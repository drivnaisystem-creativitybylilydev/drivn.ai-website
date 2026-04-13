"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lock } from "lucide-react";
import { loginLeadsAdmin } from "@/app/admin/leads/actions";

const KONAMI = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a",
] as const;

function normalizeKey(key: string) {
  return key.length === 1 ? key.toLowerCase() : key;
}

export function AdminLoginPanel({ error }: { error?: "1" | "2" }) {
  const [unlocked, setUnlocked] = useState(false);
  const step = useRef(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (unlocked) return;
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable)
      )
        return;

      const key = normalizeKey(e.key);
      const expected = normalizeKey(KONAMI[step.current]);

      if (key === expected) {
        step.current += 1;
        if (step.current >= KONAMI.length) {
          step.current = 0;
          setUnlocked(true);
        }
      } else {
        step.current = key === normalizeKey(KONAMI[0]) ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [unlocked]);

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16 md:py-24">
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="locked"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-hidden rounded-2xl border border-red-500/15 bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-10 text-center shadow-[0_0_60px_-20px_rgba(239,68,68,0.25)] backdrop-blur-md">
              <div className="mb-6 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/25 bg-red-950/30 shadow-[0_0_24px_-4px_rgba(239,68,68,0.35)]">
                  <Lock className="h-6 w-6 text-red-400/70" />
                </div>
              </div>

              <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.28em] text-red-400/50">
                Access Restricted
              </p>
              <div className="mt-3 flex justify-center gap-1">
                {["██████", "████", "████████", "█████"].map((s, i) => (
                  <span key={i} className="font-mono text-xs text-white/10">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-2 px-4">
                {[72, 55, 83, 40].map((w, i) => (
                  <div
                    key={i}
                    className="mx-auto h-1.5 rounded-full bg-white/[0.04]"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>

              <p className="mt-8 font-mono text-[0.6rem] text-white/15">
                AUTHORIZATION REQUIRED · DRIVN.AI OS
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
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
                Operating System
              </h1>
              <p className="mt-2 text-center text-sm text-white/50">
                Enter your password to continue.
              </p>

              {error === "1" && (
                <p className="mt-5 rounded-xl border border-red-500/30 bg-red-950/35 px-4 py-3 text-center text-sm text-red-100">
                  Incorrect password.
                </p>
              )}
              {error === "2" && (
                <p className="mt-5 rounded-xl border border-amber-500/30 bg-amber-950/30 px-4 py-3 text-center text-sm text-amber-50">
                  Server missing{" "}
                  <code className="rounded bg-black/30 px-1 font-mono text-xs">
                    LEADS_ADMIN_PASSWORD
                  </code>
                  .
                </p>
              )}

              <form action={loginLeadsAdmin} className="mt-8 space-y-5">
                <label className="block text-sm font-medium text-white/75">
                  Password
                  <input
                    type="password"
                    name="password"
                    required
                    autoFocus
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
