"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Briefcase,
  DollarSign,
  TrendingUp,
  Users2,
  X,
  ChevronRight,
  Mail,
  Pencil,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ClientRow, ClientStatus } from "@/lib/client-db";
import { addClientAction, editClientAction } from "@/app/admin/clients/actions";

// ─── Design primitives ──────────────────────────────────────────────────────

function HudBrackets({ color = "rgba(139,92,246,0.45)", size = 10 }: { color?: string; size?: number }) {
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

function ScanLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 z-20 h-px bg-gradient-to-r from-transparent via-brand-purple/60 to-transparent"
      initial={{ top: 0, opacity: 0 }}
      animate={{ top: "100%", opacity: [0, 0.9, 0.9, 0] }}
      transition={{ duration: 1.4, ease: "linear", delay, times: [0, 0.05, 0.95, 1] }}
    />
  );
}

function AnimatedNumber({
  to,
  prefix = "",
  suffix = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let start: number | null = null;
    const duration = 1400;
    function step(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * to);
      node!.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, prefix, suffix]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

const STATUS_META: Record<
  ClientStatus,
  { label: string; dot: string; badge: string; text: string }
> = {
  active:   { label: "Active",   dot: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]", badge: "border-emerald-400/30 bg-emerald-400/10", text: "text-emerald-400" },
  prospect: { label: "Prospect", dot: "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]",   badge: "border-amber-400/30 bg-amber-400/10",   text: "text-amber-400" },
  proposal: { label: "Proposal", dot: "bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.7)]",     badge: "border-sky-400/30 bg-sky-400/10",       text: "text-sky-400" },
  paused:   { label: "Paused",   dot: "bg-white/30",                                           badge: "border-white/15 bg-white/5",            text: "text-white/40" },
  churned:  { label: "Churned",  dot: "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.7)]",    badge: "border-red-400/30 bg-red-400/10",       text: "text-red-400" },
};

function StatusPip({ status }: { status: ClientStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      {status === "active" && (
        <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", meta.dot)} />
      )}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", meta.dot)} />
    </span>
  );
}

function StatusBadge({ status }: { status: ClientStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-sora text-[0.62rem] font-bold uppercase tracking-wider", meta.badge, meta.text)}>
      <StatusPip status={status} />
      {meta.label}
    </span>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  delay = 0,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  sub?: string;
  delay?: number;
  accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-xl border p-4",
        accent
          ? "border-brand-purple/30 bg-brand-purple/[0.07] shadow-[0_0_32px_-8px_rgba(139,92,246,0.3)]"
          : "border-white/[0.08] bg-white/[0.02]",
      )}
    >
      <ScanLine delay={delay + 0.1} />
      <HudBrackets color={accent ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.15)"} />
      <div className="flex items-start justify-between">
        <p className="font-sora text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/40">
          {label}
        </p>
        <Icon className={cn("h-3.5 w-3.5", accent ? "text-brand-purple-light/70" : "text-white/25")} />
      </div>
      <p className={cn("mt-2 font-mono text-2xl font-bold tabular-nums", accent ? "text-white" : "text-white")}>
        {accent && "$"}
        <AnimatedNumber to={value} />
        {accent && <span className="ml-1 text-sm text-white/40">/mo</span>}
      </p>
      {sub && <p className="mt-1 font-inter text-[0.68rem] text-white/35">{sub}</p>}
    </motion.div>
  );
}

// ─── Client card ─────────────────────────────────────────────────────────────

