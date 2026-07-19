"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Globe,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Zap,
  MessageSquare,
  Phone,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HudBrackets } from "@/components/admin/hud-primitives";
import { TARGETS, NICHES, type Target } from "@/lib/walk-in-targets";

// ─── Status ───────────────────────────────────────────────────────────────────

type WalkInStatus =
  | "not_visited"
  | "visited"
  | "contact_got"
  | "demo_sent"
  | "negotiating"
  | "closed"
  | "lost";

const STATUS_META: Record<WalkInStatus, { label: string; color: string; bg: string; border: string }> = {
  not_visited:  { label: "Not Visited",  color: "text-white/40",          bg: "bg-white/5",           border: "border-white/10" },
  visited:      { label: "Visited",      color: "text-amber-400",          bg: "bg-amber-400/10",      border: "border-amber-400/30" },
  contact_got:  { label: "Contact Got",  color: "text-blue-400",           bg: "bg-blue-400/10",       border: "border-blue-400/30" },
  demo_sent:    { label: "Demo Sent",    color: "text-brand-purple-light", bg: "bg-brand-purple/10",   border: "border-brand-purple/30" },
  negotiating:  { label: "Negotiating",  color: "text-orange-400",         bg: "bg-orange-400/10",     border: "border-orange-400/30" },
  closed:       { label: "Closed ✓",     color: "text-emerald-400",        bg: "bg-emerald-400/10",    border: "border-emerald-400/30" },
  lost:         { label: "Lost",         color: "text-red-400/70",         bg: "bg-red-400/5",         border: "border-red-400/20" },
};

const STATUS_FLOW: WalkInStatus[] = [
  "not_visited", "visited", "contact_got", "demo_sent", "negotiating", "closed",
];

// ─── Situation badge ───────────────────────────────────────────────────────────

function SituationBadge({ tag }: { tag: Target["situationTag"] }) {
  const map = {
    no_site:     { label: "No Website",    color: "text-red-400",           bg: "bg-red-400/10",     border: "border-red-400/30" },
    weak_site:   { label: "Weak Site",     color: "text-amber-400",         bg: "bg-amber-400/10",   border: "border-amber-400/30" },
    third_party: { label: "Platform Only", color: "text-orange-400",        bg: "bg-orange-400/10",  border: "border-orange-400/30" },
  };
  const m = map[tag];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-widest", m.color, m.bg, m.border)}>
      {m.label}
    </span>
  );
}

// ─── Status stepper ───────────────────────────────────────────────────────────

