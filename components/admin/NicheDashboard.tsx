"use client";

import { useState, useTransition, useCallback, useRef, useEffect, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Globe,
  Star,
  ChevronLeft,
  ChevronDown,
  MapPin,
  Zap,
  Users,
  TrendingUp,
  Merge,
  Search,
  X,
  Plus,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HudBrackets } from "@/components/admin/hud-primitives";
import { NichePieChart } from "@/components/admin/NichePieChart";
import { AddBusinessModal } from "@/components/admin/AddBusinessModal";
import { LeadsList } from "@/components/admin/LeadsList";
import { updateLeadStatusAction, mergeNichesAction } from "@/app/admin/sourced-leads/actions";
import type { SourcedLeadRow, SourcedLeadStatus, NicheGroup } from "@/lib/sourced-lead-db";

// ─── Status meta ──────────────────────────────────────────────────────────────

const STATUS_META: Record<SourcedLeadStatus, { label: string; color: string; bg: string; border: string }> = {
  new:       { label: "New",       color: "text-brand-purple-light", bg: "bg-brand-purple/10",  border: "border-brand-purple/30" },
  called:    { label: "Called",    color: "text-amber-400",          bg: "bg-amber-400/10",      border: "border-amber-400/30" },
  booked:    { label: "Booked",    color: "text-emerald-400",        bg: "bg-emerald-400/10",    border: "border-emerald-400/30" },
  converted: { label: "Converted", color: "text-emerald-300",        bg: "bg-emerald-300/10",    border: "border-emerald-300/30" },
  dismissed: { label: "Dismissed", color: "text-white/25",           bg: "bg-white/5",           border: "border-white/10" },
};

const DEFAULT_STATUS_META = { label: "Unknown", color: "text-white/40", bg: "bg-white/5", border: "border-white/10" };

function getStatusMeta(status: SourcedLeadStatus) {
  return STATUS_META[status] ?? DEFAULT_STATUS_META;
}

const STATUS_FLOW: SourcedLeadStatus[] = ["new", "called", "booked", "converted", "dismissed"];

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 40 }: { score: number; size?: number }) {
  const color = score >= 80 ? "#34d399" : score >= 60 ? "#a78bfa" : "#f59e0b";
  const r = (size / 2) - 4;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <motion.circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth="3"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute font-mono font-bold text-white/80" style={{ fontSize: size * 0.175 }}>{score}</span>
    </div>
  );
}

// ─── Status dropdown ─────────────────────────────────────────────────────────

