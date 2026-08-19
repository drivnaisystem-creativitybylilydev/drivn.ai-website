import { Send, PhoneCall } from "lucide-react";
import type { SourcedLeadRow } from "@/lib/sourced-lead-db";

// notes are stored as "Owner: X | Intake: Y | Pain point: Z | Offer fit: W | Notes: V" —
// but some leads (bounce flags, manual call-only markers) prepend a "[LIKE THIS]" bracket
// or other free text before the first labeled segment, which breaks a naive " | "-split
// parse (the bracket's own internal colon gets mistaken for the segment's key). Extracting
// each label by regex anywhere in the string is robust to that, and to labels appearing in
// any order.
const LABELS = ["Owner", "Intake", "Pain point", "Offer fit", "Notes"];

export function parseLeadNotes(notes?: string) {
  if (!notes) return { painPoint: null, offerFit: null, owner: null, intake: null, extra: null };

  function extract(label: string): string | null {
    const otherLabels = LABELS.filter((l) => l !== label).join("|");
    const re = new RegExp(`\\b${label}:\\s*(.+?)(?=\\s*\\|\\s*(?:${otherLabels}|Draft note):|$)`, "i");
    const m = notes!.match(re);
    return m ? m[1].trim() : null;
  }

  return {
    painPoint: extract("Pain point"),
    offerFit: extract("Offer fit"),
    owner: extract("Owner"),
    intake: extract("Intake"),
    extra: extract("Notes"),
  };
}

// email on file -> lead with an email first, call as backup. No email -> cold call is the only real option.
export function getLeadChannel(lead: Pick<SourcedLeadRow, "email">): "email" | "call" {
  return lead.email ? "email" : "call";
}

export const CHANNEL_META = {
  email: { label: "Email", icon: Send, color: "text-brand-purple-light", bg: "bg-brand-purple/10", border: "border-brand-purple/25" },
  call: { label: "Cold call", icon: PhoneCall, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/25" },
} as const;
