import Anthropic from "@anthropic-ai/sdk";
import type { ScoredLead } from "./types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY?.trim() });

const FINN_CONTEXT = `
You are writing cold emails on behalf of Finn Schueler, founder of Drivn.AI — an AI consulting agency.

Finn's offer: He helps small service businesses get more customers and close more deals without hiring more staff, using AI automation. His flagship product is a "Speed-to-Lead" system — when a new inquiry comes in, AI follows up within 60 seconds, books a call, and qualifies the lead automatically.

Pricing: $1,200–$2,500 setup + optional $200/mo maintenance.

Tone: Direct, confident, revenue-focused. NOT salesy or generic. Reference something specific about their business. Keep it short — 5–7 sentences max. The goal is ONE response: a reply or a booked call.

Finn closes on cold calls, so the email is just to open the door — not to sell the whole thing.
`.trim();

export async function draftEmailForLead(lead: ScoredLead): Promise<{ subject: string; body: string }> {
  const businessContext = [
    `Business: ${lead.name}`,
    `Category: ${lead.category ?? "service business"}`,
    `Location: ${lead.address}`,
    lead.rating ? `Rating: ${lead.rating}★ (${lead.reviewCount ?? 0} reviews)` : null,
    lead.website ? `Website: ${lead.website}` : "No website",
    lead.phone ? `Phone: ${lead.phone}` : null,
    `Top signals: ${lead.signals.map((s) => s.label).join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const prompt = `${FINN_CONTEXT}

Business to write email for:
${businessContext}

Write a cold email to this business owner. Return ONLY valid JSON in this exact format:
{
  "subject": "...",
  "body": "..."
}

Rules:
- Subject line: curiosity-driven, not clickbait, under 8 words
- Body: 5–7 sentences, reference their specific business/situation, end with a soft CTA (15-min call or simple reply)
- No "I hope this email finds you well" openers
- No bullet points
- Sign off as: Finn | Drivn.AI`;

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const text = msg.content[0].type === "text" ? msg.content[0].text : "";

  // Extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Could not parse email JSON from model response");

  const parsed = JSON.parse(jsonMatch[0]) as { subject: string; body: string };
  return parsed;
}

export async function draftEmailsForTopLeads(
  leads: ScoredLead[],
  topN = 10,
): Promise<ScoredLead[]> {
  const top = leads.slice(0, topN);

  // Draft in parallel, gracefully skip failures
  const drafts = await Promise.allSettled(
    top.map((lead) => draftEmailForLead(lead)),
  );

  return top.map((lead, i) => {
    const result = drafts[i];
    if (result.status === "fulfilled") {
      return { ...lead, emailDraft: { ...result.value, tone: "professional" as const } };
    }
    return lead;
  });
}
