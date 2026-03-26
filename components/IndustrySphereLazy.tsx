"use client";

import { useEffect, useState, type ComponentType } from "react";

const shellClass =
  "flex h-[min(70vh,520px)] min-h-[420px] w-full items-center justify-center rounded-xl bg-white/5 md:h-[min(72vh,640px)] md:min-h-[480px] lg:h-[min(75vh,720px)] lg:min-h-[520px]";

const loading = (
  <div className={shellClass} aria-hidden>
    <span className="text-sm text-white/40">Loading 3D…</span>
  </div>
);

/**
 * Loads the WebGL sphere only in the browser via a plain dynamic import.
 */
export default function IndustrySphereLazy() {
  const [Sphere, setSphere] = useState<ComponentType | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void import("./IndustrySphere")
      .then((mod) => {
        if (!cancelled) setSphere(() => mod.default);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return (
      <div className={`${shellClass} px-4 text-center`}>
        <p className="text-sm text-white/50">
          Interactive view couldn&apos;t load. Refresh the page — and run only one{" "}
          <code className="rounded bg-white/10 px-1 py-0.5 text-xs">npm run dev</code> for this
          project.
        </p>
      </div>
    );
  }

  if (!Sphere) return loading;
  return <Sphere />;
}
