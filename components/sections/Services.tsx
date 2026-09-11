"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { viewRelaxed } from "@/lib/motion-viewport";
import { ChapterLabel } from "@/components/ui/ChapterLabel";
import { ShowcasePanelFull, type Bullet } from "@/components/sections/solutions/ShowcasePanel";
import ShowUpFirst from "@/components/sections/solutions/ShowUpFirst";
import SpeedToLead from "@/components/sections/solutions/SpeedToLead";
import NeverMissACall from "@/components/sections/solutions/NeverMissACall";
import CustomAutomations from "@/components/sections/solutions/CustomAutomations";
import OperatingSystemPlayer from "@/components/sections/solutions/remotion/OperatingSystemPlayer";

const SPRING = [0.32, 0.72, 0, 1] as const;

type OsPanel = {
  eyebrow: string;
  headline: string;
  subtext: string;
  bullets: Bullet[];
  cta: string;
  href: string;
};

const groupDivider =
  "mt-16 border-t pt-2 md:mt-24";

export default function Services() {
  const t = useTranslations("Services");
  const os = t.raw("operatingSystem") as OsPanel;

  return (
    <section id="systems" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.65, ease: SPRING }}
          className="mb-4 max-w-3xl"
        >
          <ChapterLabel title={t("eyebrow")} />
          <div
            aria-hidden
            className="mt-1 mb-6 h-px w-14"
            style={{
              background:
                "linear-gradient(90deg, var(--color-accent), transparent)",
            }}
          />
          <h2 className="font-display text-[clamp(30px,4.6vw,50px)] font-semibold leading-[1.08] tracking-[-0.025em] text-white text-pretty">
            {t.rich("headline", {
              a: (chunks) => (
                <span style={{ color: "var(--color-accent-light)" }}>
                  {chunks}
                </span>
              ),
            })}
          </h2>
        </motion.div>

        {/* Foundation — visibility-layer carousel */}
        <ShowUpFirst />

        {/* Speed-to-Lead + Quoting carousel */}
        <div
          className={groupDivider}
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          <SpeedToLead />
        </div>

        {/* Never Miss a Call carousel */}
        <div
          className={groupDivider}
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          <NeverMissACall />
        </div>

        {/* Custom automations — horizontal pipeline block */}
        <div
          className={groupDivider}
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          <CustomAutomations />
        </div>

        {/* Closing panel — full width, the "one system" payoff */}
        <ShowcasePanelFull
          eyebrow={os.eyebrow}
          headline={os.headline}
          subtext={os.subtext}
          bullets={os.bullets}
          cta={os.cta}
          href={os.href}
          mockup={<OperatingSystemPlayer />}
        />
      </div>
    </section>
  );
}
