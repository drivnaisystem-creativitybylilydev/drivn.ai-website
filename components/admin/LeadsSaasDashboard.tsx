"use client";

import { Fragment, useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LEAD_FIELD_KEYS, type LeadPayload } from "@/lib/lead-submission";
import { LEAD_FIELD_LABELS } from "@/lib/lead-labels";
import { logoutLeadsAdmin, deleteLeadAction } from "@/app/admin/leads/actions";
import { LeadCrmForm } from "@/components/admin/LeadCrmForm";
import { LeadExpandedPanel } from "@/components/admin/LeadExpandedPanel";

const ALWAYS_PREVIEW_FIELDS = new Set<(typeof LEAD_FIELD_KEYS)[number]>([
  "biggestChallenge",
  "additionalNotes",
]);

function isTruncatedField(key: (typeof LEAD_FIELD_KEYS)[number], text: string) {
  return ALWAYS_PREVIEW_FIELDS.has(key) || text.length > 96;
}

function CellPreview({
  text,
  fieldKey,
}: {
  text: string;
  fieldKey: (typeof LEAD_FIELD_KEYS)[number];
}) {
  const trunc = isTruncatedField(fieldKey, text);
  if (!trunc) {
    return <span className="break-words text-white/88">{text}</span>;
  }
  return (
    <span className="line-clamp-2 break-words text-white/78" title={text}>
      {text}
    </span>
  );
}

export type LeadInviteeView = {
  email: string;
  name?: string;
};

export type LeadBookingView = {
  calendlyEventUri?: string;
  calendlyInviteeUri?: string;
  eventTypeName?: string;
  joinUrl?: string;
  scheduledStart?: string;
  scheduledEnd?: string;
  timezone?: string;
  lastWebhookAt?: string;
  canceled?: boolean;
  invitees?: LeadInviteeView[];
};

export type LeadEmailSentView = {
  type: string;
  sentAt: string;
  opened?: boolean;
};

export type LeadStatusView =
  | "form_submitted"
  | "call_booked"
  | "call_completed"
  | "converted"
  | "lost";

const STATUS_LABEL: Record<LeadStatusView, string> = {
  form_submitted: "Form",
  call_booked: "Booked",
  call_completed: "Done",
  converted: "Won",
  lost: "Lost",
};

function StatusBadge({ status }: { status: LeadStatusView }) {
  return (
    <span className="inline-flex rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 font-sora text-[0.65rem] font-bold uppercase tracking-wider text-brand-purple-light/95">
      {STATUS_LABEL[status]}
    </span>
  );
}

export type LeadRowView = {
  id: string;
  created_at: string;
  payload: LeadPayload;
  schemaVersion: number;
  status: LeadStatusView;
  booking: LeadBookingView | null;
  emailsSent: LeadEmailSentView[];
  internalNotes: string;
  callNotes: string;
};

export type LeadAdminStats = {
  total: number;
  byStatus: Record<LeadStatusView, number>;
  upcomingCallsNext7Days: number;
};

