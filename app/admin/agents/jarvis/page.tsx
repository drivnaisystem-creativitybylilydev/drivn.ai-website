import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { JarvisChat } from "@/components/admin/JarvisChat";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import { HudBrackets } from "@/components/admin/hud-primitives";

export const dynamic = "force-dynamic";

export default async function JarvisPage() {
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    return <AdminLoginPanel />;
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-brand-dark text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-20%,rgba(139,92,246,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_90%_60%,rgba(56,189,248,0.05),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 border-b border-white/[0.07] pb-6">
          <Link href="/admin/agents" className="mb-4 inline-flex items-center gap-2 text-brand-purple-light hover:text-brand-purple transition">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Agents</span>
          </Link>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand-purple/50 bg-brand-purple/20 shadow-[0_0_16px_-4px_rgba(139,92,246,0.8)]">
              <Zap className="h-6 w-6 text-brand-purple-light" />
            </div>
            <div className="flex-1">
              <h1 className="font-sora text-3xl font-bold text-white">JARVIS</h1>
              <p className="mt-1 font-inter text-sm text-white/60">
                AI Chief of Staff — Strategic business advisor for Drivn.AI
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="relative overflow-hidden rounded-2xl border border-brand-purple/40 bg-brand-purple/[0.08] p-6">
            <HudBrackets color="rgba(139,92,246,0.3)" size={8} />
            <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/40">Status</p>
            <p className="mt-2 font-sora text-2xl font-bold text-emerald-400">Active</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-brand-purple/40 bg-brand-purple/[0.08] p-6">
            <HudBrackets color="rgba(139,92,246,0.3)" size={8} />
            <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/40">Model</p>
            <p className="mt-2 font-sora text-2xl font-bold text-brand-purple-light">Haiku</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-brand-purple/40 bg-brand-purple/[0.08] p-6">
            <HudBrackets color="rgba(139,92,246,0.3)" size={8} />
            <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/40">Cost/Query</p>
            <p className="mt-2 font-sora text-2xl font-bold text-brand-purple-light">~$0.04</p>
          </div>
        </div>

        {/* Topics Section */}
        <div className="mb-8">
          <h2 className="mb-6 font-sora text-xl font-bold text-white">Topics Jarvis Handles Well</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <HudBrackets color="rgba(255,255,255,0.06)" size={6} />
              <div className="font-sora font-semibold text-white">Client Decisions</div>
              <p className="mt-1 font-inter text-xs text-white/60">Should I take this client? What price?</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <HudBrackets color="rgba(255,255,255,0.06)" size={6} />
              <div className="font-sora font-semibold text-white">Revenue Strategy</div>
              <p className="mt-1 font-inter text-xs text-white/60">How to hit $1K MRR goal?</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <HudBrackets color="rgba(255,255,255,0.06)" size={6} />
              <div className="font-sora font-semibold text-white">Pricing & ROI</div>
              <p className="mt-1 font-inter text-xs text-white/60">How do I justify this price?</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <HudBrackets color="rgba(255,255,255,0.06)" size={6} />
              <div className="font-sora font-semibold text-white">Build Planning</div>
              <p className="mt-1 font-inter text-xs text-white/60">What agent should I build next?</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <HudBrackets color="rgba(255,255,255,0.06)" size={6} />
              <div className="font-sora font-semibold text-white">Risk Assessment</div>
              <p className="mt-1 font-inter text-xs text-white/60">What could go wrong with X?</p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
              <HudBrackets color="rgba(255,255,255,0.06)" size={6} />
              <div className="font-sora font-semibold text-white">Progress Reviews</div>
              <p className="mt-1 font-inter text-xs text-white/60">How are we doing vs goals?</p>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="mb-8">
          <h2 className="mb-4 font-sora text-xl font-bold text-white">Ask Jarvis</h2>
          <JarvisChat />
        </div>

        {/* How It Works */}
        <div className="relative overflow-hidden rounded-2xl border border-brand-purple/30 bg-brand-purple/[0.05] p-6">
          <HudBrackets color="rgba(139,92,246,0.2)" size={8} />
          <h3 className="font-sora text-lg font-bold text-white mb-4">How Jarvis Works</h3>
          <ul className="space-y-3 font-inter text-sm text-white/70">
            <li>Jarvis reads all your KB files every conversation</li>
            <li>Conversation history is saved and remembered</li>
            <li>Key decisions and metrics are extracted and stored</li>
            <li>All advice is quantified with ROI math</li>
            <li>Jarvis will challenge weak assumptions and flag risks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
