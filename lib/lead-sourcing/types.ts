export interface RawBusiness {
  placeId: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  email?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  location: { lat: number; lng: number };
  source: "google_maps" | "apify";
}

export interface ScoredLead extends RawBusiness {
  score: number; // 0–100
  signals: LeadSignal[];
  emailDraft?: EmailDraft;
}

export interface LeadSignal {
  type:
    | "has_website"
    | "no_website"
    | "many_reviews"
    | "few_reviews"
    | "high_rating"
    | "low_rating"
    | "has_phone"
    | "active_business";
  weight: number;
  label: string;
}

export interface EmailDraft {
  subject: string;
  body: string;
  tone: "professional" | "casual";
}

export interface SourcingBrief {
  query: string;           // e.g. "dentists in London"
  industries?: string[];   // e.g. ["dental", "health"]
  locations?: string[];    // e.g. ["London", "Manchester"]
  maxLeads?: number;       // default 20
}

export interface SourcingResult {
  brief: SourcingBrief;
  leads: ScoredLead[];
  totalFound: number;
  tokensUsed: number;
  durationMs: number;
  error?: string;
}