export function LeadsSaasDashboard({
  leads,
  storageConfigured,
  stats,
}: {
  leads: LeadRowView[];
  storageConfigured: boolean;
  stats: LeadAdminStats;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDeleteLead = (leadId: string) => {
    setDeleteLeadId(leadId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteLeadId) return;
    startTransition(async () => {
      const result = await deleteLeadAction(deleteLeadId);
      setDeleteDialogOpen(false);
      setDeleteLeadId(null);
      if (result.error) {
        alert(`Error: ${result.error}`);
      }
    });
  };

  return (
    <div className="mx-auto max-w-[1680px] px-3 pb-12 pt-8 sm:px-6 md:px-8 md:pt-10">
      <header className="flex flex-col gap-6 border-b border-white/[0.08] pb-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-purple/40 bg-gradient-to-br from-brand-purple/30 to-purple-950/50 shadow-[0_0_28px_-4px_rgba(139,92,246,0.55)]">
            <Sparkles className="h-6 w-6 text-brand-purple-light" />
          </div>
          <div>
            <p className="font-inter text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brand-purple-light/90">
              Drivn · Operations
            </p>
            <h1 className="mt-1 bg-gradient-to-r from-white via-white to-brand-purple-light bg-clip-text font-sora text-2xl font-bold tracking-tight text-transparent md:text-3xl">
              Lead command center
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-white/50">
              Discovery funnel submissions · MongoDB · Expand a row for full field details
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/55">
            {leads.length} lead{leads.length === 1 ? "" : "s"}
          </span>
          <form action={logoutLeadsAdmin}>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-violet-900 via-brand-purple to-violet-800 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(139,92,246,0.65)] transition hover:brightness-110 hover:shadow-[0_0_32px_-2px_rgba(167,139,250,0.45)] active:scale-[0.98]"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
          <p className="font-sora text-[0.6rem] font-bold uppercase tracking-wider text-white/40">
            Total leads
          </p>
          <p className="mt-1 font-sora text-xl font-bold tabular-nums text-white">{stats.total}</p>
        </div>
        {(Object.keys(STATUS_LABEL) as LeadStatusView[]).map((key) => (
          <div
            key={key}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <p className="font-sora text-[0.6rem] font-bold uppercase tracking-wider text-white/40">
              {STATUS_LABEL[key]}
            </p>
            <p className="mt-1 font-sora text-xl font-bold tabular-nums text-white">
              {stats.byStatus[key]}
            </p>
          </div>
        ))}
        <div className="rounded-xl border border-brand-purple/25 bg-brand-purple/[0.08] px-4 py-3">
          <p className="font-sora text-[0.6rem] font-bold uppercase tracking-wider text-brand-purple-light/80">
            Calls · 7d
          </p>
          <p className="mt-1 font-sora text-xl font-bold tabular-nums text-white">
            {stats.upcomingCallsNext7Days}
          </p>
        </div>
      </div>

      {!storageConfigured ? (
        <div className="mt-10 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/45 via-brand-dark to-brand-dark p-6 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.15)]">
          <p className="font-sora text-lg font-semibold text-amber-100">Database not wired</p>
          <p className="mt-2 text-sm text-amber-100/75">
            Add{" "}
            <code className="rounded-md bg-black/35 px-1.5 py-0.5 font-mono text-xs">
              MONGODB_URI
            </code>{" "}
            to your environment, then restart the server.
          </p>
        </div>
      ) : leads.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-8 py-20 text-center">
          <div className="mb-4 rounded-2xl border border-brand-purple/30 bg-gradient-to-br from-brand-purple/15 to-transparent p-4">
            <Sparkles className="h-8 w-8 text-brand-purple-light" />
          </div>
          <p className="font-sora text-lg font-semibold text-white/90">No leads yet</p>
          <p className="mt-2 max-w-sm text-sm text-white/45">
            Submissions appear here after visitors complete the discovery form.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.02] shadow-[0_0_0_1px_rgba(139,92,246,0.08),0_24px_80px_-32px_rgba(0,0,0,0.85)] backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-gradient-to-r from-white/[0.07] via-brand-purple/[0.08] to-white/[0.05]">
                  <th className="w-10 px-2 py-3.5" aria-hidden />
                  <th className="whitespace-nowrap px-3 py-3.5 font-sora text-xs font-bold uppercase tracking-wider text-brand-purple-light/95">
                    Received
                  </th>
                  <th className="whitespace-nowrap px-3 py-3.5 font-sora text-xs font-bold uppercase tracking-wider text-white/75">
                    Status
                  </th>
                  {LEAD_FIELD_KEYS.map((key) => (
                    <th
                      key={key}
                      className="min-w-[7.5rem] px-3 py-3.5 font-sora text-xs font-bold uppercase tracking-wider text-white/75"
                    >
                      {LEAD_FIELD_LABELS[key]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((row) => {
                  const open = openId === row.id;
                  return (
                    <Fragment key={row.id}>
                      <tr
                        className="group border-b border-white/[0.06] transition-colors hover:bg-white/[0.04]"
                      >
                        <td className="px-2 py-3 align-middle">
                          <button
                            type="button"
                            onClick={() => setOpenId(open ? null : row.id)}
                            className="cursor-pointer"
                          >
                            <motion.span
                              animate={{ rotate: open ? 90 : 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 28 }}
                              className="inline-flex text-brand-purple-light/85"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </motion.span>
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-white/55">
                          {new Date(row.created_at).toLocaleString()}
                        </td>
                        <td className="px-3 py-3 align-middle">
                          <StatusBadge status={row.status} />
                        </td>
                        {LEAD_FIELD_KEYS.map((key) => {
                          const text = row.payload[key];
                          const trunc = isTruncatedField(key, text);
                          return (
                            <td key={key} className="max-w-[11rem] px-3 py-3 align-top">
                              <CellPreview text={text} fieldKey={key} />
                              {trunc ? (
                                <span className="mt-1 block text-[0.6rem] font-semibold uppercase tracking-wider text-brand-purple-light/60">
                                  {open ? "Details below" : "Row expand"}
                                </span>
                              ) : null}
                            </td>
                          );
                        })}
                        <td className="px-3 py-3 align-middle text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteLead(row.id)}
                            className="inline-flex items-center justify-center rounded-lg p-1 text-white/30 opacity-0 transition hover:bg-red-950/40 hover:text-red-400 group-hover:opacity-100"
                            title="Delete lead"
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                      {open ? (
                        <tr className="border-b border-white/[0.08] bg-black/30">
                          <td colSpan={3 + LEAD_FIELD_KEYS.length} className="p-0">
                            <LeadExpandedPanel>
                              <div className="border-t border-brand-purple/30 bg-gradient-to-b from-brand-purple/[0.14] to-transparent px-4 py-6 sm:px-6">
                              <p className="mb-4 font-sora text-xs font-bold uppercase tracking-widest text-brand-purple-light">
                                Pipeline &amp; metadata
                              </p>
                              <div className="mb-6 grid gap-3 rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                  <p className="font-sora text-[0.6rem] font-bold uppercase tracking-wider text-white/40">
                                    Schema
                                  </p>
                                  <p className="mt-1 font-mono text-white/90">v{row.schemaVersion}</p>
                                </div>
                                <div>
                                  <p className="font-sora text-[0.6rem] font-bold uppercase tracking-wider text-white/40">
                                    Status
                                  </p>
                                  <p className="mt-1">
                                    <StatusBadge status={row.status} />
                                  </p>
                                </div>
                                <div>
                                  <p className="font-sora text-[0.6rem] font-bold uppercase tracking-wider text-white/40">
                                    Emails logged
                                  </p>
                                  <p className="mt-1 tabular-nums text-white/90">
                                    {row.emailsSent.length}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-sora text-[0.6rem] font-bold uppercase tracking-wider text-white/40">
                                    Booking
                                  </p>
                                  <p className="mt-1 text-white/90">
                                    {row.booking?.scheduledStart
                                      ? new Date(row.booking.scheduledStart).toLocaleString()
                                      : "—"}
                                  </p>
                                </div>
                              </div>
                              {row.booking &&
                              (row.booking.eventTypeName ||
                                row.booking.joinUrl ||
                                row.booking.invitees?.length ||
                                row.booking.canceled) ? (
                                <div className="mb-6 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/80">
                                  <p className="font-sora text-[0.6rem] font-bold uppercase tracking-wider text-white/40">
                                    Booking details
                                  </p>
                                  {row.booking.canceled ? (
                                    <p className="mt-2 text-amber-200/90">Canceled (per last sync)</p>
                                  ) : null}
                                  {row.booking.eventTypeName ? (
                                    <p className="mt-2">
                                      <span className="text-white/45">Event: </span>
                                      {row.booking.eventTypeName}
                                    </p>
                                  ) : null}
                                  {row.booking.joinUrl ? (
                                    <p className="mt-2 break-all">
                                      <span className="text-white/45">Join: </span>
                                      <a
                                        href={row.booking.joinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-brand-purple-light underline-offset-2 hover:underline"
                                      >
                                        {row.booking.joinUrl}
                                      </a>
                                    </p>
                                  ) : null}
                                  {row.booking.invitees && row.booking.invitees.length > 0 ? (
                                    <ul className="mt-2 list-inside list-disc space-y-1 text-white/75">
                                      {row.booking.invitees.map((inv) => (
                                        <li key={inv.email}>
                                          {inv.name ? `${inv.name} · ` : null}
                                          {inv.email}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : null}
                                </div>
                              ) : null}
                              <div className="mb-8 rounded-xl border border-white/10 bg-black/25 p-4">
                                <p className="mb-3 font-sora text-[0.65rem] font-bold uppercase tracking-wider text-brand-purple-light/90">
                                  Update pipeline
                                </p>
                                <LeadCrmForm
                                  leadId={row.id}
                                  status={row.status}
                                  internalNotes={row.internalNotes}
                                  callNotes={row.callNotes}
                                />
                              </div>
                              <p className="mb-4 font-sora text-xs font-bold uppercase tracking-widest text-brand-purple-light">
                                Full record
                              </p>
                              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {LEAD_FIELD_KEYS.map((key) => (
                                  <div
                                    key={key}
                                    className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-4 shadow-[inset_0_1px_0_0_rgba(167,139,250,0.14)]"
                                  >
                                    <p className="font-sora text-[0.65rem] font-bold uppercase tracking-wider text-brand-purple-light/90">
                                      {LEAD_FIELD_LABELS[key]}
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-white/90">
                                      {row.payload[key]}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              </div>
                            </LeadExpandedPanel>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this lead? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <p className="mt-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-white/55 transition hover:border-brand-purple/35 hover:text-brand-purple-light"
        >
          ← Back to marketing site
        </Link>
      </p>
    </div>
  );
}
