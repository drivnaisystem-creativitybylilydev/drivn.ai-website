"use client";

import { InlineWidget, useCalendlyEventListener } from "react-calendly";

type Props = {
  calendlyUrl: string;
  prefill?: { name?: string; email?: string };
  /** From discovery form — used to match the lead in MongoDB */
  leadEmail?: string;
  leadName?: string;
};

/**
 * Inline Calendly + postMessage listener: when the invitee finishes booking,
 * we POST URIs to `/api/bookings/calendly-embed` (free Calendly–friendly).
 */
export function CalendlyEmbedStep({
  calendlyUrl,
  prefill,
  leadEmail,
  leadName,
}: Props) {
  useCalendlyEventListener({
    onEventScheduled: (e) => {
      const payload = e.data?.payload;
      if (!payload || typeof payload !== "object") return;
      const p = payload as {
        event?: { uri?: string };
        invitee?: { uri?: string };
      };
      const eventUri = typeof p.event?.uri === "string" ? p.event.uri : "";
      const inviteeUri = typeof p.invitee?.uri === "string" ? p.invitee.uri : "";
      if (!eventUri || !inviteeUri) return;

      void fetch("/api/bookings/calendly-embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventUri,
          inviteeUri,
          email: leadEmail ?? prefill?.email ?? null,
          fullName: leadName ?? prefill?.name ?? null,
          website: "",
        }),
      }).catch((err) => {
        console.error("[CalendlyEmbedStep] booking record failed:", err);
      });
    },
  });

  return (
    <InlineWidget
      url={calendlyUrl}
      prefill={prefill}
      styles={{ minWidth: "320px", height: "640px" }}
      className="w-full overflow-hidden rounded-lg border border-white/10 bg-white"
    />
  );
}
