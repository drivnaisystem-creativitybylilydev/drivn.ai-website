import { Resend } from "resend";
import type { LeadPayload } from "@/lib/lead-submission";

function siteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit?.startsWith("http")) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return vercel.startsWith("http") ? vercel.replace(/\/$/, "") : `https://${vercel}`;
  return "";
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM_EMAIL?.trim());
}

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

export async function sendLeadConfirmationEmail(data: LeadPayload): Promise<boolean> {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const resend = getResend();
  if (!resend || !from) return false;

  const origin = siteOrigin();
  const bookHint = origin
    ? `<p>If you haven't already, you can <a href="${origin}">return to the site</a> to finish booking a time.</p>`
    : "<p>If you haven't already, return to the site to finish booking a time.</p>";

  const { error } = await resend.emails.send({
    from,
    to: data.email,
    subject: `We received your audit request — ${data.businessName}`,
    html: `
      <p>Hi ${escapeHtml(data.fullName)},</p>
      <p>Thanks for submitting the discovery form. We have your details and will use them to prep for your call.</p>
      ${bookHint}
      <p>— Drivn.AI</p>
    `,
  });

  if (error) {
    console.error("[lead-email] confirmation send failed:", error);
    return false;
  }
  return true;
}

export async function sendNudgeNotBookedEmail(data: LeadPayload): Promise<boolean> {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const resend = getResend();
  if (!resend || !from) return false;

  const origin = siteOrigin();
  const cta = origin
    ? `<p><a href="${origin}">Pick a time on the calendar</a> when you're ready.</p>`
    : "<p>Reply to this email if you'd like help booking a time.</p>";

  const snippet =
    data.biggestChallenge.length > 200
      ? `${escapeHtml(data.biggestChallenge.slice(0, 200))}…`
      : escapeHtml(data.biggestChallenge);

  const { error } = await resend.emails.send({
    from,
    to: data.email,
    subject: "Still want to book your audit?",
    html: `
      <p>Hi ${escapeHtml(data.fullName)},</p>
      <p>You mentioned: “${snippet}” — we can dig into that on a short call.</p>
      ${cta}
      <p>— Drivn.AI</p>
    `,
  });

  if (error) {
    console.error("[lead-email] nudge send failed:", error);
    return false;
  }
  return true;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