function StatusDropdown({
  current,
  onSelect,
  disabled,
}: {
  current: SourcedLeadStatus;
  onSelect: (s: SourcedLeadStatus) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const meta = getStatusMeta(current);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        disabled={disabled}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-inter text-xs font-semibold transition",
          meta.border, meta.bg, meta.color,
          disabled && "opacity-40",
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", meta.color.replace("text-", "bg-"))} />
        {meta.label}
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-30 mt-1.5 w-40 overflow-hidden rounded-xl border border-white/[0.08] bg-[#12122A] shadow-2xl"
          >
            {STATUS_FLOW.map((s) => {
              const m = getStatusMeta(s);
              const isActive = s === current;
              return (
                <button
                  key={s}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (s !== current) onSelect(s);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left font-inter text-xs transition",
                    isActive
                      ? cn("font-semibold", m.bg, m.color)
                      : "text-white/50 hover:bg-white/[0.04] hover:text-white/70",
                  )}
                >
                  <span className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    isActive ? m.color.replace("text-", "bg-") : "bg-white/20",
                  )} />
                  {m.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Lead row (inside niche detail view) ─────────────────────────────────────

function LeadRow({ lead, index }: { lead: SourcedLeadRow; index: number }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleStatus(status: SourcedLeadStatus) {
    startTransition(async () => {
      await updateLeadStatusAction(lead.id, status);
      router.refresh();
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-white/[0.02] p-4 transition-colors",
        lead.status === "dismissed" ? "border-white/[0.04] opacity-40" : "border-white/[0.07]",
      )}
    >
      <HudBrackets color="rgba(139,92,246,0.1)" size={5} />

      <div className="flex items-start gap-3">
        <ScoreRing score={lead.score} size={36} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-sora text-sm font-semibold text-white">{lead.name}</p>
          </div>

          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-inter text-xs text-white/35">
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex items-center gap-1 transition hover:text-white/60">
                <Phone className="h-3 w-3" />{lead.phone}
              </a>
            )}
            {lead.website && (
              <a href={lead.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 transition hover:text-brand-purple-light">
                <Globe className="h-3 w-3" />website
              </a>
            )}
            {lead.rating && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-400/70" />
                {lead.rating} ({lead.reviewCount ?? 0})
              </span>
            )}
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="max-w-[180px] truncate">{lead.address}</span>
            </span>
          </div>

          {lead.signals.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {lead.signals.map((s) => (
                <span key={s} className="rounded-full border border-brand-purple/20 bg-brand-purple/10 px-2 py-0.5 font-inter text-[0.6rem] text-brand-purple-light/70">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        <StatusDropdown
          current={lead.status}
          onSelect={handleStatus}
          disabled={pending}
        />
      </div>
    </motion.div>
  );
}

// ─── Niche card (on overview grid) ───────────────────────────────────────────

function NicheCard({
  group,
  index,
  onClick,
  isDragOver,
  onDragStart,
  onDragEnd,
  onDragOverCard,
  onDragLeaveCard,
  onDropCard,
}: {
  group: NicheGroup;
  index: number;
  onClick: () => void;
  isDragOver: boolean;
  onDragStart: (niche: string) => void;
  onDragEnd: () => void;
  onDragOverCard: (niche: string, e: DragEvent) => void;
  onDragLeaveCard: () => void;
  onDropCard: (targetNiche: string, e: DragEvent) => void;
}) {
  const scoreColor = group.avgScore >= 80 ? "text-emerald-400" : group.avgScore >= 60 ? "text-brand-purple-light" : "text-amber-400";

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      draggable
      onDragStart={(e) => {
        const de = e as unknown as DragEvent;
        de.dataTransfer.setData("text/plain", group.niche);
        de.dataTransfer.effectAllowed = "move";
        onDragStart(group.niche);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        const de = e as unknown as DragEvent;
        de.preventDefault();
        de.dataTransfer.dropEffect = "move";
        onDragOverCard(group.niche, de);
      }}
      onDragLeave={onDragLeaveCard}
      onDrop={(e) => {
        const de = e as unknown as DragEvent;
        de.preventDefault();
        onDropCard(group.niche, de);
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 text-left transition-all",
        isDragOver
          ? "border-brand-purple/60 bg-brand-purple/[0.12] ring-2 ring-brand-purple/30 scale-[1.02]"
          : "border-white/[0.07] bg-white/[0.02] hover:border-brand-purple/30 hover:bg-brand-purple/[0.04]",
      )}
    >
      <HudBrackets color={isDragOver ? "rgba(139,92,246,0.35)" : "rgba(139,92,246,0.15)"} size={7} />

      {isDragOver && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-brand-purple/10 backdrop-blur-[2px]">
          <div className="flex items-center gap-2 rounded-xl border border-brand-purple/40 bg-brand-dark/80 px-4 py-2">
            <Merge className="h-4 w-4 text-brand-purple-light" />
            <span className="font-inter text-xs font-semibold text-brand-purple-light">Drop to merge here</span>
          </div>
        </div>
      )}

      <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/30">Niche</p>
      <h3 className="mt-1 font-sora text-base font-bold text-white leading-tight">{group.niche}</h3>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <p className="font-inter text-[0.55rem] font-bold uppercase tracking-[0.15em] text-white/25">Leads</p>
          <p className="mt-0.5 font-sora text-xl font-bold text-white">{group.count}</p>
        </div>
        <div>
          <p className="font-inter text-[0.55rem] font-bold uppercase tracking-[0.15em] text-white/25">Avg Score</p>
          <p className={cn("mt-0.5 font-sora text-xl font-bold", scoreColor)}>{group.avgScore}</p>
        </div>
        <div>
          <p className="font-inter text-[0.55rem] font-bold uppercase tracking-[0.15em] text-white/25">New</p>
          <p className="mt-0.5 font-sora text-xl font-bold text-brand-purple-light">{group.newCount}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5">
        <TrendingUp className="h-3 w-3 text-white/20" />
        <span className="font-inter text-xs text-white/30">Top score: <span className="text-white/50">{group.topScore}</span></span>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-inter text-xs text-white/10 transition group-hover:text-white/30">→</div>
    </motion.button>
  );
}

// ─── Niche detail view ────────────────────────────────────────────────────────

function NicheDetail({ group, onBack, searchQuery = "" }: { group: NicheGroup; onBack: () => void; searchQuery?: string }) {
  const [statusFilter, setStatusFilter] = useState<SourcedLeadStatus | "all">("all");

  const filtered = (statusFilter === "all"
    ? group.leads.filter((l) => l.status !== "dismissed")
    : group.leads.filter((l) => l.status === statusFilter)
  ).filter((l) =>
    searchQuery === "" || l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25 }}
    >
      {/* Back + header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 font-inter text-xs text-white/40 transition hover:border-white/20 hover:text-white/60"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          All niches
        </button>
        <div>
          <h2 className="font-sora text-lg font-bold text-white">{group.niche}</h2>
          <p className="font-inter text-xs text-white/30">{group.count} leads · {group.newCount} new</p>
        </div>
      </div>

      {/* Status filter */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {(["all", ...STATUS_FLOW] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "rounded-xl border px-3 py-1 font-inter text-xs font-medium transition",
              statusFilter === s
                ? "border-brand-purple/50 bg-brand-purple/20 text-brand-purple-light"
                : "border-white/10 bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/60",
            )}
          >
            {s === "all" ? "Active" : getStatusMeta(s).label}
          </button>
        ))}
      </div>

      {/* Lead list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16">
          <Zap className="mb-2 h-6 w-6 text-white/10" />
          <p className="font-inter text-sm text-white/25">No leads in this view</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((lead, i) => (
            <LeadRow key={lead.id} lead={lead} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Merge confirmation modal ────────────────────────────────────────────────

function MergeConfirmModal({
  from,
  to,
  fromCount,
  onConfirm,
  onCancel,
  pending,
}: {
  from: string;
  to: string;
  fromCount: number;
  onConfirm: () => void;
  onCancel: () => void;
  pending: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0E0E24] p-6 shadow-2xl"
      >
        <HudBrackets color="rgba(139,92,246,0.2)" size={8} />

        <div className="mb-1 flex items-center gap-2">
          <Merge className="h-5 w-5 text-brand-purple-light" />
          <h3 className="font-sora text-lg font-bold text-white">Merge Niches</h3>
        </div>
        <p className="mb-5 font-inter text-sm text-white/40">
          This will move <span className="font-semibold text-white/70">{fromCount} lead{fromCount !== 1 ? "s" : ""}</span> from
          <span className="font-semibold text-brand-purple-light"> {from}</span> into
          <span className="font-semibold text-brand-purple-light"> {to}</span>.
        </p>

        <div className="mb-5 flex items-center justify-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] py-4">
          <span className="max-w-[140px] truncate rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-inter text-xs font-medium text-white/60">{from}</span>
          <span className="font-inter text-xs text-white/20">→</span>
          <span className="max-w-[140px] truncate rounded-lg border border-brand-purple/30 bg-brand-purple/10 px-3 py-1.5 font-inter text-xs font-semibold text-brand-purple-light">{to}</span>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={pending}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 font-inter text-xs font-medium text-white/50 transition hover:border-white/20 hover:text-white/70 disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={pending}
            className="flex items-center gap-1.5 rounded-xl border border-brand-purple/40 bg-brand-purple/20 px-4 py-2 font-inter text-xs font-semibold text-brand-purple-light transition hover:bg-brand-purple/30 disabled:opacity-40"
          >
            <Merge className="h-3.5 w-3.5" />
            {pending ? "Merging…" : "Merge"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export function NicheDashboard({
  niches,
  totalLeads,
}: {
  niches: NicheGroup[];
  totalLeads: number;
}) {
  const router = useRouter();
  const [activeNiche, setActiveNiche] = useState<NicheGroup | null>(null);
  const [draggedNiche, setDraggedNiche] = useState<string | null>(null);
  const [dragOverNiche, setDragOverNiche] = useState<string | null>(null);
  const [mergePrompt, setMergePrompt] = useState<{ from: string; to: string } | null>(null);
  const [mergePending, startMergeTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [listView, setListView] = useState(false);

  const handleMergeRequest = useCallback((from: string, to: string) => {
    if (from === to) return;
    setMergePrompt({ from, to });
  }, []);

  const handleMergeConfirm = useCallback(() => {
    if (!mergePrompt) return;
    startMergeTransition(async () => {
      await mergeNichesAction(mergePrompt.from, mergePrompt.to);
      setMergePrompt(null);
      setActiveNiche(null);
      router.refresh();
    });
  }, [mergePrompt, router]);

  const handleDragStart = useCallback((niche: string) => setDraggedNiche(niche), []);
  const handleDragEnd = useCallback(() => { setDraggedNiche(null); setDragOverNiche(null); }, []);
  const handleDragOverCard = useCallback((niche: string, e: DragEvent) => {
    e.preventDefault();
    setDragOverNiche(niche);
  }, []);
  const handleDragLeaveCard = useCallback(() => setDragOverNiche(null), []);
  const handleDropCard = useCallback((targetNiche: string, e: DragEvent) => {
    e.preventDefault();
    const from = e.dataTransfer.getData("text/plain");
    setDraggedNiche(null);
    setDragOverNiche(null);
    if (from && from !== targetNiche) {
      handleMergeRequest(from, targetNiche);
    }
  }, [handleMergeRequest]);

  const pieData = niches.map((n) => ({ niche: n.niche, count: n.count, avgScore: n.avgScore }));

  return (
    <div className="relative min-h-svh overflow-hidden bg-brand-dark text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-20%,rgba(139,92,246,0.18),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 pb-20 pt-8 md:px-8">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 border-b border-white/[0.07] pb-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.22em] text-brand-purple-light/80">
                Drivn.AI OS · Pipeline Scout
              </p>
              <h1 className="mt-1 bg-gradient-to-r from-white via-white to-brand-purple-light bg-clip-text font-sora text-2xl font-bold tracking-tight text-transparent md:text-3xl">
                Sourced Leads
              </h1>
              <p className="mt-1 font-inter text-sm text-white/40">
                {totalLeads} leads across {niches.length} niches
              </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                {/* Add Business Button */}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-brand-purple/40 bg-brand-purple/20 px-4 py-2 font-inter text-sm font-semibold text-brand-purple-light transition hover:bg-brand-purple/30 md:justify-start"
                >
                  <Plus className="h-4 w-4" />
                  Add Business
                </button>

                {/* View toggle */}
                <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.03] p-1">
                  <button
                    onClick={() => setListView(false)}
                    className={cn(
                      "rounded px-3 py-1.5 transition",
                      !listView ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                    )}
                    title="Card view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setListView(true)}
                    className={cn(
                      "rounded px-3 py-1.5 transition",
                      listView ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                    )}
                    title="List view"
                  >
                    <LayoutList className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Search bar */}
              <div className="relative w-full md:max-w-xs">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  placeholder="Search by business name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full rounded-xl border border-white/10 bg-white/[0.03] py-2 pl-9 pr-9 font-inter text-sm text-white placeholder-white/30 transition",
                    "focus:border-brand-purple/50 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-brand-purple/20",
                  )}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white/60"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Two-column layout: niche grid + chart (or full width for list) */}
        <div className={listView ? "" : "grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]"}>

          {/* Left: niche grid, detail, or list view */}
          <div>
            {listView ? (
              <LeadsList leads={niches.flatMap((n) => n.leads)} />
            ) : (
              <AnimatePresence mode="wait">
                {activeNiche ? (
                  <NicheDetail
                    key="detail"
                    group={activeNiche}
                    onBack={() => setActiveNiche(null)}
                    searchQuery={searchQuery}
                  />
                ) : (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                  {niches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-24">
                      <Zap className="mb-3 h-8 w-8 text-white/10" />
                      <p className="font-sora text-sm font-semibold text-white/30">No leads yet</p>
                      <p className="mt-1 font-inter text-xs text-white/20">Run Pipeline Scout to source leads by niche.</p>
                    </div>
                  ) : (
                    <>
                      {niches.length > 1 && (
                        <p className="mb-3 font-inter text-[0.65rem] text-white/20">
                          <Merge className="mr-1 inline h-3 w-3 -translate-y-px text-white/15" />
                          Drag a niche onto another to merge their leads
                        </p>
                      )}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {niches
                          .filter((group) =>
                            searchQuery === "" ||
                            group.niche.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            group.leads.some((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          )
                          .map((group, i) => (
                          <NicheCard
                            key={group.niche}
                            group={group}
                            index={i}
                            onClick={() => setActiveNiche(group)}
                            isDragOver={dragOverNiche === group.niche && draggedNiche !== group.niche}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDragOverCard={handleDragOverCard}
                            onDragLeaveCard={handleDragLeaveCard}
                            onDropCard={handleDropCard}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Right: stats + pie chart (hidden in list view) */}
          {!listView && <div className="flex flex-col gap-4">

            {/* Summary stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Leads", value: totalLeads, icon: Users, color: "text-white" },
                { label: "Niches", value: niches.length, icon: TrendingUp, color: "text-brand-purple-light" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <HudBrackets color="rgba(255,255,255,0.04)" size={5} />
                  <Icon className="mb-1 h-4 w-4 text-white/20" />
                  <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/30">{label}</p>
                  <p className={cn("mt-1 font-sora text-2xl font-bold tabular-nums", color)}>{value}</p>
                </div>
              ))}
            </div>

            {/* Pie chart — implemented by Cursor */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <HudBrackets color="rgba(139,92,246,0.1)" size={6} />
              <p className="mb-4 font-inter text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/30">Leads by Niche</p>
              <NichePieChart data={pieData} />
            </div>

          </div>}
        </div>
      </div>

      {/* Merge confirmation modal */}
      <AnimatePresence>
        {mergePrompt && (
          <MergeConfirmModal
            key="merge-modal"
            from={mergePrompt.from}
            to={mergePrompt.to}
            fromCount={niches.find((n) => n.niche === mergePrompt.from)?.count ?? 0}
            onConfirm={handleMergeConfirm}
            onCancel={() => setMergePrompt(null)}
            pending={mergePending}
          />
        )}
      </AnimatePresence>

      {/* Add business modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddBusinessModal
            key="add-modal"
            onClose={() => setShowAddModal(false)}
            onSuccess={() => setShowAddModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
