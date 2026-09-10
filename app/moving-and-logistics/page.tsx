"use client";

/**
 * /moving-and-logistics — Drivn.AI's first fully-bundled, productized vertical offer.
 *
 * Design pass: full-width layout (container-max, full-bleed section backgrounds),
 * homepage-style hero (eyebrow stack + huge clamp headline with accent line + white
 * pill CTA + purple gradient bottom-glow). Hero background is a Higgsfield-generated
 * abstract route-network visual (public/moving-and-logistics/hero-network.webp) —
 * deliberately different from the homepage's dotted sphere / dashboard.
 *
 * ALL PROSE IS PLACEHOLDER pending Finn's sign-off on the five open items:
 * desc copy option, Foundation-tier GBP+SEO decision, canonical calendar link,
 * /services/ai-operating-systems stub, OS timeline language. Pricing/timeline spots
 * are marked {/* PLACEHOLDER *​/}.
 */

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Calculator,
  Lightning,
  ChatCircleText,
  Phone,
  MapPin,
  MagnifyingGlass,
  Megaphone,
  SquaresFour,
  ArrowRight,
  ArrowDown,
  Check,
} from "@phosphor-icons/react/dist/ssr";
import { ChapterLabel } from "@/components/ui/ChapterLabel";
import TryItYourself from "@/components/moving/TryItYourself";
import {
  GetStartedProvider,
  useGetStarted,
} from "@/components/moving/GetStartedDialog";
import OsDashboard from "@/components/moving/OsDashboard";
import PainScroller from "@/components/moving/PainScroller";

export const dynamic = "force-static";

// PLACEHOLDER — confirm this is still the canonical booking link before launch.
// Same link currently used by app/sheridan-movers and app/allset-moving.
const CAL_LINK = "https://calendar.app.google/hwHNSN7M7Lf4xwrK8";

const SPRING = [0.32, 0.72, 0, 1] as const;

// Bidirectional scroll reveal — re-plays every time the element enters the middle
// band of the viewport, scrolling up or down. Shared by every section on the page.
const VIEW = { once: false, margin: "-12% 0px -12% 0px" } as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: VIEW,
  transition: { duration: 0.6, ease: SPRING },
};

const fadeUpDelay = (delay: number) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay },
});

// Directional slide — used where content should enter from a specific side
// (e.g. alternating solution rows). Also bidirectional.
const slideIn = (fromX: number) => ({
  initial: { opacity: 0, x: fromX },
  whileInView: { opacity: 1, x: 0 },
  viewport: VIEW,
  transition: { duration: 0.7, ease: SPRING },
});

