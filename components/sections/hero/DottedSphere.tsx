"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const SIZE = 640;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 20;
const RING_COUNT = 14;

// Latitude rings of dots projected onto a sphere viewed head-on — dot size/opacity
// falls off toward the top/bottom edges to suggest curvature and a light source above.
function useSphereDots() {
  return useMemo(() => {
    const dots: { x: number; y: number; r: number; o: number }[] = [];
    // Fixed precision on every value — server and client can compute trig with tiny
    // floating-point differences in the last decimal place, which React's hydration
    // check treats as a real mismatch. Rounding guarantees identical string output.
    const round = (n: number, places = 2) => {
      const f = 10 ** places;
      return Math.round(n * f) / f;
    };

    for (let ring = 0; ring < RING_COUNT; ring++) {
      // latitude from -1 (bottom) to 1 (top)
      const lat = -1 + (ring / (RING_COUNT - 1)) * 2;
      const ringRadius = Math.cos((lat * Math.PI) / 2) * RADIUS;
      const y = CENTER - lat * RADIUS;
      if (ringRadius < 6) continue;

      const dotsInRing = Math.max(6, Math.round((ringRadius / RADIUS) * 32));
      for (let i = 0; i < dotsInRing; i++) {
        const angle = (i / dotsInRing) * Math.PI * 2;
        const x = CENTER + Math.cos(angle) * ringRadius;
        const dotY = y + Math.sin(angle) * ringRadius * 0.14; // slight vertical squash per ring for a 3D feel
        const curveFalloff = Math.cos((lat * Math.PI) / 2); // 1 at equator, 0 at poles
        const lightFalloff = 0.55 + 0.45 * Math.max(0, (lat + 1) / 2); // brighter toward top
        dots.push({
          x: round(x),
          y: round(dotY),
          r: round(1 + curveFalloff * 1.6),
          o: round(0.18 + curveFalloff * lightFalloff * 0.55, 3),
        });
      }
    }
    return dots;
  }, []);
}

export default function DottedSphere() {
  const dots = useSphereDots();

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
      // Animating `scale` alongside this drop-shadow filter forced a full re-rasterization
      // of the (expensive, double) blur on every single frame, forever — the filter's pixels
      // change shape every frame instead of staying static. Opacity-only keeps the filter's
      // output geometrically constant, so it's rasterized once and then just composited.
      style={{ filter: "drop-shadow(0 0 60px rgba(124,77,255,0.35)) drop-shadow(0 0 120px rgba(124,77,255,0.18))" }}
      animate={{ opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ opacity: 0.16, transform: "translateY(-14%)" }}
      >
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="var(--color-accent-light)" opacity={d.o} />
        ))}
      </svg>
    </motion.div>
  );
}
