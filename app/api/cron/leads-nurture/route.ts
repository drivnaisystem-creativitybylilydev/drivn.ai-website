import { NextResponse } from "next/server";
import { appendLeadEmailSent, findLeadsForNudge } from "@/lib/lead-db";
import { sendNudgeNotBookedEmail } from "@/lib/lead-outbound-email";

export const runtime = "nodejs";

/**
 * Daily nurture: “booked yet?” nudge via Resend.
 *
 * Vercel Cron: add `vercel.json` (included) and set `CRON_SECRET` in the project env.
 * The job sends `Authorization: Bearer <CRON_SECRET>` when that env is set.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "CRON_SECRET is required in production." },
      { status: 503 },
    );
  }

  if (!process.env.RESEND_API_KEY?.trim()) {
    return NextResponse.json({ ok: true, skipped: true, reason: "resend_not_configured" });
  }

  const candidates = await findLeadsForNudge(25);
  let sent = 0;
  let failed = 0;

  for (const row of candidates) {
    const ok = await sendNudgeNotBookedEmail(row.payload);
    if (ok) {
      await appendLeadEmailSent(row.id, {
        type: "nudge_not_booked",
        sentAt: new Date(),
      });
      sent += 1;
    } else {
      failed += 1;
    }
  }

  return NextResponse.json({ ok: true, sent, failed, examined: candidates.length });
}
