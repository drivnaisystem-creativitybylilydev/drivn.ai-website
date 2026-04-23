"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Zap,
  Database,
  BarChart3,
  MessageSquare,
  FileText,
  Search,
  BookOpen,
  Terminal,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Play,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { runAgentAction, deleteAgentRunAction } from "@/app/admin/agents/actions";
import type { AgentRunRow, AgentRunStatus } from "@/lib/agent-db";
import { AGENTS } from "@/lib/agent-registry";

const STATUS_META: Record<
  AgentRunStatus,
  { label: string; color: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending:   { label: "Queued",    color: "text-amber-400",   icon: Clock },
  running:   { label: "Running",   color: "text-sky-400",     icon: Loader2 },
  completed: { label: "Completed", color: "text-emerald-400", icon: CheckCircle2 },
  error:     { label: "Error",     color: "text-red-400",     icon: XCircle },
};

const agentConfig = [
  { id: "jarvis", name: "JARVIS", icon: Zap, description: "AI Chief of Staff providing daily briefs and strategic advice", status: "Active" },
  { id: "kb-updater", name: "KB Updater", icon: Database, description: "Reads OS folder and syncs CLAUDE.md with latest agency state", status: "Active" },
  { id: "weekly-review", name: "Weekly Review", icon: BarChart3, description: "Summarizes the week: MRR delta, pipeline changes, open tasks", status: "Active" },
  { id: "lead-nurture", name: "Lead Nurture", icon: MessageSquare, description: "Finds leads needing follow-up and drafts personalized outreach", status: "Active" },
  { id: "proposal-writer", name: "Proposal Writer", icon: FileText, description: "Takes a client brief and drafts a full proposal document", status: "Active" },
  { id: "pipeline-scout", name: "Pipeline Scout", icon: Search, description: "Searches for ICP prospects and adds qualified leads", status: "Active" },
  { id: "case-study-builder", name: "Case Study Builder", icon: BookOpen, description: "Turns completed projects into polished case studies", status: "Active" },
];

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function AgentCard({
  agent,
  lastRun,
  onRun,
  running,
  index,
}: {
  agent: (typeof agentConfig)[0];
  lastRun?: AgentRunRow;
  onRun: (id: string, name: string) => void;
  running: boolean;
  index: number;
}) {
  const Icon = agent.icon;
  const status = lastRun ? STATUS_META[lastRun.status] : null;
  const StatusIcon = status?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-full"
    >
      {/* Glow effect background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Card */}
      <div className="relative h-full bg-slate-900/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 hover:border-purple-500/40 transition-all duration-300 shadow-[0_0_50px_rgba(124,58,237,0.3)] hover:shadow-[0_0_70px_rgba(124,58,237,0.5)] flex flex-col">

        {/* Icon with glow */}
        <div className="mb-6">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.4)] group-hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] transition-all">
            <Icon className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-3">{agent.name}</h3>
        <p className="text-gray-400 leading-relaxed mb-6 flex-1">{agent.description}</p>

        {/* Status and Last Run */}
        <div className="space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            ✓ {agent.status}
          </div>

          {status && StatusIcon && lastRun && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <StatusIcon className={cn("h-3 w-3", status.color)} />
              <span>{status.label}</span>
              <span>·</span>
              <span>{relativeTime(lastRun.triggeredAt)}</span>
            </div>
          )}

          {/* Action button */}
          {agent.id === "pipeline-scout" ? (
            <Link href="/admin/agents/pipeline-scout" className="w-full">
              <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 py-2.5 font-semibold text-purple-300 transition-all hover:border-purple-500/50 hover:bg-purple-500/20 active:scale-95">
                <ArrowRight className="h-4 w-4" />
                Open Scout
              </button>
            </Link>
          ) : agent.id === "jarvis" ? (
            <Link href="/admin/agents/jarvis" className="w-full">
              <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 py-2.5 font-semibold text-purple-300 transition-all hover:border-purple-500/50 hover:bg-purple-500/20 active:scale-95">
                <ArrowRight className="h-4 w-4" />
                Chat with Jarvis
              </button>
            </Link>
          ) : (
            <button
              onClick={() => onRun(agent.id, agent.name)}
              disabled={running}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 py-2.5 font-semibold text-purple-300 transition-all hover:border-purple-500/50 hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {running ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {running ? "Running..." : "Run"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function RunLogRow({ run, index, onDelete }: { run: AgentRunRow; index: number; onDelete: (id: string) => void }) {
  const meta = STATUS_META[run.status];
  const StatusIcon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="group flex items-center gap-4 border-b border-white/[0.04] py-3 last:border-0"
    >
      <StatusIcon className={cn("h-4 w-4 shrink-0", meta.color, run.status === "running" && "animate-spin")} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-white/90">{run.agentName}</span>
          {run.summary && <span className="truncate text-xs text-white/35">{run.summary}</span>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className={cn("text-xs font-medium", meta.color)}>{meta.label}</span>
        {run.durationMs && <span className="text-xs text-white/25">{(run.durationMs / 1000).toFixed(1)}s</span>}
        <span className="text-xs text-white/25">{relativeTime(run.triggeredAt)}</span>
        <button onClick={() => onDelete(run.id)} className="rounded-lg p-1 text-white/20 opacity-0 transition hover:bg-red-950/40 hover:text-red-400 group-hover:opacity-100" title="Delete run">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

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

  function handleDeleteRun(runId: string) {
    startTransition(async () => {
      const res = await deleteAgentRunAction(runId);
      if (res.error) {
        setToast(res.error);
        setTimeout(() => setToast(null), 3500);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="relative min-h-svh bg-[#0a0a14] text-white overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 pt-20 pb-16 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
            AI Agent System
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your automated business intelligence and operations team working 24/7
          </p>
        </motion.div>

        {/* Agent Pyramid */}
        <div className="max-w-6xl mx-auto px-4 pb-20">
          <div className="relative">
            {/* SVG connecting lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ minHeight: "600px" }}>
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "rgba(124,58,237,0.4)" }} />
                  <stop offset="100%" style={{ stopColor: "rgba(124,58,237,0.2)" }} />
                </linearGradient>
              </defs>
              {/* Lines from Jarvis to second level */}
              <line x1="50" y1="8" x2="25" y2="32" stroke="url(#lineGradient)" strokeWidth="0.5" />
              <line x1="50" y1="8" x2="75" y2="32" stroke="url(#lineGradient)" strokeWidth="0.5" />

              {/* Lines from second level to third level */}
              <line x1="25" y1="40" x2="12.5" y2="64" stroke="url(#lineGradient)" strokeWidth="0.5" />
              <line x1="25" y1="40" x2="37.5" y2="64" stroke="url(#lineGradient)" strokeWidth="0.5" />
              <line x1="75" y1="40" x2="62.5" y2="64" stroke="url(#lineGradient)" strokeWidth="0.5" />
              <line x1="75" y1="40" x2="87.5" y2="64" stroke="url(#lineGradient)" strokeWidth="0.5" />
            </svg>

            {/* Jarvis - Top level */}
            <div className="flex justify-center mb-32">
              <div className="w-80">
                <AgentCard
                  agent={agentConfig[0]}
                  lastRun={lastRuns[agentConfig[0].id]}
                  onRun={handleRun}
                  running={pending && runningId === agentConfig[0].id}
                  index={0}
                />
              </div>
            </div>

            {/* Second level - 2 agents */}
            <div className="flex justify-between px-8 mb-32">
              <div className="w-80">
                <AgentCard
                  agent={agentConfig[1]}
                  lastRun={lastRuns[agentConfig[1].id]}
                  onRun={handleRun}
                  running={pending && runningId === agentConfig[1].id}
                  index={1}
                />
              </div>
              <div className="w-80">
                <AgentCard
                  agent={agentConfig[2]}
                  lastRun={lastRuns[agentConfig[2].id]}
                  onRun={handleRun}
                  running={pending && runningId === agentConfig[2].id}
                  index={2}
                />
              </div>
            </div>

            {/* Third level - 4 agents */}
            <div className="flex justify-between gap-4 px-0">
              <div className="w-64">
                <AgentCard
                  agent={agentConfig[3]}
                  lastRun={lastRuns[agentConfig[3].id]}
                  onRun={handleRun}
                  running={pending && runningId === agentConfig[3].id}
                  index={3}
                />
              </div>
              <div className="w-64">
                <AgentCard
                  agent={agentConfig[4]}
                  lastRun={lastRuns[agentConfig[4].id]}
                  onRun={handleRun}
                  running={pending && runningId === agentConfig[4].id}
                  index={4}
                />
              </div>
              <div className="w-64">
                <AgentCard
                  agent={agentConfig[5]}
                  lastRun={lastRuns[agentConfig[5].id]}
                  onRun={handleRun}
                  running={pending && runningId === agentConfig[5].id}
                  index={5}
                />
              </div>
              <div className="w-64">
                <AgentCard
                  agent={agentConfig[6]}
                  lastRun={lastRuns[agentConfig[6].id]}
                  onRun={handleRun}
                  running={pending && runningId === agentConfig[6].id}
                  index={6}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Run Log Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-7xl mx-auto px-4 pb-20"
        >
          <div className="mb-6 flex items-center gap-3">
            <Terminal className="h-5 w-5 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Run Log</h2>
            <span className="text-gray-500">({runs.length})</span>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl shadow-[0_0_50px_rgba(124,58,237,0.3)] p-8">
            {runs.length === 0 ? (
              <div className="text-center py-12">
                <Terminal className="h-8 w-8 text-white/20 mx-auto mb-3" />
                <p className="text-gray-400">No runs yet. Execute an agent to see activity here.</p>
              </div>
            ) : (
              <div className="space-y-0">
                {runs.slice(0, 10).map((run, i) => (
                  <RunLogRow key={run.id} run={run} index={i} onDelete={handleDeleteRun} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Toast notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl border border-purple-500/30 bg-slate-900/90 backdrop-blur-xl px-5 py-3 text-sm text-white shadow-[0_0_40px_rgba(124,58,237,0.3)]"
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
}
