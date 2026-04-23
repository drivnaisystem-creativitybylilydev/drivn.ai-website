"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputWrap = "relative audit-form-field";
const inputLine =
  "w-full bg-transparent text-white placeholder:text-white/40 py-2 pr-0 pl-0 border-0 border-b border-white/20 focus:outline-none focus:ring-0 focus:border-transparent";
const labelCls = "block text-sm font-medium text-white/90 mb-1";
const hintCls = "text-xs text-white/50 mb-2";

const Q3_HOURS = [
  "5-10 hours/week",
  "10-15 hours/week",
  "15-20 hours/week",
  "20+ hours/week",
];

const Q4_REVENUE = [
  "Not sure / Can't estimate",
  "$1,000-$2,500/month",
  "$2,500-$5,000/month",
  "$5,000-$10,000/month",
  "$10,000+/month",
];

const Q11_LEADS = ["Yes, absolutely", "Yes, somewhat", "Not sure", "No"];

const Q12_DRIVERS = [
  "More capacity (can handle more bookings now)",
  "Better conversion (capture every lead)",
  "Less missed opportunities",
  "Able to accept bookings 24/7",
];

const Q20_AGAIN = ["Absolutely, 100%", "Yes, likely", "Maybe", "No"];

const Q22_OPTS: { id: string; label: string }[] = [
  { id: "247", label: "24/7 automated bookings" },
  { id: "stripe", label: "Stripe payment integration (cards, Apple Pay, Link, etc.)" },
  { id: "dashboard", label: "Student dashboard (tracking, updates)" },
  { id: "email", label: "Automated email confirmations" },
  { id: "mobile", label: "Mobile-friendly design" },
  { id: "backend", label: "Easy backend management" },
  { id: "deposit", label: "Deposit system" },
  { id: "plans", label: "Monthly payment plans" },
];

const Q25_NAME = [
  "Yes, you can use my full name and business name",
  "Yes, but use my first name only and business name",
  'Yes, but use initials only (e.g., "J.S., Storage Business Owner")',
  "I prefer to remain anonymous",
];

const Q25_PHOTO = [
  "Yes, any photos",
  "Yes, but I'd like to approve which photos first",
  "No photos please",
];

const Q25_NUMBERS = [
  "Yes, exact numbers are fine",
  'Yes, but rough percentages only (e.g., "3x revenue increase")',
  "No, keep numbers private",
];

const Q25_VIDEO = [
  "Yes, I'm interested",
  "Maybe, tell me more",
  "No thanks, written is fine",
];

const Q25_LINKEDIN = [
  "Yes, I'd love to",
  "Yes, if you write it and I approve",
  "Maybe later",
  "No thanks",
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-sora text-lg font-semibold text-white border-b border-white/15 pb-2 mt-12 first:mt-0">
      {children}
    </h2>
  );
}

function TextField({
  id,
  label,
  hint,
  rows = 3,
  value,
  onChange,
  required,
}: {
  id: string;
  label: string;
  hint?: string;
  rows?: number;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
        {required ? <span className="text-brand-purple"> *</span> : null}
      </label>
      {hint ? <p className={hintCls}>{hint}</p> : null}
      <div className={inputWrap}>
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          required={required}
          className={cn(inputLine, "resize-y min-h-[4.5rem]")}
        />
        <span className="input-underline-animate" />
      </div>
    </div>
  );
}

function SingleLineField({
  id,
  label,
  hint,
  type = "text",
  value,
  onChange,
  required,
}: {
  id: string;
  label: string;
  hint?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
        {required ? <span className="text-brand-purple"> *</span> : null}
      </label>
      {hint ? <p className={hintCls}>{hint}</p> : null}
      <div className={inputWrap}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={inputLine}
        />
        <span className="input-underline-animate" />
      </div>
    </div>
  );
}

