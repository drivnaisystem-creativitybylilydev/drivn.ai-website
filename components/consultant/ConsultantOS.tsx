"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Mail, AlertTriangle, Wifi, WifiOff, X } from "lucide-react";
import { ConsultantPipelineBoard } from "@/components/admin/ConsultantPipelineBoard";
import type { ConsultantLeadRow, LeadStats } from "@/lib/consultant-pipeline-db";

const POLL_INTERVAL_MS = 30_000;
const FOLLOWUP_DAYS = 7;

function needsFollowUp(lead: ConsultantLeadRow): boolean {
  if (lead.pipeline_stage !== "emailed" && lead.pipeline_stage !== "followed_up") return false;
  const ts = lead.last_contacted ?? lead.crm_updated_at;
  if (!ts) return false;
  const daysSince = (Date.now() - new Date(ts).getTime()) / (1000 * 60 * 60 * 24);
  return daysSince >= FOLLOWUP_DAYS;
}

function formatAge(ms: number): string {
  const secs = Math.round(ms / 1000);
  if (secs < 10) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.round(secs / 60);
  return `${mins}m ago`;
}

interface Props {
  initialLeads: ConsultantLeadRow[];
  initialStats: LeadStats;
}

export function ConsultantOS({ initialLeads, initialStats }: Props) {
  const [leads, setLeads] = useState<ConsultantLeadRow[]>(initialLeads);
  const [stats, setStats] = useState<LeadStats>(initialStats);
  const [lastRefreshed, setLastRefreshed] = useState<number>(Date.now());
  const [ageMs, setAgeMs] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [online, setOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  const followUpLeads = leads.filter(needsFollowUp);

  // "X ago" ticker — updates every 10s
  useEffect(() => {
    const ticker = setInterval(() => {
      setAgeMs(Date.now() - lastRefreshed);
    }, 10_000);
    return () => clearInterval(ticker);
  }, [lastRefreshed]);

  const doRefresh = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsRefreshing(true);
    try {
      const res = await fetch("/api/consultant-pipeline/leads");
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setLeads(data.leads);
      setStats(data.stats);
      setLastRefreshed(Date.now());
      setAgeMs(0);
      setOnline(true);
    } catch {
      setOnline(false);
    } finally {
      if (showSpinner) setIsRefreshing(false);
    }
  }, []);

  // Auto-poll every 30s
  useEffect(() => {
    const id = setInterval(() => doRefresh(false), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [doRefresh]);

  async function handleGmailSync() {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch("/api/consultant-pipeline/gmail-sync", { method: "POST" });
      const data = await res.json();
      setSyncMsg(data.message ?? `Synced ${data.synced ?? 0} leads`);
      await doRefresh(false);
    } catch {
      setSyncMsg("Sync failed — check console.");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-zinc-950 text-white">
      {/* Subtle atmospheric glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_35%_at_50%_-5%,rgba(139,92,246,0.14),transparent_55%)]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-svh flex-col">
        {/* ── OS Header ─────────────────────────────────────────────── */}
        <header className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-5 py-2.5 backdrop-blur-sm">
          {/* Left: brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-violet-400">
                Drivn.AI
              </span>
              <span className="text-zinc-700">/</span>
              <span className="text-[0.9rem] font-bold tracking-tight text-white">
                Consultant OS
              </span>
            </div>
            <span
              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-wide ${
                online
                  ? "border-emerald-800/50 bg-emerald-950/40 text-emerald-400"
                  : "border-red-800/50 bg-red-950/40 text-red-400"
              }`}
            >
              {online ? (
                <Wifi className="h-2.5 w-2.5" />
              ) : (
                <WifiOff className="h-2.5 w-2.5" />
              )}
              {online ? "Live" : "Offline"}
            </span>
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-3">
            <span className="text-[0.62rem] tabular-nums text-zinc-600">
              {ageMs === 0 ? "just now" : `updated ${formatAge(ageMs)}`}
            </span>

            <button
              onClick={() => doRefresh(true)}
              disabled={isRefreshing}
              className="flex h-7 items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 text-[0.68rem] font-medium text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white disabled:opacity-40"
            >
              <RefreshCw
                className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <button
              onClick={handleGmailSync}
              disabled={syncing}
              className="flex h-7 items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 text-[0.68rem] font-medium text-zinc-400 transition-colors hover:border-blue-800 hover:bg-blue-950/30 hover:text-blue-300 disabled:opacity-40"
            >
              <Mail className={`h-3 w-3 ${syncing ? "animate-pulse" : ""}`} />
              {syncing ? "Syncing…" : "Sync Gmail"}
            </button>
          </div>
        </header>

        {/* ── Sync message banner ───────────────────────────────────── */}
        {syncMsg && (
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-5 py-1.5">
            <span className="text-[0.7rem] text-zinc-400">{syncMsg}</span>
            <button
              onClick={() => setSyncMsg(null)}
              className="ml-3 text-zinc-600 transition-colors hover:text-zinc-300"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* ── Follow-up alert strip ─────────────────────────────────── */}
        {followUpLeads.length > 0 && (
          <div className="flex items-center gap-2.5 border-b border-yellow-900/40 bg-yellow-950/20 px-5 py-2">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-yellow-500" />
            <p className="text-[0.7rem] text-yellow-300">
              <span className="font-bold">{followUpLeads.length}</span>
              {" "}lead{followUpLeads.length > 1 ? "s" : ""} overdue for follow-up
              {" "}(emailed {FOLLOWUP_DAYS}+ days ago, no reply):{" "}
              <span className="text-yellow-400">
                {followUpLeads
                  .slice(0, 4)
                  .map((l) => l.name.split(" ")[0])
                  .join(", ")}
                {followUpLeads.length > 4 ? ` +${followUpLeads.length - 4} more` : ""}
              </span>
            </p>
          </div>
        )}

        {/* ── Kanban board ─────────────────────────────────────────── */}
        <div className="flex-1">
          <ConsultantPipelineBoard leads={leads} stats={stats} />
        </div>
      </div>
    </div>
  );
}
