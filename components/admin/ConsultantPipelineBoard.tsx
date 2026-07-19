"use client";

import { useState, useCallback, useRef, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  ChevronRight,
  X,
  ExternalLink,
  Globe,
  Clock,
  User,
  Tag,
  MoreHorizontal,
  Check,
  Filter,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import type { ConsultantLeadRow, LeadStats } from "@/lib/consultant-pipeline-db";
import {
  type PipelineStage,
  type ActionLogEntry,
  PIPELINE_STAGES,
  PIPELINE_STAGE_LABELS,
} from "@/lib/consultant-pipeline-constants";
import { moveLeadToStage, logAction, updateNotes } from "@/app/admin/consultant-pipeline/actions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 8) return "bg-violet-600 text-white shadow-[0_0_8px_rgba(124,58,237,0.6)]";
  if (score >= 6) return "bg-violet-900/60 text-violet-200";
  return "bg-zinc-800 text-zinc-400";
}

function stageAccent(stage: PipelineStage): string {
  const map: Record<PipelineStage, string> = {
    new: "border-zinc-700",
    emailed: "border-blue-800",
    followed_up: "border-yellow-700",
    called: "border-orange-700",
    replied: "border-green-700",
    meeting: "border-emerald-600",
    won: "border-emerald-500",
    lost: "border-red-900",
  };
  return map[stage];
}

