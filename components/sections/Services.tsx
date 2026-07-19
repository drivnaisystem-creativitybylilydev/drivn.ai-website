"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { viewRelaxed } from "@/lib/motion-viewport";
import { ChapterLabel } from "@/components/ui/ChapterLabel";
import { ShowcasePanelSplit, ShowcasePanelFull, type Bullet } from "@/components/sections/solutions/ShowcasePanel";
import MessagingAgentPlayer from "@/components/sections/solutions/remotion/MessagingAgentPlayer";
import ReceptionistPlayer from "@/components/sections/solutions/remotion/ReceptionistPlayer";
import WebsitePlayer from "@/components/sections/solutions/remotion/WebsitePlayer";
import MarketingPlayer from "@/components/sections/solutions/remotion/MarketingPlayer";
import WorkflowPlayer from "@/components/sections/solutions/remotion/WorkflowPlayer";
import OperatingSystemPlayer from "@/components/sections/solutions/remotion/OperatingSystemPlayer";

const SPRING = [0.32, 0.72, 0, 1] as const;
const MOCKUPS = [MessagingAgentPlayer, ReceptionistPlayer, WebsitePlayer, MarketingPlayer, WorkflowPlayer];

type Panel = {
  eyebrow: string;
  headline: string;
  subtext: string;
  bullets: Bullet[];
  cta: string;
  href: string;
};

export default function Services() {
  const t = useTranslations("Services");
  const panels = t.raw("panels") as Panel[];
  const splitPanels = panels.slice(0, -1);
  const fullPanel = panels[panels.length - 1];

  return (
    <section id="systems" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.65, ease: SPRING }}
          className="mb-4 max-w-2xl"
        >
          <ChapterLabel title={t("eyebrow")} />
          <h2 className="font-display mt-4 text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white text-balance">
            {t("headline")}
          </h2>
        </motion.div>

        {/* Showcase panels — gradient frame + floating mockup, alternating sides */}
        {splitPanels.map((panel, i) => {
          const Mockup = MOCKUPS[i];
          return (
            <ShowcasePanelSplit
              key={panel.headline}
              eyebrow={panel.eyebrow}
              headline={panel.headline}
              subtext={panel.subtext}
              bullets={panel.bullets}
              cta={panel.cta}
              href={panel.href}
              reversed={i % 2 === 1}
              mockup={<Mockup />}
            />
          );
        })}

        {/* Closing panel — full width, the "one system" payoff */}
        {fullPanel && (
          <ShowcasePanelFull
            eyebrow={fullPanel.eyebrow}
            headline={fullPanel.headline}
            subtext={fullPanel.subtext}
            bullets={fullPanel.bullets}
            cta={fullPanel.cta}
            href={fullPanel.href}
            mockup={<OperatingSystemPlayer />}
          />
        )}
      </div>
    </section>
  );
}
