"use client";

import { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  Phone,
  Globe,
  Star,
  MapPin,
  CheckCircle2,
  XCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HudBrackets } from "@/components/admin/hud-primitives";
import { updateLeadStatusAction } from "@/app/admin/sourced-leads/actions";
import type { SourcedLeadRow, SourcedLeadStatus } from "@/lib/sourced-lead-db";

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

type SortKey = "score" | "name" | "rating" | "status";
type SortDir = "asc" | "desc";

// ─── Score badge ──────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
    : score >= 60 ? "text-brand-purple-light border-brand-purple/30 bg-brand-purple/10"
    : "text-amber-400 border-amber-400/30 bg-amber-400/10";
  return (
    <span className={cn("inline-flex items-center rounded-lg border px-2 py-0.5 font-mono text-xs font-bold tabular-nums", color)}>
      {score}
    </span>
  );
}

// ─── Status cell with advance button ─────────────────────────────────────────

function StatusCell({ lead }: { lead: SourcedLeadRow }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const meta = getStatusMeta(lead.status);

  function advance() {
    const next = STATUS_FLOW[STATUS_FLOW.indexOf(lead.status) + 1];
    if (!next) return;
    startTransition(async () => {
      await updateLeadStatusAction(lead.id, next);
      router.refresh();
    });
  }

  function dismiss() {
    startTransition(async () => {
      await updateLeadStatusAction(lead.id, "dismissed");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("rounded-full border px-2 py-0.5 font-inter text-[0.6rem] font-bold whitespace-nowrap", meta.border, meta.bg, meta.color)}>
        {meta.label}
      </span>
      {lead.status !== "converted" && lead.status !== "dismissed" && (
        <>
          <button onClick={advance} disabled={pending} title="Advance status"
            className="rounded p-0.5 text-white/20 transition hover:text-emerald-400 disabled:opacity-30">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </button>
          <button onClick={dismiss} disabled={pending} title="Dismiss"
            className="rounded p-0.5 text-white/20 transition hover:text-red-400 disabled:opacity-30">
            <XCircle className="h-3.5 w-3.5" />
          </button>
        </>
      )}
    </div>
  );
}

// ─── Scout bar ────────────────────────────────────────────────────────────────

function ScoutBar({ onNewLeads }: { onNewLeads: () => void }) {
  const [query, setQuery] = useState("");
  const [maxLeads, setMaxLeads] = useState(20);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ found: number; saved: number; durationMs: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/agents/source-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), maxLeads }),
      });
      const data = await res.json() as { error?: string; totalFound?: number; savedToDb?: number; durationMs?: number };
      if (!res.ok) throw new Error(data.error ?? "Agent failed");
      setResult({ found: data.totalFound ?? 0, saved: data.savedToDb ?? 0, durationMs: data.durationMs ?? 0 });
      onNewLeads();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-purple/20 bg-brand-purple/[0.04] p-5">
      <HudBrackets color="rgba(139,92,246,0.3)" size={8} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && handleRun()}
          placeholder='e.g. "dentists in London" or "plumbers in Sydney"'
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 font-inter text-sm text-white placeholder:text-white/25 focus:border-brand-purple/50 focus:outline-none"
        />
        <select
          value={maxLeads}
          onChange={(e) => setMaxLeads(Number(e.target.value))}
          className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 font-inter text-sm text-white/70 focus:border-brand-purple/50 focus:outline-none"
        >
          {[10, 20, 30, 40, 50].map((n) => (
            <option key={n} value={n} className="bg-[#07071a]">{n} leads</option>
          ))}
        </select>
        <button
          onClick={handleRun}
          disabled={loading || !query.trim()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-900 via-brand-purple to-violet-800 px-6 py-2.5 font-sora text-sm font-bold text-white shadow-[0_0_24px_-4px_rgba(139,92,246,0.65)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          {loading ? "Sourcing…" : "Find Leads"}
        </button>
      </div>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-3 flex items-center gap-2 font-inter text-xs text-white/40">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-purple-light" />
            Searching Google Maps via Apify, scoring leads…
          </motion.div>
        )}
        {result && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-3">
            {result.saved === 0 ? (
              <div className="flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-950/20 px-4 py-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <p className="font-inter text-sm text-amber-300/90">
                  Found {result.found} businesses but <strong>0 were saved</strong> — check <code className="rounded bg-black/30 px-1 font-mono text-xs">MONGODB_URI</code>.
                </p>
              </div>
            ) : (
              <p className="font-inter text-sm text-emerald-400">
                ✓ Found {result.found} · {result.saved} saved · {(result.durationMs / 1000).toFixed(1)}s — table updated below
              </p>
            )}
          </motion.div>
        )}
        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 font-inter text-sm text-red-400">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sort header cell ─────────────────────────────────────────────────────────

