"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export function CursorTrailer() {
  const [mounted, setMounted] = useState(false);
  const [isRing, setIsRing] = useState(false);

  const mouseX = useMotionValue(-120);
  const mouseY = useMotionValue(-120);

  const x = useSpring(mouseX, { stiffness: 200, damping: 22, mass: 0.4 });
  const y = useSpring(mouseY, { stiffness: 200, damping: 22, mass: 0.4 });

  useEffect(() => {
    // Skip entirely on touch/coarse-pointer devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setMounted(true);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onRingEnter = () => setIsRing(true);
    const onRingLeave = () => setIsRing(false);

    const bindRingTargets = () => {
      document.querySelectorAll("[data-cursor-ring]").forEach((el) => {
        el.addEventListener("mouseenter", onRingEnter);
        el.addEventListener("mouseleave", onRingLeave);
      });
    };

    window.addEventListener("mousemove", onMove);
    // Bind after a tick so DOM is populated
    const t = setTimeout(bindRingTargets, 300);

    return () => {
      window.removeEventListener("mousemove", onMove);
      clearTimeout(t);
      document.querySelectorAll("[data-cursor-ring]").forEach((el) => {
        el.removeEventListener("mouseenter", onRingEnter);
        el.removeEventListener("mouseleave", onRingLeave);
      });
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        data-cursor-trailer
        aria-hidden
        className="fixed pointer-events-none top-0 left-0"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 9998,
        }}
      >
        <motion.div
          animate={
            isRing
              ? {
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "transparent",
                  border: "1.5px solid rgba(167,139,250,0.75)",
                  opacity: 1,
                }
              : {
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: "rgba(167,139,250,0.72)",
                  border: "none",
                  opacity: 1,
                }
          }
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          style={{ originX: "50%", originY: "50%" }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
