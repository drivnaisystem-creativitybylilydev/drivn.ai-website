"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiResend,
  SiSentry,
  SiSquare,
  SiSupabase,
  SiVercel,
} from "react-icons/si";
import {
  ArrowBigRight,
  Check,
  CircleSlash,
  Coins,
  FileStack,
  FileText,
  Instagram,
  Package,
  Percent,
  Sparkles,
  Truck,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuditForm } from "@/components/providers/AuditFormProvider";
import { creativityByLillyMedia } from "@/lib/creativity-by-lilly-media";
import { cn } from "@/lib/utils";

const BG = "#0A0B14";
const ACCENT = "#7C3AED";

const easeOut = [0.22, 1, 0.36, 1] as const;

const PAIN_POINTS = [
  "Selling exclusively on Etsy and In Person Pop-Up Shops",
  <>
    ~10-15% of online revenue lost to Etsy fees
    <span className="mt-1 block font-inter text-sm font-normal text-gray-500">
      ($0.20 listing + 6.5% transaction + 3% processing)
    </span>
  </>,
  "Manually copying shipping info for every single order",
  "3,000+ Instagram followers without a branded online store to send them to",
];

const SOLUTION_FEATURES = [
  "Custom e-commerce platform",
  "Email automation",
  "Square payment integration",
  "Admin dashboard for full control",
  "One-click shipping label generation",
  "Event announcements for pop-ups",
  "ADA-compliant & mobile-optimized",
];

const ADMIN_FEATURES = [
  "Track orders in real-time",
  "Analytics at a glance",
  "Generate shipping labels instantly",
];

const EVENT_FEATURES = [
  "Announce pop-up events and special drops",
  "Keep customers in the loop without extra tools",
  "On-brand event pages that match the storefront",
];

const IMPACT_METRICS = [
  {
    icon: Percent,
    stat: "0%",
    title: "Marketplace fees",
    body: "Zero Etsy fees — keeps 100% of margins",
  },
  {
    icon: Package,
    stat: "Live",
    title: "Order flow",
    body: "Already processing orders on the new store",
  },
  {
    icon: Truck,
    stat: "75%",
    title: "Faster fulfillment",
    body: "Shipping time cut by 75%",
  },
  {
    icon: Sparkles,
    stat: "100%",
    title: "Brand ownership",
    body: "Full control of experience and data",
  },
];

const TESTIMONIAL_PARAGRAPHS = [
  "Working with Drivn.ai was a game changer for my brand.",
  "Before, I was stuck on Etsy doing everything manually. Going the custom website route was the best decision.",
  "What I'm happiest with now is how clean and elevated everything feels. It actually looks like a real business, and it's so much easier to manage orders.",
  "The process was surprisingly smooth—Finn made everything feel manageable even when I didn't know exactly what I wanted.",
  "I couldn't be happier. 100% recommend.",
];

/** Cursor isn’t in Simple Icons yet; compact mark inspired by the product logo (monochrome). */
function CursorBrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M12.02 2 4 6.65v10.7l8.02 4.65 7.98-4.65V6.65L12.02 2Zm-.02 2.2 6.38 3.7v7.4l-6.38 3.7-6.4-3.7V7.9l6.4-3.7Z" />
      <path d="m9.2 8.35 2.82 1.63v3.26L9.2 14.87l-2.8-1.63v-3.26l2.8-1.63Zm5.6 0 2.82 1.63v3.26l-2.82 1.63-2.8-1.63v-3.26l2.8-1.63Z" opacity={0.85} />
    </svg>
  );
}

