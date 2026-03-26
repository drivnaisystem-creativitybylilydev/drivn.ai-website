/**
 * Public Calendly event URL, e.g. https://calendly.com/your-org/30min
 * Set in `.env.local` as NEXT_PUBLIC_CALENDLY_URL=
 */
export function getCalendlySchedulingUrl(): string {
  const raw = process.env.NEXT_PUBLIC_CALENDLY_URL;
  if (typeof raw !== "string") return "";
  const url = raw.trim();
  if (!url.startsWith("https://")) return "";
  return url;
}

export function hasCalendlyScheduling(): boolean {
  return getCalendlySchedulingUrl().length > 0;
}
