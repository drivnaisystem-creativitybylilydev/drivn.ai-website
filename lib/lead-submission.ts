/** Field names sent from AuditForm — must match `components/forms/AuditForm.tsx`. */
export const LEAD_FIELD_KEYS = [
  "fullName",
  "email",
  "phone",
  "businessName",
  "businessType",
  "biggestChallenge",
  "monthlyRevenue",
  "hearAboutUs",
  "additionalNotes",
] as const;

export type LeadPayload = Record<(typeof LEAD_FIELD_KEYS)[number], string>;

export function parseLeadPayload(body: unknown): LeadPayload | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const out: Partial<LeadPayload> = {};
  for (const key of LEAD_FIELD_KEYS) {
    const v = o[key];
    if (typeof v !== "string" || v.trim() === "") return null;
    out[key] = v.trim();
  }
  return out as LeadPayload;
}