const TECH_ITEMS: readonly {
  label: string;
  subtitle: string;
  Icon: IconType | "cursor";
  iconClassName?: string;
}[] = [
  { label: "Cursor", subtitle: "AI-assisted development", Icon: "cursor" },
  {
    label: "Supabase",
    subtitle: "Backend & database",
    Icon: SiSupabase,
    iconClassName: "text-[#3ECF8E]",
  },
  { label: "Resend", subtitle: "Transactional emails", Icon: SiResend, iconClassName: "text-white" },
  {
    label: "Sentry",
    subtitle: "Error monitoring",
    Icon: SiSentry,
    iconClassName: "text-[#FB4226]",
  },
  { label: "Vercel", subtitle: "Edge deployment", Icon: SiVercel, iconClassName: "text-white" },
  { label: "Square", subtitle: "Payment processing", Icon: SiSquare, iconClassName: "text-white" },
];

const noiseBgStyle: CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
};

function useCountUp(target: number, enabled: boolean, durationMs = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    let start: number | null = null;
    let frame: number;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / durationMs, 1);
      const eased = 1 - (1 - p) ** 3;
      setValue(Math.round(eased * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, target, durationMs]);
  return value;
}

/** Full-bleed screenshot — no fake browser chrome; image scaled slightly past clip to kill hairline gaps */
function StudyShot({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-gray-800 shadow-2xl leading-none",
        // Next/Image direct child (span or img): fill slot edge-to-edge
        "[&>*]:absolute [&>*]:inset-0 [&>*]:block [&>*]:size-full [&>*]:min-h-0 [&>*]:min-w-0",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1152px"
        className="!block h-full w-full min-h-full min-w-full rounded-2xl object-cover object-top [transform:translateZ(0)] scale-[1.03]"
      />
    </div>
  );
}

/** Stylized “E” on Etsy orange — not the official logo; evokes marketplace without asset files */
function EtsyMarkIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 56"
      className={className}
      aria-hidden
    >
      <circle cx="28" cy="28" r="26" fill="#F1641E" />
      <path
        fill="white"
        d="M18 20h16v3.5H22.5v5H32V32h-9.5v5.5H34V41H18V20z"
      />
    </svg>
  );
}

