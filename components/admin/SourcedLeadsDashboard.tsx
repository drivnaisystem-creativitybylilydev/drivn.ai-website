"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Globe,
  Star,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Zap,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HudBrackets } from "@/components/admin/hud-primitives";
import { updateLeadStatusAction } from "@/app/admin/sourced-leads/actions";
import type { SourcedLeadRow, SourcedLeadStatus } from "@/lib/sourced-lead-db";

// ─── Status meta ──────────────────────────────────────────────────────────────

const STATUS_META: Record<SourcedLeadStatus, { label: string; color: string; bg: string; border: string }> = {
  new:       { label: "New",       color: "text-brand-purple-light", bg: "bg-brand-purple/10",  border: "border-brand-purple/30" },
  emailed:   { label: "Emailed",   color: "text-sky-400",            bg: "bg-sky-400/10",        border: "border-sky-400/30" },
  called:    { label: "Called",    color: "text-amber-400",          bg: "bg-amber-400/10",      border: "border-amber-400/30" },
  booked:    { label: "Booked",    color: "text-emerald-400",        bg: "bg-emerald-400/10",    border: "border-emerald-400/30" },
  converted: { label: "Converted", color: "text-emerald-300",        bg: "bg-emerald-300/10",    border: "border-emerald-300/30" },
  dismissed: { label: "Dismissed", color: "text-white/25",           bg: "bg-white/5",           border: "border-white/10" },
};

const STATUS_FLOW: SourcedLeadStatus[] = ["new", "emailed", "called", "booked", "converted", "dismissed"];

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#34d399" : score >= 60 ? "#a78bfa" : "#f59e0b";
  const r = 16;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
      <svg className="-rotate-90" width="40" height="40">
        <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <motion.circle
          cx="20" cy="20" r={r} fill="none"
          stroke={color} strokeWidth="3"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute font-mono text-[0.6rem] font-bold text-white/80">{score}</span>
    </div>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-inter text-xs text-white/50 transition hover:border-brand-purple/30 hover:bg-brand-purple/10 hover:text-brand-purple-light"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy email"}
    </button>
  );
}

// ─── Lead card ────────────────────────────────────────────────────────────────

