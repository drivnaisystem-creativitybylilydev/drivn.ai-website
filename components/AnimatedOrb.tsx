"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AnimatedOrb() {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orbRef.current) return;

    gsap.to(orbRef.current, {
      scale: 1.2,
      opacity: 0.35,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div
      ref={orbRef}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[29rem] h-[29rem] rounded-full bg-gradient-to-r from-brand-purple to-brand-purple-light blur-3xl opacity-25 pointer-events-none"
      aria-hidden
    />
  );
}