function ProblemPainVisuals({ reduce }: { reduce: boolean | null }) {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.11,
        delayChildren: reduce ? 0 : 0.06,
      },
    },
  };
  const cell: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.52, ease: easeOut },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      className="grid h-fit w-full grid-cols-2 content-start justify-items-stretch gap-3 sm:gap-4 md:gap-5"
    >
      {/* Row 1 col 1 — Bullet 1: Etsy / channels */}
      <motion.div variants={cell} className="min-h-0">
        <Card className="group relative flex h-full min-h-[168px] flex-col items-center justify-center overflow-hidden border-gray-800 bg-white/[0.02] p-4 transition-all duration-300 hover:scale-[1.02] hover:border-[#7C3AED]/45 hover:shadow-[0_0_44px_-14px_rgba(124,58,237,0.55)] md:min-h-[188px] md:p-5">
          <Badge
            className="absolute right-2 top-2 border border-rose-500/60 bg-rose-950/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-200 md:right-3 md:top-3"
            variant="outline"
          >
            Fees
          </Badge>
          <EtsyMarkIcon className="h-20 w-20 shrink-0 md:h-24 md:w-24" />
          <p className="mt-3 text-center font-inter text-[11px] font-medium uppercase tracking-wider text-white/45 md:text-xs">
            Marketplace lock-in
          </p>
        </Card>
      </motion.div>

      {/* Row 1 col 2 — Bullet 2: revenue leaking */}
      <motion.div variants={cell} className="min-h-0">
        <Card className="group relative flex h-full min-h-[168px] flex-col items-center justify-center overflow-hidden border-gray-800 bg-white/[0.02] p-4 transition-all duration-300 hover:scale-[1.02] hover:border-[#7C3AED]/45 hover:shadow-[0_0_44px_-14px_rgba(124,58,237,0.55)] md:min-h-[188px] md:p-5">
          <div className="relative flex h-24 w-full max-w-[7.5rem] items-center justify-center md:h-28 md:max-w-[8.5rem]">
            <Coins
              className="h-20 w-20 text-amber-400/90 md:h-[5.5rem] md:w-[5.5rem]"
              strokeWidth={1.35}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-1 bottom-5 h-[3px] rotate-[8deg] rounded-full bg-gradient-to-r from-transparent via-rose-500/90 to-transparent md:bottom-6"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-2 top-1/2 h-[2px] -translate-y-1 rotate-[-6deg] rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
              aria-hidden
            />
          </div>
          <p className="mt-3 text-center font-inter text-[11px] font-medium uppercase tracking-wider text-white/45 md:text-xs">
            Revenue slipping away
          </p>
        </Card>
      </motion.div>

      {/* Row 2 col 1 — Bullet 3: manual shipping chaos */}
      <motion.div variants={cell} className="min-h-0">
        <Card className="group relative flex h-full min-h-[168px] flex-col items-center justify-center overflow-hidden border-gray-800 bg-white/[0.02] p-4 transition-all duration-300 hover:scale-[1.02] hover:border-[#7C3AED]/45 hover:shadow-[0_0_44px_-14px_rgba(124,58,237,0.55)] md:min-h-[188px] md:p-5">
          <div className="relative flex h-24 w-full items-center justify-center md:h-28">
            <User
              className="relative z-10 h-16 w-16 text-violet-200/95 md:h-[4.5rem] md:w-[4.5rem]"
              strokeWidth={1.35}
              aria-hidden
            />
            <FileStack
              className="absolute -right-0 top-0 h-12 w-12 text-white/35 md:h-14 md:w-14"
              strokeWidth={1.25}
              aria-hidden
            />
            <FileText
              className="absolute -left-1 bottom-1 h-11 w-11 text-white/28 md:h-12 md:w-12"
              strokeWidth={1.25}
              aria-hidden
            />
            <Package
              className="absolute right-4 bottom-0 h-9 w-9 text-rose-400/50 md:right-5"
              strokeWidth={1.35}
              aria-hidden
            />
          </div>
          <p className="mt-3 text-center font-inter text-[11px] font-medium uppercase tracking-wider text-white/45 md:text-xs">
            Manual shipping grind
          </p>
        </Card>
      </motion.div>

      {/* Row 2 col 2 — Bullet 4: IG with nowhere to send */}
      <motion.div variants={cell} className="min-h-0">
        <Card className="group relative flex h-full min-h-[168px] flex-col items-center justify-center overflow-hidden border-gray-800 bg-white/[0.02] p-4 transition-all duration-300 hover:scale-[1.02] hover:border-[#7C3AED]/45 hover:shadow-[0_0_44px_-14px_rgba(124,58,237,0.55)] md:min-h-[188px] md:p-5">
          <div className="flex flex-col items-center gap-2 md:gap-3">
            <Instagram
              className="h-20 w-20 text-pink-400 md:h-24 md:w-24"
              strokeWidth={1.35}
              aria-hidden
            />
            <div className="flex items-center gap-1.5 text-white/40">
              <ArrowBigRight className="h-8 w-8 md:h-9 md:w-9" strokeWidth={1.35} aria-hidden />
              <CircleSlash className="h-7 w-7 text-rose-400/85 md:h-8 md:w-8" strokeWidth={1.35} aria-hidden />
            </div>
          </div>
          <p className="mt-3 text-center font-inter text-[11px] font-medium uppercase tracking-wider text-white/45 md:text-xs">
            Audience, no owned funnel
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function SlideIn({
  children,
  className,
  from = "left",
}: {
  children: React.ReactNode;
  className?: string;
  from?: "left" | "right";
}) {
  const reduce = useReducedMotion();
  const x = from === "left" ? -40 : 40;
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, x }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedProductCount() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const n = useCountUp(41, inView, 1400);
  return (
    <div ref={ref} className="flex flex-wrap items-center gap-3">
      <Badge variant="accent" className="px-4 py-1.5 text-sm font-bold tabular-nums">
        {n} products
      </Badge>
      <span className="font-inter text-lg text-gray-400">managed seamlessly in one place</span>
    </div>
  );
}

