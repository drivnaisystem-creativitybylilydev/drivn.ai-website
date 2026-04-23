import { NextRequest, NextResponse } from "next/server";
import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { getConversation, addMessage, addMemoryPoint } from "@/lib/jarvis-db";
import { readFileSync } from "fs";
import { resolve } from "path";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const OS_PATH = "/Users/finnschueler/Desktop/Drivn.AI OS";

interface JarvisRequest {
  sessionId: string;
  userMessage: string;
}

interface JarvisResponse {
  sessionId: string;
  assistantMessage: string;
  memory?: string;
}

function readOSFile(filePath: string): string | null {
  try {
    const fullPath = resolve(OS_PATH, filePath);
    // Safety check: ensure we're reading from within OS_PATH
    if (!fullPath.startsWith(OS_PATH)) {
      return null;
    }
    return readFileSync(fullPath, "utf-8");
  } catch (err) {
    console.error(`[jarvis] Failed to read ${filePath}:`, err);
    return null;
  }
}

function buildSystemPrompt(): string {
  // Load KB files
  const overviewKB = readOSFile("knowledge-base/AGENCY-OVERVIEW.md") || "";
  const goalsKB = readOSFile("knowledge-base/GOALS-TRACKER.md") || "";
  const claudemd = readOSFile("CLAUDE.md") || "";

  let revenueData = "";
  try {
    const revenueJSON = readOSFile("finances/revenue-tracker.json");
    if (revenueJSON) {
      const parsed = JSON.parse(revenueJSON);
      revenueData = `\nCurrent MRR: $${parsed.current_mrr}\n30-Day Goal: $${parsed.goal_30day}\nClients: ${parsed.clients.length}`;
    }
  } catch (err) {
    console.error("[jarvis] Failed to parse revenue tracker:", err);
  }

  return `You are JARVIS, the AI Chief of Staff and Strategic Advisor for Drivn.AI.

CURRENT AGENCY STATE:
${revenueData}

KEY KNOWLEDGE BASE:
${overviewKB.substring(0, 2000)}

GOALS & TRACKING:
${goalsKB.substring(0, 2000)}

MASTER OS DOCUMENT:
${claudemd.substring(0, 2000)}

YOUR ROLE:
- Strategic business consultant (help Finn make better decisions)
- Revenue architect (advise on pricing, ROI, positioning)
- Agent architect (design what agents to build next)
- Build strategist (oversee custom dashboard projects)
- Accountability partner (brutally honest, no-bullshit)

YOUR PERSONALITY:
- Direct and honest (no sugarcoating)
- Revenue-obsessed (every decision ties to $1K MRR goal)
- Strategic (connect dots, spot patterns)
- Builder-minded (understand the actual build work)
- Use emojis for clarity (✅ ⚠️ ❌ 💰 📊 🔥 💡)

TONE:
- Conversational but professional
- Bold important numbers
- Ask hard "why" questions
- Connect to goals and constraints

CRITICAL RULES:
1. Read KB files before responding - always pull current data
2. Quantify everything - if you can't measure it, don't recommend it
3. Connect to goals - every decision must advance the $1K MRR goal
4. Challenge assumptions - especially vague thinking
5. Flag risks explicitly
6. Calculate ROI - show the math
7. Respect constraints - running on Haiku

When consulting Finn:
- Ask clarifying questions upfront
- Pull data from KB
- Measure and analyze
- Recommend with reasoning
- Challenge bad patterns
- End with clear next steps

DECISION FRAMEWORK:
For client decisions, check:
- ICP fit (5-50 employees, $500K-$5M revenue)
- Build complexity (Low/Medium/High)
- Revenue impact ($ annually saved/earned)
- Timeline risk (client responsiveness)
- Your capacity
- Strategic alignment

PRICING:
Setup fee = 40% of annual value created
Payback period should be 6-15 months
Always show ROI math

Ready to advise.`;
}

export async function POST(req: NextRequest) {
  // Auth check
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
    const body = (await req.json()) as JarvisRequest;
    const { sessionId, userMessage } = body;

    if (!sessionId || !userMessage) {
      return NextResponse.json(
        { error: "sessionId and userMessage required" },
        { status: 400 }
      );
    }

    // Get conversation from DB
    const conversation = await getConversation(sessionId);
    if (!conversation) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Add user message
    await addMessage(sessionId, "user", userMessage);

    // Build messages for Claude (last 10 messages for context)
    const recentMessages = conversation.messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));
    recentMessages.push({
      role: "user",
      content: userMessage,
    });

    // Call Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1500,
        system: buildSystemPrompt(),
        messages: recentMessages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[jarvis] Claude API error:", error);
      return NextResponse.json(
        { error: "Claude API failed" },
        { status: 500 }
      );
    }

    const claudeResponse = await response.json();
    const assistantMessage =
      claudeResponse.content[0]?.text || "No response generated";

    // Save assistant message
    await addMessage(sessionId, "assistant", assistantMessage);

    // Extract and save memory points (look for key decisions/metrics)
    const memoryPatterns = [
      {
        pattern: /recommendation|should/i,
        category: "decision",
      },
      {
        pattern: /\$[\d,]+|mrr|revenue/i,
        category: "metric",
      },
      {
        pattern: /risk|⚠️|❌|flag/i,
        category: "risk",
      },
      {
        pattern: /pattern|notice|observed/i,
        category: "pattern",
      },
    ];

    for (const { pattern, category } of memoryPatterns) {
      if (pattern.test(assistantMessage)) {
        // Extract a summary (first sentence with the pattern)
        const sentences = assistantMessage.split(/[.!?]+/);
        const relevant = sentences.find((s: string) => pattern.test(s));
        if (relevant) {
          await addMemoryPoint(
            sessionId,
            category,
            relevant.trim().substring(0, 200)
          );
        }
        break;
      }
    }

    return NextResponse.json({
      sessionId,
      assistantMessage,
    } as JarvisResponse);
  } catch (err) {
    console.error("[jarvis] API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
