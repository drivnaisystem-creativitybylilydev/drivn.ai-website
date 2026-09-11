"use client";

/**
 * "Never miss a call" — the receptionist + missed-call text-back + lead
 * reactivation group in the homepage "What We Build" section. Thin wrapper over
 * <SolutionCarousel />.
 */

import {
  Phone,
  ChatText,
  ArrowsClockwise,
} from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import SolutionCarousel, {
  type CarouselSlide,
} from "@/components/sections/solutions/SolutionCarousel";

const ICONS = [Phone, ChatText, ArrowsClockwise];
const IMAGES = [
  "/home/never-miss-a-call/receptionist.webp",
  "/home/never-miss-a-call/missed-call-textback.webp",
  "/home/never-miss-a-call/lead-reactivation.webp",
];
const POS = ["76% 46%", "80% 44%", "70% 42%"];
const SCALE = [1.1, 1.12, 1.06];

type Item = { title: string; desc: string; bullets: string[]; cta: string };
type Group = {
  eyebrow: string;
  headline: string;
  subtext: string;
  items: Item[];
};

export default function NeverMissACall() {
  const t = useTranslations("Services");
  const g = t.raw("neverMissACall") as Group;

  const slides: CarouselSlide[] = g.items.map((it, i) => ({
    ...it,
    image: IMAGES[i] ?? IMAGES[0],
    objectPosition: POS[i],
    scale: SCALE[i],
    Icon: ICONS[i] ?? Phone,
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
