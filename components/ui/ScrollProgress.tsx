"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 pointer-events-none"
      style={{
        height: 2,
        background: "#8b5cf6",
        scaleX,
        transformOrigin: "left",
        zIndex: 9999,
      }}
    />
  );
}
