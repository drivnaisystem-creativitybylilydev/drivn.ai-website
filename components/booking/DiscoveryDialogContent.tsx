"use client";

import dynamic from "next/dynamic";
import { hasCalendlyScheduling, getCalendlySchedulingUrl } from "@/lib/booking";
import AuditForm from "@/components/forms/AuditForm";

const CalendlyEmbedStep = dynamic(
  () =>
    import("@/components/booking/CalendlyEmbedStep").then((m) => m.CalendlyEmbedStep),
  { ssr: false, loading: () => <CalendlySkeleton /> },
);

function CalendlySkeleton() {
  return (
    <div
      className="flex min-h-[560px] w-full items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]"
      aria-hidden
    >
      <p className="text-sm text-white/45">Loading calendar…</p>
    </div>
  );
}

export type DiscoveryDialogView = "schedule" | "form";

export type CalendlySchedulePrefill = {
  name?: string;
  email?: string;
};

type DiscoveryDialogContentProps = {
  formKey: number;
  view: DiscoveryDialogView;
  onViewChange: (view: DiscoveryDialogView) => void;
  schedulePrefill?: CalendlySchedulePrefill;
  onFormFinishedForSchedule?: (answers: Record<string, string>) => void;
};

export function DiscoveryDialogContent({
  formKey,
  view,
  onViewChange,
  schedulePrefill,
  onFormFinishedForSchedule,
}: DiscoveryDialogContentProps) {
  const calendly = hasCalendlyScheduling();
  const calendlyUrl = getCalendlySchedulingUrl();

  const prefillForWidget =
    schedulePrefill &&
    (schedulePrefill.name || schedulePrefill.email)
      ? {
          ...(schedulePrefill.name ? { name: schedulePrefill.name } : {}),
          ...(schedulePrefill.email ? { email: schedulePrefill.email } : {}),
        }
      : undefined;

  if (calendly && view === "schedule") {
    return (
      <div className="space-y-4">
        <CalendlyEmbedStep
          calendlyUrl={calendlyUrl}
          prefill={prefillForWidget}
          leadEmail={schedulePrefill?.email}
          leadName={schedulePrefill?.name}
        />
        <p className="text-center text-sm text-white/50">
          <button
            type="button"
            onClick={() => onViewChange("form")}
            className="font-medium text-brand-purple-light underline-offset-2 hover:text-brand-purple-light/90 hover:underline"
          >
            ← Back to form
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AuditForm
        key={formKey}
        onContinueToSchedule={
          calendly ? onFormFinishedForSchedule : undefined
        }
      />
      {!calendly && process.env.NODE_ENV === "development" ? (
        <p className="border-t border-white/10 pt-4 text-center text-xs text-white/45">
          Set{" "}
          <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.65rem]">
            NEXT_PUBLIC_CALENDLY_URL
          </code>{" "}
          in <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[0.65rem]">.env.local</code>{" "}
          to embed scheduling.
        </p>
      ) : null}
    </div>
  );
}
