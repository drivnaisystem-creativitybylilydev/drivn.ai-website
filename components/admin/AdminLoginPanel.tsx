import Link from "next/link";
import { Sparkles } from "lucide-react";
import { loginLeadsAdmin } from "@/app/admin/leads/actions";

export function AdminLoginPanel({
  error,
}: {
  error?: "1" | "2";
}) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 md:py-24">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-8 shadow-[0_0_80px_-20px_rgba(139,92,246,0.5),inset_0_1px_0_0_rgba(167,139,250,0.15)] backdrop-blur-md">
        <div className="mb-8 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-purple/40 bg-gradient-to-br from-brand-purple/35 to-purple-950/60 shadow-[0_0_32px_-4px_rgba(139,92,246,0.6)]">
            <Sparkles className="h-7 w-7 text-brand-purple-light" />
          </div>
        </div>
        <p className="text-center font-inter text-[0.65rem] font-bold uppercase tracking-[0.22em] text-brand-purple-light">
          Drivn · Secure access
        </p>
        <h1 className="mt-2 bg-gradient-to-r from-white via-white to-brand-purple-light bg-clip-text text-center font-sora text-2xl font-bold tracking-tight text-transparent">
          Lead command center
        </h1>
        <p className="mt-2 text-center text-sm text-white/50">
          Sign in to view discovery submissions.
        </p>

        {error === "1" ? (
          <p className="mt-5 rounded-xl border border-red-500/30 bg-red-950/35 px-4 py-3 text-center text-sm text-red-100">
            Incorrect password.
          </p>
        ) : null}
        {error === "2" ? (
          <p className="mt-5 rounded-xl border border-amber-500/30 bg-amber-950/30 px-4 py-3 text-center text-sm text-amber-50">
            Server missing{" "}
            <code className="rounded bg-black/30 px-1 font-mono text-xs">LEADS_ADMIN_PASSWORD</code>.
          </p>
        ) : null}

        <form action={loginLeadsAdmin} className="mt-8 space-y-5">
          <label className="block text-sm font-medium text-white/75">
            Password
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-white outline-none ring-0 transition placeholder:text-white/30 focus:border-brand-purple/55 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)]"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-violet-900 via-brand-purple to-violet-800 py-3.5 text-sm font-bold text-white shadow-[0_0_28px_-4px_rgba(139,92,246,0.7)] transition hover:brightness-110 active:scale-[0.99]"
          >
            Sign in
          </button>
        </form>

        <p className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-brand-purple-light/85 transition hover:text-brand-purple-light"
          >
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
