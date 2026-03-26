"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuditForm } from "@/components/providers/AuditFormProvider";
import { viewRelaxed } from "@/lib/motion-viewport";

const IndustrySphere = dynamic(() => import("@/components/IndustrySphere"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[520px] w-full items-center justify-center rounded-xl bg-white/5 md:h-[640px] lg:h-[720px]"
      aria-hidden
    >
      <span className="text-sm text-white/40">Loading 3D…</span>
    </div>
  ),
});

const sectionBg = {
  background:
    "linear-gradient(180deg, #0A0A1A 0%, #0F0B1F 50%, #0A0A1A 100%)",
} as const;

const gridOverlay = {
  backgroundImage:
    "linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)",
  backgroundSize: "50px 50px",
} as const;

export default function IndustriesWeServe() {
  const { openAuditForm } = useAuditForm();

  return (
    <section
      id="industries"
      className="relative overflow-hidden py-20 md:py-28"
      style={sectionBg}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-brand-purple/15 via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={gridOverlay}
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="mb-3 font-sora text-3xl font-bold text-white md:mb-4 md:text-4xl lg:text-5xl">
            Industries We{" "}
            <span className="text-brand-purple-light">Transform</span>
          </h2>
          <p className="mb-3 font-inter text-sm tracking-wide text-white/50 md:mb-4 md:text-base">
            Drag to explore · Industries we transform
          </p>
          <p className="mx-auto max-w-2xl text-base text-white/60 md:text-lg">
            Service businesses losing revenue to manual processes
          </p>
        </motion.div>

        {/* Don’t animate opacity on WebGL parent — canvas often stays blank after opacity:0 */}
        <motion.div
          initial={{ y: 28 }}
          whileInView={{ y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <IndustrySphere />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-10 max-w-2xl text-center text-base text-white/50 md:mt-12 md:text-lg"
        >
          From home services to trades — if you&apos;re spending time on admin
          instead of revenue, we build the systems that fix that.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mt-10 flex justify-center md:mt-12"
        >
          <Button
            size="lg"
            className="bg-violet-900 px-8 shadow-[0_0_24px_rgba(88,28,135,0.6)] hover:bg-violet-800"
            type="button"
            onClick={() => openAuditForm()}
          >
            Book Free Audit
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