function stageHeaderColor(stage: PipelineStage): string {
  const map: Record<PipelineStage, string> = {
    new: "text-zinc-400",
    emailed: "text-blue-400",
    followed_up: "text-yellow-400",
    called: "text-orange-400",
    replied: "text-green-400",
    meeting: "text-emerald-400",
    won: "text-emerald-300",
    lost: "text-red-400",
  };
  return map[stage];
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function actionLabel(action: ActionLogEntry["action"]): string {
  const map: Record<ActionLogEntry["action"], string> = {
    emailed: "Email sent",
    followed_up: "Follow-up sent",
    called: "Call made",
    replied: "Reply received",
    meeting_booked: "Meeting booked",
    note_added: "Note added",
  };
  return map[action];
}

function getDomain(url: string): string {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

// ─── Lead Card ────────────────────────────────────────────────────────────────

function LeadCard({
  lead,
  onOpen,
  onDragStart,
}: {
  lead: ConsultantLeadRow;
  onOpen: (lead: ConsultantLeadRow) => void;
  onDragStart: (e: React.DragEvent, leadId: string) => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      onClick={() => onOpen(lead)}
      className={`group cursor-pointer rounded-lg border bg-zinc-900 p-3 transition-all hover:border-zinc-600 hover:bg-zinc-800/80 active:opacity-80 ${stageAccent(lead.pipeline_stage)}`}
    >
      {/* Top row */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span
            className={`inline-flex h-5 min-w-[2rem] items-center justify-center rounded-full px-1.5 text-[0.62rem] font-bold tabular-nums ${scoreColor(lead.icp_score)}`}
          >
            {lead.icp_score_raw === "unscored" ? "?" : `${lead.icp_score}/10`}
          </span>
          {lead.niche && (
            <span className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-zinc-400">
              {lead.niche}
            </span>
          )}
        </div>
        <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-zinc-600 transition-colors group-hover:text-zinc-400" />
      </div>

      {/* Name + title */}
      <p className="mb-0.5 truncate text-[0.82rem] font-semibold text-white">{lead.name}</p>
      {lead.title && (
        <p className="mb-1.5 truncate text-[0.72rem] text-zinc-500">{lead.title}</p>
      )}

      {/* Location + email */}
      <div className="flex flex-col gap-0.5 text-[0.68rem] text-zinc-500">
        {lead.location && (
          <span className="truncate">{lead.location}</span>
        )}
        {lead.email_primary ? (
          <span className="truncate text-zinc-400">{lead.email_primary}</span>
        ) : (
          <span className="italic text-zinc-700">no email</span>
        )}
      </div>

      {/* Website */}
      {lead.website_url && (
        <div className="mt-1.5">
          <span className="text-[0.62rem] text-zinc-600">
            {getDomain(lead.website_url)}
          </span>
        </div>
      )}

      {/* Quick action row */}
      <div
        className="mt-2.5 flex items-center gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        {lead.email_primary && (
          <a
            href={`mailto:${lead.email_primary}`}
            className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-zinc-400 transition-colors hover:bg-blue-900/50 hover:text-blue-300"
            title="Send email"
          >
            <Mail className="h-3 w-3" />
          </a>
        )}
        {lead.phone && (
          <a
            href={`tel:${lead.phone}`}
            className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-zinc-400 transition-colors hover:bg-green-900/50 hover:text-green-300"
            title="Call"
          >
            <Phone className="h-3 w-3" />
          </a>
        )}
        {lead.profile_url && (
          <a
            href={lead.profile_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
            title="Open profile"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────────────────────

function KanbanColumn({
  stage,
  leads,
  onOpen,
  onDragStart,
  onDrop,
}: {
  stage: PipelineStage;
  leads: ConsultantLeadRow[];
  onOpen: (lead: ConsultantLeadRow) => void;
  onDragStart: (e: React.DragEvent, leadId: string) => void;
  onDrop: (stage: PipelineStage) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      className={`flex min-w-[220px] flex-1 flex-col rounded-xl border transition-colors ${
        isDragOver ? "border-violet-600/50 bg-violet-950/20" : "border-zinc-800 bg-zinc-950/50"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        onDrop(stage);
      }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <span className={`text-[0.75rem] font-bold uppercase tracking-wider ${stageHeaderColor(stage)}`}>
          {PIPELINE_STAGE_LABELS[stage]}
        </span>
        <span className="flex h-5 min-w-[1.5rem] items-center justify-center rounded-full bg-zinc-800 px-1.5 text-[0.65rem] font-bold text-zinc-400">
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2" style={{ maxHeight: "calc(100vh - 210px)" }}>
        {leads.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-8 text-[0.7rem] text-zinc-700">
            Drop here
          </div>
        )}
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onOpen={onOpen}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Lead Drawer ──────────────────────────────────────────────────────────────

function LeadDrawer({
  lead,
  onClose,
  onStageChange,
  onActionLog,
  onNotesSave,
}: {
  lead: ConsultantLeadRow;
  onClose: () => void;
  onStageChange: (leadId: string, stage: PipelineStage) => Promise<void>;
  onActionLog: (leadId: string, action: ActionLogEntry["action"], note?: string) => Promise<void>;
  onNotesSave: (leadId: string, notes: string) => Promise<void>;
}) {
  const [localStage, setLocalStage] = useState<PipelineStage>(lead.pipeline_stage);
  const [localNotes, setLocalNotes] = useState(lead.crm_notes ?? "");
  const [localLog, setLocalLog] = useState<ActionLogEntry[]>(lead.pipeline_log);
  const [notesDirty, setNotesDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logNote, setLogNote] = useState("");
  const [showLogForm, setShowLogForm] = useState(false);
  const [pendingAction, setPendingAction] = useState<ActionLogEntry["action"] | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleStageChange(stage: PipelineStage) {
    setLocalStage(stage);
    const newEntry: ActionLogEntry = {
      action: stageToAction(stage) ?? "note_added",
      timestamp: new Date().toISOString(),
    };
    startTransition(async () => {
      await onStageChange(lead.id, stage);
      if (stageToAction(stage)) {
        setLocalLog((prev) => [...prev, newEntry]);
      }
    });
  }

  function stageToAction(stage: PipelineStage): ActionLogEntry["action"] | null {
    const map: Partial<Record<PipelineStage, ActionLogEntry["action"]>> = {
      emailed: "emailed",
      followed_up: "followed_up",
      called: "called",
      replied: "replied",
      meeting: "meeting_booked",
    };
    return map[stage] ?? null;
  }

  async function handleQuickAction(action: ActionLogEntry["action"]) {
    const entry: ActionLogEntry = {
      action,
      timestamp: new Date().toISOString(),
    };
    setLocalLog((prev) => [...prev, entry]);
    startTransition(async () => {
      await onActionLog(lead.id, action);
    });

    // Auto-advance stage
    const stageMap: Partial<Record<ActionLogEntry["action"], PipelineStage>> = {
      emailed: "emailed",
      followed_up: "followed_up",
      called: "called",
      replied: "replied",
      meeting_booked: "meeting",
    };
    const newStage = stageMap[action];
    if (newStage && newStage !== localStage) {
      setLocalStage(newStage);
      startTransition(async () => {
        await onStageChange(lead.id, newStage);
      });
    }
  }

  async function handleLogWithNote() {
    if (!pendingAction) return;
    const entry: ActionLogEntry = {
      action: pendingAction,
      timestamp: new Date().toISOString(),
      ...(logNote.trim() ? { note: logNote.trim() } : {}),
    };
    setLocalLog((prev) => [...prev, entry]);
    startTransition(async () => {
      await onActionLog(lead.id, pendingAction, logNote.trim() || undefined);
    });
    setLogNote("");
    setPendingAction(null);
    setShowLogForm(false);
  }

  async function handleSaveNotes() {
    setSaving(true);
    await onNotesSave(lead.id, localNotes);
    setSaving(false);
    setNotesDirty(false);
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 38 }}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[480px] flex-col overflow-hidden border-l border-zinc-800 bg-zinc-950"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 px-5 py-4">
          <div className="flex-1 pr-4">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className={`inline-flex h-5 items-center rounded-full px-2 text-[0.62rem] font-bold ${scoreColor(lead.icp_score)}`}>
                {lead.icp_score_raw === "unscored" ? "Unscored" : `${lead.icp_score}/10`}
              </span>
              {lead.niche && (
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[0.6rem] uppercase tracking-wide text-zinc-400">
                  {lead.niche}
                </span>
              )}
            </div>
            <h2 className="text-[1rem] font-bold text-white">{lead.name}</h2>
            {lead.title && <p className="text-[0.75rem] text-zinc-400">{lead.title}</p>}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Contact info */}
          <section className="border-b border-zinc-800/50 px-5 py-4">
            <p className="mb-2.5 text-[0.65rem] font-bold uppercase tracking-widest text-zinc-600">
              Contact
            </p>
            <div className="grid gap-2">
              {lead.location && (
                <InfoRow icon={<User className="h-3.5 w-3.5" />} label="Location" value={lead.location} />
              )}
              {lead.email_primary && (
                <InfoRow
                  icon={<Mail className="h-3.5 w-3.5" />}
                  label="Email"
                  value={lead.email_primary}
                  action={
                    <a href={`mailto:${lead.email_primary}`} className="text-blue-400 hover:text-blue-300">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  }
                  sub={lead.email_confidence !== undefined ? `${lead.email_confidence}% confidence` : undefined}
                />
              )}
              {lead.phone && (
                <InfoRow
                  icon={<Phone className="h-3.5 w-3.5" />}
                  label="Phone"
                  value={lead.phone}
                  action={
                    <a href={`tel:${lead.phone}`} className="text-green-400 hover:text-green-300">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  }
                />
              )}
              {lead.website_url && (
                <InfoRow
                  icon={<Globe className="h-3.5 w-3.5" />}
                  label="Website"
                  value={getDomain(lead.website_url)}
                  action={
                    <a href={lead.website_url.startsWith("http") ? lead.website_url : `https://${lead.website_url}`} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  }
                />
              )}
              {lead.company_name && (
                <InfoRow icon={<Tag className="h-3.5 w-3.5" />} label="Company" value={lead.company_name} />
              )}
              {lead.profile_url && (
                <InfoRow
                  icon={<ExternalLink className="h-3.5 w-3.5" />}
                  label="Profile"
                  value={getDomain(lead.profile_url)}
                  action={
                    <a href={lead.profile_url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  }
                />
              )}
              {lead.independence_signal && (
                <InfoRow icon={<Check className="h-3.5 w-3.5" />} label="Signal" value={lead.independence_signal} />
              )}
              {lead.services_fit && (
                <InfoRow icon={<SlidersHorizontal className="h-3.5 w-3.5" />} label="Services Fit" value={lead.services_fit} />
              )}
              {lead.source && (
                <InfoRow icon={<Tag className="h-3.5 w-3.5" />} label="Source" value={lead.source} />
              )}
              {lead.scraped_at && (
                <InfoRow icon={<Clock className="h-3.5 w-3.5" />} label="Scraped" value={formatTimestamp(lead.scraped_at)} />
              )}
            </div>
          </section>

          {/* Stage selector */}
          <section className="border-b border-zinc-800/50 px-5 py-4">
            <p className="mb-2.5 text-[0.65rem] font-bold uppercase tracking-widest text-zinc-600">
              Pipeline Stage
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PIPELINE_STAGES.map((s) => (
                <button
                  key={s}
                  disabled={isPending}
                  onClick={() => handleStageChange(s)}
                  className={`rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide transition-all ${
                    localStage === s
                      ? "bg-violet-600 text-white shadow-[0_0_8px_rgba(124,58,237,0.5)]"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                  } disabled:opacity-50`}
                >
                  {PIPELINE_STAGE_LABELS[s]}
                </button>
              ))}
            </div>
          </section>

          {/* Quick actions */}
          <section className="border-b border-zinc-800/50 px-5 py-4">
            <p className="mb-2.5 text-[0.65rem] font-bold uppercase tracking-widest text-zinc-600">
              Quick Actions
            </p>
            <div className="flex flex-wrap gap-2">
              <QuickActionBtn
                label="Mark Emailed Today"
                onClick={() => handleQuickAction("emailed")}
                disabled={isPending}
              />
              <QuickActionBtn
                label="Mark Called Today"
                onClick={() => handleQuickAction("called")}
                disabled={isPending}
              />
              <QuickActionBtn
                label="Mark Replied"
                onClick={() => handleQuickAction("replied")}
                disabled={isPending}
              />
              <QuickActionBtn
                label="Follow-Up Sent"
                onClick={() => handleQuickAction("followed_up")}
                disabled={isPending}
              />
              <button
                onClick={() => {
                  setPendingAction("note_added");
                  setShowLogForm(true);
                }}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[0.7rem] font-medium text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white disabled:opacity-50"
              >
                <MoreHorizontal className="h-3 w-3" />
                Add Note
              </button>
            </div>

            {/* Log form */}
            <AnimatePresence>
              {showLogForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={logNote}
                      onChange={(e) => setLogNote(e.target.value)}
                      placeholder="Optional note..."
                      rows={2}
                      className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-[0.75rem] text-white placeholder-zinc-600 outline-none focus:border-violet-600"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleLogWithNote}
                        disabled={isPending}
                        className="rounded-lg bg-violet-600 px-3 py-1.5 text-[0.7rem] font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setShowLogForm(false);
                          setLogNote("");
                          setPendingAction(null);
                        }}
                        className="rounded-lg border border-zinc-700 px-3 py-1.5 text-[0.7rem] font-medium text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Notes */}
          <section className="border-b border-zinc-800/50 px-5 py-4">
            <p className="mb-2.5 text-[0.65rem] font-bold uppercase tracking-widest text-zinc-600">
              Notes
            </p>
            <textarea
              value={localNotes}
              onChange={(e) => {
                setLocalNotes(e.target.value);
                setNotesDirty(true);
              }}
              placeholder="Internal notes about this lead..."
              rows={4}
              className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-[0.75rem] text-white placeholder-zinc-600 outline-none focus:border-violet-600"
            />
            <AnimatePresence>
              {notesDirty && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-2"
                >
                  <button
                    onClick={handleSaveNotes}
                    disabled={saving}
                    className="rounded-lg bg-violet-600 px-3 py-1.5 text-[0.7rem] font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Notes"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Action log timeline */}
          <section className="px-5 py-4">
            <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-widest text-zinc-600">
              Activity Log
            </p>
            {localLog.length === 0 ? (
              <p className="text-[0.72rem] italic text-zinc-700">No activity logged yet.</p>
            ) : (
              <div className="space-y-2.5">
                {[...localLog].reverse().map((entry, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-violet-700" />
                    <div>
                      <p className="text-[0.73rem] font-medium text-zinc-300">
                        {actionLabel(entry.action)}
                      </p>
                      {entry.note && (
                        <p className="mt-0.5 text-[0.68rem] text-zinc-500">{entry.note}</p>
                      )}
                      <p className="mt-0.5 text-[0.62rem] text-zinc-700">
                        {formatTimestamp(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </motion.aside>
    </>
  );
}

function InfoRow({
  icon,
  label,
  value,
  sub,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-zinc-600">{icon}</span>
      <div className="flex-1 min-w-0">
        <span className="text-[0.62rem] uppercase tracking-wide text-zinc-600">{label}: </span>
        <span className="break-all text-[0.73rem] text-zinc-300">{value}</span>
        {sub && <p className="text-[0.62rem] text-zinc-600">{sub}</p>}
      </div>
      {action && <span className="shrink-0">{action}</span>}
    </div>
  );
}

function QuickActionBtn({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-[0.7rem] font-medium text-zinc-400 transition-colors hover:border-violet-700 hover:bg-violet-950/30 hover:text-violet-300 disabled:opacity-50"
    >
      {label}
    </button>
  );
}

// ─── Main Board ───────────────────────────────────────────────────────────────

interface Props {
  leads: ConsultantLeadRow[];
  stats: LeadStats;
}

export function ConsultantPipelineBoard({ leads: initialLeads, stats }: Props) {
  const [leads, setLeads] = useState<ConsultantLeadRow[]>(initialLeads);
  const [activeLead, setActiveLead] = useState<ConsultantLeadRow | null>(null);

  // Merge incoming prop updates (from ConsultantOS live-refresh polling)
  const prevLeadsRef = useRef(initialLeads);
  useEffect(() => {
    if (initialLeads === prevLeadsRef.current) return;
    prevLeadsRef.current = initialLeads;
    setLeads(initialLeads);
    setActiveLead((prev) =>
      prev ? (initialLeads.find((l) => l.id === prev.id) ?? prev) : null,
    );
  }, [initialLeads]);
  const [search, setSearch] = useState("");
  const [filterNiche, setFilterNiche] = useState("");
  const [filterMinScore, setFilterMinScore] = useState(0);
  const [filterHasEmail, setFilterHasEmail] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dragLeadId = useRef<string | null>(null);

  // Compute unique niches
  const niches = Array.from(
    new Set(leads.map((l) => l.niche).filter((n): n is string => !!n)),
  ).sort();

  // Filtered leads
  const filtered = leads.filter((l) => {
    if (filterHasEmail && !l.email_primary) return false;
    if (filterMinScore > 0 && l.icp_score < filterMinScore) return false;
    if (filterNiche && l.niche !== filterNiche) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        (l.email_primary?.toLowerCase().includes(q) ?? false) ||
        (l.title?.toLowerCase().includes(q) ?? false) ||
        (l.location?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  // Group by stage
  const byStage = Object.fromEntries(
    PIPELINE_STAGES.map((s) => [
      s,
      filtered.filter((l) => l.pipeline_stage === s),
    ]),
  ) as Record<PipelineStage, ConsultantLeadRow[]>;

  // Drag-and-drop
  function handleDragStart(e: React.DragEvent, leadId: string) {
    dragLeadId.current = leadId;
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(targetStage: PipelineStage) {
    const id = dragLeadId.current;
    if (!id) return;
    dragLeadId.current = null;

    const lead = leads.find((l) => l.id === id);
    if (!lead || lead.pipeline_stage === targetStage) return;

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, pipeline_stage: targetStage } : l)),
    );

    startTransition(async () => {
      const result = await moveLeadToStage(id, targetStage);
      if (result.error) {
        // Roll back
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, pipeline_stage: lead.pipeline_stage } : l)),
        );
      }
    });
  }

  const handleStageChange = useCallback(
    async (leadId: string, stage: PipelineStage) => {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, pipeline_stage: stage } : l)),
      );
      // Update activeLead if open
      setActiveLead((prev) =>
        prev?.id === leadId ? { ...prev, pipeline_stage: stage } : prev,
      );
      await moveLeadToStage(leadId, stage);
    },
    [],
  );

  const handleActionLog = useCallback(
    async (leadId: string, action: ActionLogEntry["action"], note?: string) => {
      const entry: ActionLogEntry = {
        action,
        timestamp: new Date().toISOString(),
        ...(note ? { note } : {}),
      };
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? { ...l, pipeline_log: [...l.pipeline_log, entry] }
            : l,
        ),
      );
      setActiveLead((prev) =>
        prev?.id === leadId
          ? { ...prev, pipeline_log: [...prev.pipeline_log, entry] }
          : prev,
      );
      await logAction(leadId, action, note);
    },
    [],
  );

  const handleNotesSave = useCallback(async (leadId: string, notes: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, crm_notes: notes } : l)),
    );
    setActiveLead((prev) =>
      prev?.id === leadId ? { ...prev, crm_notes: notes } : prev,
    );
    await updateNotes(leadId, notes);
  }, []);

  function openLead(lead: ConsultantLeadRow) {
    // Always get the freshest version from state
    const fresh = leads.find((l) => l.id === lead.id) ?? lead;
    setActiveLead(fresh);
  }

  return (
    <div className="flex min-h-svh flex-col bg-zinc-950">
      {/* Page header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h1 className="font-inter text-[1.1rem] font-bold text-white">
              Consultant Pipeline
            </h1>
            <p className="text-[0.72rem] text-zinc-500">
              German coaches &amp; consultants · {stats.total} leads
            </p>
          </div>
          {isPending && (
            <span className="text-[0.65rem] text-violet-400 animate-pulse">Saving...</span>
          )}
        </div>

        {/* Stats chips */}
        <div className="mb-4 flex flex-wrap gap-2">
          <StatChip label="Total" value={stats.total} />
          <StatChip label="With Email" value={stats.withEmail} accent />
          {PIPELINE_STAGES.filter((s) => stats.byStage[s] > 0).map((s) => (
            <StatChip
              key={s}
              label={PIPELINE_STAGE_LABELS[s]}
              value={stats.byStage[s]}
            />
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-[320px]">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, location..."
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-1.5 pl-8 pr-3 text-[0.75rem] text-white placeholder-zinc-600 outline-none focus:border-violet-600"
            />
          </div>

          <select
            value={filterNiche}
            onChange={(e) => setFilterNiche(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-900 py-1.5 pl-3 pr-6 text-[0.72rem] text-zinc-300 outline-none focus:border-violet-600"
          >
            <option value="">All niches</option>
            {niches.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-zinc-600" />
            <span className="text-[0.7rem] text-zinc-500">Min score:</span>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={filterMinScore}
              onChange={(e) => setFilterMinScore(Number(e.target.value))}
              className="w-20 accent-violet-600"
            />
            <span className="w-4 text-center text-[0.7rem] text-zinc-400">{filterMinScore}</span>
          </div>

          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              checked={filterHasEmail}
              onChange={(e) => setFilterHasEmail(e.target.checked)}
              className="h-3.5 w-3.5 accent-violet-600"
            />
            <span className="text-[0.72rem] text-zinc-400">Has email</span>
          </label>

          {(search || filterNiche || filterMinScore > 0 || filterHasEmail) && (
            <button
              onClick={() => {
                setSearch("");
                setFilterNiche("");
                setFilterMinScore(0);
                setFilterHasEmail(false);
              }}
              className="text-[0.7rem] text-zinc-600 hover:text-zinc-300"
            >
              Clear filters
            </button>
          )}
        </div>
      </header>

      {/* Kanban board */}
      <div className="flex flex-1 gap-2 overflow-x-auto p-4">
        {PIPELINE_STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            leads={byStage[stage]}
            onOpen={openLead}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {/* Lead drawer */}
      <AnimatePresence>
        {activeLead && (
          <LeadDrawer
            lead={activeLead}
            onClose={() => setActiveLead(null)}
            onStageChange={handleStageChange}
            onActionLog={handleActionLog}
            onNotesSave={handleNotesSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatChip({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium ${
        accent
          ? "border-violet-800/50 bg-violet-950/30 text-violet-300"
          : "border-zinc-800 bg-zinc-900 text-zinc-400"
      }`}
    >
      <span className="font-bold text-white">{value}</span>
      {label}
    </span>
  );
}
