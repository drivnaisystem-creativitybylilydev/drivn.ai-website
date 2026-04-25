"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Building2, Briefcase, Calendar, Pencil } from "lucide-react";
import type { ClientRow, ClientStatus } from "@/lib/client-db";
import { cn } from "@/lib/utils";
import { HudBrackets } from "@/components/admin/hud-primitives";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { editClientAction } from "@/app/admin/clients/actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const STATUS_META: Record<
  ClientStatus,
  { label: string; dot: string; badge: string; text: string }
> = {
  active: {
    label: "Active",
    dot: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]",
    badge: "border-emerald-400/30 bg-emerald-400/10",
    text: "text-emerald-400",
  },
  prospect: {
    label: "Prospect",
    dot: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]",
    badge: "border-amber-400/30 bg-amber-400/10",
    text: "text-amber-400",
  },
  proposal: {
    label: "Proposal",
    dot: "bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.7)]",
    badge: "border-sky-400/30 bg-sky-400/10",
    text: "text-sky-400",
  },
  paused: {
    label: "Paused",
    dot: "bg-white/30",
    badge: "border-white/15 bg-white/5",
    text: "text-white/40",
  },
  churned: {
    label: "Churned",
    dot: "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.7)]",
    badge: "border-red-400/30 bg-red-400/10",
    text: "text-red-400",
  },
};

function StatusBadge({ status }: { status: ClientStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-sora text-[0.62rem] font-bold uppercase tracking-wider",
        meta.badge,
        meta.text
      )}
    >
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

const FIELD_CLS =
  "w-full rounded-xl border border-white/10 bg-black/25 px-4 py-2.5 font-inter text-sm text-white outline-none placeholder:text-white/25 transition focus:border-brand-purple/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)]";

function ClientForm({
  defaultValues,
  pending,
}: {
  defaultValues?: Partial<ClientRow>;
  pending: boolean;
}) {
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1.5 block font-inter text-[0.68rem] font-semibold uppercase tracking-wider text-white/50">
            Client Name *
          </span>
          <input
            name="name"
            required
            defaultValue={defaultValues?.name}
            placeholder="Acme Corp"
            className={FIELD_CLS}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-inter text-[0.68rem] font-semibold uppercase tracking-wider text-white/50">
            Industry
          </span>
          <input
            name="industry"
            defaultValue={defaultValues?.industry}
            placeholder="Real Estate"
            className={FIELD_CLS}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1.5 block font-inter text-[0.68rem] font-semibold uppercase tracking-wider text-white/50">
            Contact Name
          </span>
          <input
            name="contactName"
            defaultValue={defaultValues?.contactName}
            placeholder="John Smith"
            className={FIELD_CLS}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-inter text-[0.68rem] font-semibold uppercase tracking-wider text-white/50">
            Contact Email
          </span>
          <input
            name="contactEmail"
            type="email"
            defaultValue={defaultValues?.contactEmail}
            placeholder="john@acme.com"
            className={FIELD_CLS}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1.5 block font-inter text-[0.68rem] font-semibold uppercase tracking-wider text-white/50">
            Status
          </span>
          <select
            name="status"
            defaultValue={defaultValues?.status ?? "prospect"}
            className={cn(FIELD_CLS, "cursor-pointer")}
          >
            <option value="prospect">Prospect</option>
            <option value="proposal">Proposal</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="churned">Churned</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block font-inter text-[0.68rem] font-semibold uppercase tracking-wider text-white/50">
            MRR (USD)
          </span>
          <input
            name="mrr"
            type="number"
            min="0"
            defaultValue={defaultValues?.mrr ?? 0}
            placeholder="2000"
            className={FIELD_CLS}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block font-inter text-[0.68rem] font-semibold uppercase tracking-wider text-white/50">
          Services (comma-separated)
        </span>
        <input
          name="services"
          defaultValue={defaultValues?.services?.join(", ")}
          placeholder="Speed-to-Lead, AI Audit"
          className={FIELD_CLS}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block font-inter text-[0.68rem] font-semibold uppercase tracking-wider text-white/50">
          Notes
        </span>
        <textarea
          name="notes"
          rows={3}
          defaultValue={defaultValues?.notes}
          placeholder="Context, next steps, anything relevant..."
          className={cn(FIELD_CLS, "resize-none")}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-gradient-to-r from-violet-900 via-brand-purple to-violet-800 py-3 font-sora text-sm font-bold text-white shadow-[0_0_24px_-4px_rgba(139,92,246,0.6)] transition hover:brightness-110 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Client"}
      </button>
    </div>
  );
}