function TechStackGrid() {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.06 },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
  };
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {TECH_ITEMS.map(({ Icon, iconClassName, label, subtitle }) => (
        <motion.div key={label} variants={item}>
          <Card className="group h-full border-gray-800 bg-white/[0.03] transition-all duration-300 hover:scale-[1.02] hover:border-[#7C3AED]/35 hover:shadow-[0_0_40px_-12px_rgba(124,58,237,0.45)]">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#7C3AED]/25 bg-[#7C3AED]/10 text-[#c4b5fd] transition-colors group-hover:border-[#7C3AED]/50 group-hover:bg-[#7C3AED]/20">
                {Icon === "cursor" ? (
                  <CursorBrandMark className="h-5 w-5 text-white" />
                ) : (
                  <Icon
                    className={cn("h-5 w-5 shrink-0", iconClassName ?? "text-white")}
                    aria-hidden
                  />
                )}
              </div>
              <div>
                <CardTitle className="text-lg text-white">{label}</CardTitle>
                <CardDescription className="mt-1 text-gray-500">{subtitle}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function CreativityByLilyCaseStudy() {
  const { openAuditForm } = useAuditForm();
  const reduce = useReducedMotion();

  return (
    <main
      className="relative min-h-screen overflow-x-clip text-white"
      style={{ backgroundColor: BG }}
    >
      {/* Ambient + pattern */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div
          className="absolute -right-1/3 top-0 h-[min(90vw,780px)] w-[min(90vw,780px)] rounded-full opacity-[0.14] blur-[140px]"
          style={{ background: ACCENT }}
        />
        <div
          className="absolute bottom-0 left-0 h-[min(70vw,560px)] w-[min(70vw,560px)] rounded-full opacity-[0.08] blur-[120px]"
          style={{ background: "#ec4899" }}
        />
        <Image
          src="/brand/purple-lines-bg.webp"
          alt=""
          fill
          className="object-cover object-top opacity-[0.12]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={noiseBgStyle}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B14] via-transparent to-[#0A0B14]" />
      </div>

      <div className="relative z-10">
        {/* —— Hero —— */}
        <section className="relative flex min-h-svh flex-col px-4 pb-16 pt-6 md:px-8 md:pb-20 md:pt-8">
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOut }}
              className="mb-10"
            >
              <Link
                href="/#work"
                className="inline-flex items-center gap-2 font-inter text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 transition-colors hover:text-white"
              >
                <span aria-hidden>←</span> All results
              </Link>
            </motion.div>

            <div className="flex flex-1 flex-col items-center justify-center px-2 text-center md:px-8">
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: easeOut }}
                className="relative mb-8 h-32 w-32 sm:mb-10 sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56"
              >
                <Image
                  src={creativityByLillyMedia.logo}
                  alt="Creativity by Lily"
                  fill
                  className="object-contain drop-shadow-[0_0_32px_rgba(124,58,237,0.4)]"
                  sizes="(max-width: 768px) 128px, 224px"
                  priority
                />
              </motion.div>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: reduce ? 0 : 0.08, ease: easeOut }}
                className="max-w-4xl"
              >
                <p
                  className="mb-5 font-inter text-[11px] font-bold uppercase tracking-[0.3em] text-[#a78bfa]"
                  style={{ color: ACCENT }}
                >
                  Case study
                </p>
                <h1 className="font-sora text-4xl font-bold leading-[1.08] tracking-tight text-balance sm:text-5xl md:text-6xl">
                  From Etsy fees and{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    manual chaos
                  </span>{" "}
                  to full ownership
                </h1>
                <p className="mx-auto mt-8 max-w-2xl font-inter text-lg leading-relaxed text-gray-400 md:text-xl">
                  How we built a custom e-commerce platform for a handmade jewelry business — store,
                  admin, and payments in one cohesive system.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Separator className="bg-white/[0.08]" />
        </div>

        {/* —— Problem —— */}
        <section className="px-4 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="font-inter text-xs font-bold uppercase tracking-[0.28em] text-[#a78bfa]">
              The problem
            </p>
            <h2 className="mt-4 font-sora text-4xl font-bold tracking-tight md:text-5xl">
              What we found in the audit
            </h2>
            <p className="mt-4 max-w-2xl font-inter text-lg text-gray-400">
              Revenue and time were leaking through channels and workflows that didn&apos;t scale with
              the brand.
            </p>
            {/* Explicit grid: both columns share row 1 on lg so the 2×2 cards align with the first bullet, not vertically centered in the list. */}
            <div className="mt-8 grid grid-cols-1 gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,30rem)] lg:items-start lg:gap-x-14 lg:gap-y-0 xl:gap-x-16">
              <ul className="col-start-1 row-start-1 min-w-0 space-y-8">
                {PAIN_POINTS.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      delay: reduce ? 0 : i * 0.1,
                      duration: 0.45,
                      ease: easeOut,
                    }}
                    className="flex items-start gap-4"
                  >
                    <span className="mt-1 shrink-0 text-rose-500/90" aria-hidden>
                      <X className="h-6 w-6" strokeWidth={2.2} />
                    </span>
                    <span className="font-inter text-lg leading-relaxed text-gray-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="col-start-1 row-start-2 w-full lg:col-start-2 lg:row-start-1 lg:-mt-44 lg:w-auto lg:self-start xl:-mt-48">
                <ProblemPainVisuals reduce={reduce} />
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Separator className="bg-white/[0.08]" />
        </div>

        {/* —— Solution —— */}
        <section className="px-4 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: reduce ? 0 : 0.2, duration: 0.55, ease: easeOut }}
            >
              <p className="font-inter text-xs font-bold uppercase tracking-[0.28em] text-[#a78bfa]">
                Our solution
              </p>
              <h2 className="mt-4 font-sora text-4xl font-bold tracking-tight md:text-5xl">
                A store that feels like the brand
              </h2>
            </motion.div>

            <div className="mt-14 grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
              <SlideIn from="left">
                <Card className="border-gray-800 bg-white/[0.02] shadow-none transition-all duration-300 hover:border-[#7C3AED]/25 hover:shadow-[0_0_50px_-20px_rgba(124,58,237,0.35)]">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">What we shipped</CardTitle>
                    <CardDescription className="text-base text-gray-500">
                      End-to-end commerce, not a template patch job.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {SOLUTION_FEATURES.map((line) => (
                        <li key={line} className="flex items-start gap-3 font-inter text-lg text-gray-300">
                          <Check
                            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                            strokeWidth={2.5}
                            aria-hidden
                          />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </SlideIn>
              <SlideIn from="right">
                <StudyShot
                  src={creativityByLillyMedia.homepage}
                  alt="Creativity by Lily storefront homepage"
                />
              </SlideIn>
            </div>

            <div className="mt-20">
              <h3 className="font-sora text-2xl font-bold text-white md:text-3xl">Tech stack</h3>
              <p className="mt-2 font-inter text-lg text-gray-400">
                Production-grade tools chosen for speed, reliability, and maintainability.
              </p>
              <div className="mt-10">
                <TechStackGrid />
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Separator className="bg-white/[0.08]" />
        </div>

        {/* —— Dashboard —— */}
        <section className="px-4 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
              <SlideIn from="left" className="order-2 lg:order-1">
                <StudyShot
                  src={creativityByLillyMedia.dashboardAnalytics}
                  alt="Admin dashboard with analytics and orders"
                />
              </SlideIn>
              <div className="order-1 space-y-6 lg:order-2">
                <SlideIn from="right">
                  <p className="font-inter text-xs font-bold uppercase tracking-[0.28em] text-[#a78bfa]">
                    Operations
                  </p>
                  <h2 className="font-sora text-4xl font-bold tracking-tight md:text-5xl">
                    Built for how the owner works
                  </h2>
                  <p className="font-inter text-lg text-gray-400">
                    Custom admin dashboard — manage everything without filing a ticket to a developer.
                  </p>
                  <ul className="mt-8 space-y-4">
                    {ADMIN_FEATURES.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-3 font-inter text-lg text-gray-300"
                      >
                        <span
                          className="h-2 w-2 shrink-0 rounded-full bg-[#7C3AED]"
                          aria-hidden
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </SlideIn>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Separator className="bg-white/[0.08]" />
        </div>

        {/* —— Catalog —— */}
        <section className="px-4 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
              <SlideIn from="left">
                <div className="space-y-6">
                  <p className="font-inter text-xs font-bold uppercase tracking-[0.28em] text-[#a78bfa]">
                    Catalog
                  </p>
                  <h2 className="font-sora text-4xl font-bold tracking-tight md:text-5xl">
                    Full catalog control
                  </h2>
                  <AnimatedProductCount />
                  <p className="font-inter text-lg leading-relaxed text-gray-400">
                    Our client can add, edit, and manage products independently — no middleware, no
                    spreadsheet gymnastics.
                  </p>
                </div>
              </SlideIn>
              <SlideIn from="right">
                <StudyShot
                  src={creativityByLillyMedia.adminManageProducts}
                  alt="Product management — catalog admin"
                />
              </SlideIn>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Separator className="bg-white/[0.08]" />
        </div>

        {/* —— Events —— */}
        <section className="px-4 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
              <SlideIn from="left">
                <StudyShot
                  src={creativityByLillyMedia.eventsPage}
                  alt="Events management for pop-ups and announcements"
                />
              </SlideIn>
              <SlideIn from="right">
                <Card className="border-gray-800 bg-white/[0.02] transition-all duration-300 hover:border-pink-500/25 hover:shadow-[0_0_50px_-20px_rgba(236,72,153,0.25)]">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">Events &amp; pop-ups</CardTitle>
                    <CardDescription className="text-base text-gray-500">
                      Turn Instagram traffic into show-up traffic.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {EVENT_FEATURES.map((f) => (
                        <li key={f} className="flex items-start gap-3 font-inter text-lg text-gray-300">
                          <Check className="mt-0.5 h-5 w-5 shrink-0 text-pink-400" strokeWidth={2.5} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </SlideIn>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Separator className="bg-white/[0.08]" />
        </div>

        {/* —— Results / testimonial —— */}
        <section className="relative px-4 py-24 md:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/[0.07] via-transparent to-pink-600/[0.04]" aria-hidden />
          <div className="relative mx-auto max-w-7xl">
            <p className="font-inter text-xs font-bold uppercase tracking-[0.28em] text-[#a78bfa]">
              The result
            </p>
            <h2 className="mt-4 font-sora text-4xl font-bold tracking-tight md:text-5xl">
              Happy client, measurable lift
            </h2>

            <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:items-stretch lg:gap-14 xl:gap-16">
              <motion.div
                initial={reduce ? false : { opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, ease: easeOut }}
                className="flex w-full max-w-md justify-self-center lg:h-full lg:max-w-none lg:justify-self-stretch"
              >
                <div className="flex w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl lg:h-full lg:min-h-0">
                  <Image
                    src={creativityByLillyMedia.ceo}
                    alt="Lily Matthews, CEO of Creativity by Lily"
                    width={1200}
                    height={1800}
                    className="h-auto w-full lg:h-full lg:min-h-0 lg:object-cover lg:object-[center_25%]"
                    sizes="(max-width: 1024px) min(100vw, 28rem), 38vw"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: reduce ? 0 : 0.06, ease: easeOut }}
                className="flex min-h-0 min-w-0 lg:h-full"
              >
                <blockquote className="m-0 flex w-full flex-col border-0 p-0 lg:min-h-full lg:justify-between">
                  <div className="space-y-6 border-l-2 border-[#7C3AED]/60 pl-6 md:space-y-8 md:pl-8 lg:flex-1 lg:space-y-9">
                    {TESTIMONIAL_PARAGRAPHS.map((para, i) => (
                      <p
                        key={i}
                        className="font-inter text-xl italic leading-[1.65] text-gray-200 md:text-2xl md:leading-[1.6] lg:text-[1.35rem] lg:leading-[1.7] xl:text-[1.45rem] xl:leading-[1.68]"
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                  <footer className="mt-10 space-y-1 pl-6 font-inter not-italic text-gray-400 md:mt-12 md:pl-8 lg:mt-14">
                    <p className="text-lg font-semibold text-white/95 md:text-xl">Lily Matthews</p>
                    <p className="text-base md:text-lg">CEO, Creativity by Lily Co</p>
                  </footer>
                </blockquote>
              </motion.div>
            </div>

            <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {IMPACT_METRICS.map(({ icon: Icon, stat, title, body }, i) => (
                <MetricCard
                  key={title}
                  icon={Icon}
                  stat={stat}
                  title={title}
                  body={body}
                  index={i}
                  reduce={reduce}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Separator className="bg-white/[0.08]" />
        </div>

        {/* —— CTA —— */}
        <section className="px-4 py-24 md:px-8 md:py-28">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#7C3AED]/25 via-[#1a1025] to-pink-600/20 px-6 py-16 text-center shadow-[0_0_80px_-20px_rgba(124,58,237,0.5)] md:px-16 md:py-20"
          >
            <div className="pointer-events-none absolute inset-0 opacity-30" style={noiseBgStyle} />
            <div className="relative">
              <h2 className="font-sora text-3xl font-bold tracking-tight text-balance md:text-4xl">
                Losing revenue to{" "}
                <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  manual chaos?
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl font-inter text-lg text-gray-300">
                If slow processes, platform fees, or disconnected tools are costing you margin —
                let&apos;s map the leaks and ship systems that close them.
              </p>
              <div className="mt-10 flex flex-col items-center gap-3">
                <motion.div
                  animate={
                    reduce
                      ? undefined
                      : {
                          boxShadow: [
                            "0 0 0 0 rgba(124, 58, 237, 0.35)",
                            "0 0 28px 6px rgba(124, 58, 237, 0.35)",
                            "0 0 0 0 rgba(124, 58, 237, 0.35)",
                          ],
                        }
                  }
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-[20px]"
                >
                  <Button
                    type="button"
                    size="lg"
                    className="min-h-12 w-full cursor-pointer bg-[#7C3AED] px-10 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#6d28d9] sm:w-auto"
                    onClick={() => openAuditForm()}
                  >
                    Get a free AI audit →
                  </Button>
                </motion.div>
                <p className="font-inter text-sm text-gray-400">DM us or comment &apos;AUDIT&apos; below</p>
              </div>
              <Link
                href="/"
                className="mt-10 inline-block font-inter text-sm text-gray-400 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                Back to home
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  icon: Icon,
  stat,
  title,
  body,
  index,
  reduce,
}: {
  icon: typeof Package;
  stat: string;
  title: string;
  body: string;
  index: number;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ delay: reduce ? 0 : index * 0.08, duration: 0.5, ease: easeOut }}
    >
      <Card className="h-full cursor-default border-gray-800 bg-white/[0.03] transition-all duration-300 hover:scale-[1.02] hover:border-[#7C3AED]/30 hover:shadow-[0_0_36px_-12px_rgba(124,58,237,0.35)]">
        <CardHeader className="space-y-2 p-4 pb-2 pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7C3AED]/15 text-[#c4b5fd]">
            <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
          </div>
          <p className="font-sora text-2xl font-bold tabular-nums leading-none text-white md:text-[1.75rem]">
            {stat}
          </p>
          <CardTitle className="text-sm font-semibold leading-snug text-gray-200">{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <p className="font-inter text-xs leading-snug text-gray-500 md:text-sm">{body}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
