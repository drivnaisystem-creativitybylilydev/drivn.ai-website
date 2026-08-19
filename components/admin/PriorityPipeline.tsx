"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Phone, Globe, Star, ChevronDown, Pin, Mail, User, Search, X, StickyNote, Plus, PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";
import { HudBrackets } from "@/components/admin/hud-primitives";
import { AddBusinessModal } from "@/components/admin/AddBusinessModal";
import { updateLeadStatusAction } from "@/app/admin/sourced-leads/actions";
import type { SourcedLeadRow, SourcedLeadStatus } from "@/lib/sourced-lead-db";
import { parseLeadNotes, getLeadChannel, CHANNEL_META } from "@/lib/pipeline-lead-utils";

const STATUS_META: Record<SourcedLeadStatus, { label: string; color: string; bg: string; border: string }> = {
  new: { label: "New", color: "text-brand-purple-light", bg: "bg-brand-purple/10", border: "border-brand-purple/30" },
  emailed: { label: "Emailed", color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/30" },
  called: { label: "Called", color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30" },
  booked: { label: "Booked", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/30" },
  converted: { label: "Converted", color: "text-emerald-300", bg: "bg-emerald-300/10", border: "border-emerald-300/30" },
  dismissed: { label: "Dismissed", color: "text-white/25", bg: "bg-white/5", border: "border-white/10" },
};
const STATUS_FLOW: SourcedLeadStatus[] = ["new", "emailed", "called", "booked", "converted", "dismissed"];

const parseNotes = parseLeadNotes;
const getChannel = getLeadChannel;

function StatusPill({ leadId, status }: { leadId: string; status: SourcedLeadStatus }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState(status);
  const meta = STATUS_META[current] ?? STATUS_META.new;

  function handleSelect(s: SourcedLeadStatus) {
    setOpen(false);
    if (s === current) return;
    setCurrent(s);
    startTransition(async () => {
      await updateLeadStatusAction(leadId, s);
    });
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={pending}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-inter text-xs font-semibold transition whitespace-nowrap",
          meta.border, meta.bg, meta.color, pending && "opacity-50",
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", meta.color.replace("text-", "bg-"))} />
        {meta.label}
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1.5 w-36 overflow-hidden rounded-xl border border-white/[0.08] bg-[#12122A] shadow-2xl">
          {STATUS_FLOW.map((s) => {
            const m = STATUS_META[s];
            return (
              <button
                key={s}
                onClick={() => handleSelect(s)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left font-inter text-xs transition",
                  s === current ? cn("font-semibold", m.bg, m.color) : "text-white/50 hover:bg-white/[0.04] hover:text-white/70",
                )}
              >
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", s === current ? m.color.replace("text-", "bg-") : "bg-white/20")} />
                {m.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LeadTableRow({ lead, index }: { lead: SourcedLeadRow; index: number }) {
  const { painPoint, offerFit, owner, extra } = parseNotes(lead.notes);
  const researched = Boolean(painPoint || offerFit);
  const channel = getChannel(lead);
  const cMeta = CHANNEL_META[channel];
  const CIcon = cMeta.icon;

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.015, 0.4) }}
      className={cn(
        "border-b border-white/[0.05] align-top",
        lead.status === "dismissed" && "opacity-40",
        lead.legendary && "legendary-row",
        lead.hotLead && "outline outline-2 -outline-offset-1 outline-orange-500/70 bg-orange-500/[0.05]",
      )}
    >
      <td className={cn("py-3 pr-4", lead.legendary && "legendary-td")}>
        {lead.legendary && (
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="legendary-badge mb-1.5 flex w-fit items-center gap-1 rounded-full border border-amber-400/50 bg-black/30 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider"
          >
            <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
            Legendary Lead
          </motion.div>
        )}
        {lead.dogGroomer && (
          <div className="paw-badge mb-1.5 flex w-fit items-center gap-1 rounded-full border border-orange-400/50 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-orange-200">
            <motion.span
              animate={{ rotate: [0, -18, 14, -8, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
              className="flex"
            >
              <PawPrint className="h-3 w-3 shrink-0 fill-orange-300 text-orange-200" />
            </motion.span>
            Dog Groomer
          </div>
        )}
        <p className="flex items-center gap-1.5 font-sora text-sm font-semibold text-white">
          {lead.priority && (
            <span title="Manually checked by Finn" className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-400/15">
              <Pin className="h-2.5 w-2.5 text-amber-400" />
            </span>
          )}
          {lead.name}
        </p>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 font-inter text-[0.7rem] text-white/35">
          {lead.phone && (
            <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-white/60">
              <Phone className="h-3 w-3" />{lead.phone}
            </a>
          )}
          {lead.website && (
            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-brand-purple-light">
              <Globe className="h-3 w-3" />site
            </a>
          )}
          {lead.email && (
            <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-brand-purple-light">
              <Mail className="h-3 w-3" />{lead.email}
            </a>
          )}
          {lead.rating && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-400/70" />{lead.rating} ({lead.reviewCount ?? 0})
            </span>
          )}
        </div>
        {owner && (
          <div className="mt-1 flex items-center gap-1 font-inter text-[0.7rem] text-white/30">
            <User className="h-3 w-3" />{owner}
          </div>
        )}
      </td>
      <td className={cn("py-3 pr-4 max-w-[240px]", lead.legendary && "legendary-td")}>
        {painPoint ? (
          <p className="font-inter text-xs text-white/60">{painPoint}</p>
        ) : (
          <span className="rounded-full border border-amber-400/25 bg-amber-400/[0.06] px-2 py-0.5 font-inter text-[0.65rem] text-amber-400/70">
            not yet researched
          </span>
        )}
        {extra && (
          <p className="mt-1 flex items-start gap-1 font-inter text-[0.7rem] italic text-sky-300/70">
            <StickyNote className="mt-0.5 h-3 w-3 shrink-0" />
            {extra}
          </p>
        )}
      </td>
      <td className={cn("py-3 pr-4 max-w-[240px]", lead.legendary && "legendary-td")}>
        {offerFit ? (
          <p className="font-inter text-xs font-semibold text-white/85">{offerFit}</p>
        ) : (
          <span className="font-inter text-xs text-white/20">—</span>
        )}
      </td>
      <td className={cn("py-3 pr-4", lead.legendary && "legendary-td")}>
        <span className={cn("flex w-fit items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-inter text-xs font-semibold whitespace-nowrap", cMeta.border, cMeta.bg, cMeta.color)}>
          <CIcon className="h-3 w-3" />
          {cMeta.label}
        </span>
      </td>
      <td className={cn("py-3 pr-2", lead.legendary && "legendary-td")}>
        <StatusPill leadId={lead.id} status={lead.status} />
      </td>
    </motion.tr>
  );
}

function NicheSection({ niche, leads, defaultCollapsed }: { niche: string; leads: SourcedLeadRow[]; defaultCollapsed?: boolean }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed ?? false);
  const researchedCount = leads.filter((l) => {
    const { painPoint, offerFit } = parseNotes(l.notes);
    return Boolean(painPoint || offerFit);
  }).length;
  const contactedCount = leads.filter((l) => l.status !== "new").length;
  const emailCount = leads.filter((l) => getChannel(l) === "email").length;
  const callCount = leads.length - emailCount;

  return (
    <div className="mb-8">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="mb-3 flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-left transition hover:border-brand-purple/30"
      >
        <div className="flex items-center gap-3">
          <ChevronDown className={cn("h-4 w-4 text-white/30 transition-transform", collapsed && "-rotate-90")} />
          <h2 className="font-sora text-base font-bold text-white">{niche}</h2>
          <span className="font-inter text-xs text-white/30">{leads.length} leads</span>
        </div>
        <div className="flex items-center gap-4 font-inter text-[0.7rem] text-white/40">
          <span>{researchedCount}/{leads.length} researched</span>
          <span className="text-brand-purple-light/70">{emailCount} email-ready</span>
          <span className="text-amber-400/70">{callCount} call-only</span>
          <span>{contactedCount}/{leads.length} contacted</span>
        </div>
      </button>

      {!collapsed && (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          <HudBrackets color="rgba(139,92,246,0.1)" size={6} />
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-left font-inter text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/30">
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Pain Point</th>
                <th className="px-4 py-3 font-medium">Solution / Offer</th>
                <th className="px-4 py-3 font-medium">Channel</th>
                <th className="px-4 py-3 font-medium">Contact Status</th>
              </tr>
            </thead>
            <tbody className="px-4">
              {leads.map((lead, i) => (
                <LeadTableRow key={lead.id} lead={lead} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function PriorityPipeline({ leads, niches }: { leads: SourcedLeadRow[]; niches: string[] }) {
  const [statusFilter, setStatusFilter] = useState<SourcedLeadStatus | "all">("all");
  const [contactFilter, setContactFilter] = useState<"all" | "contacted" | "not_contacted">("all");
  const [channelFilter, setChannelFilter] = useState<"all" | "email" | "call">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const grouped = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return niches.map((niche) => ({
      niche,
      leads: leads
        .filter((l) => l.category === niche)
        .filter((l) => statusFilter === "all" || l.status === statusFilter)
        .filter((l) => contactFilter === "all" || (contactFilter === "contacted" ? l.status !== "new" : l.status === "new"))
        .filter((l) => channelFilter === "all" || getChannel(l) === channelFilter)
        .filter((l) => {
          if (!q) return true;
          const { painPoint, offerFit, owner } = parseNotes(l.notes);
          return [l.name, l.address, painPoint, offerFit, owner].some((f) => f?.toLowerCase().includes(q));
        })
        .sort((a, b) => {
          // priority (manually checked / tab-open) leads always float to the top
          if (Boolean(a.priority) !== Boolean(b.priority)) return a.priority ? -1 : 1;
          // then group email-ready leads ahead of cold-call-only ones
          const ca = getChannel(a), cb = getChannel(b);
          if (ca !== cb) return ca === "email" ? -1 : 1;
          return b.score - a.score;
        }),
    }));
  }, [leads, niches, statusFilter, contactFilter, channelFilter, searchQuery]);

  const COLLAPSED_BY_DEFAULT = new Set(["Roofing Contractor", "Landscaper"]);

  const totalResearched = leads.filter((l) => {
    const { painPoint, offerFit } = parseNotes(l.notes);
    return Boolean(painPoint || offerFit);
  }).length;

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-20 pt-8 md:px-8">
      <style jsx global>{`
        @keyframes legendary-sweep {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @keyframes legendary-pulse {
          0%, 100% { box-shadow: inset 0 0 14px 1px rgba(250, 204, 21, 0.3); }
          50% { box-shadow: inset 0 0 22px 4px rgba(250, 204, 21, 0.65); }
        }
        @keyframes legendary-text-shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        .legendary-row { position: relative; }
        .legendary-td {
          background: linear-gradient(
            120deg,
            rgba(250, 204, 21, 0.12) 0%,
            rgba(249, 115, 22, 0.18) 25%,
            rgba(168, 85, 247, 0.16) 50%,
            rgba(250, 204, 21, 0.12) 75%,
            rgba(249, 115, 22, 0.18) 100%
          );
          background-size: 300% 100%;
          animation: legendary-sweep 4s linear infinite, legendary-pulse 2.4s ease-in-out infinite;
          border-top: 1px solid rgba(250, 204, 21, 0.55) !important;
          border-bottom: 1px solid rgba(250, 204, 21, 0.55) !important;
        }
        .legendary-badge {
          background: linear-gradient(90deg, #facc15, #f97316, #a855f7, #facc15, #f97316);
          background-size: 300% 100%;
          animation: legendary-text-shimmer 1.8s linear infinite;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        @keyframes paw-glow {
          0%, 100% { box-shadow: 0 0 4px 0 rgba(251, 146, 60, 0.35); }
          50% { box-shadow: 0 0 10px 2px rgba(251, 146, 60, 0.7); }
        }
        .paw-badge {
          background: linear-gradient(90deg, rgba(251, 146, 60, 0.22), rgba(217, 119, 6, 0.28));
          animation: paw-glow 2s ease-in-out infinite;
        }
      `}</style>
      <div className="mb-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Link
            href="/admin/sourced-leads"
            className="flex w-fit items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 font-inter text-xs text-white/40 transition hover:border-white/20 hover:text-white/60"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            All sourced leads
          </Link>
          <Link
            href="/admin/sourced-leads/queue"
            className="flex w-fit items-center gap-1.5 rounded-xl border border-brand-purple/30 bg-brand-purple/10 px-3 py-1.5 font-inter text-xs font-medium text-brand-purple-light transition hover:border-brand-purple/50 hover:bg-brand-purple/20"
          >
            This Week&apos;s Outreach Queue →
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex w-fit items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 font-inter text-xs font-semibold text-emerald-300 transition hover:border-emerald-400/50 hover:bg-emerald-400/20"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Lead
          </button>
        </div>
        <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.22em] text-brand-purple-light/80">
          Drivn.AI OS · Active Campaign
        </p>
        <h1 className="mt-1 bg-gradient-to-r from-white via-white to-brand-purple-light bg-clip-text font-sora text-2xl font-bold tracking-tight text-transparent md:text-3xl">
          Priority Pipeline
        </h1>
        <p className="mt-1 font-inter text-sm text-white/40">
          {leads.length} leads across {niches.length} niches · {totalResearched} researched so far
        </p>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search name, town, pain point, owner..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2 pl-9 pr-9 font-inter text-sm text-white placeholder-white/30 transition focus:border-brand-purple/50 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white/60">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mb-2 flex flex-wrap gap-1.5">
        {(["all", "not_contacted", "contacted"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setContactFilter(c)}
            className={cn(
              "rounded-xl border px-3 py-1 font-inter text-xs font-bold transition",
              contactFilter === c
                ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300"
                : "border-white/10 bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/60",
            )}
          >
            {c === "all" ? "All leads" : c === "not_contacted" ? "Not Contacted" : "Contacted"}
          </button>
        ))}
      </div>

      <div className="mb-2 flex flex-wrap gap-1.5">
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
            {s === "all" ? "All" : STATUS_META[s].label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5">
        {(["all", "email", "call"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setChannelFilter(c)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-3 py-1 font-inter text-xs font-medium transition",
              channelFilter === c
                ? "border-brand-purple/50 bg-brand-purple/20 text-brand-purple-light"
                : "border-white/10 bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/60",
            )}
          >
            {c !== "all" && (() => { const Icon = CHANNEL_META[c].icon; return <Icon className="h-3 w-3" />; })()}
            {c === "all" ? "All channels" : CHANNEL_META[c].label}
          </button>
        ))}
      </div>

      {grouped.map(({ niche, leads: nicheLeads }) => (
        <NicheSection key={niche} niche={niche} leads={nicheLeads} defaultCollapsed={COLLAPSED_BY_DEFAULT.has(niche)} />
      ))}

      {showAddModal && (
        <AddBusinessModal preferredNiches={niches} onClose={() => setShowAddModal(false)} onSuccess={() => {}} />
      )}
    </div>
  );
}
