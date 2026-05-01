import { NextResponse } from "next/server";
import { getQuestionnaireResponse } from "@/lib/questionnaire-db";
import { Anthropic } from "@anthropic-ai/sdk";

const client = new Anthropic();

export const runtime = "nodejs";

interface CaseStudyGeneratorInput {
  responseId: string;
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { responseId } = json as CaseStudyGeneratorInput;
  if (!responseId) {
    return NextResponse.json(
      { error: "responseId is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch questionnaire response
    const response = await getQuestionnaireResponse(responseId);
    if (!response) {
      return NextResponse.json(
        { error: "Response not found" },
        { status: 404 }
      );
    }

    if (response.status !== "submitted") {
      return NextResponse.json(
        { error: "Only submitted responses can be converted to case studies" },
        { status: 400 }
      );
    }

    // Build prompt for Claude to generate case study content
    const { data } = response;

    const prompt = `You are a case study copywriter for a creative AI agency. Based on the following questionnaire responses from a client, generate a complete case study with marketing copy, stats, and image recommendations.

Client: ${data.client_name || "Unknown"} at ${data.business_name || "Their Business"}

QUESTIONNAIRE RESPONSES:
- Biggest Challenge: ${data.q01_challenge || "N/A"}
- Typical Day Before: ${data.q02_typical_day || "N/A"}
- Hours Spent Before: ${data.q03_week_hours_detail || "N/A"}
- Revenue Loss: ${data.q04_revenue_loss_detail || "N/A"}
- Biggest Change: ${data.q09_biggest_change || "N/A"}
- Hours Saved: ${data.q10_hours_saved || "N/A"}
- Revenue Impact: ${data.q12_last_summer_revenue || "N/A"} → ${data.q12_this_summer_projection || "N/A"}
- Testimonial: ${data.q17_friend || "N/A"}
- What They'd Tell Others: ${data.q18_skeptical || "N/A"}
- Value in One Sentence: ${data.q19_one_sentence || "N/A"}

Generate a JSON response with the following structure:
{
  "title": "Client Name or Business",
  "subheading": "1-2 word description of business type",
  "sector": "Industry/sector name",
  "timeline": "Duration of engagement (e.g., '3 months', 'Ongoing partnership')",
  "heroLine": "One punchy line about the transformation (max 12 words)",
  "intro": "2-3 sentences on why they came and what we solved",
  "challenge": "2-3 sentences on the specific problem they had",
  "approach": "2-3 sentences on how we solved it",
  "stats": [
    { "label": "Metric Name", "value": "Before → After", "hint": "Context" },
    { "label": "Another Metric", "value": "Result", "hint": "Context" }
  ],
  "outcome": "2-3 sentences on the lasting impact and business results",
  "resultSummary": "One sentence summary of key results",
  "cardResultLines": ["Key result 1", "Key result 2", "Key result 3"],
  "imageRecommendations": {
    "hero": "Description of ideal hero image (what, where, mood, composition)",
    "challenge": "Description of image for challenge section",
    "solution": "Description of image for solution section",
    "stats": "Description of infographic/chart style for stats"
  }
}

Make it compelling, specific, and emphasize the transformation and outcomes. Use real numbers where available.`;

    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Failed to generate case study" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let caseStudyData;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.text.match(/```json\n([\s\S]*?)\n```/) ||
        content.text.match(/```\n([\s\S]*?)\n```/) || [null, content.text];

      caseStudyData = JSON.parse(jsonMatch[1] || content.text);
    } catch (err) {
      console.error("Failed to parse Claude response:", content.text);
      return NextResponse.json(
        { error: "Failed to parse generated case study" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      caseStudy: caseStudyData,
      message:
        "Case study generated successfully. Copy, image recommendations, and next steps are below.",
    });
  } catch (err) {
    console.error("Error generating case study:", err);
    return NextResponse.json(
      { error: "Failed to generate case study" },
      { status: 500 }
    );
  }
}
