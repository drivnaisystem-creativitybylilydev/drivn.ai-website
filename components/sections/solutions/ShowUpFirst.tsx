"use client";

/**
 * "Show up first" — the visibility-layer foundation group at the top of the
 * homepage "What We Build" section. Thin wrapper over <SolutionCarousel />.
 */

import {
  Globe,
  MagnifyingGlass,
  MapPin,
  Star,
  Megaphone,
} from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import SolutionCarousel, {
  type CarouselSlide,
} from "@/components/sections/solutions/SolutionCarousel";

const ICONS = [Globe, MagnifyingGlass, MapPin, Star, Megaphone];
const IMAGES = [
  "/home/show-up-first/website.webp",
  "/home/show-up-first/local-seo.webp",
  "/home/show-up-first/gbp.webp",
  "/home/show-up-first/reviews.webp",
  "/home/show-up-first/paid-ads.webp",
];
// Per-slide framing — subject sits in a different spot / size in each render.
const POS = ["78% 44%", "84% 46%", "72% 42%", "84% 42%", "82% 46%"];
const SCALE = [1.18, 1.14, 1.08, 1.14, 1.18];

type Item = { title: string; desc: string; bullets: string[]; cta: string };
type Foundation = {
  eyebrow: string;
  headline: string;
  subtext: string;
  items: Item[];
};

export default function ShowUpFirst() {
  const t = useTranslations("Services");
  const f = t.raw("foundation") as Foundation;

  const slides: CarouselSlide[] = f.items.map((it, i) => ({
    ...it,
    image: IMAGES[i] ?? IMAGES[0],
    objectPosition: POS[i],
    scale: SCALE[i],
    Icon: ICONS[i] ?? Globe,
  }));

  return (
    <SolutionCarousel
      ariaLabel={f.eyebrow}
      eyebrow={f.eyebrow}
      title={f.headline}
      subtext={f.subtext}
      slides={slides}
    />
  );
}
