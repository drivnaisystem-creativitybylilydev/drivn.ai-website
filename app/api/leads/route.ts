import { NextResponse } from "next/server";
import { LEAD_FIELD_KEYS, parseLeadPayload, type LeadPayload } from "@/lib/lead-submission";
import { appendLeadEmailSent, insertLead } from "@/lib/lead-db";
import { isResendConfigured, sendLeadConfirmationEmail } from "@/lib/lead-outbound-email";
import { isMongoConfigured } from "@/lib/mongodb";

export const runtime = "nodejs";

function toFormspreeBody(data: LeadPayload): Record<string, string> {
  const lines = LEAD_FIELD_KEYS.map((k) => `${k}: ${data[k]}`);
  return {
    ...data,
    _subject: `Discovery lead: ${data.fullName} (${data.businessName})`,
    message: lines.join("\n"),
  };
}

async function postToFormspree(
  data: LeadPayload,
  formId: string,
): Promise<Response> {
  return fetch(`https://formspree.io/f/${formId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(toFormspreeBody(data)),
  });
}

/**
 * Persists leads to MongoDB when MONGODB_URI is set (collection `leads` in DB MONGODB_DB or `drivn`).
 * Optionally relays to Formspree for email notifications (FORMSPREE_FORM_ID).
 */
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

  const data = parseLeadPayload(json);
  if (!data) {
    return NextResponse.json(
      { error: "All fields are required and must be non-empty strings." },
      { status: 400 },
    );
  }

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
      console.error("[leads] MongoDB insert failed:", err);
      return NextResponse.json(
        {
          error: "Could not save your submission.",
          hint: "Check MONGODB_URI, network access in Atlas, and that the cluster is running.",
        },
        { status: 502 },
      );
    }
  }

  if (newLeadId && isResendConfigured()) {
    const emailed = await sendLeadConfirmationEmail(data);
    if (emailed) {
      await appendLeadEmailSent(newLeadId, {
        type: "confirmation",
        sentAt: new Date(),
      });
    }
  }

  if (formId) {
    const fsRes = await postToFormspree(data, formId);
    if (!fsRes.ok) {
      console.warn("[leads] Formspree relay failed.");
      if (!mongoReady) {
        const text = await fsRes.text();
        return NextResponse.json(
          {
            error: "Could not save your submission. Try again or email us directly.",
            detail: process.env.NODE_ENV === "development" ? text.slice(0, 200) : undefined,
          },
          { status: 502 },
        );
      }
    }
  }

  return NextResponse.json({ ok: true });
}
