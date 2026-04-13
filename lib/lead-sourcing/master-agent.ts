import Anthropic from "@anthropic-ai/sdk";
import { runGoogleMapsAgent } from "./google-maps-agent";
import { scoreAndRankLeads } from "./scoring-agent";
import { draftEmailsForTopLeads } from "./email-drafting-agent";
import type { SourcingBrief, SourcingResult } from "./types";

const client = new Anthropic();

/**
 * Master agent: takes a natural-language brief, uses Claude to generate
 * targeted search queries, runs the sub-agents, and returns ranked leads
 * with email drafts for the top results.
 */
export async function runMasterLeadAgent(
  brief: SourcingBrief,
): Promise<SourcingResult> {
  const start = Date.now();
  let totalTokens = 0;

  // ── Step 1: Use Claude to turn the brief into targeted Google Places queries ─
  const planPrompt = `You are helping an AI consulting agency (Drivn.AI) find leads.

Their ideal clients: small-to-mid service businesses (5–50 employees, $500K–$5M revenue) in English-speaking markets. Industries: local services, health & wellness, professional services, e-commerce.

The user's brief: "${brief.query}"

Generate ${Math.ceil((brief.maxLeads ?? 20) / 10)} specific Google Places search queries that will find businesses matching this brief.

Rules:
- Each query should be a natural search phrase like "dentists in London" or "plumbers in Sydney"
- Cover different sub-categories or locations if the brief is broad
- Be specific enough to find real businesses, not chains or franchises
- Target English-speaking markets (UK, US, Australia, Canada)

Return ONLY a JSON array of strings. Example: ["dentists in Manchester", "dental clinics in Birmingham"]`;

  const planMsg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [{ role: "user", content: planPrompt }],
  });

  totalTokens += (planMsg.usage.input_tokens ?? 0) + (planMsg.usage.output_tokens ?? 0);

  const planText = planMsg.content[0].type === "text" ? planMsg.content[0].text : "[]";
  const jsonMatch = planText.match(/\[[\s\S]*\]/);
  let queries: string[] = [];

  try {
    queries = jsonMatch ? (JSON.parse(jsonMatch[0]) as string[]) : [];
  } catch {
    queries = [brief.query];
  }

  if (queries.length === 0) queries = [brief.query];

  // ── Step 2: Run Google Maps agent with generated queries ──────────────────────
  const maxPerQuery = Math.ceil((brief.maxLeads ?? 20) / queries.length);
  const rawBusinesses = await runGoogleMapsAgent(queries, maxPerQuery);

  // ── Step 3: Score and rank all leads ──────────────────────────────────────────
  const rankedLeads = scoreAndRankLeads(rawBusinesses);
  const topLeads = rankedLeads.slice(0, brief.maxLeads ?? 20);

  // ── Step 4: Draft emails for top 10 leads ────────────────────────────────────
  const leadsWithEmails = await draftEmailsForTopLeads(topLeads, 10);

  // Merge drafted emails back into full ranked list
  const emailMap = new Map(leadsWithEmails.map((l) => [l.placeId, l]));
  const finalLeads = topLeads.map((l) => emailMap.get(l.placeId) ?? l);

  return {
    brief,
    leads: finalLeads,
    totalFound: rawBusinesses.length,
    tokensUsed: totalTokens,
    durationMs: Date.now() - start,
  };
}