// ── Word-by-word clip reveal — hero headline, animates on mount ──────────────
function WordReveal({
  text,
  baseDelay = 0,
  wordDelay = 0.06,
  color,
}: {
  text: string;
  baseDelay?: number;
  wordDelay?: number;
  color?: string;
}) {
  const words = text.split(" ");
  return (
    <span aria-label={text} style={color ? { color } : undefined}>
      {words.map((word, i) => (
        <span key={i}>
          <span
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "bottom",
              lineHeight: 1.1,
              padding: "0.12em 0.09em 0.05em 0.05em",
              margin: "-0.12em -0.09em -0.05em -0.05em",
            }}
          >
            <motion.span
              style={{ display: "inline-block" }}
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.6, ease: SPRING, delay: baseDelay + i * wordDelay }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

function SectionHeading({
  chapter,
  title,
  intro,
  centered = false,
  titleClassName = "",
}: {
  chapter: string;
  title: ReactNode;
  intro?: string;
  centered?: boolean;
  titleClassName?: string;
}) {
  if (centered) {
    return (
      <motion.div
        {...fadeUp}
        className="relative mx-auto max-w-4xl text-center"
      >
        {/* Brand glow behind the heading */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[240%] w-[130%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse 45% 55% at 50% 45%, rgba(124,77,255,0.16) 0%, transparent 70%)",
          }}
        />
        <ChapterLabel title={chapter} />
        {/* Short accent rule */}
        <div
          aria-hidden
          className="mx-auto mb-6 h-px w-16"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
          }}
        />
        <h2
          className={`font-display mx-auto max-w-[26ch] text-[clamp(30px,5vw,56px)] font-semibold leading-[1.05] tracking-[-0.025em] text-white text-balance ${titleClassName}`}
        >
          {title}
        </h2>
        {intro && (
          <p
            className="font-mono mx-auto mt-6 max-w-xl text-[15px] leading-relaxed"
            style={{ color: "#f5f5f4" }}
          >
            {intro}
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div {...fadeUp} className="max-w-2xl">
      <ChapterLabel title={chapter} />
      <h2 className="font-display mt-3 text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.08] tracking-[-0.02em] text-white text-balance">
        {title}
      </h2>
      {intro && (
        <p
          className="font-mono mt-5 text-[15px] leading-relaxed"
          style={{ color: "#f5f5f4" }}
        >
          {intro}
        </p>
      )}
    </motion.div>
  );
}

// The renders sit on near-black but not the exact page tone, so a hard CSS mask
// still leaves a faint rectangle. Instead we paint the real page colour back over
// the edges with a radial vignette in --color-mono-bg — seamless by construction —
// and let a soft mask carry the very outer pixels. Core is nudged toward the copy.
function BlendedRender({
  src,
  bias = "50%",
  className = "",
  imgClassName = "",
}: {
  src: string;
  bias?: string;
  className?: string;
  imgClassName?: string;
}) {
  const mask = `radial-gradient(118% 122% at ${bias} 48%, #000 40%, transparent 82%)`;
  return (
    <div className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute inset-[10%] -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(124,77,255,0.10) 0%, transparent 70%)",
          filter: "blur(38px)",
        }}
        aria-hidden
      />
      <img
        src={src}
        alt=""
        loading="lazy"
        className={`h-auto w-full select-none ${imgClassName}`}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 74% 78% at ${bias} 48%, transparent 26%, var(--color-mono-bg) 76%)`,
        }}
        aria-hidden
      />
    </div>
  );
}

// ── One part of the system — boxless render on one side, detail + outcomes on the
//    other, sides alternate down the page (homepage Services showcase pattern). ──
function SolutionRow({
  index,
  total,
  part,
}: {
  index: number;
  total: number;
  part: (typeof SYSTEM_PARTS)[number];
}) {
  const Icon = part.icon;
  const reversed = index % 2 === 1;
  const num = String(index + 1).padStart(2, "0");
  const totalStr = String(total).padStart(2, "0");

  // Image enters from its own outer edge, copy from the opposite edge; the
  // direction flips row to row so the section alternates left/right on scroll.
  const imgFrom = reversed ? 90 : -90;
  const txtFrom = reversed ? -70 : 70;

  return (
    <div
      className={`flex flex-col ${
        reversed ? "lg:flex-row-reverse" : "lg:flex-row"
      } items-center gap-4 py-12 md:py-16`}
    >
      <motion.div {...slideIn(imgFrom)} className="w-full shrink-0 lg:w-[54%]">
        <BlendedRender src={part.image} bias={reversed ? "44%" : "56%"} />
      </motion.div>

      {/* Detail + outcomes */}
      <motion.div
        {...slideIn(txtFrom)}
        className="flex min-w-0 flex-col justify-center lg:w-[46%] lg:px-2"
      >
        <span
          className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ color: "var(--color-accent-light)" }}
        >
          <Icon size={15} weight="light" />
          Part {num} of {totalStr}
        </span>
        <h3 className="font-display mt-3 text-[26px] font-semibold leading-[1.15] tracking-[-0.01em] text-white text-balance md:text-[32px]">
          {part.title}
        </h3>
        <p
          className="font-mono mt-4 text-[13.5px] leading-relaxed"
          style={{ color: "#f5f5f4" }}
        >
          {part.detail}
        </p>

        <p
          className="font-mono mt-6 text-[10px] uppercase tracking-[0.2em]"
          style={{ color: "#f5f5f4" }}
        >
          What it moves
        </p>
        <ul className="mt-3 space-y-2.5">
          {part.outcomes.map((o) => (
            <li key={o} className="flex items-start gap-2.5">
              <Check
                size={14}
                weight="bold"
                className="mt-0.5 shrink-0"
                style={{ color: "var(--color-accent-light)" }}
              />
              <span
                className="font-mono text-[12.5px] leading-relaxed"
                style={{ color: "#f5f5f4" }}
              >
                {o}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

// ── The Operating System — pulled out of the alternating group and given its own
//    full-width block, the way the homepage treats it (ShowcasePanelFull). ──
function OperatingSystemBlock({
  part,
}: {
  part: (typeof SYSTEM_PARTS)[number];
}) {
  const Icon = part.icon;

  return (
    <motion.div {...fadeUp} className="pt-8 md:pt-12">
      <div className="mx-auto max-w-2xl text-center">
        <span
          className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ color: "var(--color-accent-light)" }}
        >
          <Icon size={15} weight="light" />
          The layer that ties it together
        </span>
        <h3 className="font-display mt-3 text-[28px] font-semibold leading-[1.1] tracking-[-0.01em] text-white text-balance md:text-[38px]">
          {part.title}
        </h3>
        <p
          className="font-mono mx-auto mt-4 max-w-xl text-[14px] leading-relaxed"
          style={{ color: "#f5f5f4" }}
        >
          {part.detail}
        </p>
      </div>

      {/* The exact animated dashboard from the homepage Services section, rendered
          boxless. The Remotion composition centres its content inside a 4:3 canvas,
          so the canvas carries a lot of empty margin — the negative margins here
          pull the heading and the outcomes in tight against the visible dashboard. */}
      <div className="relative mx-auto -mt-24 w-full max-w-6xl md:-mt-36">
        <div
          className="pointer-events-none absolute inset-[8%] -z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(124,77,255,0.18) 0%, transparent 72%)",
            filter: "blur(56px)",
          }}
          aria-hidden
        />
        <div
          className="aspect-[4/3]"
          style={{
            maskImage:
              "radial-gradient(125% 130% at 50% 50%, #000 66%, transparent 99%)",
            WebkitMaskImage:
              "radial-gradient(125% 130% at 50% 50%, #000 66%, transparent 99%)",
          }}
        >
          <OsDashboard />
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-24 grid max-w-3xl gap-x-10 gap-y-4 sm:grid-cols-3 md:-mt-36">
        {part.outcomes.map((o) => (
          <div key={o} className="flex items-start gap-2.5">
            <Check
              size={15}
              weight="bold"
              className="mt-1 shrink-0"
              style={{ color: "var(--color-accent-light)" }}
            />
            <span
              className="font-display text-[14px] font-medium leading-snug md:text-[15px]"
              style={{ color: "#f5f5f4" }}
            >
              {o}
            </span>
          </div>
        ))}
      </div>

      {part.note && (
        <p
          className="font-mono mt-6 text-center text-[11.5px] italic"
          style={{ color: "rgba(183,156,255,0.6)" }}
        >
          {part.note}
        </p>
      )}
    </motion.div>
  );
}

// ── Pricing tier — glassy violet panel (same aesthetic as the Higgsfield section
//    renders / homepage hero). Mouse-follow spotlight, hover lift + edge-glow,
//    a slow glow pulse on the featured card, and a CTA straight into the form. ──
function TierCard({
  tier,
  index,
  onGetStarted,
}: {
  tier: (typeof TIERS)[number];
  index: number;
  onGetStarted: () => void;
}) {
  const featured = !!tier.featured;
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={VIEW}
      transition={{ duration: 0.6, ease: SPRING, delay: index * 0.09 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPt({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setPt(null)}
      className={`group ease-spring relative flex flex-col rounded-[1.75rem] transition-[transform,box-shadow] duration-500 hover:-translate-y-2 ${
        featured ? "lg:-translate-y-5 lg:hover:-translate-y-7" : ""
      }`}
      style={{
        background: featured
          ? "rgba(15,12,24,0.72)"
          : "rgba(8,9,13,0.68)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: featured
          ? "inset 0 1px 1px rgba(255,255,255,0.14), 0 0 0 1px rgba(124,77,255,0.30), 0 44px 90px -28px rgba(124,77,255,0.40)"
          : "inset 0 1px 1px rgba(255,255,255,0.07), 0 30px 70px -34px rgba(0,0,0,0.65)",
      }}
    >
      {featured && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-3 -z-10 rounded-[2.1rem]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(124,77,255,0.30) 0%, transparent 70%)",
            filter: "blur(34px)",
          }}
          animate={{ opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* ── Backlit crescent — a bright indigo arch curving down over the top of
             the card, clipped hard so it never spills past the border. ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 overflow-hidden rounded-t-[1.75rem]"
        style={{
          maskImage: "linear-gradient(to bottom, #000 36%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 36%, transparent 80%)",
        }}
      >
        {/* soft outer bloom */}
        <div
          className="absolute left-1/2 top-0 aspect-square w-[110%] -translate-x-1/2 -translate-y-[45%] rounded-full"
          style={{
            background: `radial-gradient(circle, transparent 54%, rgba(112,96,228,${
              featured ? 0.48 : 0.34
            }) 61%, transparent 77%)`,
            filter: "blur(14px)",
          }}
        />
        {/* crisp arch — hugs the top edge, fully inside the card width */}
        <div
          className="absolute left-1/2 top-0 aspect-square w-[96%] -translate-x-1/2 -translate-y-[47%] rounded-full transition-[filter] duration-500 group-hover:brightness-125"
          style={{
            background: featured
              ? "radial-gradient(circle, transparent 56%, rgba(152,134,250,0.95) 60%, rgba(112,94,238,0.5) 64%, transparent 73%)"
              : "radial-gradient(circle, transparent 56%, rgba(140,120,240,0.82) 60%, rgba(102,86,216,0.34) 64%, transparent 73%)",
          }}
        />
      </div>

      {/* glass sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[1.75rem]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 20%)",
        }}
      />
      {/* mouse-follow spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={
          pt
            ? {
                background: `radial-gradient(340px circle at ${pt.x}px ${pt.y}px, rgba(124,77,255,0.16), transparent 68%)`,
              }
            : undefined
        }
      />
      {/* hover edge-glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[1.75rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow:
            "0 0 0 1px rgba(124,77,255,0.5), 0 0 46px 2px rgba(124,77,255,0.30)",
        }}
      />

      <div className="relative flex flex-1 flex-col overflow-hidden rounded-[1.68rem]">
        {/* ── Full-width tier header ── */}
        <div
          className="relative flex flex-col items-center gap-1.5 border-b px-6 pb-4 pt-6 text-center"
          style={{
            borderColor: featured
              ? "rgba(124,77,255,0.28)"
              : "rgba(255,255,255,0.10)",
            background: featured
              ? "rgba(124,77,255,0.16)"
              : "rgba(0,0,0,0.28)",
          }}
        >
          {featured && (
            <span
              className="font-mono text-[8.5px] font-semibold uppercase tracking-[0.34em]"
              style={{ color: "var(--color-accent-light)" }}
            >
              Where most movers start
            </span>
          )}
          <span className="font-mono text-[15px] font-bold uppercase tracking-[0.42em] text-white">
            {tier.kicker}
          </span>
          <span
            aria-hidden
            className="mt-0.5 h-px w-9"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--color-accent-light), transparent)",
            }}
          />
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 flex-col p-8">
          <h3 className="font-display text-[22px] font-semibold tracking-[-0.01em] text-white">
            {tier.name}
          </h3>
          <p
            className="font-mono mt-2.5 text-[12.5px] leading-relaxed"
            style={{ color: "#f5f5f4" }}
          >
            {tier.summary}
          </p>

          <ul className="mt-6 flex-1 space-y-3">
            {tier.includes.map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <Check
                  size={14}
                  weight="bold"
                  className="mt-0.5 shrink-0"
                  style={{ color: "var(--color-accent-light)" }}
                />
                <span
                  className="font-mono text-[12.5px] leading-relaxed"
                  style={{ color: "#f5f5f4" }}
                >
                  {line}
                </span>
              </li>
            ))}
          </ul>

          <p
            className="font-mono mt-6 border-t pt-4 text-[12px] leading-relaxed"
            style={{
              borderColor: "rgba(255,255,255,0.09)",
              color: "#f5f5f4",
            }}
          >
            {tier.roi}
          </p>

          <button
            type="button"
            onClick={onGetStarted}
            className={`font-display ease-spring group/btn mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-semibold transition-transform duration-500 hover:scale-[1.02] active:scale-[0.97] ${
              featured ? "bg-white text-[#0a0a0c]" : "text-white"
            }`}
            style={
              featured
                ? undefined
                : {
                    border: "1px solid rgba(255,255,255,0.20)",
                    background: "rgba(255,255,255,0.03)",
                  }
            }
          >
            Get started
            <ArrowRight
              size={13}
              weight="bold"
              className="transition-transform duration-500 group-hover/btn:translate-x-0.5"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function MovingAndLogisticsPage() {
  return (
    <GetStartedProvider calendarUrl={CAL_LINK}>
      <PageBody />
    </GetStartedProvider>
  );
}

function PageBody() {
  const { open } = useGetStarted();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "var(--color-mono-bg)", color: "var(--color-mono-text)" }}>
      <div className="grain-overlay" aria-hidden />

      {/* ── Header ── */}
      <header
        className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-5 transition-colors duration-500 sm:px-8 md:h-20 md:px-10"
        style={{
          background: scrolled ? "rgba(10,10,12,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid transparent",
        }}
      >
        <Link
          href="/"
          className="font-display text-[22px] font-bold leading-none tracking-tight md:text-[28px]"
        >
          <span className="text-white">Drivn</span>
          <span style={{ color: "var(--color-accent-light)" }}>.ai</span>
        </Link>
        <button
          type="button"
          onClick={open}
          className="font-display ease-spring group inline-flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-[13px] font-semibold text-[#0a0a0c] transition-transform duration-500 active:scale-[0.97]"
        >
          Get started
          <span
            className="ease-spring flex h-7 w-7 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 group-hover:translate-x-[2px]"
            aria-hidden
          >
            <ArrowRight size={12} weight="bold" />
          </span>
        </button>
      </header>

      {/* ── 1. Hero ── */}
      <section className="relative flex min-h-[100dvh] flex-col overflow-hidden">
        {/* base */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{ background: "var(--color-mono-bg)" }}
          aria-hidden
        />
        {/* Higgsfield-generated moving scene — frosted violet-glass truck, cartons,
            dolly, wrapped chair, pallet, drifting boxes. Anchored low so the whole
            upper half stays a calm dark field for the headline. */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            backgroundImage:
              "url(/moving-and-logistics/hero-moving-scene.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center 78%",
            opacity: 0.72,
            maskImage:
              "radial-gradient(ellipse 120% 105% at 50% 74%, black 34%, transparent 96%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 120% 105% at 50% 74%, black 34%, transparent 96%)",
          }}
          aria-hidden
        />
        {/* Contrast scrim — darkens the field directly behind the copy so the
            purple headline separates from the purple-tinted art. The scene stays
            fully present low and to the sides. */}
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(ellipse 68% 56% at 50% 42%, rgba(10,10,12,0.86) 0%, rgba(10,10,12,0.6) 46%, rgba(10,10,12,0.2) 68%, transparent 82%)",
          }}
          aria-hidden
        />

        <div className="container-max relative z-10 flex flex-1 flex-col items-center justify-center pb-16 pt-32 text-center">
          {/* Eyebrow stack — matches homepage hero */}
          <div className="mb-7 flex flex-col items-center gap-1.5">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-mono text-[18px] font-semibold uppercase tracking-[0.22em] text-white sm:text-[22px]"
            >
              Moving &amp; Logistics
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-mono text-[11px] font-medium uppercase tracking-[0.22em]"
              style={{ color: "var(--color-accent-light)" }}
            >
              A Drivn.AI growth system
            </motion.span>
          </div>

          {/* Headline — an imperative pair read as one block. Line 1: deeper accent,
              lead-in weight, tighter tracking. Line 2: white, heavier — the payoff
              the eye settles on. No terminal periods (they read timid at this scale). */}
          <h1 className="font-display max-w-[22ch] text-[clamp(38px,7vw,84px)] leading-[0.93] text-white">
            <span
              className="block font-semibold tracking-[-0.045em]"
              style={{
                color: "var(--color-accent-light)",
                filter:
                  "drop-shadow(0 1px 2px rgba(0,0,0,0.6)) drop-shadow(0 3px 16px rgba(0,0,0,0.45))",
              }}
            >
              <WordReveal text="Book the jobs" baseDelay={0.12} />
            </span>
            <span
              className="block font-bold tracking-[-0.03em]"
              style={{
                filter:
                  "drop-shadow(0 1px 2px rgba(0,0,0,0.55)) drop-shadow(0 3px 16px rgba(0,0,0,0.4))",
              }}
            >
              <WordReveal text="Lose the busywork" baseDelay={0.34} />
            </span>
          </h1>

          {/* Sub — one shared measure, wide enough that each line sits on a single
              row; the accent line is the shorter of the two so it can't out-width
              the line above it. text-balance tidies the wrap on small screens. */}
          <div className="mx-auto mt-7 flex max-w-[60ch] flex-col gap-2 px-4">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: SPRING, delay: 0.7 }}
              className="font-mono text-[14px] leading-snug text-balance text-white sm:text-[16.5px]"
            >
              Be the mover people find first, and trust enough to call.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: SPRING, delay: 0.78 }}
              className="font-mono text-[14px] font-semibold leading-snug text-balance sm:text-[16.5px]"
              style={{ color: "var(--color-accent-light)" }}
            >
              The quoting and follow&#8288;-&#8288;up run themselves from there.
            </motion.p>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: SPRING, delay: 0.86 }}
            className="mt-10"
          >
            <a
              href="#calculator"
              className="font-display ease-spring group relative inline-flex items-center gap-3 rounded-full bg-white py-2 pl-7 pr-2 text-[15px] font-semibold text-[#0a0a0c] transition-transform duration-500 hover:scale-[1.02] active:scale-[0.97]"
            >
              <span
                className="pointer-events-none absolute -inset-2 -z-10 rounded-full"
                style={{ boxShadow: "0 0 40px 4px rgba(124,77,255,0.35)" }}
                aria-hidden
              />
              <span className="tracking-tight">See what missed leads cost you</span>
              <span
                className="ease-spring flex h-11 w-11 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 group-hover:translate-x-[3px]"
                aria-hidden
              >
                <ArrowRight size={16} weight="bold" />
              </span>
            </a>
            <p
              className="font-mono mt-4 text-[12px]"
              style={{ color: "#f5f5f4" }}
            >
              Free, instant, no email — just move the sliders.{" "}
              <button
                type="button"
                onClick={open}
                className="underline underline-offset-2 transition-colors hover:text-white/70"
              >
                Or get started
              </button>
              .
            </p>
          </motion.div>
        </div>

        {/* Purple gradient bottom-glow — same treatment as homepage hero */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-40 overflow-hidden"
          aria-hidden
        >
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2"
            style={{
              width: "min(1100px, 92%)",
              height: "160px",
              background:
                "radial-gradient(ellipse 55% 100% at 50% 100%, rgba(255,255,255,0.5) 0%, rgba(124,77,255,0.4) 32%, rgba(124,77,255,0.12) 55%, transparent 78%)",
              filter: "blur(36px)",
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 h-px -translate-x-1/2"
            style={{
              width: "min(760px, 70%)",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
              boxShadow:
                "0 0 24px 4px rgba(255,255,255,0.5), 0 0 60px 12px rgba(124,77,255,0.5)",
            }}
          />
        </div>

        <motion.a
          href="#pain"
          aria-label="Scroll to why movers lose jobs"
          className="relative z-10 mb-10 flex justify-center text-white transition-colors duration-300 hover:text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 7, 0] }}
          transition={{
            opacity: { delay: 1.2, duration: 0.5 },
            y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <ArrowDown size={18} weight="light" />
        </motion.a>
      </section>

      {/* ── 2. The pain — full-bleed 2×2 grid + closing beat (all in PainScroller).
          Comes first: create the pain, then quantify it in the calculator below. ── */}
      <PainScroller />

      {/* ── Try it yourself — missed-revenue calculator + demos ── */}
      <section id="calculator" className="relative scroll-mt-20 py-24 md:py-36">
        <div className="container-max">
          <SectionHeading
            chapter="Try it yourself"
            title="See what slow follow-up is costing you."
            intro="Rough inputs, instant math. Nothing is saved and no email is asked — just move the sliders."
          />
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEW}
            transition={{ duration: 0.6, ease: SPRING }}
            className="mt-12"
          >
            <TryItYourself onGetStarted={open} />
          </motion.div>
        </div>
      </section>

      {/* ── 3. The bundle ── */}
      <section className="relative overflow-x-clip py-24 md:py-36">
        <div className="container-max">
          <SectionHeading
            centered
            chapter="What's in the system"
            title={
              <>
                <span style={{ color: "var(--color-accent-light)" }}>
                  Solutions
                </span>{" "}
                we offer, tailored to your{" "}
                <span style={{ color: "var(--color-accent-light)" }}>
                  daily problems
                </span>
                .
              </>
            }
            intro="Each one moves a number on its own. Together they close the gap between an inquiry and a booked truck."
          />

          <div className="mt-6 divide-y divide-white/[0.08] md:mt-10">
            {SYSTEM_PARTS.slice(0, -1).map((part, i, arr) => (
              <SolutionRow
                key={part.title}
                index={i}
                total={arr.length}
                part={part}
              />
            ))}
          </div>

          <div
            className="mt-16 border-t pt-16 md:mt-24 md:pt-24"
            style={{ borderColor: "rgba(255,255,255,0.10)" }}
          >
            <OperatingSystemBlock part={SYSTEM_PARTS[SYSTEM_PARTS.length - 1]} />
          </div>
        </div>
      </section>

      {/* ── 4. Proof = capability ── */}
      <section
        className="relative py-24 md:py-36"
        style={{ background: "var(--color-mono-surface)" }}
      >
        <div className="container-max">
          <SectionHeading
            chapter="Already built"
            title="The same system, already running on real mover sites."
            intro="Built as working demos to prove the pattern, not paid engagements. No client numbers to show yet — what they show is that the system is real and runs today."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {DEMOS.map((demo, i) => (
              <motion.a
                key={demo.name}
                {...fadeUpDelay(i * 0.08)}
                href={demo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-3xl border p-8 transition-colors duration-200 md:p-10"
                style={{
                  borderColor: "rgba(255,255,255,0.10)",
                  background: "var(--color-mono-bg)",
                }}
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: "var(--color-accent-light)" }}
                >
                  Demo build — capability, not a client result
                </p>
                <h3 className="font-display mt-3 text-[20px] font-semibold text-white">
                  {demo.name}
                </h3>
                <p
                  className="font-mono mt-3 flex-1 text-[13px] leading-relaxed"
                  style={{ color: "#f5f5f4" }}
                >
                  {demo.body}
                </p>
                <span
                  className="font-display mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium"
                  style={{ color: "var(--color-accent-light)" }}
                >
                  View the build
                  <ArrowRight
                    size={13}
                    weight="bold"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </motion.a>
            ))}
          </div>
          <motion.p
            {...fadeUp}
            className="font-mono mt-8 text-[12px]"
            style={{ color: "#f5f5f4" }}
          >
            {/* PLACEHOLDER — confirm these demo URLs are still live before launch. */}
            Once a moving company is live on the paid system, this section becomes a real case
            study with real numbers.
          </motion.p>
        </div>
      </section>

      {/* ── 5. Tiers ── */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 h-[640px] -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(124,77,255,0.11) 0%, transparent 70%)",
          }}
        />
        <div className="container-max relative z-10">
          <SectionHeading
            centered
            chapter="How it's packaged"
            titleClassName="!max-w-3xl !text-[clamp(26px,3.8vw,44px)] !leading-[1.12] !text-balance"
            title={
              <>
                <span className="block sm:whitespace-nowrap">
                  Start where the leak is.
                </span>
                <span className="block sm:whitespace-nowrap">
                  Add the rest when it pays for itself.
                </span>
              </>
            }
            intro="No prices listed here on purpose. On the call we run the math on your actual volume so anything proposed is sized to real numbers."
          />

          <div className="mt-16 grid items-start gap-6 lg:grid-cols-3 lg:gap-7">
            {TIERS.map((tier, i) => (
              <TierCard
                key={tier.name}
                tier={tier}
                index={i}
                onGetStarted={open}
              />
            ))}
          </div>

          {/* Not-sure-what-you-need one-liner + audit CTA (replaces the old
              standalone "How we work" two-box section). */}
          <motion.div
            {...fadeUp}
            className="mx-auto mt-14 flex max-w-2xl flex-col items-center gap-6 border-t pt-14 text-center md:mt-16"
            style={{ borderColor: "rgba(255,255,255,0.10)" }}
          >
            <p className="font-display text-[clamp(19px,2.6vw,28px)] font-semibold leading-snug text-white text-balance">
              Not sure what you need?{" "}
              <span style={{ color: "var(--color-accent-light)" }}>
                That&rsquo;s what the audit is for — we&rsquo;ll figure it out
                with you.
              </span>
            </p>
            <button
              type="button"
              onClick={open}
              className="font-display ease-spring group relative inline-flex items-center gap-3 rounded-full bg-white py-2 pl-7 pr-2 text-[15px] font-semibold text-[#0a0a0c] transition-transform duration-500 hover:scale-[1.02] active:scale-[0.97]"
            >
              <span
                className="pointer-events-none absolute -inset-2 -z-10 rounded-full"
                style={{ boxShadow: "0 0 40px 4px rgba(124,77,255,0.35)" }}
                aria-hidden
              />
              <span className="tracking-tight">Book a free audit</span>
              <span
                className="ease-spring flex h-11 w-11 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 group-hover:translate-x-[3px]"
                aria-hidden
              >
                <ArrowRight size={16} weight="bold" />
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── 6. FAQ ── */}
      <section className="relative py-24 md:py-36">
        <div className="container-max">
          <SectionHeading chapter="Questions" title="Before you book the call." />

          <div className="mt-14 grid gap-x-12 gap-y-2 md:grid-cols-2">
            {FAQ.map((item, i) => (
              <motion.div
                key={item.q}
                {...fadeUpDelay((i % 2) * 0.05)}
                className="border-t py-6"
                style={{ borderColor: "rgba(255,255,255,0.10)" }}
              >
                <p className="font-display text-[15px] font-semibold text-white">
                  {item.q}
                </p>
                <p
                  className="font-mono mt-2 text-[13px] leading-relaxed"
                  style={{ color: "#f5f5f4" }}
                >
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Get started ── */}
      <section
        id="book"
        className="relative scroll-mt-20 overflow-hidden py-24 md:py-36"
        style={{ background: "var(--color-mono-surface)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[120%] w-[80%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse 50% 55% at 50% 50%, rgba(124,77,255,0.14) 0%, transparent 70%)",
          }}
        />
        <div className="container-max relative z-10 mx-auto max-w-2xl text-center">
          <motion.div {...fadeUp}>
            <ChapterLabel title="Next step" />
            <h2 className="font-display mx-auto mt-3 max-w-[20ch] text-[clamp(28px,4.2vw,46px)] font-semibold leading-[1.08] tracking-[-0.02em] text-white text-balance">
              A 20-minute call. We run the quote-math on your real numbers.
            </h2>
            <p
              className="font-mono mx-auto mt-5 max-w-md text-[14px] leading-relaxed"
              style={{ color: "#f5f5f4" }}
            >
              Three quick questions, then pick a time. No prices are quoted before we see
              your actual lead volume.
            </p>
            <ul className="mx-auto mt-8 inline-flex flex-col items-start gap-3 text-left">
              {BOOK_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-2.5">
                  <Check
                    size={14}
                    weight="bold"
                    className="mt-0.5 shrink-0"
                    style={{ color: "var(--color-accent-light)" }}
                  />
                  <span
                    className="font-mono text-[13px] leading-relaxed"
                    style={{ color: "#f5f5f4" }}
                  >
                    {p}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <button
                type="button"
                onClick={open}
                className="font-display ease-spring group relative inline-flex items-center gap-3 rounded-full bg-white py-2 pl-7 pr-2 text-[15px] font-semibold text-[#0a0a0c] transition-transform duration-500 hover:scale-[1.02] active:scale-[0.97]"
              >
                <span
                  className="pointer-events-none absolute -inset-2 -z-10 rounded-full"
                  style={{ boxShadow: "0 0 40px 4px rgba(124,77,255,0.35)" }}
                  aria-hidden
                />
                <span className="tracking-tight">Get started</span>
                <span
                  className="ease-spring flex h-11 w-11 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 group-hover:translate-x-[3px]"
                  aria-hidden
                >
                  <ArrowRight size={16} weight="bold" />
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 9. Footer ── */}
      <footer
        className="px-5 py-10 sm:px-8 md:px-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="container-max flex flex-col items-start justify-between gap-4 !px-0 sm:flex-row sm:items-center">
          <Link href="/" className="font-display text-[16px] font-bold tracking-tight">
            <span className="text-white">Drivn</span>
            <span style={{ color: "var(--color-accent-light)" }}>.ai</span>
          </Link>
          <a
            href="mailto:drivn.ai.system@gmail.com"
            className="font-mono text-[12px]"
            style={{ color: "#f5f5f4" }}
          >
            drivn.ai.system@gmail.com
          </a>
          <p className="font-mono text-[11px]" style={{ color: "#f5f5f4" }}>
            © {new Date().getFullYear()} Drivn.AI
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────  DATA (all copy PLACEHOLDER)  ───────────────────────────── */
/* "Why movers lose jobs" beats now live in components/moving/PainScroller.tsx. */

const SYSTEM_PARTS: Array<{
  icon: typeof Globe;
  title: string;
  detail: string;
  outcomes: string[];
  note?: string;
  /** Higgsfield-generated section render (nano_banana_pro). Swap for a real
      product screenshot when one exists. */
  image: string;
}> = [
  {
    icon: Globe,
    title: "A website built to convert",
    image: "/moving-and-logistics/system/website.webp",
    detail:
      "Mover-specific, fast, and structured around one next step: getting a quote. A proven layout pulled from real mover builds, not a template dropped on your logo.",
    outcomes: [
      "Every page points at the quote form, not a phone number nobody answers mid-move",
      "Loads in under two seconds on a phone on a job site",
      "Structured to rank in local search, not just to look right",
    ],
  },
  {
    icon: MapPin,
    title: "Google Business Profile",
    image: "/moving-and-logistics/system/gbp.webp",
    detail:
      "Categories, photos, posts, and Q&A set up properly, plus a review flow that keeps the profile earning after launch instead of going stale.",
    outcomes: [
      "Show up in the map pack for the moves you actually want",
      "A steady flow of new reviews from finished jobs",
      "Profile stays active without you logging in to post",
    ],
  },
  {
    icon: MagnifyingGlass,
    title: "Local SEO",
    image: "/moving-and-logistics/system/local-seo.webp",
    detail:
      "Service pages, schema, and citations so the searches you should already be winning land on you instead of the mover one town over.",
    outcomes: [
      "A ranked page for each service and each area you cover",
      "Structured data search engines can read and cite",
      "Consistent name, address, and phone across the web",
    ],
  },
  {
    icon: Calculator,
    title: "Instant auto-quoting",
    image: "/moving-and-logistics/system/quoting.webp",
    detail:
      "Size, distance, and date turn into a price range on screen — moving and junk removal both. The customer gets a real number before they call anyone else.",
    outcomes: [
      "A price range on screen in under a minute",
      "Separate branches for moving, junk removal, and both together",
      "Leads land already knowing your range, so the callback is a booking, not a negotiation",
    ],
  },
  {
    icon: ChatCircleText,
    title: "Missed-call text-back",
    image: "/moving-and-logistics/system/missed-call.webp",
    detail:
      "The second a call rings out, the caller gets a text back — “Sorry we missed you, how can we help?” — so the lead starts a conversation with you instead of dialing the next mover on the list.",
    outcomes: [
      "Every unanswered call turns into a text thread, not a lost job",
      "Fires in seconds, day or night, with nothing for the crew to check",
      "Replies land in the same lead system as web and form leads",
    ],
  },
  {
    icon: Lightning,
    title: "Speed-to-lead follow-up",
    image: "/moving-and-logistics/system/speed-to-lead.webp",
    detail:
      "Every quote request gets an immediate reply and a structured follow-up sequence, backed by a real lead system instead of a shared inbox nobody checks on a moving day.",
    outcomes: [
      "First response in seconds, whether or not the crew is free",
      "Multi-step follow-up runs on its own until they reply or book",
      "Nothing sits unanswered overnight or over a weekend",
    ],
  },
  {
    icon: Phone,
    title: "Never miss a call",
    image: "/moving-and-logistics/system/receptionist.webp",
    detail:
      "An answering agent picks up the calls your crew can't — books the job, takes the details, and texts you the ones that need a person. Nights, weekends, and mid-move.",
    outcomes: [
      "Every call answered on the first ring, even with the whole crew on a truck",
      "Simple quotes and bookings handled start to finish, no callback needed",
      "Urgent or complex calls summarized and handed to you by text",
    ],
  },
  {
    icon: Megaphone,
    title: "Paid marketing",
    image: "/moving-and-logistics/system/marketing.webp",
    detail:
      "Google and Facebook campaigns pointed at the same instant-quote flow, so paid clicks land on a page built to convert them instead of a generic homepage.",
    outcomes: [
      "Google Ads for the high-intent “movers near me” searches",
      "Facebook and Instagram for the moves people are only starting to plan",
      "Spend tracked to booked jobs, not just clicks and form fills",
    ],
  },
  {
    icon: SquaresFour,
    title: "The Operating System",
    image: "/moving-and-logistics/system/operating-system.webp",
    detail:
      "Website, Google Business Profile, SEO, and marketing metrics in one dashboard instead of five logins — standalone, or the layer every other part plugs into.",
    outcomes: [
      "One view of every number that matters, updated live",
      "See which part is producing and which part is leaking",
      "Included with every Full System build as it rolls out",
    ],
    note: "Included with every Full System build, rolling out — not a separate live product yet.",
  },
];

const DEMOS: Array<{ name: string; body: string; url: string }> = [
  {
    name: "Mazheika Moving Services",
    body: "A full mover site with a working instant-quote flow covering moving and junk removal, a real review section, and local-SEO service pages.",
    // PLACEHOLDER — verify live before launch.
    url: "https://mazheika-moving-demo.vercel.app",
  },
  {
    name: "Statewide Moving & Storage",
    body: "A rebuild of an established mover's site around an instant estimate and a cleaner path from search to booked job.",
    // PLACEHOLDER — verify live before launch.
    url: "https://statewidemoving-vercel.vercel.app",
  },
];

const TIERS: Array<{
  kicker: string;
  name: string;
  summary: string;
  includes: string[];
  roi: string;
  featured?: boolean;
}> = [
  {
    kicker: "Tier 1",
    name: "Foundation",
    summary: "Get found, and put a real number on the screen.",
    includes: [
      "Conversion-focused mover website",
      "Instant auto-quoting — moving and junk removal",
      "Google Business Profile, set up and kept active",
      "Local SEO — service pages, schema, citations",
    ],
    // PLACEHOLDER — pending the Foundation-tier GBP+SEO decision.
    roi: "Most movers recoup setup within the first few jobs the system books that would otherwise have gone cold.",
  },
  {
    kicker: "Tier 2",
    name: "Foundation + Speed-to-Lead",
    summary: "Every inquiry gets an instant reply and a follow-up that doesn't quit.",
    includes: [
      "Everything in Foundation",
      "Speed-to-lead follow-up — first reply in seconds, structured sequence",
      "Missed-call text-back on every unanswered call",
      "An answering agent for the calls the crew can't take",
    ],
    roi: "Priced as a layer on Foundation. It does the chasing an employee would — days, nights, and mid-move.",
    featured: true,
  },
  {
    kicker: "Tier 3",
    name: "Full System",
    summary: "Every part of the system in one place, on one dashboard.",
    includes: [
      "Everything in Foundation + Speed-to-Lead",
      "Paid marketing — Google and Facebook pointed at the quote flow",
      "Precision quoting tuned to your real pricing",
      "The Operating System — site, calls, GBP, SEO and marketing in one view",
    ],
    // PLACEHOLDER — Tier 3 not quoted until the OS v1 is actually built.
    roi: "Sized on the call. The Operating System is included as it rolls out, not billed as a finished product.",
  },
];

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "We already have a website.",
    a: "Most movers do. The question is whether it puts a price on screen and follows up on its own. If it doesn't, that's the gap this closes — and we can build around what already works rather than starting over.",
  },
  {
    q: "How can an instant quote be accurate?",
    a: "Tier 1 gives an honest range from size, distance, and date — enough for the customer to keep talking to you instead of a competitor. Tier 2's Precision Quoting adds a deeper intake and a cost formula tuned to your actual pricing.",
  },
  {
    q: "What do we own?",
    a: "Everything. The site, the accounts, and the data are yours from day one. Support continues as a partnership, not a lock-in.",
  },
  {
    q: "How long until something is live?",
    a: "The Foundation build is about two weeks from kickoff to launch. Precision Quoting and the Operating System layer on after that.",
  },
  {
    q: "Do you handle junk removal quoting too?",
    a: "Yes. The instant-quote flow has a real junk-removal branch alongside moving, including adding junk removal onto a move.",
  },
  {
    q: "Do you only work with movers on Cape Cod?",
    a: "No. The system is the same for any moving or logistics company — the demos happen to be regional because that's where the first builds were.",
  },
];

const BOOK_POINTS: string[] = [
  "We run your quote volume, close rate, and average job value live on the call",
  "You leave with the math whether or not you move forward",
  "No prices quoted before we see your real numbers",
];
