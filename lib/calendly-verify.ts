import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Parses `Calendly-Webhook-Signature` header (comma-separated `t=` / `v1=` pairs).
 * @see https://developer.calendly.com/api-docs/webhook-signatures
 */
export function parseCalendlySignatureHeader(
  header: string | null,
): { t: string; v1: string[] } | null {
  if (!header || typeof header !== "string") return null;
  let t: string | undefined;
  const v1: string[] = [];
  for (const bit of header.split(",")) {
    const s = bit.trim();
    const eq = s.indexOf("=");
    if (eq <= 0) continue;
    const key = s.slice(0, eq).trim();
    const val = s.slice(eq + 1).trim();
    if (key === "t") t = val;
    if (key === "v1") v1.push(val);
  }
  if (!t || v1.length === 0) return null;
  return { t, v1 };
}

function timingSafeEqualHex(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "hex");
    const bb = Buffer.from(b, "hex");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

/**
 * Verifies Calendly webhook using signing key + raw JSON body (string).
 * Rejects replays older than `maxSkewSec` (default 3 minutes).
 */
export function verifyCalendlyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  signingKey: string,
  maxSkewSec = 180,
): boolean {
  if (!signingKey || !rawBody) return false;
  const parsed = parseCalendlySignatureHeader(signatureHeader);
  if (!parsed) return false;
  const ts = Number(parsed.t);
  if (!Number.isFinite(ts)) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - ts) > maxSkewSec) return false;

  const signedPayload = `${parsed.t}.${rawBody}`;
  const digest = createHmac("sha256", signingKey).update(signedPayload, "utf8").digest("hex");

  return parsed.v1.some((sig) => timingSafeEqualHex(digest, sig));
}
