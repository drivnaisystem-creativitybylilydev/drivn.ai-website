"use client";

import { useState, useTransition } from "react";
import { Check, Phone, Mail, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateLeadStatusAction, bulkUpdateStatusAction, updateLeadNotesAction } from "@/app/admin/sourced-leads/actions";
import type { SourcedLeadRow, SourcedLeadStatus } from "@/lib/sourced-lead-db";

const STATUS_META: Record<SourcedLeadStatus, { label: string; color: string; bg: string }> = {
  new:       { label: "New",       color: "text-brand-purple-light", bg: "bg-brand-purple/10" },
  called:    { label: "Called",    color: "text-amber-400",          bg: "bg-amber-400/10" },
  booked:    { label: "Booked",    color: "text-emerald-400",        bg: "bg-emerald-400/10" },
  converted: { label: "Converted", color: "text-emerald-300",        bg: "bg-emerald-300/10" },
  dismissed: { label: "Dismissed", color: "text-white/25",           bg: "bg-white/5" },
};

export function LeadsList({ leads }: { leads: SourcedLeadRow[] }) {
  const [pending, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState<SourcedLeadStatus | "all">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});

  const filteredLeads = statusFilter === "all"
    ? leads
    : leads.filter(l => l.status === statusFilter);

  const handleSelectAll = () => {
    if (selectedIds.size === filteredLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkStatus = (status: SourcedLeadStatus) => {
    startTransition(async () => {
      await bulkUpdateStatusAction(Array.from(selectedIds), status);
      setSelectedIds(new Set());
    });
  };

  const handleStatusChange = (id: string, status: SourcedLeadStatus) => {
    startTransition(async () => {
      await updateLeadStatusAction(id, status);
    });
  };

  const handleNotesChange = (id: string, notes: string) => {
    setEditingNotes(prev => ({ ...prev, [id]: notes }));
  };

  const handleNotesSave = (id: string) => {
    startTransition(async () => {
      await updateLeadNotesAction(id, editingNotes[id] || "");
      setEditingNotes(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      {/* Filter and bulk actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-white/50" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SourcedLeadStatus | "all")}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-inter text-sm text-white transition focus:border-brand-purple/50 focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="called">Called</option>
            <option value="booked">Booked</option>
            <option value="converted">Converted</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>

        {selectedIds.size > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-white/60">{selectedIds.size} selected</span>
            <button
              onClick={() => handleBulkStatus("called")}
              disabled={pending}
              className="rounded-lg bg-amber-500/20 px-3 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-500/30 disabled:opacity-50"
            >
              Mark Called
            </button>
            <button
              onClick={() => handleBulkStatus("dismissed")}
              disabled={pending}
              className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white/60 transition hover:bg-white/20 disabled:opacity-50"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th className="w-8 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredLeads.length && filteredLeads.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-white/20 bg-white/5"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white/60">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white/60">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white/60">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white/60">Score</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white/60">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white/60">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLeads.map((lead) => {
              const statusMeta = STATUS_META[lead.status] || STATUS_META.new;
              return (
                <tr key={lead.id} className="hover:bg-white/[0.02] transition">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(lead.id)}
                      onChange={() => handleSelect(lead.id)}
                      className="h-4 w-4 rounded border-white/20 bg-white/5"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-inter text-sm text-white font-medium">{lead.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-inter text-sm text-white/70">{lead.category}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {lead.phone && (
                        <button
                          onClick={() => copyToClipboard(lead.phone!)}
                          title={lead.phone}
                          className="text-white/40 hover:text-white/60 transition"
                        >
                          <Phone className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {lead.email && (
                        <button
                          onClick={() => copyToClipboard(lead.email!)}
                          title={lead.email}
                          className="text-white/40 hover:text-white/60 transition"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-mono text-sm font-bold text-white/70">{lead.score}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as SourcedLeadStatus)}
                      disabled={pending}
                      className={cn(
                        "rounded-lg px-2 py-1 font-inter text-xs font-semibold transition",
                        "border border-current/30 bg-current/10",
                        statusMeta.color,
                        statusMeta.bg,
                        "disabled:opacity-50"
                      )}
                    >
                      <option value="new">New</option>
                      <option value="called">Called</option>
                      <option value="booked">Booked</option>
                      <option value="converted">Converted</option>
                      <option value="dismissed">Dismissed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    {editingNotes[lead.id] !== undefined ? (
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={editingNotes[lead.id]}
                          onChange={(e) => handleNotesChange(lead.id, e.target.value)}
                          placeholder="Add notes..."
                          className="flex-1 rounded border border-white/20 bg-white/5 px-2 py-1 font-inter text-xs text-white placeholder-white/30"
                        />
                        <button
                          onClick={() => handleNotesSave(lead.id)}
                          disabled={pending}
                          className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => setEditingNotes(prev => ({ ...prev, [lead.id]: lead.notes || "" }))}
                        className="font-inter text-xs text-white/50 cursor-pointer hover:text-white/70 transition truncate"
                      >
                        {lead.notes || "—"}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredLeads.length === 0 && (
        <div className="flex items-center justify-center rounded-2xl border border-white/10 py-12">
          <p className="font-inter text-sm text-white/40">No leads found</p>
        </div>
      )}
    </div>
  );
}
