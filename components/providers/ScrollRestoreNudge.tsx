"use client";

import { useLayoutEffect } from "react";

/**
 * After a hard refresh, browsers can restore scroll before layout/intersection observers settle.
 * Framer `whileInView` with `once: true` may never fire for content already in view, leaving
 * blocks stuck at `initial` (e.g. opacity: 0). A 1px scroll round-trip re-triggers observers.
 */
export function ScrollRestoreNudge() {
  useLayoutEffect(() => {
    const nudge = () => {
      const y = window.scrollY;
      if (y < 1) return;
      window.scrollTo(0, y - 1);
      window.scrollTo(0, y);
    };

    nudge();
    window.addEventListener("pageshow", nudge);
    return () => window.removeEventListener("pageshow", nudge);
  }, []);

  return null;
}
