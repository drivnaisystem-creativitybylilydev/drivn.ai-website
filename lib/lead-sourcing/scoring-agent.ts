import type { RawBusiness, ScoredLead, LeadSignal } from "./types";

/**
 * Pure scoring — no Claude needed, just deterministic signals.
 * Score 0–100 based on how well the business matches Drivn.AI's ICP:
 * - Revenue-focused (wants more customers)
 * - Has operational pain (slow follow-up, manual processes)
 * - Small-to-mid service business ($500K–$5M revenue proxy)
 */
export function scoreLead(business: RawBusiness): ScoredLead {
  const signals: LeadSignal[] = [];
  let score = 50; // base

  // ── Website signals ─────────────────────────────────────────────────────────
  if (!business.website) {
    signals.push({ type: "no_website", weight: +15, label: "No website — easy value add" });
    score += 15;
  } else {
    signals.push({ type: "has_website", weight: +5, label: "Has website" });
    score += 5;
  }

  // ── Review signals ───────────────────────────────────────────────────────────
  const reviews = business.reviewCount ?? 0;

  if (reviews >= 50) {
    signals.push({ type: "many_reviews", weight: +15, label: `${reviews} reviews — active business` });
    score += 15;
  } else if (reviews >= 10) {
    signals.push({ type: "many_reviews", weight: +8, label: `${reviews} reviews — established` });
    score += 8;
  } else if (reviews > 0) {
    signals.push({ type: "few_reviews", weight: +3, label: `${reviews} reviews — early stage` });
    score += 3;
  }

  // ── Rating signals ───────────────────────────────────────────────────────────
  const rating = business.rating ?? 0;

  if (rating >= 4.5 && reviews >= 20) {
    // High-rated + many reviews = doing well but could do better with AI
    signals.push({ type: "high_rating", weight: +10, label: `${rating}★ — strong reputation to protect` });
    score += 10;
  } else if (rating >= 3.5 && rating < 4.2 && reviews >= 10) {
    // Mid-rating = operational issues, good AI opportunity
    signals.push({ type: "low_rating", weight: +12, label: `${rating}★ — response/service pain likely` });
    score += 12;
  }

  // ── Phone signals ─────────────────────────────────────────────────────────────
  if (business.phone) {
    signals.push({ type: "has_phone", weight: +5, label: "Phone listed — can cold call" });
    score += 5;
  }

  // ── Active business signal ────────────────────────────────────────────────────
  if (reviews >= 5 && rating >= 3.0) {
    signals.push({ type: "active_business", weight: 0, label: "Active, real business" });
  }

  return {
    ...business,
    score: Math.min(score, 100),
    signals,
  };
}

export function scoreAndRankLeads(businesses: RawBusiness[]): ScoredLead[] {
  return businesses
    .map(scoreLead)
    .sort((a, b) => b.score - a.score);
}