function StatusStepper({
  current,
  onChange,
}: {
  current: WalkInStatus;
  onChange: (s: WalkInStatus) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {STATUS_FLOW.map((s, i) => {
        const idx = STATUS_FLOW.indexOf(current);
        const done = i < idx;
        const active = s === current;
        const meta = STATUS_META[s];
        return (
          <button
            key={s}
            onClick={() => onChange(s)}
            title={meta.label}
            className={cn(
              "relative h-1.5 flex-1 rounded-full transition-all duration-300",
              done   ? "bg-brand-purple/60" : "",
              active ? "bg-brand-purple shadow-[0_0_6px_rgba(139,92,246,0.8)]" : "",
              !done && !active ? "bg-white/10 hover:bg-white/20" : "",
            )}
          />
        );
      })}
      {/* Lost option */}
      <button
        onClick={() => onChange("lost")}
        className={cn(
          "ml-1 rounded border px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-widest transition-colors",
          current === "lost"
            ? "border-red-400/40 bg-red-400/10 text-red-400"
            : "border-white/10 text-white/20 hover:border-white/20 hover:text-white/40",
        )}
      >
        Lost
      </button>
    </div>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="shrink-0 rounded p-1 text-white/30 transition-colors hover:bg-white/[0.05] hover:text-white/60"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

// ─── Target card ──────────────────────────────────────────────────────────────

function TargetCard({
  target,
  index,
  status,
  onStatus,
}: {
  target: Target;
  index: number;
  status: WalkInStatus;
  onStatus: (s: WalkInStatus) => void;
}) {
  const [open, setOpen] = useState<"pain" | "objections" | "close" | null>(null);
  const meta = STATUS_META[status];
  const isClosed = status === "closed";
  const isLost = status === "lost";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className={cn(
        "relative overflow-hidden rounded-xl border transition-all duration-300",
        isClosed ? "border-emerald-400/20 bg-emerald-400/[0.03]" : isLost ? "border-white/[0.04] opacity-60" : "border-white/[0.08] bg-surface",
      )}
    >
      <HudBrackets color={isClosed ? "rgba(52,211,153,0.3)" : `${target.accentColor}33`} size={8} />

      {/* Color bar */}
      <div
        className="absolute left-0 top-0 h-full w-[2px]"
        style={{ background: target.accentColor, boxShadow: `0 0 8px ${target.accentColor}66` }}
      />

      <div className="pl-4">
        {/* Header */}
        <div className="flex items-start gap-4 p-4 pb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-sora text-[0.95rem] font-semibold text-white">{target.name}</h3>
              <span className="font-inter text-[0.65rem] uppercase tracking-widest text-white/40 border border-white/10 rounded px-1.5 py-0.5">
                {target.niche}
              </span>
              <SituationBadge tag={target.situationTag} />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-white/40">
              <span className="flex items-center gap-1 font-inter text-[0.72rem]">
                <MapPin className="h-3 w-3" />
                {target.district}
              </span>
              {target.googleRating && (
                <span className="flex items-center gap-1 font-inter text-[0.72rem]">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-amber-400/80">{target.googleRating.toFixed(1)}</span>
                  <span className="text-white/30">/ {target.googleReviews} reviews</span>
                </span>
              )}
              {!target.googleRating && (
                <span className="flex items-center gap-1 font-inter text-[0.72rem] text-red-400/60">
                  <AlertCircle className="h-3 w-3" />
                  Not on Maps
                </span>
              )}
              {target.phone && (
                <a
                  href={`tel:${target.phone}`}
                  className="flex items-center gap-1 font-inter text-[0.72rem] text-white/30 hover:text-brand-purple-light transition-colors"
                >
                  <Phone className="h-3 w-3" />
                  {target.phone}
                </a>
              )}
              <a
                href={target.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-inter text-[0.72rem] text-white/30 hover:text-brand-purple-light transition-colors"
              >
                <Globe className="h-3 w-3" />
                Maps
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>

          {/* Status badge */}
          <span className={cn("shrink-0 rounded border px-2.5 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-widest", meta.color, meta.bg, meta.border)}>
            {meta.label}
          </span>
        </div>

        {/* Status stepper */}
        <div className="px-4 pb-3">
          <div className="mb-1.5 font-mono text-[0.58rem] uppercase tracking-widest text-white/25">
            Progress
          </div>
          <StatusStepper current={status} onChange={onStatus} />
          <div className="mt-1 font-inter text-[0.65rem] text-white/30">
            {STATUS_FLOW.map((s, i) => s === status && i < STATUS_FLOW.length - 1 ? (
              <span key={s}>Next: <span className={STATUS_META[STATUS_FLOW[i + 1]].color}>{STATUS_META[STATUS_FLOW[i + 1]].label}</span></span>
            ) : null)}
            {status === "closed" && <span className="text-emerald-400">Deal closed — congratulations.</span>}
            {status === "lost" && <span className="text-red-400/60">Marked as lost.</span>}
          </div>
        </div>

        {/* Opener */}
        <div className="mx-4 mb-3 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
          <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-widest text-white/30">
            <MessageSquare className="h-3 w-3" />
            Opening Line
          </div>
          <div className="flex items-start gap-2">
            <p className="flex-1 font-inter text-[0.78rem] italic leading-relaxed text-white/70">
              {target.opener}
            </p>
            <CopyButton text={target.opener.replace(/^"|"$/g, "")} />
          </div>
        </div>

        {/* Demo note */}
        <div className="mx-4 mb-3 flex items-start gap-2 rounded-lg border border-brand-purple/15 bg-brand-purple/[0.06] p-3">
          <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-purple-light" />
          <p className="font-inter text-[0.72rem] leading-relaxed text-brand-purple-light/70">
            {target.demoNote}
          </p>
        </div>

        {/* Collapsible sections */}
        <div className="space-y-1 pb-4 pr-4">
          {/* Pain Points */}
          <Accordion
            icon={<AlertCircle className="h-3.5 w-3.5 text-amber-400/70" />}
            label="Pain Points to Hit"
            labelColor="text-amber-400/70"
            open={open === "pain"}
            onToggle={() => setOpen(open === "pain" ? null : "pain")}
          >
            <div className="space-y-3 p-3 pt-0">
              {target.painPoints.map((p, i) => (
                <div key={i} className="border-l-2 pl-3" style={{ borderColor: `${target.accentColor}55` }}>
                  <p className="mb-1 font-sora text-[0.72rem] font-semibold text-white/70">{p.title}</p>
                  <p className="font-inter text-[0.7rem] leading-relaxed text-white/45">{p.pitch}</p>
                </div>
              ))}
            </div>
          </Accordion>

          {/* Objections */}
          <Accordion
            icon={<Shield className="h-3.5 w-3.5 text-blue-400/70" />}
            label="Objection Rebuttals"
            labelColor="text-blue-400/70"
            open={open === "objections"}
            onToggle={() => setOpen(open === "objections" ? null : "objections")}
          >
            <div className="space-y-2.5 p-3 pt-0">
              {target.objections.map((o, i) => (
                <div key={i} className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-2.5">
                  <p className="mb-1.5 font-sora text-[0.7rem] font-semibold text-white/50">
                    <span className="text-white/25 mr-1">—</span>{o.q}
                  </p>
                  <div className="flex items-start gap-2">
                    <p className="flex-1 font-inter text-[0.7rem] leading-relaxed text-white/60">{o.a}</p>
                    <CopyButton text={o.a} />
                  </div>
                </div>
              ))}
            </div>
          </Accordion>

          {/* Close script */}
          <Accordion
            icon={<CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/70" />}
            label="Close Script"
            labelColor="text-emerald-400/70"
            open={open === "close"}
            onToggle={() => setOpen(open === "close" ? null : "close")}
          >
            <div className="p-3 pt-0">
              <div className="flex items-start gap-2 rounded-lg border border-emerald-400/10 bg-emerald-400/[0.04] p-3">
                <p className="flex-1 font-inter text-[0.72rem] italic leading-relaxed text-emerald-400/70">
                  {target.closeScript}
                </p>
                <CopyButton text={target.closeScript} />
              </div>
            </div>
          </Accordion>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────

function Accordion({
  icon,
  label,
  labelColor,
  open,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  labelColor: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-white/[0.03] transition-colors"
      >
        {icon}
        <span className={cn("flex-1 font-mono text-[0.62rem] uppercase tracking-widest", labelColor)}>
          {label}
        </span>
        {open
          ? <ChevronUp className="h-3.5 w-3.5 text-white/30" />
          : <ChevronDown className="h-3.5 w-3.5 text-white/30" />
        }
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/[0.06]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

const STORAGE_KEY = "walk-in-statuses";

function loadStatuses(): Record<string, WalkInStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveStatuses(map: Record<string, WalkInStatus>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

export function WalkInDashboard() {
  const [statuses, setStatuses] = useState<Record<string, WalkInStatus>>({});
  const [activeNiche, setActiveNiche] = useState("All");

  useEffect(() => {
    setStatuses(loadStatuses());
  }, []);

  function setStatus(id: string, s: WalkInStatus) {
    setStatuses((prev) => {
      const next = { ...prev, [id]: s };
      saveStatuses(next);
      return next;
    });
  }

  const filtered = activeNiche === "All" ? TARGETS : TARGETS.filter((t) => t.niche === activeNiche);

  const visitedCount = filtered.filter((t) => (statuses[t.id] ?? "not_visited") !== "not_visited").length;
  const closedCount  = filtered.filter((t) => (statuses[t.id] ?? "not_visited") === "closed").length;

  return (
    <div className="min-h-screen bg-brand-dark px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-1 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-brand-purple-light/60">
          Drivn.AI · Berlin Sprint
        </div>
        <h1 className="font-sora text-2xl font-bold text-white">Walk-In Sales</h1>
        <p className="mt-1 font-inter text-[0.8rem] text-white/40">
          {TARGETS.length} Berlin targets. Go close.
        </p>

        {/* Quick stats */}
        <div className="mt-5 flex gap-3">
          <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-surface px-5 py-3.5">
            <HudBrackets color="rgba(139,92,246,0.25)" size={6} />
            <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/30 mb-0.5">Visited</p>
            <p className="font-sora text-xl font-bold text-white">{visitedCount} <span className="text-white/20 text-base font-normal">/ {filtered.length}</span></p>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-surface px-5 py-3.5">
            <HudBrackets color="rgba(52,211,153,0.25)" size={6} />
            <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/30 mb-0.5">Closed</p>
            <p className="font-sora text-xl font-bold text-emerald-400">{closedCount}</p>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-surface px-5 py-3.5">
            <HudBrackets color="rgba(251,191,36,0.25)" size={6} />
            <p className="font-mono text-[0.58rem] uppercase tracking-widest text-white/30 mb-0.5">Potential MRR</p>
            <p className="font-sora text-xl font-bold text-amber-400">
              {closedCount > 0 ? `${closedCount * 99}€` : "—"}
            </p>
          </div>
        </div>

        {/* Niche filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          {NICHES.map((niche) => {
            const count = niche === "All" ? TARGETS.length : TARGETS.filter((t) => t.niche === niche).length;
            const isActive = activeNiche === niche;
            return (
              <button
                key={niche}
                onClick={() => setActiveNiche(niche)}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[0.6rem] uppercase tracking-widest transition-all",
                  isActive
                    ? "border-brand-purple/60 bg-brand-purple/20 text-brand-purple-light"
                    : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/50",
                )}
              >
                {niche} <span className="opacity-50">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Universal rules strip */}
      <div className="mb-6 rounded-xl border border-brand-purple/15 bg-brand-purple/[0.05] p-4">
        <div className="mb-2 font-mono text-[0.58rem] uppercase tracking-widest text-brand-purple-light/50">
          Rules every walk-in
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
          {[
            "Ask for the owner — never pitch to staff",
            "Goal of visit 1: get their contact, send demo. Not close.",
            "Open laptop / phone immediately — show, don't tell",
            "Best times: 10:30–12:00 or 14:00–16:30",
            "Send demo link within one hour of leaving",
            "Pricing: 1,000€ setup · 99€/mo. Alt: 333€ × 3, no setup",
          ].map((r) => (
            <div key={r} className="flex items-start gap-1.5">
              <Circle className="mt-[3px] h-2.5 w-2.5 shrink-0 fill-brand-purple/40 text-brand-purple/40" />
              <span className="font-inter text-[0.7rem] leading-relaxed text-white/45">{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Target cards */}
      <div className="space-y-4">
        {filtered.map((t, i) => (
          <TargetCard
            key={t.id}
            target={t}
            index={i}
            status={statuses[t.id] ?? "not_visited"}
            onStatus={(s) => setStatus(t.id, s)}
          />
        ))}
      </div>
    </div>
  );
}
