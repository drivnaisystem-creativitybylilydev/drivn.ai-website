import { Resend } from "resend";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

export function isQuestionnaireEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.RESEND_FROM_EMAIL?.trim() &&
      getQuestionnaireInboxEmail(),
  );
}

/** Where completed questionnaires are delivered (your inbox). */
export function getQuestionnaireInboxEmail(): string | null {
  const direct = process.env.QUESTIONNAIRE_INBOX_EMAIL?.trim();
  if (direct) return direct;
  return null;
}

const FIELD_ORDER: { key: string; label: string }[] = [
  { key: "client_name", label: "Client name" },
  { key: "client_email", label: "Client email" },
  { key: "business_name", label: "Business name" },
  { key: "interview_date", label: "Interview / completion date" },
  { key: "q01_challenge", label: "Biggest day-to-day challenge before" },
  { key: "q02_typical_day", label: "Typical busy day before automation" },
  { key: "q03_week_hours", label: "Hours/week on bookings & admin (range)" },
  { key: "q03_week_hours_detail", label: "Specific hours/week estimate" },
  { key: "q04_revenue_loss_band", label: "Revenue lost (range)" },
  { key: "q04_revenue_loss_detail", label: "Details / context" },
  { key: "q05_frustration", label: "What frustrated you most" },
  { key: "q06_previous_solutions", label: "What you tried before" },
  { key: "q07_communication_score", label: "Communication score (1–10)" },
  { key: "q07_communication_why", label: "What made it that score" },
  { key: "q08_surprises", label: "Surprises during the project" },
  { key: "q09_biggest_change", label: "#1 biggest change since go-live" },
  { key: "q10_hours_before", label: "Hours/week on bookings/admin (before)" },
  { key: "q10_hours_now", label: "Hours/week on bookings/admin (now)" },
  { key: "q10_hours_saved", label: "Hours saved per week" },
  { key: "q10_time_use", label: "What you do with that time now" },
  { key: "q11_leads_capture", label: "Capturing leads you would have missed" },
  { key: "q11_extra_bookings", label: "Additional bookings per week (if applicable)" },
  { key: "q12_last_summer_revenue", label: "Last summer revenue (estimate)" },
  { key: "q12_this_summer_projection", label: "This summer projection" },
  { key: "q12_increase_drivers", label: "What’s driving the increase" },
  { key: "q13_payment_impact", label: "Stripe & automated payments impact" },
  { key: "q14_customers_say", label: "What customers say about booking" },
  { key: "q17_friend", label: "What you’d tell a friend" },
  { key: "q18_skeptical", label: "Skepticism about hiring a student (response)" },
  { key: "q19_one_sentence", label: "Value in one sentence" },
  { key: "q20_work_again", label: "Work together again" },
  { key: "q20_work_again_why", label: "Why" },
  { key: "q21_nps", label: "Recommend 1–10" },
  { key: "q22_features", label: "Features appreciated (selected)" },
  { key: "q22_other", label: "Other feature (free text)" },
  { key: "q22_feature_why", label: "Why that feature matters" },
  { key: "q23_wish", label: "Wish the system did" },
  { key: "q24_students_last", label: "Students served last summer" },
  { key: "q24_students_projected", label: "Projected students this summer" },
  { key: "q24_avg_booking", label: "Average booking value" },
  { key: "q24_total_bookings", label: "Total bookings through new system" },
  { key: "q24_mins_before", label: "Minutes per booking (before)" },
  { key: "q24_mins_now", label: "Minutes per booking (now)" },
  { key: "q25_publication_name", label: "Name usage permission" },
  { key: "q25_photo", label: "Photo permission" },
  { key: "q25_share_numbers", label: "Share revenue/booking numbers" },
  { key: "q25_video", label: "Video testimonial" },
  { key: "q25_linkedin", label: "Joint Social Media Post" },
  { key: "q26_else", label: "Anything else" },
  { key: "footer_completed_by", label: "Completed by" },
  { key: "footer_completed_date", label: "Completion date" },
  { key: "footer_signature", label: "Signature" },
];

export function buildNotimeQuestionnaireAdminHtml(data: Record<string, string>): string {
  const rows = FIELD_ORDER.map(({ key, label }) => {
    const raw = data[key]?.trim() ?? "";
    const value = raw || "—";
    return `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;vertical-align:top;font-weight:600;width:32%;">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`;
  }).join("");
  return `
  <p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#111827;">
    <strong>NoTime Storage — case study questionnaire</strong><br />
    Submitted from the Drivn.AI website form.
  </p>
  <table style="border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px;color:#111827;width:100%;max-width:720px;">${rows}</table>
  `;
}

export async function sendNotimeQuestionnaireEmails(params: {
  adminHtml: string;
  clientEmail?: string;
  clientFirstName?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  const to = getQuestionnaireInboxEmail();
  const resend = getResend();
  if (!resend || !from || !to) {
    return { ok: false, error: "Email is not configured." };
  }

  const subject = `[NoTime Storage] Case study questionnaire — ${params.clientFirstName || "Client"}`;

  const { error: errAdmin } = await resend.emails.send({
    from,
    to,
    subject,
    html: params.adminHtml,
  });

  if (errAdmin) {
    console.error("[questionnaire] admin email failed:", errAdmin);
    return { ok: false, error: "Could not send notification email." };
  }

  const ce = params.clientEmail?.trim();
  if (ce && ce.includes("@")) {
    const name = params.clientFirstName?.trim() || "there";
    const { error: errClient } = await resend.emails.send({
      from,
      to: ce,
      subject: "We received your case study questionnaire — Drivn.AI",
      html: `
        <p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#111827;">
          Hi ${escapeHtml(name)},
        </p>
        <p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#111827;">
          Thanks for taking the time to fill this out. Your answers help us document the impact of the work we did together for NoTime Storage.
        </p>
        <p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#111827;">
          — Finn &amp; Drivn.AI
        </p>
      `,
    });
    if (errClient) {
      console.warn("[questionnaire] client copy failed (admin still sent):", errClient);
    }
  }

  return { ok: true };
}
