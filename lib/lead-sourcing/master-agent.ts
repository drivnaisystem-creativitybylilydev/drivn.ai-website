import { runApifyGoogleMaps } from "./apify-agent";
import { scoreAndRankLeads } from "./scoring-agent";
import type { SourcingBrief, SourcingResult } from "./types";

/**
 * Master agent: takes a natural-language brief, runs Apify Google Maps
 * scraper, scores and ranks results, and returns leads with qualifying data.
 */
export async function runMasterLeadAgent(
  brief: SourcingBrief,
): Promise<SourcingResult> {
  const start = Date.now();
  const maxLeads = brief.maxLeads ?? 50;

  // ── Step 1: Run Apify Google Maps scraper with the brief query directly ──────
  const rawBusinesses = await runApifyGoogleMaps([brief.query], maxLeads);

  // ── Step 2: Score and rank all leads ─────────────────────────────────────────
  const rankedLeads = scoreAndRankLeads(rawBusinesses);
  const finalLeads = rankedLeads.slice(0, maxLeads);

  return {
    brief,
    leads: finalLeads,
    totalFound: rawBusinesses.length,
    tokensUsed: 0,
    durationMs: Date.now() - start,
  };
}
