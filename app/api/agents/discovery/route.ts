import { NextRequest, NextResponse } from "next/server";
import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { insertSession, updateSession } from "@/lib/discovery-db";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface DiscoveryRequest {
  businessName: string;
  niche: string;
  linkedLeadId?: string;
  transcript?: string;
  answers: Record<string, string>;
}

interface DiscoveryOutput {
  healthScore: number;
  buildRequirements: string;
  markdownBrief: string;
  auditReport: string;
}

export async function POST(req: NextRequest) {
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json()) as DiscoveryRequest;
    const { businessName, niche, linkedLeadId, transcript, answers } = body;

    if (!businessName || !niche || !answers) {
      return NextResponse.json(
        { error: "businessName, niche, and answers required" },
        { status: 400 }
      );
    }

    // Insert session with processing status
    const sessionId = await insertSession({
      businessName,
      niche,
      linkedLeadId,
      transcript,
      answers,
      status: "processing",
    });

    // Build context from answers
    let context = `## Business Information\n`;
    context += `- **Business Name:** ${businessName}\n`;
    context += `- **Niche:** ${niche}\n`;
    context += `- **Owner Name:** ${answers["ownerName"] || "Not provided"}\n\n`;

    context += `## Current State\n`;
    context += `- **Calls/Week:** ${answers["callsPerWeek"] || "Unknown"}\n`;
    context += `- **Booking Conversion Rate:** ${answers["bookingConversion"] || "Unknown"}%\n`;
    context += `- **24/7 Phone Coverage:** ${answers["phone24_7"] || "No"}\n`;
    context += `- **Google Rating:** ${answers["googleRating"] || "Unknown"}/5 (${answers["reviewCount"] || "0"} reviews)\n`;
    context += `- **Respond to Reviews:** ${answers["respondsToReviews"] || "No"}\n`;
    context += `- **Leads Lost/Month:** ${answers["leadsLost"] || "Unknown"}\n`;
    context += `- **Monthly Marketing Spend:** $${answers["marketingSpend"] || "0"}\n`;
    context += `- **Biggest Pain Point:** ${answers["painPoint"] || "Not stated"}\n\n`;

    // Add niche-specific answers
    const nicheAnswers = Object.entries(answers)
      .filter(([key]) => key.startsWith(`niche_`))
      .map(([key, value]) => `- ${key.replace("niche_", "").replace(/_/g, " ")}: ${value}`)
      .join("\n");

    if (nicheAnswers) {
      context += `## Niche-Specific Insights\n${nicheAnswers}\n\n`;
    }

    // Add transcript if provided
    if (transcript) {
      context += `## Call Transcript\n\`\`\`\n${transcript}\n\`\`\`\n\n`;
    }

    const systemPrompt = `You are an AI business auditor for Drivn.AI, an AI automation agency serving home services contractors.

Your job is to analyze discovery call transcripts and questionnaire data to produce a structured audit.

You will receive business information and must return a JSON response with exactly these fields (and no others):
{
  "healthScore": <number 0-100>,
  "buildRequirements": "<markdown string with prioritized build tasks>",
  "markdownBrief": "<markdown string for internal context, can be read by Jarvis agent>",
  "auditReport": "<markdown string, client-facing, shows gaps and impact>"
}

For healthScore, consider: call volume, conversion rate, review responsiveness, leads lost, marketing efficiency, team capacity.
- 70+: Strong baseline, minor gaps
- 40-70: Significant opportunity, 2-3 key fixes needed
- <40: Critical issues, needs immediate attention

buildRequirements should list specific features/fixes prioritized by ROI impact. Use this format:
## 1. Feature Name ($X annual impact)
Brief description and why it matters.

markdownBrief should explain the situation in neutral business language (for internal team/Jarvis).

auditReport should be persuasive, showing the prospect how much money they're leaving on the table.

You must return ONLY valid JSON, no markdown wrapper or explanation.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 3000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Please analyze this business discovery and return the audit JSON.\n\n${context}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[discovery] Claude API error:", error);
      await updateSession(sessionId, {
        status: "error",
        errorMessage: "Claude API failed",
      });
      return NextResponse.json(
        { error: "Claude API failed" },
        { status: 500 }
      );
    }

    const claudeResponse = await response.json();
    const responseText = claudeResponse.content[0]?.text || "";

    // Parse JSON response
    let outputs: DiscoveryOutput;
    try {
      outputs = JSON.parse(responseText);
    } catch (err) {
      console.error("[discovery] Failed to parse JSON response:", responseText);
      await updateSession(sessionId, {
        status: "error",
        errorMessage: "Failed to parse Claude response",
      });
      return NextResponse.json(
        { error: "Failed to parse audit response" },
        { status: 500 }
      );
    }

    // Update session with outputs
    await updateSession(sessionId, {
      status: "completed",
      outputs,
    });

    return NextResponse.json({
      sessionId,
      outputs,
    });
  } catch (err) {
    console.error("[discovery] API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
