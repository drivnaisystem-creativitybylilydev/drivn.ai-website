"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Phone,
  Globe,
  Star,
  Pin,
  Mail,
  User,
  CheckCircle2,
  Video,
  CalendarPlus,
  RotateCcw,
  StickyNote,
  Plus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateLeadStatusAction, generateWeeklyQueueAction, resetWeeklyQueueAction } from "@/app/admin/sourced-leads/actions";
import type { SourcedLeadRow } from "@/lib/sourced-lead-db";
import { parseLeadNotes, getLeadChannel, CHANNEL_META } from "@/lib/pipeline-lead-utils";
import { AddBusinessModal } from "@/components/admin/AddBusinessModal";

function dateKeyOf(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function todayKey(): string {
  return dateKeyOf(new Date().toISOString())!;
}

function formatDayLabel(key: string): string {
  const d = new Date(`${key}T00:00:00`);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

function toGCalUTC(d: Date): string {
  return d.toISOString().replace(/[-:]|\.\d{3}/g, "");
}

function ScheduleCallModal({
  lead,
  offerFit,
  painPoint,
  onClose,
}: {
  lead: SourcedLeadRow;
  offerFit: string | null;
  painPoint: string | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [time, setTime] = useState("14:00");
  const [duration, setDuration] = useState(30);
  const [pending, startTransition] = useTransition();

  function handleCreate() {
    const start = new Date(`${date}T${time}:00`);
    const end = new Date(start.getTime() + duration * 60000);
    const details = [
      `Initial audit call — Drivn.AI × ${lead.name}`,
      offerFit ? `Package: ${offerFit}` : null,
      painPoint ? `Pain point: ${painPoint}` : null,
      lead.phone ? `Phone: ${lead.phone}` : null,
      "",
      "Click \"Add Google Meet video conferencing\" before saving to generate the call link.",
    ]
      .filter(Boolean)
      .join("\n");

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `Drivn.AI × ${lead.name} — Initial Audit Call`,
      dates: `${toGCalUTC(start)}/${toGCalUTC(end)}`,
      details,
    });
    if (lead.email) params.set("add", lead.email);

    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank", "noopener,noreferrer");

    startTransition(async () => {
      await updateLeadStatusAction(lead.id, "booked");
      router.refresh();
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#12122A] p-5 shadow-2xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-sora text-sm font-bold text-white">Schedule call — {lead.name}</h3>
          <button onClick={onClose} className="text-white/40 transition hover:text-white/70">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block font-inter text-[0.65rem] uppercase tracking-wide text-white/40">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-inter text-sm text-white focus:border-brand-purple/50 focus:outline-none"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block font-inter text-[0.65rem] uppercase tracking-wide text-white/40">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-inter text-sm text-white focus:border-brand-purple/50 focus:outline-none"
              />
            </div>
            <div className="w-28">
              <label className="mb-1 block font-inter text-[0.65rem] uppercase tracking-wide text-white/40">Length</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-2 py-2 font-inter text-sm text-white focus:border-brand-purple/50 focus:outline-none"
              >
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
            </div>
          </div>
          {!lead.email && (
            <p className="rounded-lg border border-amber-400/25 bg-amber-400/[0.06] px-3 py-2 font-inter text-xs text-amber-300/80">
              No email on file — add their address as a guest manually once you have it.
            </p>
          )}
          <button
            onClick={handleCreate}
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-purple px-4 py-2.5 font-inter text-sm font-semibold text-white transition hover:bg-brand-purple/90 disabled:opacity-50"
          >
            <Video className="h-4 w-4" />
            Open in Google Calendar
          </button>
          <p className="font-inter text-[0.65rem] text-white/30">
            Opens a prefilled event in a new tab — click &quot;Add Google Meet video conferencing,&quot; then Save &amp; Send. Marks this lead Booked.
          </p>
        </div>
      </div>
    </div>
  );
}

function QueueLeadCard({ lead, index }: { lead: SourcedLeadRow; index: number }) {
  const { painPoint, offerFit, owner, extra } = parseLeadNotes(lead.notes);
  const channel = getLeadChannel(lead);
  const cMeta = CHANNEL_META[channel];
  const CIcon = cMeta.icon;
  const [pending, startTransition] = useTransition();
  const [contacted, setContacted] = useState(lead.status !== "new");
  const [scheduleOpen, setScheduleOpen] = useState(false);

  function markContacted() {
    if (contacted) return;
    setContacted(true);
    startTransition(async () => {
      await updateLeadStatusAction(lead.id, channel === "email" ? "emailed" : "called");
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.4) }}
      className={cn(
        "rounded-2xl border p-4 transition",
        contacted ? "border-white/[0.05] bg-white/[0.01] opacity-45" : "border-white/[0.08] bg-white/[0.025]",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 font-sora text-sm font-semibold text-white">
            {lead.priority && (
              <span title="Manually checked by Finn" className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-400/15">
                <Pin className="h-2.5 w-2.5 text-amber-400" />
              </span>
            )}
            {lead.name}
          </p>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 font-inter text-[0.7rem] text-white/40">
            {lead.address && <span>{lead.address}</span>}
            {lead.rating && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-400/70" />
                {lead.rating} ({lead.reviewCount ?? 0})
              </span>
            )}
          </div>
        </div>
        <span
          className={cn(
            "flex w-fit shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-inter text-xs font-semibold whitespace-nowrap",
            cMeta.border,
            cMeta.bg,
            cMeta.color,
          )}
        >
          <CIcon className="h-3 w-3" />
          {cMeta.label}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-inter text-xs text-white/50">
        {lead.phone && (
          <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-white/80">
            <Phone className="h-3.5 w-3.5" />
            {lead.phone}
          </a>
        )}
        {lead.email && (
          <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-brand-purple-light">
            <Mail className="h-3.5 w-3.5" />
            {lead.email}
          </a>
        )}
        {lead.website && (
          <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-brand-purple-light">
            <Globe className="h-3.5 w-3.5" />
            site
          </a>
        )}
        {owner && (
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            {owner}
          </span>
        )}
      </div>

      <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
        <p className="font-inter text-[0.65rem] font-bold uppercase tracking-wide text-brand-purple-light/70">Package to offer</p>
        <p className="mt-0.5 font-inter text-sm font-semibold text-white/85">{offerFit ?? "Not yet defined — use the niche's default offer"}</p>
        {painPoint && <p className="mt-1.5 font-inter text-xs text-white/45">{painPoint}</p>}
        {extra && (
          <p className="mt-1.5 flex items-start gap-1 font-inter text-xs italic text-sky-300/70">
            <StickyNote className="mt-0.5 h-3 w-3 shrink-0" />
            {extra}
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={markContacted}
          disabled={contacted || pending}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-inter text-xs font-semibold transition",
            contacted
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              : "border-white/15 bg-white/[0.03] text-white/70 hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-300",
          )}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {contacted ? "Contacted" : channel === "email" ? "Mark Emailed" : "Mark Called"}
        </button>
        <button
          onClick={() => setScheduleOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-brand-purple/25 bg-brand-purple/10 px-3 py-1.5 font-inter text-xs font-semibold text-brand-purple-light transition hover:border-brand-purple/50 hover:bg-brand-purple/20"
        >
          <Video className="h-3.5 w-3.5" />
          Schedule Call
        </button>
      </div>

      {scheduleOpen && (
        <ScheduleCallModal lead={lead} offerFit={offerFit} painPoint={painPoint} onClose={() => setScheduleOpen(false)} />
      )}
    </motion.div>
  );
}

interface QueueTab {
  key: string;
  label: string;
  sub?: string;
  leads: SourcedLeadRow[];
  accent?: "overdue" | "today";
}

export function WeeklyQueue({ leads, niches }: { leads: SourcedLeadRow[]; niches: string[] }) {
  const router = useRouter();
  const [genPending, startGenTransition] = useTransition();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Server and browser can disagree on the calendar date near midnight (different
  // timezones), so "today" is only computed after mount — SSR and the first client
  // render both use "" (no key matches, no tab gets the Today/Overdue accent),
  // avoiding a hydration mismatch. It corrects itself a beat later post-mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const today = mounted ? todayKey() : "";

  const scheduled = useMemo(() => leads.filter((l) => l.status === "new" && l.nextActionDate), [leads]);
  const unscheduledCount = useMemo(() => leads.filter((l) => l.status === "new" && !l.nextActionDate).length, [leads]);
  const contactedCount = leads.filter((l) => l.status !== "new").length;

  const byDay = useMemo(() => {
    const map = new Map<string, SourcedLeadRow[]>();
    for (const l of scheduled) {
      const key = dateKeyOf(l.nextActionDate);
      if (!key) continue;
      const arr = map.get(key) ?? [];
      arr.push(l);
      map.set(key, arr);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => Number(Boolean(b.priority)) - Number(Boolean(a.priority)) || b.score - a.score);
    }
    return map;
  }, [scheduled]);

  const tabs: QueueTab[] = useMemo(() => {
    const keys = [...byDay.keys()].sort();
    const overdueKeys = keys.filter((k) => k < today);
    const upcomingKeys = keys.filter((k) => k >= today);
    const list: QueueTab[] = [];
    if (overdueKeys.length > 0) {
      const overdueLeads = overdueKeys.flatMap((k) => byDay.get(k)!);
      list.push({
        key: "overdue",
        label: "Overdue",
        sub: "Should've already been touched — clear these first.",
        leads: overdueLeads,
        accent: "overdue",
      });
    }
    for (const k of upcomingKeys) {
      list.push({
        key: k,
        label: k === today ? "Today" : formatDayLabel(k).split(",")[0],
        sub: formatDayLabel(k),
        leads: byDay.get(k)!,
        accent: k === today ? "today" : undefined,
      });
    }
    return list;
  }, [byDay, today]);

  const activeKey =
    selectedKey && tabs.some((t) => t.key === selectedKey) ? selectedKey : (tabs.find((t) => t.accent === "today") ?? tabs[0])?.key ?? null;
  const activeTab = tabs.find((t) => t.key === activeKey) ?? null;

  function handleGenerate() {
    startGenTransition(async () => {
      await generateWeeklyQueueAction(niches);
      router.refresh();
    });
  }

  function handleReset() {
    if (!confirm("Clear this week's schedule for not-yet-contacted leads? You can regenerate right after.")) return;
    startGenTransition(async () => {
      await resetWeeklyQueueAction(niches);
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-[1000px] px-4 pb-20 pt-8 md:px-8">
      <div className="mb-6">
        <Link
          href="/admin/sourced-leads/pipeline"
          className="mb-4 flex w-fit items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 font-inter text-xs text-white/40 transition hover:border-white/20 hover:text-white/60"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Priority Pipeline
        </Link>
        <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.22em] text-brand-purple-light/80">
          Drivn.AI OS · Daily Driver
        </p>
        <h1 className="mt-1 bg-gradient-to-r from-white via-white to-brand-purple-light bg-clip-text font-sora text-2xl font-bold tracking-tight text-transparent md:text-3xl">
          This Week&apos;s Outreach Queue
        </h1>
        <p className="mt-1 font-inter text-sm text-white/40">
          {scheduled.length} queued · {contactedCount} contacted so far · {unscheduledCount} not yet scheduled
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          onClick={handleGenerate}
          disabled={genPending || unscheduledCount === 0}
          className="flex items-center gap-1.5 rounded-xl border border-brand-purple/40 bg-brand-purple/15 px-3.5 py-2 font-inter text-xs font-semibold text-brand-purple-light transition hover:bg-brand-purple/25 disabled:opacity-40"
        >
          <CalendarPlus className="h-3.5 w-3.5" />
          {unscheduledCount > 0 ? `Schedule ${Math.min(unscheduledCount, 100)} unscheduled leads` : "Everything in scope is scheduled"}
        </button>
        {scheduled.length > 0 && (
          <button
            onClick={handleReset}
            disabled={genPending}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2 font-inter text-xs text-white/40 transition hover:border-white/20 hover:text-white/60 disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset schedule
          </button>
        )}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-2 font-inter text-xs font-semibold text-emerald-300 transition hover:border-emerald-400/50 hover:bg-emerald-400/20"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Lead
        </button>
      </div>

      {tabs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center">
          <p className="font-inter text-sm text-white/40">
            No queue yet. Hit &quot;Schedule unscheduled leads&quot; above — it buckets not-yet-contacted leads across the next 5 business
            days (~20/day), walk-in and no-website leads first, then niche order.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setSelectedKey(t.key)}
                className={cn(
                  "rounded-xl border px-3.5 py-2 text-left font-inter text-xs font-semibold transition",
                  activeKey === t.key
                    ? t.accent === "overdue"
                      ? "border-red-400/50 bg-red-400/15 text-red-300"
                      : "border-brand-purple/50 bg-brand-purple/20 text-brand-purple-light"
                    : "border-white/10 bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/60",
                )}
              >
                {t.label}
                <span className="ml-1.5 opacity-60">({t.leads.length})</span>
              </button>
            ))}
          </div>

          {activeTab?.sub && <p className="mb-4 font-inter text-xs text-white/30">{activeTab.sub}</p>}

          <div className="space-y-3">
            {activeTab && activeTab.leads.length > 0 ? (
              activeTab.leads.map((lead, i) => <QueueLeadCard key={lead.id} lead={lead} index={i} />)
            ) : (
              <p className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-6 text-center font-inter text-sm text-white/30">
                Nothing here.
              </p>
            )}
          </div>
        </>
      )}

      {showAddModal && (
        <AddBusinessModal preferredNiches={niches} onClose={() => setShowAddModal(false)} onSuccess={() => {}} />
      )}
    </div>
  );
}