function SortTh({ label, sortKey, current, dir, onSort }: {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  dir: SortDir;
  onSort: (k: SortKey) => void;
}) {
  const active = current === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      className="cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left font-inter text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/30 transition hover:text-white/60"
    >
      <span className="flex items-center gap-1">
        {label}
        {active ? (
          dir === "desc" ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3 opacity-20" />
        )}
      </span>
    </th>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function PipelineScoutPage({ initialLeads }: { initialLeads: SourcedLeadRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<SourcedLeadStatus | "all">("all");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const leads = useMemo(() => {
    let rows = initialLeads;

    // Status filter
    if (statusFilter === "all") {
      rows = rows.filter((l) => l.status !== "dismissed");
    } else {
      rows = rows.filter((l) => l.status === statusFilter);
    }

    // Search filter
    const q = search.toLowerCase().trim();
    if (q) {
      rows = rows.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.category ?? "").toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q) ||
          (l.phone ?? "").includes(q),
      );
    }

    // Sort
    rows = [...rows].sort((a, b) => {
      let av: string | number = 0;
      let bv: string | number = 0;
      if (sortKey === "score")  { av = a.score;          bv = b.score; }
      if (sortKey === "name")   { av = a.name.toLowerCase(); bv = b.name.toLowerCase(); }
      if (sortKey === "rating") { av = a.rating ?? 0;    bv = b.rating ?? 0; }
      if (sortKey === "status") { av = a.status;         bv = b.status; }
      if (av < bv) return sortDir === "desc" ? 1 : -1;
      if (av > bv) return sortDir === "desc" ? -1 : 1;
      return 0;
    });

    return rows;
  }, [initialLeads, search, sortKey, sortDir, statusFilter]);

  return (
    <div className="relative min-h-svh overflow-hidden bg-brand-dark text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-20%,rgba(139,92,246,0.18),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-20 pt-8 md:px-8">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 border-b border-white/[0.07] pb-6"
        >
          <Link
            href="/admin/agents"
            className="mb-4 inline-flex items-center gap-1.5 font-inter text-xs text-white/30 transition hover:text-white/60"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Agent Workforce
          </Link>
          <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.22em] text-brand-purple-light/80">
            Drivn.AI OS · Sales
          </p>
          <h1 className="mt-1 bg-gradient-to-r from-white via-white to-brand-purple-light bg-clip-text font-sora text-2xl font-bold tracking-tight text-transparent md:text-3xl">
            Pipeline Scout
          </h1>
          <p className="mt-1 font-inter text-sm text-white/40">
            {initialLeads.length} leads in database
          </p>
        </motion.header>

        {/* Scout bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mb-6"
        >
          <ScoutBar onNewLeads={() => router.refresh()} />
        </motion.div>

        {/* Filter + search row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.18 }}
          className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Status pills */}
          <div className="flex flex-wrap gap-1.5">
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

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, niche, location…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2 pl-9 pr-4 font-inter text-sm text-white placeholder:text-white/25 focus:border-brand-purple/40 focus:outline-none sm:w-64"
            />
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.07]"
        >
          <HudBrackets color="rgba(139,92,246,0.12)" size={8} />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <SortTh label="Name"   sortKey="name"   current={sortKey} dir={sortDir} onSort={handleSort} />
                  <SortTh label="Score"  sortKey="score"  current={sortKey} dir={sortDir} onSort={handleSort} />
                  <th className="px-4 py-3 text-left font-inter text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/30">Niche</th>
                  <th className="px-4 py-3 text-left font-inter text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/30">Phone</th>
                  <th className="px-4 py-3 text-left font-inter text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/30">Website</th>
                  <SortTh label="Rating" sortKey="rating" current={sortKey} dir={sortDir} onSort={handleSort} />
                  <th className="px-4 py-3 text-left font-inter text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/30">Address</th>
                  <SortTh label="Status" sortKey="status" current={sortKey} dir={sortDir} onSort={handleSort} />
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center font-inter text-sm text-white/25">
                      No leads match your filters. Run the scout above to source new ones.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead, i) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: i * 0.02 }}
                      className={cn(
                        "border-b border-white/[0.04] transition-colors hover:bg-white/[0.02] last:border-0",
                        lead.status === "dismissed" && "opacity-35",
                      )}
                    >
                      {/* Name */}
                      <td className="px-4 py-3">
                        <p className="font-sora text-sm font-semibold text-white max-w-[200px] truncate">{lead.name}</p>
                      </td>

                      {/* Score */}
                      <td className="px-4 py-3">
                        <ScoreBadge score={lead.score} />
                      </td>

                      {/* Niche */}
                      <td className="px-4 py-3">
                        <span className="whitespace-nowrap font-inter text-xs text-white/50">
                          {lead.category ?? "—"}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3">
                        {lead.phone ? (
                          <a href={`tel:${lead.phone}`}
                            className="flex items-center gap-1 whitespace-nowrap font-inter text-xs text-white/50 transition hover:text-white/80">
                            <Phone className="h-3 w-3 shrink-0" />
                            {lead.phone}
                          </a>
                        ) : (
                          <span className="font-inter text-xs text-white/20">—</span>
                        )}
                      </td>

                      {/* Website */}
                      <td className="px-4 py-3">
                        {lead.website ? (
                          <a href={lead.website} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 font-inter text-xs text-brand-purple-light/70 transition hover:text-brand-purple-light">
                            <Globe className="h-3 w-3 shrink-0" />
                            <span className="max-w-[120px] truncate">{lead.website.replace(/^https?:\/\//, "")}</span>
                          </a>
                        ) : (
                          <span className="font-inter text-xs text-white/20">—</span>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-3">
                        {lead.rating ? (
                          <span className="flex items-center gap-1 font-inter text-xs text-white/50">
                            <Star className="h-3 w-3 text-amber-400/70" />
                            {lead.rating}
                            <span className="text-white/25">({lead.reviewCount ?? 0})</span>
                          </span>
                        ) : (
                          <span className="font-inter text-xs text-white/20">—</span>
                        )}
                      </td>

                      {/* Address */}
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 font-inter text-xs text-white/40">
                          <MapPin className="h-3 w-3 shrink-0 text-white/20" />
                          <span className="max-w-[180px] truncate">{lead.address}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusCell lead={lead} />
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Row count footer */}
          <div className="border-t border-white/[0.04] bg-white/[0.01] px-4 py-2.5">
            <p className="font-inter text-xs text-white/20">
              {leads.length} row{leads.length !== 1 ? "s" : ""} {search || statusFilter !== "all" ? "filtered" : ""}
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