function RadioBlock({
  name,
  label,
  hint,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  hint?: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className={labelCls}>{label}</legend>
      {hint ? <p className={hintCls}>{hint}</p> : null}
      <div className="space-y-2 mt-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-start gap-2 cursor-pointer text-sm text-white/85"
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="mt-1 accent-violet-500"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ScoreRadios({
  name,
  label,
  hint,
  max,
  value,
  onChange,
}: {
  name: string;
  label: string;
  hint?: string;
  max: number;
  value: string;
  onChange: (v: string) => void;
}) {
  const opts = Array.from({ length: max }, (_, i) => String(i + 1));
  return (
    <fieldset>
      <legend className={labelCls}>{label}</legend>
      {hint ? <p className={hintCls}>{hint}</p> : null}
      <div className="flex flex-wrap gap-2 mt-2">
        {opts.map((n) => (
          <label
            key={n}
            className={cn(
              "flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg border text-sm cursor-pointer transition-colors",
              value === n
                ? "border-brand-purple bg-violet-950/50 text-white"
                : "border-white/20 text-white/80 hover:border-white/40",
            )}
          >
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="sr-only"
            />
            {n}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function NoTimeQuestionnaireForm() {
  const [form, setForm] = useState<Record<string, string>>({ website: "" });
  const [q12Drivers, setQ12Drivers] = useState<Record<string, boolean>>({});
  const [q22Pick, setQ22Pick] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = useCallback((key: string, v: string) => {
    setSubmitError(null);
    setForm((prev) => ({ ...prev, [key]: v }));
  }, []);

  const toggleDriver = (key: string) => {
    setSubmitError(null);
    setQ12Drivers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleQ22 = (id: string) => {
    setSubmitError(null);
    setQ22Pick((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const drivers = Q12_DRIVERS.filter((d) => q12Drivers[d]).join("; ");
    const features = Q22_OPTS.filter((o) => q22Pick[o.id])
      .map((o) => o.label)
      .join("; ");
    const q22Other = form.q22_other?.trim();
    const q22Combined = [features, q22Other ? `Other: ${q22Other}` : ""]
      .filter(Boolean)
      .join(" | ");

    const { website: _honeypot, ...rest } = form;
    const payload = {
      ...rest,
      business_name: form.business_name || "NoTime Storage",
      q12_increase_drivers: drivers,
      q22_features: q22Combined,
    };
    void _honeypot;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/questionnaires/notime-storage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        hint?: string;
      };
      if (!res.ok) {
        setSubmitError(
          data.error ??
            (res.status === 503
              ? "This form isn’t fully configured yet. Please email us directly."
              : "Something went wrong. Please try again."),
        );
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
        <h3 className="font-sora text-xl font-semibold text-white mb-3">
          Thank you — we received your responses.
        </h3>
        <p className="text-white/70 max-w-md mx-auto text-sm leading-relaxed">
          Your answers are on their way to Finn. If you shared an email address,
          you&apos;ll get a short confirmation message. We&apos;ll use this to
          draft the case study and reach out if anything needs clarification.
        </p>
      </div>
    );
  }

  const f = (k: string) => form[k] ?? "";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      <input
        type="text"
        name="website"
        value={form.website ?? ""}
        onChange={(e) => set("website", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-0 w-0 opacity-0"
      />

      <p className="text-sm text-white/60 leading-relaxed">
        Take your time — rough estimates are fine. Your answers help us document
        real outcomes for NoTime Storage. Nothing is published without the
        permissions you select in Section 7.
      </p>

      {submitError ? (
        <p
          className="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          {submitError}
        </p>
      ) : null}

      <SectionTitle>Your details</SectionTitle>
      <div className="space-y-6">
        <SingleLineField
          id="client_name"
          label="Your name"
          hint="As you’d like it to appear in internal notes."
          value={f("client_name")}
          onChange={(v) => set("client_name", v)}
          required
        />
        <SingleLineField
          id="client_email"
          label="Email (optional)"
          hint="We’ll send a quick confirmation. No marketing — just a receipt for your records."
          type="email"
          value={f("client_email")}
          onChange={(v) => set("client_email", v)}
        />
        <SingleLineField
          id="business_name"
          label="Business name"
          value={f("business_name") || "NoTime Storage"}
          onChange={(v) => set("business_name", v)}
        />
        <SingleLineField
          id="interview_date"
          label="Date"
          hint="Today’s date is fine."
          type="date"
          value={f("interview_date")}
          onChange={(v) => set("interview_date", v)}
        />
      </div>

      <SectionTitle>Section 1 — Before we worked together</SectionTitle>
      <div className="space-y-6">
        <TextField
          id="q01_challenge"
          label="Biggest day-to-day challenge before"
          hint="Specific pain: missed calls, manual work, lost revenue, etc."
          value={f("q01_challenge")}
          onChange={(v) => set("q01_challenge", v)}
          rows={4}
        />
        <TextField
          id="q02_typical_day"
          label="A typical busy day before automation"
          value={f("q02_typical_day")}
          onChange={(v) => set("q02_typical_day", v)}
          rows={4}
        />
        <RadioBlock
          name="q3h"
          label="Hours per week on bookings, payments, and comms (before)"
          options={Q3_HOURS}
          value={f("q03_week_hours")}
          onChange={(v) => set("q03_week_hours", v)}
        />
        <SingleLineField
          id="q03_week_hours_detail"
          label="Specific estimate (hours/week)"
          value={f("q03_week_hours_detail")}
          onChange={(v) => set("q03_week_hours_detail", v)}
        />
        <RadioBlock
          name="q4r"
          label="Revenue lost to missed calls / slow responses / manual work"
          options={Q4_REVENUE}
          value={f("q04_revenue_loss_band")}
          onChange={(v) => set("q04_revenue_loss_band", v)}
        />
        <TextField
          id="q04_revenue_loss_detail"
          label="Details or context"
          value={f("q04_revenue_loss_detail")}
          onChange={(v) => set("q04_revenue_loss_detail", v)}
          rows={3}
        />
        <TextField
          id="q05_frustration"
          label="What frustrated you most"
          value={f("q05_frustration")}
          onChange={(v) => set("q05_frustration", v)}
          rows={4}
        />
        <TextField
          id="q06_previous_solutions"
          label="What you tried before (agencies, DIY, staff, other tools)"
          value={f("q06_previous_solutions")}
          onChange={(v) => set("q06_previous_solutions", v)}
          rows={5}
        />
      </div>

      <SectionTitle>Section 2 — Working together</SectionTitle>
      <div className="space-y-6">
        <ScoreRadios
          name="q7s"
          label="Communication & collaboration (1–10)"
          value={f("q07_communication_score")}
          onChange={(v) => set("q07_communication_score", v)}
          max={10}
        />
        <TextField
          id="q07_communication_why"
          label="What made it that score?"
          value={f("q07_communication_why")}
          onChange={(v) => set("q07_communication_why", v)}
          rows={3}
        />
        <TextField
          id="q08_surprises"
          label="Surprises (good or bad) during the project"
          value={f("q08_surprises")}
          onChange={(v) => set("q08_surprises", v)}
          rows={4}
        />
      </div>

      <SectionTitle>Section 3 — After: results</SectionTitle>
      <div className="space-y-6">
        <TextField
          id="q09_biggest_change"
          label="#1 biggest change since go-live"
          value={f("q09_biggest_change")}
          onChange={(v) => set("q09_biggest_change", v)}
          rows={4}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <SingleLineField
            id="q10_hours_before"
            label="Hours/week (before)"
            value={f("q10_hours_before")}
            onChange={(v) => set("q10_hours_before", v)}
          />
          <SingleLineField
            id="q10_hours_now"
            label="Hours/week (now)"
            value={f("q10_hours_now")}
            onChange={(v) => set("q10_hours_now", v)}
          />
          <SingleLineField
            id="q10_hours_saved"
            label="Hours saved / week"
            value={f("q10_hours_saved")}
            onChange={(v) => set("q10_hours_saved", v)}
          />
        </div>
        <TextField
          id="q10_time_use"
          label="What you’re doing with that time now"
          value={f("q10_time_use")}
          onChange={(v) => set("q10_time_use", v)}
          rows={3}
        />
        <RadioBlock
          name="q11l"
          label="Capturing leads you would have missed before"
          options={Q11_LEADS}
          value={f("q11_leads_capture")}
          onChange={(v) => set("q11_leads_capture", v)}
        />
        <TextField
          id="q11_extra_bookings"
          label="Rough extra bookings per week (if yes)"
          value={f("q11_extra_bookings")}
          onChange={(v) => set("q11_extra_bookings", v)}
          rows={2}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <SingleLineField
            id="q12_last_summer_revenue"
            label="Last summer revenue (estimate)"
            value={f("q12_last_summer_revenue")}
            onChange={(v) => set("q12_last_summer_revenue", v)}
          />
          <SingleLineField
            id="q12_this_summer_projection"
            label="This summer projection"
            value={f("q12_this_summer_projection")}
            onChange={(v) => set("q12_this_summer_projection", v)}
          />
        </div>
        <fieldset>
          <legend className={labelCls}>What’s driving that increase?</legend>
          <p className={hintCls}>Select all that apply.</p>
          <div className="space-y-2 mt-2">
            {Q12_DRIVERS.map((opt) => (
              <label
                key={opt}
                className="flex items-start gap-2 cursor-pointer text-sm text-white/85"
              >
                <input
                  type="checkbox"
                  checked={!!q12Drivers[opt]}
                  onChange={() => toggleDriver(opt)}
                  className="mt-1 accent-violet-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <TextField
          id="q13_payment_impact"
          label="Impact of automated payments (Stripe, Apple Pay, deposits)"
          value={f("q13_payment_impact")}
          onChange={(v) => set("q13_payment_impact", v)}
          rows={4}
        />
        <TextField
          id="q14_customers_say"
          label="What customers say about the new booking experience"
          value={f("q14_customers_say")}
          onChange={(v) => set("q14_customers_say", v)}
          rows={4}
        />
      </div>

      <SectionTitle>Section 4 — Testimonial</SectionTitle>
      <div className="space-y-6">
        <TextField
          id="q17_friend"
          label="If a friend asked about working with us, what would you say?"
          value={f("q17_friend")}
          onChange={(v) => set("q17_friend", v)}
          rows={5}
        />
        <TextField
          id="q18_skeptical"
          label="What would you say to someone skeptical about hiring a student for this?"
          value={f("q18_skeptical")}
          onChange={(v) => set("q18_skeptical", v)}
          rows={4}
        />
        <TextField
          id="q19_one_sentence"
          label="Value you received in one sentence"
          value={f("q19_one_sentence")}
          onChange={(v) => set("q19_one_sentence", v)}
          rows={2}
        />
        <RadioBlock
          name="q20a"
          label="Would you work together again?"
          options={Q20_AGAIN}
          value={f("q20_work_again")}
          onChange={(v) => set("q20_work_again", v)}
        />
        <TextField
          id="q20_work_again_why"
          label="Why?"
          value={f("q20_work_again_why")}
          onChange={(v) => set("q20_work_again_why", v)}
          rows={3}
        />
        <ScoreRadios
          name="q21n"
          label="Likelihood to recommend (1–10)"
          value={f("q21_nps")}
          onChange={(v) => set("q21_nps", v)}
          max={10}
        />
      </div>

      <SectionTitle>Section 5 — Features</SectionTitle>
      <div className="space-y-6">
        <fieldset>
          <legend className={labelCls}>Features you use or appreciate most</legend>
          <p className={hintCls}>Select all that apply.</p>
          <div className="space-y-2 mt-2">
            {Q22_OPTS.map((o) => (
              <label
                key={o.id}
                className="flex items-start gap-2 cursor-pointer text-sm text-white/85"
              >
                <input
                  type="checkbox"
                  checked={!!q22Pick[o.id]}
                  onChange={() => toggleQ22(o.id)}
                  className="mt-1 accent-violet-500"
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <SingleLineField
          id="q22_other"
          label="Other feature (optional)"
          value={f("q22_other")}
          onChange={(v) => set("q22_other", v)}
        />
        <TextField
          id="q22_feature_why"
          label="Why that feature matters to you"
          value={f("q22_feature_why")}
          onChange={(v) => set("q22_feature_why", v)}
          rows={3}
        />
        <TextField
          id="q23_wish"
          label="Anything you wish the system did that it doesn’t yet?"
          value={f("q23_wish")}
          onChange={(v) => set("q23_wish", v)}
          rows={3}
        />
      </div>

      <SectionTitle>Section 6 — Numbers & metrics</SectionTitle>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <SingleLineField
            id="q24_students_last"
            label="Students served last summer"
            value={f("q24_students_last")}
            onChange={(v) => set("q24_students_last", v)}
          />
          <SingleLineField
            id="q24_students_projected"
            label="Projected students this summer"
            value={f("q24_students_projected")}
            onChange={(v) => set("q24_students_projected", v)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SingleLineField
            id="q24_avg_booking"
            label="Average booking value"
            value={f("q24_avg_booking")}
            onChange={(v) => set("q24_avg_booking", v)}
          />
          <SingleLineField
            id="q24_total_bookings"
            label="Total bookings through the new system (so far)"
            value={f("q24_total_bookings")}
            onChange={(v) => set("q24_total_bookings", v)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SingleLineField
            id="q24_mins_before"
            label="Minutes to complete a booking (before)"
            value={f("q24_mins_before")}
            onChange={(v) => set("q24_mins_before", v)}
          />
          <SingleLineField
            id="q24_mins_now"
            label="Minutes to complete a booking (now)"
            value={f("q24_mins_now")}
            onChange={(v) => set("q24_mins_now", v)}
          />
        </div>
      </div>

      <SectionTitle>Section 7 — Permission & usage</SectionTitle>
      <div className="space-y-6">
        <RadioBlock
          name="q25n"
          label="How we may use your name"
          options={Q25_NAME}
          value={f("q25_publication_name")}
          onChange={(v) => set("q25_publication_name", v)}
        />
        <RadioBlock
          name="q25p"
          label="Photos in social posts"
          options={Q25_PHOTO}
          value={f("q25_photo")}
          onChange={(v) => set("q25_photo", v)}
        />
        <RadioBlock
          name="q25num"
          label="Sharing revenue / booking numbers publicly"
          options={Q25_NUMBERS}
          value={f("q25_share_numbers")}
          onChange={(v) => set("q25_share_numbers", v)}
        />
        <RadioBlock
          name="q25v"
          label="Short video testimonial"
          options={Q25_VIDEO}
          value={f("q25_video")}
          onChange={(v) => set("q25_video", v)}
        />
        <RadioBlock
          name="q25li"
          label="Joint Social Media Post"
          options={Q25_LINKEDIN}
          value={f("q25_linkedin")}
          onChange={(v) => set("q25_linkedin", v)}
        />
      </div>

      <SectionTitle>Section 8 — Final thoughts</SectionTitle>
      <div className="space-y-6">
        <TextField
          id="q26_else"
          label="Anything else we should know?"
          value={f("q26_else")}
          onChange={(v) => set("q26_else", v)}
          rows={5}
        />
        <SingleLineField
          id="footer_completed_by"
          label="Completed by"
          value={f("footer_completed_by")}
          onChange={(v) => set("footer_completed_by", v)}
        />
        <SingleLineField
          id="footer_completed_date"
          label="Completion date"
          type="date"
          value={f("footer_completed_date")}
          onChange={(v) => set("footer_completed_date", v)}
        />
        <TextField
          id="footer_signature"
          label="Signature (type your full name)"
          value={f("footer_signature")}
          onChange={(v) => set("footer_signature", v)}
          rows={2}
        />
      </div>

      <p className="text-xs text-white/45 leading-relaxed">
        This questionnaire is part of the Drivn.AI client success process. We only
        publish what you approve, per Section 7.
      </p>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full bg-violet-900 hover:bg-violet-800 text-lg py-6"
      >
        {isSubmitting ? "Sending…" : "Submit questionnaire"}
      </Button>
    </form>
  );
}
