import type { RawBusiness } from "./types";

const ACTOR_ID = "compass~crawler-google-places";

function apiToken(): string {
  const token = process.env.APIFY_API_TOKEN?.trim();
  if (!token) throw new Error("APIFY_API_TOKEN not set");
  return token;
}

interface ApifyPlace {
  placeId?: string;
  title?: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  emails?: string[];
  totalScore?: number;
  reviewsCount?: number;
  categoryName?: string;
  location?: { lat?: number; lng?: number; latitude?: number; longitude?: number };
}

/**
 * Run Apify Google Maps Scraper for multiple queries in a single actor run.
 * Returns deduplicated businesses with emails when available.
 *
 * Apify is ~4x cheaper than Google Places ($4 vs $17 per 1,000 results),
 * removes the 20-result cap, and scrapes emails from business websites.
 */
export async function runApifyGoogleMaps(
  queries: string[],
  maxPerQuery = 50,
): Promise<RawBusiness[]> {
  const token = apiToken();

  const input = {
    searchStringsArray: queries,
    maxCrawledPlacesPerSearch: maxPerQuery,
    language: "en",
    // scrape contact info (emails) from business websites
    scrapeContacts: true,
    includeWebResults: false,
  };

  // run-sync-get-dataset-items blocks until the actor finishes, then returns results
  // timeout=240 leaves a buffer before Vercel's 300s maxDuration
  const url =
    `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items` +
    `?token=${token}&timeout=240&memory=1024`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Apify error ${res.status}: ${err}`);
  }

  const places: ApifyPlace[] = await res.json();

  const seen = new Set<string>();
  const businesses: RawBusiness[] = [];

  for (const p of places) {
    const id = p.placeId ?? `${p.title ?? ""}-${p.address ?? ""}`;
    if (!id || seen.has(id)) continue;
    seen.add(id);

    // Apify can return email as a string or as an emails array
    const email =
      p.email?.trim() ||
      p.emails?.find((e) => e?.trim())?.trim() ||
      undefined;

    const loc = p.location ?? {};
    const lat = loc.lat ?? loc.latitude ?? 0;
    const lng = loc.lng ?? loc.longitude ?? 0;

    businesses.push({
      placeId: id,
      name: p.title ?? "Unknown",
      address: p.address ?? "",
      phone: p.phone,
      website: p.website,
      email,
      rating: p.totalScore,
      reviewCount: p.reviewsCount,
      category: p.categoryName,
      location: { lat, lng },
      source: "apify",
    });
  }

  return businesses;
}
