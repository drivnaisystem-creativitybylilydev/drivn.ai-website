"use client";

/**
 * "Answer first" — the speed-to-lead + quoting group in the homepage
 * "What We Build" section. Thin wrapper over <SolutionCarousel />.
 */

import { ChatCircleDots, Receipt } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import SolutionCarousel, {
  type CarouselSlide,
} from "@/components/sections/solutions/SolutionCarousel";

const ICONS = [ChatCircleDots, Receipt];
const IMAGES = [
  "/home/speed-to-lead/instant-reply.webp",
  "/home/speed-to-lead/instant-quoting.webp",
];
const POS = ["82% 46%", "78% 46%"];
const SCALE = [1.12, 1.1];

type Item = { title: string; desc: string; bullets: string[]; cta: string };
type Group = {
  eyebrow: string;
  headline: string;
  subtext: string;
  items: Item[];
};

export default function SpeedToLead() {
  const t = useTranslations("Services");
  const g = t.raw("speedToLead") as Group;

  const slides: CarouselSlide[] = g.items.map((it, i) => ({
    ...it,
    image: IMAGES[i] ?? IMAGES[0],
    objectPosition: POS[i],
    scale: SCALE[i],
    Icon: ICONS[i] ?? ChatCircleDots,
  }));

  return (
    <SolutionCarousel
      ariaLabel={g.eyebrow}
      eyebrow={g.eyebrow}
      title={g.headline}
      subtext={g.subtext}
      slides={slides}
    />
  );
}
