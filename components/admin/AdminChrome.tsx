import type { ReactNode } from "react";

/** Shared atmospheric background for /admin routes. */
export function AdminChrome({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-brand-dark text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-18%,rgba(139,92,246,0.28),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_50%,rgba(167,139,250,0.12),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,26,0)_0%,rgba(10,10,26,0.85)_100%)]"
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
