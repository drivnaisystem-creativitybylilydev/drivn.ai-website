import { NextResponse } from "next/server";
import { LEAD_FIELD_KEYS, type LeadPayload } from "@/lib/lead-submission";
import { appendLeadEmailSent, insertLead } from "@/lib/lead-db";
import { isResendConfigured, sendLeadConfirmationEmail } from "@/lib/lead-outbound-email";
import { isMongoConfigured } from "@/lib/mongodb";

export const runtime = "nodejs";

/**
 * Tailored intake for the /moving-and-logistics landing page.
 *
 * Own field set (role / quote volume / interest) so the shared 9-key `LeadPayload`
 * contract used by the main-site audit form (`components/forms/AuditForm.tsx`) stays
 * untouched. Structured moving fields are preserved verbatim in `additionalNotes`, and
 * the record is mapped onto `LeadPayload` for storage so it shows up in the existing
 * admin/consultant pipeline like any other lead. `hearAboutUs` carries the source tag.
 */

const MOVING_FIELD_KEYS = [
  "fullName",
  "email",
  "phone",
  "companyName",
  "role",
  "quoteVolume",
  "interest",
] as const;

type MovingLeadInput = Record<(typeof MOVING_FIELD_KEYS)[number], string> & {
  notes: string;
};

function parseMovingLeadInput(body: unknown): MovingLeadInput | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const out: Partial<MovingLeadInput> = {};
  for (const key of MOVING_FIELD_KEYS) {
    const v = o[key];
    if (typeof v !== "string" || v.trim() === "") return null;
    out[key] = v.trim();
  }
  const notes = o.notes;
  out.notes = typeof notes === "string" ? notes.trim() : "";
  return out as MovingLeadInput;
}

function toLeadPayload(input: MovingLeadInput): LeadPayload {
  const notesBlock = [
    `Role: ${input.role}`,
    `Quote requests / week: ${input.quoteVolume}`,
    `Most interested in: ${input.interest}`,
    input.notes ? `Notes: ${input.notes}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    businessName: input.companyName,
    businessType: "Moving & Logistics",
    biggestChallenge: input.notes
      ? `Interested in ${input.interest}. ${input.notes}`
      : `Interested in ${input.interest}.`,
    monthlyRevenue: "Prefer not to say",
    hearAboutUs: "Moving & Logistics landing page",
    additionalNotes: notesBlock,
  };
}

function toFormspreeBody(data: LeadPayload): Record<string, string> {
  const lines = LEAD_FIELD_KEYS.map((k) => `${k}: ${data[k]}`);
  return {
    ...data,
    _subject: `Moving lead: ${data.fullName} (${data.businessName})`,
    message: lines.join("\n"),
  };
}

async function postToFormspree(data: LeadPayload, formId: string): Promise<Response> {
  return fetch(`https://formspree.io/f/${formId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(toFormspreeBody(data)),
  });
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = json as Record<string, unknown>;
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const input = parseMovingLeadInput(json);
  if (!input) {
    return NextResponse.json(
      { error: "Name, email, phone, company, role, quote volume, and interest are all required." },
      { status: 400 },
    );
  }

  const data = toLeadPayload(input);
  const mongoReady = isMongoConfigured();
  const formId = process.env.FORMSPREE_FORM_ID?.trim();

  if (!mongoReady && !formId) {
    return NextResponse.json(
      {
        error: "Lead capture is not configured.",
        hint: "Set MONGODB_URI (MongoDB Atlas). Optionally set FORMSPREE_FORM_ID for email relay.",
      },
      { status: 503 },
    );
  }

  let newLeadId: string | null = null;
  if (mongoReady) {
    try {
      newLeadId = await insertLead(data);
    } catch (err) {
      console.error("[moving-lead] MongoDB insert failed:", err);
      return NextResponse.json(
        {
          error: "Could not save your submission.",
          hint: "Check MONGODB_URI, Atlas network access, and that the cluster is running.",
        },
        { status: 502 },
      );
    }
  }

  if (newLeadId && isResendConfigured()) {
    const emailed = await sendLeadConfirmationEmail(data);
    if (emailed) {
      await appendLeadEmailSent(newLeadId, { type: "confirmation", sentAt: new Date() });
    }
  }

  if (formId) {
    const fsRes = await postToFormspree(data, formId);
    if (!fsRes.ok) {
      console.warn("[moving-lead] Formspree relay failed.");
      if (!mongoReady) {
        return NextResponse.json(
          { error: "Could not save your submission. Try again or email us directly." },
          { status: 502 },
        );
      }
    }
  }

  return NextResponse.json({ ok: true });
}