function LeadCard({ lead, index }: { lead: SourcedLeadRow; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const meta = STATUS_META[lead.status];

  function handleStatus(status: SourcedLeadStatus) {
    startTransition(async () => {
      await updateLeadStatusAction(lead.id, status);
      router.refresh();
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-white/[0.02] transition-colors",
        lead.status === "dismissed" ? "border-white/[0.04] opacity-40" : "border-white/[0.07]",
      )}
    >
      <HudBrackets color="rgba(139,92,246,0.15)" size={7} />

      {/* Main row */}
      <div className="flex items-center gap-4 p-4">
        <ScoreRing score={lead.score} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-sora text-sm font-semibold text-white">{lead.name}</p>
            {lead.category && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-inter text-[0.6rem] text-white/40">
                {lead.category}
              </span>
            )}
            <span className={cn("rounded-full border px-2 py-0.5 font-inter text-[0.6rem] font-bold", meta.border, meta.bg, meta.color)}>
              {meta.label}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 font-inter text-xs text-white/35">
            {lead.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />{lead.phone}
              </span>
            )}
            {lead.rating && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-400/70" />
                {lead.rating} ({lead.reviewCount ?? 0})
              </span>
            )}
            {lead.website && (
              <a href={lead.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 transition hover:text-brand-purple-light">
                <Globe className="h-3 w-3" />website
              </a>
            )}
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="max-w-[200px] truncate">{lead.address}</span>
            </span>
          </div>
        </div>

        {/* Quick status actions */}
        <div className="flex shrink-0 items-center gap-2">
          {lead.status !== "dismissed" && lead.status !== "converted" && (
            <>
              <button
                onClick={() => {
                  const next = STATUS_FLOW[STATUS_FLOW.indexOf(lead.status) + 1];
                  if (next) handleStatus(next);
                }}
                disabled={pending}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 font-inter text-xs font-medium text-emerald-400 transition hover:bg-emerald-400/20 disabled:opacity-40"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {STATUS_FLOW[STATUS_FLOW.indexOf(lead.status) + 1] ?? "Done"}
              </button>
              <button
                onClick={() => handleStatus("dismissed")}
                disabled={pending}
                className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-white/30 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-400 disabled:opacity-40"
              >
                <XCircle className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="rounded-xl border border-white/10 bg-white/5 p-1.5 text-white/30 transition hover:border-brand-purple/30 hover:text-brand-purple-light"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded: signals + email draft */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/[0.06]"
          >
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              {/* Signals */}
              <div>
                <p className="mb-2 font-inter text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/30">Signals</p>
                <div className="flex flex-wrap gap-1.5">
                  {lead.signals.map((s) => (
                    <span key={s} className="rounded-full border border-brand-purple/20 bg-brand-purple/10 px-2.5 py-1 font-inter text-xs text-brand-purple-light/80">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Email draft */}
              {lead.emailDraft ? (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/30">
                      Email Draft
                    </p>
                    <CopyButton text={`Subject: ${lead.emailDraft.subject}\n\n${lead.emailDraft.body}`} />
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="mb-1 font-inter text-xs font-semibold text-white/60">
                      {lead.emailDraft.subject}
                    </p>
                    <p className="font-inter text-xs leading-relaxed text-white/40 whitespace-pre-wrap">
                      {lead.emailDraft.body}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 p-4">
                  <p className="font-inter text-xs text-white/25">No email draft generated</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export function SourcedLeadsDashboard({ leads }: { leads: SourcedLeadRow[] }) {
  const [filter, setFilter] = useState<SourcedLeadStatus | "all">("all");

  const filtered = filter === "all" ? leads.filter((l) => l.status !== "dismissed") : leads.filter((l) => l.status === filter);
  const newCount       = leads.filter((l) => l.status === "new").length;
  const emailedCount   = leads.filter((l) => l.status === "emailed").length;
  const calledCount    = leads.filter((l) => l.status === "called").length;
  const convertedCount = leads.filter((l) => l.status === "converted").length;

  return (
    <div className="relative min-h-svh overflow-hidden bg-brand-dark text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-20%,rgba(139,92,246,0.18),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 pb-20 pt-8 md:px-8">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col gap-4 border-b border-white/[0.07] pb-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.22em] text-brand-purple-light/80">
              Drivn.AI OS · Agent Sourced
            </p>
            <h1 className="mt-1 bg-gradient-to-r from-white via-white to-brand-purple-light bg-clip-text font-sora text-2xl font-bold tracking-tight text-transparent md:text-3xl">
              Sourced Leads
            </h1>
            <p className="mt-1 font-inter text-sm text-white/40">
              {leads.length} leads found · {newCount} new · {convertedCount} converted
            </p>
          </div>
        </motion.header>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "New",       value: newCount,       color: "text-brand-purple-light" },
            { label: "Emailed",   value: emailedCount,   color: "text-sky-400" },
            { label: "Called",    value: calledCount,    color: "text-amber-400" },
            { label: "Converted", value: convertedCount, color: "text-emerald-400" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4"
            >
              <HudBrackets color="rgba(255,255,255,0.05)" size={6} />
              <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/30">{s.label}</p>
              <p className={cn("mt-1 font-sora text-2xl font-bold tabular-nums", s.color)}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(["all", ...STATUS_FLOW] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-xl border px-4 py-1.5 font-inter text-xs font-medium transition",
                filter === s
                  ? "border-brand-purple/50 bg-brand-purple/20 text-brand-purple-light"
                  : "border-white/10 bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/60",
              )}
            >
              {s === "all" ? "Active" : STATUS_META[s].label}
            </button>
          ))}
        </div>

        {/* Lead list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-24 text-center">
            <Zap className="mb-3 h-8 w-8 text-white/10" />
            <p className="font-sora text-sm font-semibold text-white/30">No leads here yet</p>
            <p className="mt-1 font-inter text-xs text-white/20">
              Run the Pipeline Scout agent to source leads.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((lead, i) => (
              <LeadCard key={lead.id} lead={lead} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