export function ClientDetailView({ client }: { client: ClientRow }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleEditSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await editClientAction(client.id, formData);
      if (res.error) {
        setError(res.error);
        return;
      }
      setEditOpen(false);
      router.refresh();
    });
  };

  return (
    <div className="relative min-h-svh overflow-hidden bg-brand-dark text-white">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-20%,rgba(139,92,246,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_90%_60%,rgba(167,139,250,0.08),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 pb-16 pt-8 md:px-8">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Link
            href="/admin/clients"
            className="inline-flex items-center gap-2 text-sm text-brand-purple-light hover:text-white transition mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
        >
          <div className="flex-1">
            <StatusBadge status={client.status} />
            <h1 className="mt-3 bg-gradient-to-r from-white via-white to-brand-purple-light bg-clip-text font-sora text-4xl font-bold text-transparent">
              {client.name}
            </h1>
            {client.industry && (
              <p className="mt-2 font-inter text-white/50">{client.industry}</p>
            )}
          </div>

          {client.mrr > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="shrink-0 rounded-xl border border-brand-purple/25 bg-brand-purple/[0.08] px-6 py-4 shadow-[0_0_16px_-4px_rgba(139,92,246,0.4)]"
            >
              <p className="font-sora text-[0.6rem] font-bold uppercase tracking-wider text-brand-purple-light/70">
                MRR
              </p>
              <p className="mt-1 font-mono text-3xl font-bold text-white">
                ${client.mrr.toLocaleString()}
              </p>
              <p className="font-inter text-[0.65rem] text-white/30">/month</p>
            </motion.div>
          )}
        </motion.div>

        {/* Details grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 grid gap-4 md:grid-cols-2"
        >
          {/* Contact Info */}
          {(client.contactName || client.contactEmail) && (
            <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
              <HudBrackets color="rgba(139,92,246,0.25)" size={8} />
              <p className="mb-3 font-sora text-xs font-bold uppercase tracking-[0.15em] text-white/40">
                Contact Info
              </p>
              <div className="relative space-y-2">
                {client.contactName && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-4 w-4 shrink-0 text-white/30 mt-0.5" />
                    <div>
                      <p className="text-xs text-white/40">Name</p>
                      <p className="font-inter text-white">{client.contactName}</p>
                    </div>
                  </div>
                )}
                {client.contactEmail && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 shrink-0 text-white/30 mt-0.5" />
                    <div>
                      <p className="text-xs text-white/40">Email</p>
                      <p className="font-mono text-sm text-white">{client.contactEmail}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Services */}
          {client.services.length > 0 && (
            <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
              <HudBrackets color="rgba(139,92,246,0.25)" size={8} />
              <p className="mb-3 font-sora text-xs font-bold uppercase tracking-[0.15em] text-white/40">
                Services
              </p>
              <div className="relative flex flex-wrap gap-2">
                {client.services.map((s) => (
                  <span key={s} className="rounded-full border border-brand-purple/30 bg-brand-purple/10 px-3 py-1.5 font-inter text-xs text-brand-purple-light">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
            <HudBrackets color="rgba(139,92,246,0.25)" size={8} />
            <p className="mb-3 font-sora text-xs font-bold uppercase tracking-[0.15em] text-white/40">
              Timeline
            </p>
            <div className="relative space-y-2">
              {client.startDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 shrink-0 text-white/30 mt-0.5" />
                  <div>
                    <p className="text-xs text-white/40">Start Date</p>
                    <p className="font-inter text-sm text-white">
                      {new Date(client.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 shrink-0 text-white/30 mt-0.5" />
                <div>
                  <p className="text-xs text-white/40">Added</p>
                  <p className="font-inter text-sm text-white">
                    {new Date(client.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notes */}
        {client.notes && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8 relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-5"
          >
            <HudBrackets color="rgba(139,92,246,0.25)" size={8} />
            <p className="mb-3 font-sora text-xs font-bold uppercase tracking-[0.15em] text-white/40">
              Notes
            </p>
            <p className="relative font-inter text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
              {client.notes}
            </p>
          </motion.div>
        )}

        {/* Edit button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <button
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-900 via-brand-purple to-violet-800 px-5 py-2.5 font-sora text-sm font-bold text-white shadow-[0_0_24px_-4px_rgba(139,92,246,0.65)] transition hover:brightness-110 active:scale-[0.98]"
          >
            <Pencil className="h-4 w-4" />
            Edit Client
          </button>
        </motion.div>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="border-brand-purple/20 bg-[#07071a] shadow-[0_0_80px_-20px_rgba(139,92,246,0.5),inset_0_1px_0_0_rgba(167,139,250,0.1)]">
          <DialogHeader>
            <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand-purple-light/80">
              Drivn · Clients
            </p>
            <DialogTitle className="bg-gradient-to-r from-white to-brand-purple-light bg-clip-text text-transparent">
              Edit Client
            </DialogTitle>
          </DialogHeader>
          {error && (
            <p className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}
          <form action={handleEditSubmit}>
            <ClientForm defaultValues={client} pending={pending} />
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
