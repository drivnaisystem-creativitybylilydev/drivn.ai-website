"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuditForm } from "@/components/providers/AuditFormProvider";

export default function FinalCTA() {
  const { openAuditForm } = useAuditForm();

  return (
    <section id="contact" className="pt-12 md:pt-16 pb-20 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sora font-semibold mb-6"
        >
          Ready to See Where You&apos;re <span className="text-neon-purple">Losing Money</span>?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-white/90 leading-relaxed mb-10 max-w-3xl mx-auto"
        >
          15 minutes. We&apos;ll show you exactly where revenue is slipping
          away — and what it would take to fix it. No pitch. No obligation.
          Just clarity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className="px-8 bg-violet-900 hover:bg-violet-800 shadow-[0_0_24px_rgba(88,28,135,0.6)]"
            onClick={openAuditForm}
          >
            Discovery Call
          </Button>
        </motion.div>
      </div>
    </section>
  );
}