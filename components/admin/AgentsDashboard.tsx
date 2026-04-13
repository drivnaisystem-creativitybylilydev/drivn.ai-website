"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Zap,
  Terminal,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HudBrackets } from "@/components/admin/hud-primitives";
import { runAgentAction } from "@/app/admin/agents/actions";
import type { AgentRunRow, AgentRunStatus } from "@/lib/agent-db";
import { AGENTS } from "@/lib/agent-registry";
import type { Agent } from "@/lib/agent-registry";

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_META: Record<
  AgentRunStatus,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending:   { label: "Queued",    color: "text-amber-400",   icon: Clock },
  running:   { label: "Running",   color: "text-sky-400",     icon: Loader2 },
  completed: { label: "Completed", color: "text-emerald-400", icon: CheckCircle2 },
  error:     { label: "Error",     color: "text-red-400",     icon: XCircle },
};

const CATEGORY_META = {
  ops:     { label: "Ops",     color: "text-violet-400",  border: "border-violet-400/20 bg-violet-400/10" },
  sales:   { label: "Sales",   color: "text-sky-400",     border: "border-sky-400/20 bg-sky-400/10" },
  content: { label: "Content", color: "text-emerald-400", border: "border-emerald-400/20 bg-emerald-400/10" },
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Agent card ───────────────────────────────────────────────────────────────

function AgentCard({
  agent,
  lastRun,
  index,
  onRun,
  running,
}: {
  agent: Agent;
  lastRun?: AgentRunRow;
  index: number;
  onRun: (id: string, name: string) => void;
  running: boolean;
}) {
  const Icon = agent.icon;
  const cat = CATEGORY_META[agent.category];
  const status = lastRun ? STATUS_META[lastRun.status] : null;
  const StatusIcon = status?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-colors hover:border-brand-purple/30 hover:bg-brand-purple/[0.04]"
    >
      <HudBrackets color="rgba(139,92,246,0.2)" size={8} />

      {/* Category badge */}
      <span className={cn("mb-4 inline-flex items-center rounded-full border px-2 py-0.5 font-inter text-[0.55rem] font-bold uppercase tracking-[0.18em]", cat.border, cat.color)}>
        {cat.label}
      </span>

      {/* Icon + name */}
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-purple/30 bg-brand-purple/10 shadow-[0_0_16px_-4px_rgba(139,92,246,0.5)]">
          <Icon className="h-5 w-5 text-brand-purple-light" />
        </div>
        <div className="min-w-0">
          <p className="font-sora text-sm font-semibold text-white">{agent.name}</p>
          <p className="mt-0.5 font-inter text-xs leading-relaxed text-white/40">{agent.description}</p>
        </div>
      </div>

      {/* Last run */}
      <div className="mb-4 flex items-center gap-2 font-inter text-xs text-white/30">
        {status && StatusIcon ? (
          <>
            <StatusIcon className={cn("h-3 w-3 shrink-0", status.color, lastRun?.status === "running" && "animate-spin")} />
            <span className={status.color}>{status.label}</span>
            <span>·</span>
            <span>{relativeTime(lastRun!.triggeredAt)}</span>
          </>
        ) : (
          <>
            <Clock className="h-3 w-3 shrink-0" />
            <span>Never run</span>
          </>
        )}
      </div>

      {/* Run button */}
      <button
        onClick={() => onRun(agent.id, agent.name)}
        disabled={running}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-purple/25 bg-brand-purple/10 py-2 font-sora text-xs font-semibold text-brand-purple-light transition hover:border-brand-purple/50 hover:bg-brand-purple/20 hover:shadow-[0_0_20px_-6px_rgba(139,92,246,0.5)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {running ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Play className="h-3.5 w-3.5" />
        )}
        {running ? "Queuing…" : "Run"}
      </button>
    </motion.div>
  );
}

// ─── Run log row ──────────────────────────────────────────────────────────────

