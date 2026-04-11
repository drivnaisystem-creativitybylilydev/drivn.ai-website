"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DollarSign,
  Users2,
  Briefcase,
  TrendingUp,
  ChevronRight,
  Terminal,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClientRow, ClientStats } from "@/lib/client-db";
import type { LeadAdminStats, LeadRowView } from "@/components/admin/LeadsSaasDashboard";

// ─── Primitives ──────────────────────────────────────────────────────────────

function HudBrackets({ color = "rgba(139,92,246,0.4)", size = 10 }: { color?: string; size?: number }) {
  const s = size;
  return (
    <>
      <div style={{ width: s, height: s, borderColor: color }} className="absolute left-0 top-0 border-l border-t" />
      <div style={{ width: s, height: s, borderColor: color }} className="absolute right-0 top-0 border-r border-t" />
      <div style={{ width: s, height: s, borderColor: color }} className="absolute bottom-0 left-0 border-b border-l" />
      <div style={{ width: s, height: s, borderColor: color }} className="absolute bottom-0 right-0 border-b border-r" />
    </>
  );
}

function AnimatedNumber({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let start: number | null = null;
    const duration = 1600;
    function step(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node!.textContent = Math.round(eased * to).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span ref={ref}>0</span>;
}

// ─── MRR Ring ────────────────────────────────────────────────────────────────

const GOAL = 10000;
const R = 50;
const CIRCUMFERENCE = 2 * Math.PI * R;

function MrrRing({ mrr }: { mrr: number }) {
  const progress = Math.min(mrr / GOAL, 1);
  const offset = CIRCUMFERENCE * (1 - progress);
  const pct = Math.round(progress * 100);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-[140px] w-[140px]">
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full opacity-20"
          style={{ boxShadow: "0 0 40px 8px rgba(139,92,246,0.6)" }}
        />
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          {/* Track */}
          <circle
            cx="60" cy="60" r={R}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="7"
          />
          {/* Progress arc */}
          <motion.circle
            cx="60" cy="60" r={R}
            fill="none"
            stroke="url(#mrrGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.4 }}
            style={{ filter: "drop-shadow(0 0 6px rgba(139,92,246,0.8))" }}
          />
          <defs>
            <linearGradient id="mrrGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-mono text-[0.6rem] font-bold uppercase tracking-widest text-brand-purple-light/70">
            MRR
          </p>
          <p className="font-mono text-xl font-bold text-white">
            $<AnimatedNumber to={mrr} />
          </p>
          <p className="font-mono text-[0.6rem] text-white/30">{pct}%</p>
        </div>
      </div>

      <p className="mt-2 font-inter text-xs text-white/30">
        of{" "}
        <span className="font-mono font-semibold text-brand-purple-light/60">
          $10,000
        </span>{" "}
        goal
      </p>
    </div>
  );
}

// ─── System status bar ───────────────────────────────────────────────────────

function SystemStatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function update() {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-6 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5"
    >
      <div className="flex items-center gap-2">
        <Zap className="h-3.5 w-3.5 text-brand-purple-light/70" />
        <p className="font-inter text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/50">
          Drivn.AI Operating System
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          </span>
          <span className="font-inter text-[0.6rem] font-bold uppercase tracking-widest text-emerald-400/80">
            Nominal
          </span>
        </div>
        <p className="font-mono text-[0.65rem] text-white/30">{time}</p>
      </div>
    </motion.div>
  );
}

// ─── Stat tile ───────────────────────────────────────────────────────────────

