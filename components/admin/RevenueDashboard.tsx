"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users2, DollarSign, Target, Briefcase, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { HudBrackets, AnimatedNumber } from "@/components/admin/hud-primitives";
import type { ClientRow, ClientStatus } from "@/lib/client-db";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RevenueProps {
  clients: ClientRow[];
  currentMrr: number;
  targetMrr: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_META: Record<ClientStatus, { label: string; color: string; bg: string; border: string }> = {
  prospect: { label: "Prospect", color: "text-white/40",          bg: "bg-white/5",           border: "border-white/10" },
  proposal: { label: "Proposal", color: "text-amber-400",         bg: "bg-amber-400/10",       border: "border-amber-400/25" },
  active:   { label: "Active",   color: "text-emerald-400",       bg: "bg-emerald-400/10",     border: "border-emerald-400/25" },
  paused:   { label: "Paused",   color: "text-sky-400",           bg: "bg-sky-400/10",         border: "border-sky-400/25" },
  churned:  { label: "Churned",  color: "text-red-400/70",        bg: "bg-red-400/10",         border: "border-red-400/20" },
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function monthsSince(iso?: string): number {
  if (!iso) return 0;
  const diff = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 30)));
}

// ─── MRR progress bar ─────────────────────────────────────────────────────────

function MrrProgress({ current, target }: { current: number; target: number }) {
  const pct = Math.min((current / target) * 100, 100);
  const remaining = Math.max(target - current, 0);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
      <HudBrackets color="rgba(139,92,246,0.2)" size={8} />

      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/30">MRR Progress</p>
          <p className="mt-1 font-sora text-3xl font-bold text-white">
            <AnimatedNumber to={current} prefix="$" />
          </p>
          <p className="mt-0.5 font-inter text-xs text-white/30">
            {fmt(remaining)} to go · target {fmt(target)}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-purple/30 bg-brand-purple/10">
          <TrendingUp className="h-5 w-5 text-brand-purple-light" />
        </div>
      </div>

      {/* Bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-purple via-brand-purple-light to-emerald-400"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </div>

      <div className="mt-2 flex justify-between font-inter text-[0.6rem] text-white/25">
        <span>$0</span>
        <span className="text-brand-purple-light/60">{pct.toFixed(1)}%</span>
        <span>{fmt(target)}</span>
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  delay,
  isNumber,
  prefix,
}: {
  label: string;
  value: number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  delay: number;
  isNumber?: boolean;
  prefix?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
    >
      <HudBrackets color="rgba(255,255,255,0.05)" size={6} />
      <Icon className="mb-2 h-4 w-4 text-white/20" />
      <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/30">{label}</p>
      <p className={cn("mt-1 font-sora text-2xl font-bold tabular-nums", color)}>
        {isNumber ? <AnimatedNumber to={value} prefix={prefix ?? ""} /> : value}
      </p>
      {sub && <p className="mt-0.5 font-inter text-[0.65rem] text-white/25">{sub}</p>}
    </motion.div>
  );
}

// ─── Client revenue table ─────────────────────────────────────────────────────

function ClientTable({ clients }: { clients: ClientRow[] }) {
  const active   = clients.filter((c) => c.status === "active").sort((a, b) => b.mrr - a.mrr);
  const pipeline = clients.filter((c) => c.status === "proposal" || c.status === "prospect");

  return (
    <div className="flex flex-col gap-6">

      {/* Active clients */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
        <HudBrackets color="rgba(52,211,153,0.15)" size={7} />

        <div className="border-b border-white/[0.06] px-5 py-4">
          <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/30">Active Clients</p>
        </div>

        {active.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="font-inter text-sm text-white/20">No active clients yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                  {["Client", "Service", "MRR", "Since", "Lifetime", "Status"].map((h) => (
                    <th key={h} className="px-5 py-2.5 text-left font-inter text-[0.58rem] font-bold uppercase tracking-[0.16em] text-white/25">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {active.map((c, i) => {
                  const months = monthsSince(c.startDate);
                  const lifetime = c.mrr * months;
                  return (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.1 + i * 0.05 }}
                      className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02] last:border-0"
                    >
                      <td className="px-5 py-3">
                        <p className="font-sora text-sm font-semibold text-white">{c.name}</p>
                        <p className="font-inter text-xs text-white/30">{c.industry}</p>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {c.services.slice(0, 2).map((s) => (
                            <span key={s} className="rounded-full border border-brand-purple/20 bg-brand-purple/10 px-2 py-0.5 font-inter text-[0.6rem] text-brand-purple-light/70">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-sora text-sm font-bold text-emerald-400">{fmt(c.mrr)}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-inter text-xs text-white/40">
                          {months > 0 ? `${months}mo` : "< 1mo"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-inter text-xs text-white/50">{lifetime > 0 ? fmt(lifetime) : "—"}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={cn("rounded-full border px-2 py-0.5 font-inter text-[0.6rem] font-bold",
                          STATUS_META[c.status].border, STATUS_META[c.status].bg, STATUS_META[c.status].color)}>
                          {STATUS_META[c.status].label}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pipeline */}
      {pipeline.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
          <HudBrackets color="rgba(251,191,36,0.12)" size={7} />

          <div className="border-b border-white/[0.06] px-5 py-4">
            <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/30">Pipeline</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                  {["Client", "Stage", "Potential MRR"].map((h) => (
                    <th key={h} className="px-5 py-2.5 text-left font-inter text-[0.58rem] font-bold uppercase tracking-[0.16em] text-white/25">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pipeline.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.1 + i * 0.05 }}
                    className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02] last:border-0"
                  >
                    <td className="px-5 py-3">
                      <p className="font-sora text-sm font-semibold text-white">{c.name}</p>
                      <p className="font-inter text-xs text-white/30">{c.industry}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn("rounded-full border px-2 py-0.5 font-inter text-[0.6rem] font-bold",
                        STATUS_META[c.status].border, STATUS_META[c.status].bg, STATUS_META[c.status].color)}>
                        {STATUS_META[c.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-inter text-sm text-amber-400/70">
                        {c.mrr > 0 ? fmt(c.mrr) : "TBD"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export function RevenueDashboard({ clients, currentMrr, targetMrr }: RevenueProps) {
  const active      = clients.filter((c) => c.status === "active");
  const pipeline    = clients.filter((c) => c.status === "proposal" || c.status === "prospect");
  const pipelineMrr = pipeline.reduce((s, c) => s + (c.mrr ?? 0), 0);
  const avgDeal     = active.length > 0 ? Math.round(currentMrr / active.length) : 0;

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
          <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.22em] text-brand-purple-light/80">
            Drivn.AI OS · Finance
          </p>
          <h1 className="mt-1 bg-gradient-to-r from-white via-white to-brand-purple-light bg-clip-text font-sora text-2xl font-bold tracking-tight text-transparent md:text-3xl">
            Revenue
          </h1>
          <p className="mt-1 font-inter text-sm text-white/40">
            {active.length} active client{active.length !== 1 ? "s" : ""} · {pipeline.length} in pipeline
          </p>
        </motion.header>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">

          {/* Left: MRR bar + tables */}
          <div className="flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <MrrProgress current={currentMrr} target={targetMrr} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.18 }}>
              <ClientTable clients={clients} />
            </motion.div>
          </div>

          {/* Right: stat cards */}
          <div className="flex flex-col gap-3">
            <StatCard label="Current MRR"     value={currentMrr}    prefix="$" isNumber icon={DollarSign}  color="text-emerald-400"       delay={0.12} sub="from active clients" />
            <StatCard label="Target MRR"      value={targetMrr}     prefix="$" isNumber icon={Target}      color="text-brand-purple-light" delay={0.16} sub="10K goal" />
            <StatCard label="Active Clients"  value={active.length}            isNumber icon={Users2}      color="text-white"              delay={0.20} />
            <StatCard label="Avg Deal Size"   value={avgDeal}       prefix="$" isNumber icon={Briefcase}   color="text-sky-400"            delay={0.24} sub="per active client" />
            <StatCard label="Pipeline Value"  value={pipelineMrr}   prefix="$" isNumber icon={TrendingUp}  color="text-amber-400"          delay={0.28} sub="potential MRR" />
            <StatCard label="Pipeline Deals"  value={pipeline.length}          isNumber icon={Calendar}    color="text-white/60"           delay={0.32} sub="prospects + proposals" />
          </div>

        </div>
      </div>
    </div>
  );
}