function RunLogRow({ run, index }: { run: AgentRunRow; index: number }) {
  const meta = STATUS_META[run.status];
  const StatusIcon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="flex items-center gap-4 border-b border-white/[0.04] py-3 last:border-0"
    >
      <StatusIcon className={cn("h-4 w-4 shrink-0", meta.color, run.status === "running" && "animate-spin")} />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-sora text-sm font-semibold text-white/90">{run.agentName}</span>
          {run.summary && (
            <span className="truncate font-inter text-xs text-white/35">{run.summary}</span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className={cn("font-inter text-xs font-medium", meta.color)}>{meta.label}</span>
        {run.durationMs && (
          <span className="font-mono text-xs text-white/25">{(run.durationMs / 1000).toFixed(1)}s</span>
        )}
        <span className="font-mono text-xs text-white/25">{relativeTime(run.triggeredAt)}</span>
        <span className={cn(
          "rounded-full px-2 py-0.5 font-inter text-[0.6rem] font-bold uppercase tracking-wide",
          run.triggeredBy === "manual"   ? "bg-white/5 text-white/30" :
          run.triggeredBy === "schedule" ? "bg-sky-400/10 text-sky-400/70" :
                                           "bg-violet-400/10 text-violet-400/70"
        )}>
          {run.triggeredBy}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export function AgentsDashboard({
  runs,
  lastRuns,
}: {
  runs: AgentRunRow[];
  lastRuns: Record<string, AgentRunRow>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [runningId, setRunningId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function handleRun(agentId: string, agentName: string) {
    setRunningId(agentId);
    startTransition(async () => {
      const res = await runAgentAction(agentId, agentName);
      setRunningId(null);
      if (res.error) {
        setToast(res.error);
      } else {
        setToast(`${agentName} queued — run #${res.runId?.slice(-6)}`);
        router.refresh();
      }
      setTimeout(() => setToast(null), 3500);
    });
  }

  const ops     = AGENTS.filter((a) => a.category === "ops");
  const sales   = AGENTS.filter((a) => a.category === "sales");
  const content = AGENTS.filter((a) => a.category === "content");

  const totalRuns = runs.length;
  const completedRuns = runs.filter((r) => r.status === "completed").length;
  const errorRuns = runs.filter((r) => r.status === "error").length;

  return (
    <div className="relative min-h-svh overflow-hidden bg-brand-dark text-white">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-20%,rgba(139,92,246,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_90%_60%,rgba(56,189,248,0.05),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-20 pt-8 md:px-8">

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col gap-4 border-b border-white/[0.07] pb-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.22em] text-brand-purple-light/80">
              Drivn.AI OS · Agents
            </p>
            <h1 className="mt-1 bg-gradient-to-r from-white via-white to-brand-purple-light bg-clip-text font-sora text-2xl font-bold tracking-tight text-transparent md:text-3xl">
              Agent Workforce
            </h1>
            <p className="mt-1 font-inter text-sm text-white/40">
              {AGENTS.length} agents · {totalRuns} total runs · {completedRuns} completed
            </p>
          </div>

          {/* System status */}
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-inter text-xs text-white/50">
              Remote Control <span className="text-amber-400">— connect env to enable</span>
            </span>
            <Terminal className="h-3.5 w-3.5 text-white/20" />
          </div>
        </motion.header>

        {/* ── Stats bar ── */}
        <div className="mb-10 grid grid-cols-3 gap-3 sm:grid-cols-3">
          {[
            { label: "Total Runs",  value: totalRuns,     color: "text-white" },
            { label: "Completed",   value: completedRuns, color: "text-emerald-400" },
            { label: "Errors",      value: errorRuns,     color: errorRuns > 0 ? "text-red-400" : "text-white/30" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4"
            >
              <HudBrackets color="rgba(255,255,255,0.06)" size={6} />
              <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/35">{stat.label}</p>
              <p className={cn("mt-1 font-sora text-2xl font-bold tabular-nums", stat.color)}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Ops agents ── */}
        <Section label="Operations" icon={Zap} delay={0.1}>
          {ops.map((a, i) => (
            <AgentCard
              key={a.id}
              agent={a}
              lastRun={lastRuns[a.id]}
              index={i}
              onRun={handleRun}
              running={pending && runningId === a.id}
            />
          ))}
        </Section>

        {/* ── Sales agents ── */}
        <Section label="Sales" icon={MessageSquare} delay={0.2}>
          {sales.map((a, i) => (
            <AgentCard
              key={a.id}
              agent={a}
              lastRun={lastRuns[a.id]}
              index={i}
              onRun={handleRun}
              running={pending && runningId === a.id}
            />
          ))}
        </Section>

        {/* ── Content agents ── */}
        <Section label="Content" icon={BookOpen} delay={0.3}>
          {content.map((a, i) => (
            <AgentCard
              key={a.id}
              agent={a}
              lastRun={lastRuns[a.id]}
              index={i}
              onRun={handleRun}
              running={pending && runningId === a.id}
            />
          ))}
        </Section>

        {/* ── Run log ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-10"
        >
          <div className="mb-4 flex items-center gap-3">
            <Terminal className="h-4 w-4 text-white/30" />
            <p className="font-sora text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/40">
              Run Log
            </p>
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="font-mono text-xs text-white/20">{runs.length}</span>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5">
            <HudBrackets color="rgba(255,255,255,0.06)" size={8} />
            {runs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Terminal className="mb-3 h-8 w-8 text-white/10" />
                <p className="font-sora text-sm font-semibold text-white/30">No runs yet</p>
                <p className="mt-1 font-inter text-xs text-white/20">
                  Run an agent above to see activity here.
                </p>
              </div>
            ) : (
              runs.map((run, i) => <RunLogRow key={run.id} run={run} index={i} />)
            )}
          </div>
        </motion.section>
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-brand-purple/30 bg-[#07071a] px-5 py-3 font-inter text-sm text-white shadow-[0_0_40px_-8px_rgba(139,92,246,0.6)]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  label,
  icon: Icon,
  delay,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="mb-8"
    >
      <div className="mb-4 flex items-center gap-3">
        <Icon className="h-3.5 w-3.5 text-white/30" />
        <p className="font-sora text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/40">
          {label}
        </p>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{children}</div>
    </motion.section>
  );
}