function ClientCard({
  client,
  index,
  onEdit,
}: {
  client: ClientRow;
  index: number;
  onEdit: (c: ClientRow) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-colors hover:border-brand-purple/20 hover:bg-white/[0.04]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 120% 80% at 50% -10%, rgba(139,92,246,0.05), transparent 60%)",
      }}
    >
      {/* Subtle grid bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <HudBrackets color="rgba(139,92,246,0.25)" size={8} />

      <div className="relative space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <StatusBadge status={client.status} />
            <h3 className="mt-2 truncate bg-gradient-to-r from-white to-brand-purple-light/80 bg-clip-text font-sora text-lg font-bold text-transparent">
              {client.name}
            </h3>
            {client.industry && (
              <p className="mt-0.5 font-inter text-xs text-white/40">{client.industry}</p>
            )}
          </div>

          {/* MRR */}
          {client.mrr > 0 && (
            <div className="shrink-0 rounded-xl border border-brand-purple/25 bg-brand-purple/[0.08] px-3 py-2 text-right shadow-[0_0_16px_-4px_rgba(139,92,246,0.4)]">
              <p className="font-sora text-[0.55rem] font-bold uppercase tracking-wider text-brand-purple-light/70">
                MRR
              </p>
              <p className="font-mono text-base font-bold text-white">
                ${client.mrr.toLocaleString()}
              </p>
              <p className="font-inter text-[0.6rem] text-white/30">/mo</p>
            </div>
          )}
        </div>

        {/* Contact */}
        {client.contactEmail && (
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Mail className="h-3 w-3 shrink-0 text-white/25" />
            <span className="truncate font-mono">{client.contactEmail}</span>
          </div>
        )}

        {/* Services */}
        {client.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {client.services.map((s) => (
              <span
                key={s}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-inter text-[0.62rem] text-white/50"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Notes */}
        {client.notes && (
          <p className="line-clamp-2 font-inter text-xs leading-relaxed text-white/35">
            {client.notes}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <p className="font-mono text-[0.6rem] text-white/20">
            {new Date(client.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </p>
          <button
            onClick={() => onEdit(client)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-inter text-xs text-white/50 opacity-0 transition-all group-hover:opacity-100 hover:border-brand-purple/30 hover:text-brand-purple-light"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Client form (shared for add + edit) ─────────────────────────────────────

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

// ─── Dialogs ─────────────────────────────────────────────────────────────────

function AddClientDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await addClientAction(formData);
      if (res.error) { setError(res.error); return; }
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClose={() => onOpenChange(false)}
        className="border-brand-purple/20 bg-[#07071a] shadow-[0_0_80px_-20px_rgba(139,92,246,0.5),inset_0_1px_0_0_rgba(167,139,250,0.1)]"
      >
        <DialogHeader>
          <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.2em] text-brand-purple-light/80">
            Drivn · Clients
          </p>
          <DialogTitle className="bg-gradient-to-r from-white to-brand-purple-light bg-clip-text text-transparent">
            Add New Client
          </DialogTitle>
        </DialogHeader>
        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}
        <form action={handleSubmit}>
          <ClientForm pending={pending} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditClientDialog({
  client,
  onClose,
}: {
  client: ClientRow | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (!client) setError(null); }, [client]);

  function handleSubmit(formData: FormData) {
    if (!client) return;
    setError(null);
    startTransition(async () => {
      const res = await editClientAction(client.id, formData);
      if (res.error) { setError(res.error); return; }
      onClose();
      router.refresh();
    });
  }

  return (
    <Dialog open={!!client} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        onClose={onClose}
        className="border-brand-purple/20 bg-[#07071a] shadow-[0_0_80px_-20px_rgba(139,92,246,0.5),inset_0_1px_0_0_rgba(167,139,250,0.1)]"
      >
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
        <form action={handleSubmit}>
          <ClientForm defaultValues={client ?? undefined} pending={pending} />
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export function ClientsDashboard({ clients }: { clients: ClientRow[] }) {
  const [addOpen, setAddOpen] = useState(false);
  const [editClient, setEditClient] = useState<ClientRow | null>(null);

  const active = clients.filter((c) => c.status === "active");
  const totalMrr = active.reduce((sum, c) => sum + c.mrr, 0);
  const pipeline = clients.filter((c) => c.status === "prospect" || c.status === "proposal");

  return (
    <div className="relative min-h-svh overflow-hidden bg-brand-dark text-white">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-20%,rgba(139,92,246,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_90%_60%,rgba(167,139,250,0.08),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 pb-16 pt-8 md:px-8">

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col gap-4 border-b border-white/[0.07] pb-6 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.22em] text-brand-purple-light/80">
              Drivn.AI OS · Clients
            </p>
            <h1 className="mt-1 bg-gradient-to-r from-white via-white to-brand-purple-light bg-clip-text font-sora text-2xl font-bold tracking-tight text-transparent md:text-3xl">
              Client Roster
            </h1>
            <p className="mt-1 font-inter text-sm text-white/40">
              {clients.length} client{clients.length !== 1 ? "s" : ""} tracked ·{" "}
              {active.length} active
            </p>
          </div>

          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 self-start rounded-xl bg-gradient-to-r from-violet-900 via-brand-purple to-violet-800 px-5 py-2.5 font-sora text-sm font-bold text-white shadow-[0_0_24px_-4px_rgba(139,92,246,0.65)] transition hover:brightness-110 hover:shadow-[0_0_32px_-2px_rgba(167,139,250,0.45)] active:scale-[0.98] md:self-auto"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </button>
        </motion.header>

        {/* ── Stats ── */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={DollarSign} label="Monthly Revenue" value={totalMrr} sub="active clients" delay={0} accent />
          <StatCard icon={Briefcase} label="Active Clients" value={active.length} sub="on retainer" delay={0.06} />
          <StatCard icon={Users2} label="Total Clients" value={clients.length} sub="all time" delay={0.12} />
          <StatCard icon={TrendingUp} label="In Pipeline" value={pipeline.length} sub="prospect + proposal" delay={0.18} />
        </div>

        {/* ── Client grid ── */}
        {clients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-8 py-24 text-center"
          >
            <div className="mb-4 rounded-2xl border border-brand-purple/30 bg-brand-purple/10 p-4">
              <Briefcase className="h-8 w-8 text-brand-purple-light" />
            </div>
            <p className="font-sora text-lg font-semibold text-white/80">No clients yet</p>
            <p className="mt-2 max-w-xs font-inter text-sm text-white/35">
              Add your first client to start tracking MRR and managing your roster.
            </p>
            <button
              onClick={() => setAddOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-brand-purple/30 bg-brand-purple/10 px-5 py-2.5 font-sora text-sm font-semibold text-brand-purple-light transition hover:bg-brand-purple/20"
            >
              <Plus className="h-4 w-4" />
              Add First Client
            </button>
          </motion.div>
        ) : (
          <>
            {/* Active first */}
            {active.length > 0 && (
              <section className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                  <p className="font-sora text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/40">
                    Active
                  </p>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <span className="font-mono text-xs text-white/25">{active.length}</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {active.map((c, i) => (
                    <ClientCard key={c.id} client={c} index={i} onEdit={setEditClient} />
                  ))}
                </div>
              </section>
            )}

            {/* Pipeline */}
            {pipeline.length > 0 && (
              <section className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                  <p className="font-sora text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/40">
                    Pipeline
                  </p>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <span className="font-mono text-xs text-white/25">{pipeline.length}</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {pipeline.map((c, i) => (
                    <ClientCard key={c.id} client={c} index={active.length + i} onEdit={setEditClient} />
                  ))}
                </div>
              </section>
            )}

            {/* Other statuses */}
            {clients.filter((c) => c.status === "paused" || c.status === "churned").length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <p className="font-sora text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/40">
                    Other
                  </p>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {clients
                    .filter((c) => c.status === "paused" || c.status === "churned")
                    .map((c, i) => (
                      <ClientCard key={c.id} client={c} index={active.length + pipeline.length + i} onEdit={setEditClient} />
                    ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Dialogs */}
      <AddClientDialog open={addOpen} onOpenChange={setAddOpen} />
      <EditClientDialog client={editClient} onClose={() => setEditClient(null)} />
    </div>
  );
}