function StatTile({
  icon: Icon,
  label,
  value,
  href,
  delay = 0,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  href: string;
  delay?: number;
  accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link href={href} className="block">
        <div
          className={cn(
            "group relative overflow-hidden rounded-xl border p-4 transition-colors hover:border-brand-purple/30",
            accent
              ? "border-brand-purple/25 bg-brand-purple/[0.06]"
              : "border-white/[0.07] bg-white/[0.02]",
          )}
        >
          <HudBrackets color={accent ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.12)"} size={8} />
          <div className="flex items-center justify-between">
            <Icon className={cn("h-4 w-4", accent ? "text-brand-purple-light/60" : "text-white/25")} />
            <ChevronRight className="h-3.5 w-3.5 text-white/20 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-purple-light/50" />
          </div>
          <p className="mt-3 font-mono text-2xl font-bold text-white">
            {accent && "$"}
            <AnimatedNumber to={value} />
            {accent && <span className="ml-1 font-inter text-xs text-white/30">/mo</span>}
          </p>
          <p className="mt-1 font-sora text-[0.62rem] font-bold uppercase tracking-wider text-white/35">
            {label}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Recent clients strip ─────────────────────────────────────────────────────

const STATUS_TEXT: Record<string, string> = {
  active:   "text-emerald-400",
  prospect: "text-amber-400",
  proposal: "text-sky-400",
  paused:   "text-white/30",
  churned:  "text-red-400",
};

function RecentClientRow({ client, index }: { client: ClientRow; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.08 * index }}
      className="flex items-center justify-between border-b border-white/[0.05] py-3 last:border-0"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] font-sora text-[0.6rem] font-bold text-white/60">
          {client.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="font-sora text-sm font-semibold text-white/90">{client.name}</p>
          <p className="font-inter text-[0.65rem] text-white/30">{client.industry || "—"}</p>
        </div>
      </div>
      <div className="text-right">
        {client.mrr > 0 && (
          <p className="font-mono text-sm font-bold text-white">${client.mrr.toLocaleString()}</p>
        )}
        <p className={cn("font-inter text-[0.62rem] font-semibold uppercase tracking-wider", STATUS_TEXT[client.status] ?? "text-white/30")}>
          {client.status}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function AdminOverview({
  clientStats,
  leadStats,
  recentClients,
  recentLeads,
}: {
  clientStats: ClientStats;
  leadStats: LeadAdminStats;
  recentClients: ClientRow[];
  recentLeads: LeadRowView[];
}) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-brand-dark text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-10%,rgba(139,92,246,0.25),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_35%_50%_at_95%_60%,rgba(167,139,250,0.08),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 pb-16 pt-8 md:px-8">
        <SystemStatusBar />

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-8 border-b border-white/[0.07] pb-6"
        >
          <h1 className="bg-gradient-to-r from-white via-white to-brand-purple-light bg-clip-text font-sora text-3xl font-bold tracking-tight text-transparent">
            Command Center
          </h1>
          <p className="mt-1 font-inter text-sm text-white/40">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.div>

        {/* Top row: MRR ring + stat tiles */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
          {/* MRR ring card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-brand-purple/20 bg-gradient-to-br from-brand-purple/[0.08] to-brand-dark p-6 shadow-[0_0_48px_-12px_rgba(139,92,246,0.35)]"
          >
            <HudBrackets color="rgba(139,92,246,0.5)" size={12} />
            <p className="mb-4 font-sora text-[0.6rem] font-bold uppercase tracking-[0.22em] text-brand-purple-light/80">
              Revenue Target
            </p>
            <MrrRing mrr={clientStats.totalMrr} />
          </motion.div>

          {/* Stat tiles grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
            <StatTile icon={DollarSign} label="Monthly Revenue" value={clientStats.totalMrr} href="/admin/clients" delay={0.12} accent />
            <StatTile icon={Briefcase} label="Active Clients"  value={clientStats.active}   href="/admin/clients" delay={0.18} />
            <StatTile icon={Users2}    label="Total Leads"     value={leadStats.total}       href="/admin/leads"   delay={0.24} />
            <StatTile icon={TrendingUp} label="Calls · 7 Days" value={leadStats.upcomingCallsNext7Days} href="/admin/leads" delay={0.30} />
          </div>
        </div>

        {/* Two column: clients + leads */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Clients */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
          >
            <HudBrackets color="rgba(255,255,255,0.1)" size={8} />
            <div className="mb-4 flex items-center justify-between">
              <p className="font-sora text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/40">
                Clients
              </p>
              <Link
                href="/admin/clients"
                className="flex items-center gap-1 font-inter text-xs text-brand-purple-light/60 transition hover:text-brand-purple-light"
              >
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {recentClients.length === 0 ? (
              <p className="py-8 text-center font-inter text-sm text-white/25">
                No clients yet.{" "}
                <Link href="/admin/clients" className="text-brand-purple-light/60 hover:text-brand-purple-light">
                  Add one →
                </Link>
              </p>
            ) : (
              recentClients.map((c, i) => <RecentClientRow key={c.id} client={c} index={i} />)
            )}
          </motion.div>

          {/* Leads */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.42 }}
            className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
          >
            <HudBrackets color="rgba(255,255,255,0.1)" size={8} />
            <div className="mb-4 flex items-center justify-between">
              <p className="font-sora text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/40">
                Recent Leads
              </p>
              <Link
                href="/admin/leads"
                className="flex items-center gap-1 font-inter text-xs text-brand-purple-light/60 transition hover:text-brand-purple-light"
              >
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {recentLeads.length === 0 ? (
              <p className="py-8 text-center font-inter text-sm text-white/25">No leads yet.</p>
            ) : (
              recentLeads.map((lead, i) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.08 * i }}
                  className="flex items-center justify-between border-b border-white/[0.05] py-3 last:border-0"
                >
                  <div>
                    <p className="font-sora text-sm font-semibold text-white/90">
                      {lead.payload.fullName}
                    </p>
                    <p className="font-inter text-[0.65rem] text-white/30">
                      {lead.payload.businessName}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-sora text-[0.6rem] font-bold uppercase tracking-wider text-brand-purple-light/80">
                    {lead.status.replace("_", " ")}
                  </span>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-6 flex flex-wrap gap-3"
        >
          {[
            { href: "/admin/clients", icon: Briefcase, label: "Manage Clients" },
            { href: "/admin/leads", icon: Users2, label: "Lead CRM" },
            { href: "/admin/agents", icon: Terminal, label: "Agent Logs" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 font-inter text-xs font-medium text-white/50 transition hover:border-brand-purple/25 hover:text-brand-purple-light"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
