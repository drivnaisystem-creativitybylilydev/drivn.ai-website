"use client";

import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuditForm } from "@/components/providers/AuditFormProvider";

type HeroLeftColumnProps = {
  variants: Variants;
};

/**
 * Left column: title group (title + subtitle move together) + CTA block.
 * Subtitle is centered relative to the title block width via `items-center` on `w-fit`.
 */
export function HeroLeftColumn({ variants }: HeroLeftColumnProps) {
  const { openAuditForm } = useAuditForm();

  return (
    <motion.div
      variants={variants}
      data-hero-region="left-column"
      className="hero-split__left flex min-h-0 min-w-0 w-full max-w-full flex-col overflow-visible lg:h-full lg:min-h-full lg:self-stretch"
    >
      {/* Title + subtitle: one box, `items-center` keeps subheader centered under the title */}
      <div className="hero-split__title-group flex w-full max-w-full shrink-0 flex-col items-center self-center lg:self-start">
        <h1 className="flex w-full max-w-full flex-col items-center leading-[1.05] text-center">
          <span className="text-4xl xs:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-sora font-bold text-white max-w-full [overflow-wrap:anywhere]">
            You&apos;re{" "}
            <span className="underline-glow-purple underline-glow-purple-hero">
              Losing Revenue
            </span>
            .
          </span>
          <span className="text-3xl xs:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-sora font-bold text-neon-purple mt-2 md:mt-3">
            We Know Where.
          </span>
        </h1>
      </div>

      {/* flex-1 + justify-start: CTA follows headline; extra space goes below (not a void between blocks) */}
      <div
        className="hero-split__cta mt-6 flex min-h-0 w-full max-w-full flex-1 flex-col justify-start gap-8 py-4 md:mt-8 md:gap-10 md:py-6 lg:gap-12 lg:py-8"
        data-hero-region="cta"
      >
        <div className="flex w-full max-w-full flex-col items-center text-center">
          <p className="text-xl md:text-2xl lg:text-3xl font-inter text-white font-medium w-full max-w-full lg:max-w-2xl leading-relaxed [overflow-wrap:anywhere]">
            <span className="inline">
              The question isn&apos;t whether it&apos;s possible — it&apos;s whether
            </span>{" "}
            you&apos;re ready to{" "}
            <span className="text-brand-purple-light">find out how</span>.
          </p>

          <div className="mt-10 lg:mt-12 flex w-full max-w-md flex-col items-stretch gap-5 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-6">
            <motion.div
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button
                size="lg"
                className="h-14 min-h-[3.5rem] w-full px-10 text-base font-semibold bg-violet-900 hover:bg-violet-800 shadow-[0_0_24px_rgba(88,28,135,0.6)] sm:w-auto"
                type="button"
                onClick={() => openAuditForm()}
              >
                Book Free Audit
              </Button>
            </motion.div>
            <motion.div
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button
                variant="ghost"
                size="lg"
                asChild
                className="h-14 min-h-[3.5rem] w-full px-10 text-base font-semibold border-2 border-violet-900 sm:w-auto"
              >
                <a href="#work">See Results</a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
