"use client";

/**
 * "Get started" flow for /moving-and-logistics.
 *
 * A context provider + a Radix dialog holding a 3-step intake wizard. CTAs across the
 * page call useGetStarted().open() instead of scrolling to an on-page form. Steps are
 * grouped logically (company → what to fix → contact); the final submit posts to
 * /api/moving-lead, then the dialog shows a "pick a time" handoff to the calendar.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "@phosphor-icons/react/dist/ssr";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const MAILTO =
  "mailto:drivn.ai.system@gmail.com?subject=Moving%20%26%20Logistics%20%E2%80%94%20Drivn.AI";
const SPRING = [0.32, 0.72, 0, 1] as const;

type Ctx = { open: () => void; close: () => void };
const GetStartedCtx = createContext<Ctx | null>(null);

export function useGetStarted(): Ctx {
  const c = useContext(GetStartedCtx);
  if (!c) throw new Error("useGetStarted must be used within GetStartedProvider");
  return c;
}

// ── Step + field config ────────────────────────────────────────────────────
type Field =
  | {
      name: string;
      label: string;
      hint?: string;
      type: "text" | "email" | "tel" | "textarea";
      required?: boolean;
    }
  | {
      name: string;
      label: string;
      hint?: string;
      type: "select";
      required?: boolean;
      options: string[];
    };

const STEPS: Array<{ title: string; blurb: string; fields: Field[] }> = [
  {
    title: "Your company",
    blurb: "The basics, so the call is about your numbers and not generic advice.",
    fields: [
      { name: "companyName", label: "Company name", type: "text", required: true },
      {
        name: "role",
        label: "Your role",
        type: "select",
        required: true,
        options: ["Owner", "Operations manager", "Sales", "Office manager", "Other"],
      },
      {
        name: "quoteVolume",
        label: "Quote requests a week",
        hint: "A rough number is fine — this is what we run the math on.",
        type: "select",
        required: true,
        options: ["Under 10", "10–30", "30–60", "60+"],
      },
    ],
  },
  {
    title: "What to fix first",
    blurb: "Where you'd want to start. We'll say so if something else should come first.",
    fields: [
      {
        name: "interest",
        label: "Most interested in",
        type: "select",
        required: true,
        options: [
          "Website + instant quoting",
          "Precision quoting",
          "Speed-to-lead follow-up",
          "Google Business Profile + local SEO",
          "The Operating System",
          "Not sure yet",
        ],
      },
      {
        name: "notes",
        label: "Anything about your current setup?",
        hint: "How you quote and handle missed calls today, or a question for the call. Optional.",
        type: "textarea",
      },
    ],
  },
  {
    title: "Where to reach you",
    blurb: "We'll send a calendar invite and a short recap — nothing else.",
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true },
      { name: "email", label: "Work email", type: "email", required: true },
      { name: "phone", label: "Phone", type: "tel", required: true },
    ],
  },
];

const requiredForStep = (i: number) =>
  STEPS[i].fields.filter((f) => f.required).map((f) => f.name);

const INPUT_CLASS =
  "font-mono w-full border-0 border-b border-white/20 bg-transparent py-2 text-[14px] text-white placeholder:text-white/30 focus:border-transparent focus:outline-none focus:ring-0";

// ── Wizard ─────────────────────────────────────────────────────────────────
function Wizard({
  calendarUrl,
  onClose,
}: {
  calendarUrl: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({ website: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const isLast = step === STEPS.length - 1;
  const canAdvance = requiredForStep(step).every((k) => values[k]?.trim());

  const set = (name: string, v: string) => {
    setError(null);
    setValues((p) => ({ ...p, [name]: v }));
  };

  async function submit() {
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/moving-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const p = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus("error");
        setError(p.error ?? "Something went wrong saving your details.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Network error — your details didn't send.");
    }
  }

  if (status === "done") {
    return (
      <div className="py-4 text-center">
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "rgba(124,77,255,0.14)" }}
        >
          <Check
            size={22}
            weight="bold"
            style={{ color: "var(--color-accent-light)" }}
          />
        </div>
        <DialogTitle className="font-display mt-4 text-[20px] font-semibold text-white">
          You&rsquo;re in.
        </DialogTitle>
        <p className="font-mono mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-white">
          We have your details. Pick a time that works and we&rsquo;ll run the
          numbers together.
        </p>
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display ease-spring mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-transform duration-300 active:scale-[0.97]"
          style={{ background: "var(--color-accent)" }}
        >
          Pick a time
          <ArrowRight size={14} weight="bold" />
        </a>
        <button
          type="button"
          onClick={onClose}
          className="font-mono mt-4 block w-full text-[12px] text-white transition-colors hover:text-white/70"
        >
          Close — I&rsquo;ll book later
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        value={values.website ?? ""}
        onChange={(e) => set("website", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-0 w-0 opacity-0"
      />

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between pr-9 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span style={{ color: "var(--color-accent-light)" }}>Get started</span>
          <span className="text-white">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
        <div
          className="mt-2 h-1 w-full overflow-hidden rounded-full"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--color-accent)" }}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: SPRING }}
          />
        </div>
      </div>

      <DialogTitle className="font-display text-[19px] font-semibold leading-tight text-white">
        {STEPS[step].title}
      </DialogTitle>
      <p className="font-mono mt-1.5 text-[12px] leading-relaxed text-white">
        {STEPS[step].blurb}
      </p>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: SPRING }}
            className="space-y-6"
          >
            {STEPS[step].fields.map((f) => {
              const v = values[f.name] ?? "";
              return (
                <div key={f.name}>
                  <label
                    htmlFor={f.name}
                    className="font-display block text-[13px] font-semibold text-white"
                  >
                    {f.label}
                    {f.required && (
                      <span style={{ color: "var(--color-accent-light)" }}> *</span>
                    )}
                  </label>
                  {f.hint && (
                    <p className="font-mono mt-1 text-[11px] leading-relaxed text-white">
                      {f.hint}
                    </p>
                  )}
                  <div className="audit-form-field relative mt-2">
                    {f.type === "textarea" ? (
                      <textarea
                        id={f.name}
                        value={v}
                        onChange={(e) => set(f.name, e.target.value)}
                        rows={3}
                        placeholder="Optional"
                        className={`${INPUT_CLASS} resize-none`}
                      />
                    ) : f.type === "select" ? (
                      <select
                        id={f.name}
                        value={v}
                        onChange={(e) => set(f.name, e.target.value)}
                        className={`${INPUT_CLASS} cursor-pointer appearance-none [&>option]:bg-[#131316] [&>option]:text-white`}
                      >
                        <option value="" disabled>
                          Select…
                        </option>
                        {f.options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={f.name}
                        type={f.type}
                        value={v}
                        onChange={(e) => set(f.name, e.target.value)}
                        autoComplete={
                          f.type === "email"
                            ? "email"
                            : f.type === "tel"
                              ? "tel"
                              : undefined
                        }
                        placeholder={`Your ${f.label.toLowerCase()}`}
                        className={INPUT_CLASS}
                      />
                    )}
                    <span className="input-underline-animate" />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {error && (
        <div
          role="alert"
          className="font-mono mt-5 rounded-lg border px-4 py-3 text-[12.5px] leading-relaxed"
          style={{
            borderColor: "rgba(248,113,113,0.4)",
            background: "rgba(127,29,29,0.25)",
            color: "rgb(254,202,202)",
          }}
        >
          {error}{" "}
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            book the call directly
          </a>{" "}
          or{" "}
          <a href={MAILTO} className="underline">
            email us
          </a>
          .
        </div>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="font-display inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:text-white"
            style={{ borderColor: "rgba(255,255,255,0.18)" }}
          >
            <ArrowLeft size={13} weight="bold" />
            Back
          </button>
        ) : (
          <span />
        )}

        {isLast ? (
          <button
            type="button"
            onClick={submit}
            disabled={!canAdvance || status === "submitting"}
            className="font-display ease-spring inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white transition-transform duration-300 active:scale-[0.97] disabled:opacity-40"
            style={{ background: "var(--color-accent)" }}
          >
            {status === "submitting" ? "Sending…" : "Submit & pick a time"}
            {status !== "submitting" && <ArrowRight size={13} weight="bold" />}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canAdvance}
            className="font-display ease-spring inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white transition-transform duration-300 active:scale-[0.97] disabled:opacity-40"
            style={{ background: "var(--color-accent)" }}
          >
            Next
            <ArrowRight size={13} weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Provider ───────────────────────────────────────────────────────────────
export function GetStartedProvider({
  calendarUrl,
  children,
}: {
  calendarUrl: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [instance, setInstance] = useState(0);

  const close = useCallback(() => setOpen(false), []);
  const ctx = useMemo<Ctx>(
    () => ({
      open: () => {
        setInstance((n) => n + 1);
        setOpen(true);
      },
      close,
    }),
    [close],
  );

  return (
    <GetStartedCtx.Provider value={ctx}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onClose={close}
          className="!gap-0 !border-white/10 !p-0 sm:!max-w-xl sm:!rounded-2xl"
          style={{ background: "var(--color-mono-surface)" }}
        >
          <DialogDescription className="sr-only">
            A short three-step intake, then pick a time for a call.
          </DialogDescription>
          <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-8">
            <Wizard
              key={instance}
              calendarUrl={calendarUrl}
              onClose={close}
            />
          </div>
        </DialogContent>
      </Dialog>
    </GetStartedCtx.Provider>
  );
}
