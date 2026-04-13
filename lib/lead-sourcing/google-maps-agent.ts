import type { RawBusiness } from "./types";

const BASE = "https://places.googleapis.com/v1";

function apiKey(): string {
  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!key) throw new Error("GOOGLE_PLACES_API_KEY not set");
  return key;
}

interface PlacesSearchResponse {
  places?: GooglePlace[];
}

interface GooglePlace {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  primaryTypeDisplayName?: { text: string };
  location?: { latitude: number; longitude: number };
}

/**
 * Search Google Places (New API) for businesses matching a text query.
 * Returns up to `limit` results.
 */
export async function searchGooglePlaces(
  query: string,
  limit = 20,
): Promise<RawBusiness[]> {
  const key = apiKey();

  const body = {
    textQuery: query,
    maxResultCount: Math.min(limit, 20),
    languageCode: "en",
  };

  const res = await fetch(`${BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.nationalPhoneNumber",
        "places.internationalPhoneNumber",
        "places.websiteUri",
        "places.rating",
        "places.userRatingCount",
        "places.primaryTypeDisplayName",
        "places.location",
      ].join(","),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Places API error ${res.status}: ${err}`);
  }

  const data: PlacesSearchResponse = await res.json();
  const places = data.places ?? [];

  return places.map((p): RawBusiness => ({
    placeId: p.id,
    name: p.displayName?.text ?? "Unknown",
    address: p.formattedAddress ?? "",
    phone: p.nationalPhoneNumber ?? p.internationalPhoneNumber,
    website: p.websiteUri,
    rating: p.rating,
    reviewCount: p.userRatingCount,
    category: p.primaryTypeDisplayName?.text,
    location: {
      lat: p.location?.latitude ?? 0,
      lng: p.location?.longitude ?? 0,
    },
    source: "google_maps",
  }));
}

/**
 * Run multiple searches in parallel to cover different categories/locations
 * from a sourcing brief, deduplicated by placeId.
 */
export async function runGoogleMapsAgent(
  queries: string[],
  maxPerQuery = 10,
): Promise<RawBusiness[]> {
  const results = await Promise.allSettled(
    queries.map((q) => searchGooglePlaces(q, maxPerQuery)),
  );

  const seen = new Set<string>();
  const businesses: RawBusiness[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const b of result.value) {
        if (!seen.has(b.placeId)) {
          seen.add(b.placeId);
          businesses.push(b);
        }
      }
    }
  }

  return businesses;
}
