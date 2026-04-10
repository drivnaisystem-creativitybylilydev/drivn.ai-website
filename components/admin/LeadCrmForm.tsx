"use client";

import { updateLeadCrmFromAdmin } from "@/app/admin/leads/actions";
import { Button } from "@/components/ui/button";
import type { LeadStatus } from "@/lib/lead-document";

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "form_submitted", label: "Form submitted" },
  { value: "call_booked", label: "Call booked" },
  { value: "call_completed", label: "Call completed" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

export function LeadCrmForm({
  leadId,
  status,
  internalNotes,
  callNotes,
}: {
  leadId: string;
  status: LeadStatus;
  internalNotes: string;
  callNotes: string;
}) {
  return (
    <form action={updateLeadCrmFromAdmin} className="space-y-4">
      <input type="hidden" name="leadId" value={leadId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`status-${leadId}`}
            className="block font-sora text-[0.6rem] font-bold uppercase tracking-wider text-white/40"
          >
            Status
          </label>
          <select
            id={`status-${leadId}`}
            name="status"
            defaultValue={status}
            className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button
            type="submit"
            className="w-full bg-violet-900 hover:bg-violet-800 sm:w-auto"
          >
            Save pipeline
          </Button>
        </div>
      </div>
      <div>
        <label
          htmlFor={`internal-${leadId}`}
          className="block font-sora text-[0.6rem] font-bold uppercase tracking-wider text-white/40"
        >
          Internal notes
        </label>
        <textarea
          id={`internal-${leadId}`}
          name="internalNotes"
          rows={3}
          defaultValue={internalNotes}
          className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
          placeholder="Private — not shown to the lead"
        />
      </div>
      <div>
        <label
          htmlFor={`call-${leadId}`}
          className="block font-sora text-[0.6rem] font-bold uppercase tracking-wider text-white/40"
        >
          Call notes
        </label>
        <textarea
          id={`call-${leadId}`}
          name="callNotes"
          rows={3}
          defaultValue={callNotes}
          className="mt-2 w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
          placeholder="Outcomes, objections, next steps…"
        />
      </div>
    </form>
  );
}
