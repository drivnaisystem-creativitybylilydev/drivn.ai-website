"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { IconType } from "react-icons";
import { SiNextdotjs, SiResend, SiStripe, SiVercel } from "react-icons/si";
import {
  Calendar,
  Check,
  Clock,
  ExternalLink,
  Globe,
  Handshake,
  LayoutDashboard,
  MessageCircle,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuditForm } from "@/components/providers/AuditFormProvider";
import { cn } from "@/lib/utils";
import { ScreenshotFrame } from "./ScreenshotFrame";
import { BookingFlowComposition } from "./BookingFlowComposition";

const BG = "#0A0B14";
const ACCENT = "#7C3AED";
const GOLD = "#F59E0B"; // Trust & Authority — premium amber/gold accent
const easeOut = [0.22, 1, 0.36, 1] as const;

const noiseBgStyle: CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
};

// ── Copy ──────────────────────────────────────────────────────────────────────

const CHALLENGE_ITEMS = [
  "Bookings managed through Instagram DMs and word of mouth",
  "No unified system for quotes, scheduling, and payments",
  "Hard to build customer trust without a professional web presence",
  "Manual processing meant attention was split across everything",
];

const SOLUTION_FEATURES = [
  "Custom branded website built for credibility on first impression",
  "24/7 self-serve booking — customers commit on their schedule",
  "Stripe checkout with cards, Apple Pay, Link, and deposits",
  "Automated email confirmations for every secured job",
  "Owner dashboard to monitor leads and traction at a glance",
  "Easy backend management — no developer required day-to-day",
];

const BOOKING_FEATURES = [
  "Instant booking — no phone tag, no follow-up DMs",
  "Real-time availability so customers know exactly when to lock in",
  "Stripe deposits secured automatically before move-in day",
  "Confirmations sent the moment a job is confirmed",
];

const DASHBOARD_FEATURES = [
  "All leads and bookings visible in a single view",
  "Monitor traction without living in the inbox",
  "More time freed for strategy and customer acquisition",
];

const TECH_ITEMS: readonly {
  label: string;
  subtitle: string;
  Icon: IconType;
  iconClassName?: string;
}[] = [
  { label: "Next.js", subtitle: "Web framework", Icon: SiNextdotjs, iconClassName: "text-white" },
  { label: "Vercel", subtitle: "Edge deployment", Icon: SiVercel, iconClassName: "text-white" },
  { label: "Stripe", subtitle: "Payments & deposits", Icon: SiStripe, iconClassName: "text-[#635BFF]" },
  { label: "Resend", subtitle: "Automated email", Icon: SiResend, iconClassName: "text-white" },
];

const IMPACT_METRICS = [
  {
    icon: Clock,
    stat: "24/7",
    title: "Always-on booking",
    body: "Jobs secured any hour — the window never closes for customers who are ready to commit",
  },
  {
    icon: Zap,
    stat: "Unified",
    title: "One system",
    body: "Quotes, bookings, payments, and lead tracking all in a single automated flow",
  },
  {
    icon: Globe,
    stat: "Live",
    title: "Credible presence",
    body: "A professional front door that earns trust before the first call or DM",
  },
  {
    icon: Handshake,
    stat: "Ongoing",
    title: "Partnership",
    body: "The through-line Jermaine chose: a team that treats the business as their own",
  },
];

const TESTIMONIAL_PARAGRAPHS = [
  "Finn was very flexible all around, and he was able to bring my vision for NoTime Storage to life. That's hard to find.",
  "The business sells itself — and having the website to see and monitor the traction was very helpful. Allowing customers to book instantly was a game changer.",
  "I absolutely would recommend Drivn.AI. They do exceptional work and have care for your business as if it's their own.",
  "Are you going to put the cheapest gas in your Lamborghini because it's cheaper? No. You use the premium, because that's what's required for it to operate best. And that's exactly what I did working with Drivn.AI — premium service.",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function StarRow({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-0.5", className)} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
      ))}
    </span>
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

function MetricCard({
  icon: Icon,
  stat,
  title,
  body,
  index,
  reduce,
}: {
  icon: typeof Clock;
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
      <Card className="h-full cursor-default border-gray-800 bg-white/[0.03] transition-all duration-200 hover:border-[#7C3AED]/30 hover:shadow-[0_0_36px_-12px_rgba(124,58,237,0.35)]">
        <CardHeader className="space-y-2 p-4 pb-2 pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
          </div>
          {/* Pulse glow on stat number — Trust & Authority signal */}
          <motion.p
            className="font-sora text-2xl font-bold tabular-nums leading-none text-amber-300 md:text-[1.75rem]"
            animate={
              reduce
                ? undefined
                : {
                    textShadow: [
                      "0 0 0px rgba(251, 191, 36, 0)",
                      "0 0 20px rgba(251, 191, 36, 0.5)",
                      "0 0 0px rgba(251, 191, 36, 0)",
                    ],
                  }
            }
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5,
            }}
          >
            {stat}
          </motion.p>
          <CardTitle className="text-sm font-semibold leading-snug text-gray-200">{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          {/* gray-400 not gray-500 — minimum contrast ratio on #0A0B14 bg */}
          <p className="font-inter text-xs leading-snug text-gray-400 md:text-sm">{body}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ChallengeGrid({ reduce }: { reduce: boolean | null }) {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0 : 0.11, delayChildren: reduce ? 0 : 0.06 },
    },
  };
  const cell: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOut } },
  };

  const cells = [
    {
      Icon: MessageCircle,
      label: "DMs & Word of Mouth",
      sub: "No system to track or convert leads",
      bg: "from-sky-500/10 to-sky-600/5",
      border: "border-sky-500/20 hover:border-sky-500/50",
      glow: "hover:shadow-[0_0_40px_-12px_rgba(14,165,233,0.4)]",
      icon: "text-sky-400",
    },
    {
      Icon: Calendar,
      label: "Manual Booking Flow",
      sub: "Every job required back-and-forth coordination",
      bg: "from-amber-500/10 to-amber-600/5",
      border: "border-amber-500/20 hover:border-amber-500/50",
      glow: "hover:shadow-[0_0_40px_-12px_rgba(245,158,11,0.4)]",
      icon: "text-amber-400",
    },
    {
      Icon: Globe,
      label: "No Credible Presence",
      sub: "Customers couldn't verify trust before booking",
      bg: "from-rose-500/10 to-rose-600/5",
      border: "border-rose-500/20 hover:border-rose-500/50",
      glow: "hover:shadow-[0_0_40px_-12px_rgba(244,63,94,0.4)]",
      icon: "text-rose-400",
    },
    {
      Icon: LayoutDashboard,
      label: "No Visibility Dashboard",
      sub: "Traction was invisible — impossible to act on",
      bg: "from-violet-500/10 to-violet-600/5",
      border: "border-violet-500/20 hover:border-violet-500/50",
      glow: "hover:shadow-[0_0_40px_-12px_rgba(124,58,237,0.4)]",
      icon: "text-violet-400",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      className="grid h-fit w-full grid-cols-2 gap-3 sm:gap-4"
    >
      {cells.map(({ Icon, label, sub, bg, border, glow, icon }) => (
        <motion.div key={label} variants={cell} className="min-h-0">
          <Card className={cn(
            "group relative flex h-full min-h-[160px] cursor-default flex-col justify-between overflow-hidden p-5 transition-all duration-300 md:min-h-[180px]",
            "border bg-gradient-to-br",
            bg, border, glow
          )}>
            {/* Icon with glow bg */}
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl border bg-white/[0.04]",
              border.split(" ")[0]
            )}>
              <Icon className={cn("h-5 w-5", icon)} strokeWidth={1.6} aria-hidden />
            </div>
            <div>
              <p className="font-inter text-xs font-semibold text-white/80 leading-snug">{label}</p>
              <p className="mt-1 font-inter text-[11px] text-white/35 leading-snug">{sub}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

function TechStackGrid() {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
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
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {TECH_ITEMS.map(({ Icon, iconClassName, label, subtitle }) => (
        <motion.div key={label} variants={item}>
          <Card className="group h-full cursor-default border-gray-800 bg-white/[0.03] transition-all duration-200 hover:border-[#7C3AED]/35 hover:shadow-[0_0_40px_-12px_rgba(124,58,237,0.45)]">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#7C3AED]/25 bg-[#7C3AED]/10 transition-colors duration-200 group-hover:border-[#7C3AED]/50 group-hover:bg-[#7C3AED]/20">
                <Icon className={cn("h-5 w-5 shrink-0", iconClassName ?? "text-white")} aria-hidden />
              </div>
              <div>
                <CardTitle className="text-lg text-white">{label}</CardTitle>
                <CardDescription className="mt-1 text-gray-400">{subtitle}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function NoTimeStorageCaseStudy() {
  const { openAuditForm } = useAuditForm();
  const reduce = useReducedMotion();

  return (
    <main
      className="relative min-h-screen overflow-x-clip pt-20 text-white md:pt-24"
      style={{ backgroundColor: BG }}
    >
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div
          className="absolute -right-1/3 top-0 h-[min(90vw,780px)] w-[min(90vw,780px)] rounded-full opacity-[0.14] blur-[140px]"
          style={{ background: ACCENT }}
        />
        <div
          className="absolute bottom-0 left-0 h-[min(70vw,560px)] w-[min(70vw,560px)] rounded-full opacity-[0.08] blur-[120px]"
          style={{ background: "#3b82f6" }}
        />
        <Image
          src="/brand/purple-lines-bg.webp"
          alt=""
          fill
          className="object-cover object-top opacity-[0.12]"
          sizes="100vw"
        />
        <div className="absolute inset-0 opacity-[0.04]" style={noiseBgStyle} />
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
                className="inline-flex items-center gap-2 font-inter text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B14]"
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
                  src="/case-studies/notime-storage/notime-storage-logo.png"
                  alt="NoTime Storage"
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
                  className="mb-5 font-inter text-[11px] font-bold uppercase tracking-[0.3em]"
                  style={{ color: ACCENT }}
                >
                  Case study
                </p>
                <h1 className="font-sora text-4xl font-bold leading-[1.08] tracking-tight text-balance sm:text-5xl md:text-6xl">
                  From DMs and hustle to a system that{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    books while you sleep
                  </span>
                </h1>
                <p className="mx-auto mt-8 max-w-2xl font-inter text-lg leading-relaxed text-gray-400 md:text-xl">
                  How we built NoTime Storage&apos;s credible web presence with 24/7 self-serve
                  booking, unified payments, and a dashboard that lets the founder focus on growth.
                </p>

                {/* Trust credential badges — Authority signals */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 font-inter text-xs font-semibold text-amber-300">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
                    10 / 10 Recommended
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-inter text-xs font-medium text-white/50">
                    Ongoing Partnership
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-3 py-1.5 font-inter text-xs font-medium text-emerald-400/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden /> Live
                  </span>
                </div>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <a
                    href="https://notimestorage.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-6 py-3 font-inter text-sm font-semibold text-white/90 transition-all duration-200 hover:border-white/30 hover:bg-white/[0.1] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B14]"
                  >
                    Visit live site <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Separator className="bg-white/[0.08]" />
        </div>

        {/* —— Challenge —— */}
        <section className="px-4 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
              {/* LEFT — label, heading, para, bullets */}
              <div>
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, ease: easeOut }}
                >
                  <p className="font-inter text-xs font-bold uppercase tracking-[0.28em] text-[#a78bfa]">
                    The challenge
                  </p>
                  <h2 className="mt-4 font-sora text-4xl font-bold tracking-tight md:text-5xl">
                    Built on hustle — without the infrastructure
                  </h2>
                  <p className="mt-4 font-inter text-lg text-gray-400">
                    Jermaine had real demand. What he needed was a system built to handle it — and a
                    professional presence customers could trust on first impression.
                  </p>
                </motion.div>
                <ul className="mt-8 space-y-6">
                  {CHALLENGE_ITEMS.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={reduce ? false : { opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ delay: reduce ? 0 : i * 0.1, duration: 0.45, ease: easeOut }}
                      className="flex items-start gap-4"
                    >
                      <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#7C3AED]/70" aria-hidden />
                      <span className="font-inter text-lg leading-relaxed text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              {/* RIGHT — icon grid only, top-aligned */}
              <ChallengeGrid reduce={reduce} />
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
                End-to-end booking infrastructure
              </h2>
            </motion.div>

            <div className="mt-14 grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
              <SlideIn from="left">
                <Card className="border-gray-800 bg-white/[0.02] shadow-none transition-all duration-200 hover:border-[#7C3AED]/25 hover:shadow-[0_0_50px_-20px_rgba(124,58,237,0.35)]">
                  <CardHeader>
                    <CardTitle className="text-2xl text-white">What we shipped</CardTitle>
                    <CardDescription className="text-base text-gray-400">
                      A complete booking and payment system — not a template patch job.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {SOLUTION_FEATURES.map((line) => (
                        <li
                          key={line}
                          className="flex items-start gap-3 font-inter text-lg text-gray-300"
                        >
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
                <ScreenshotFrame
                  src="/case-studies/notime-storage/landing.png"
                  alt="NoTime Storage homepage"
                  url="notimestorage.co"
                />
              </SlideIn>
            </div>

            <div className="mt-20">
              <h3 className="font-sora text-2xl font-bold text-white md:text-3xl">Tech stack</h3>
              <p className="mt-2 font-inter text-lg text-gray-400">
                Production-grade tools chosen for reliability and zero maintenance overhead.
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

        {/* —— Booking Feature —— */}
        <section className="px-4 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
              <SlideIn from="left" className="order-2 lg:order-1">
                <BookingFlowComposition />
              </SlideIn>
              <div className="order-1 space-y-6 lg:order-2">
                <SlideIn from="right">
                  <p className="font-inter text-xs font-bold uppercase tracking-[0.28em] text-[#a78bfa]">
                    Booking
                  </p>
                  <h2 className="font-sora text-4xl font-bold tracking-tight md:text-5xl">
                    When the customer is ready, the door is open
                  </h2>
                  <p className="font-inter text-lg text-gray-400">
                    The booking window doesn&apos;t close at 5pm. Students self-serve on their
                    schedule — Stripe handles the deposit and confirmations go out automatically.
                  </p>
                  <ul className="mt-8 space-y-4">
                    {BOOKING_FEATURES.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-3 font-inter text-lg text-gray-300"
                      >
                        <Check
                          className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                          strokeWidth={2.5}
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

        {/* —— Dashboard Feature —— */}
        <section className="px-4 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
              <SlideIn from="left">
                <div className="space-y-6">
                  <p className="font-inter text-xs font-bold uppercase tracking-[0.28em] text-[#a78bfa]">
                    Operations
                  </p>
                  <h2 className="font-sora text-4xl font-bold tracking-tight md:text-5xl">
                    Full visibility, less inbox
                  </h2>
                  <p className="font-inter text-lg leading-relaxed text-gray-400">
                    With a real dashboard in place, Jermaine can see traction at a glance — and spend
                    the time he saves on strategy and customer acquisition instead of manual tracking.
                  </p>
                  <ul className="mt-8 space-y-4">
                    {DASHBOARD_FEATURES.map((f) => (
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
                </div>
              </SlideIn>
              <SlideIn from="right">
                <ScreenshotFrame
                  src="/case-studies/notime-storage/dashboard.png"
                  alt="NoTime Storage admin dashboard"
                  url="admin.notimestorage.co"
                />
              </SlideIn>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Separator className="bg-white/[0.08]" />
        </div>

        {/* —— Results & Testimonial —— */}
        <section className="relative px-4 py-24 md:px-8">
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/[0.07] via-transparent to-blue-600/[0.04]"
            aria-hidden
          />
          <div className="relative mx-auto max-w-7xl">
            <p className="font-inter text-xs font-bold uppercase tracking-[0.28em] text-[#a78bfa]">
              The result
            </p>
            <h2 className="mt-4 font-sora text-4xl font-bold tracking-tight md:text-5xl">
              Partnership that drives the business forward
            </h2>

            <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:items-stretch lg:gap-14 xl:gap-16">
              {/* Portrait area with trust credential */}
              <motion.div
                initial={reduce ? false : { opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.6, ease: easeOut }}
                className="flex w-full max-w-md justify-self-center lg:h-full lg:max-w-none lg:justify-self-stretch"
              >
                <div className="relative flex min-h-[340px] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-950/60 via-[#0d0e1a] to-indigo-950/40 shadow-2xl lg:h-full lg:min-h-0">
                  <svg
                    className="absolute inset-0 h-full w-full opacity-[0.04]"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <defs>
                      <pattern id="gridp" width="32" height="32" patternUnits="userSpaceOnUse">
                        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#gridp)" />
                  </svg>
                  <div className="relative flex flex-1 flex-col items-center justify-center gap-4 p-8">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-violet-500/30 bg-violet-600/20">
                      <Sparkles className="h-9 w-9 text-violet-300/80" strokeWidth={1.4} aria-hidden />
                    </div>
                    <p className="font-inter text-sm font-medium uppercase tracking-wider text-white/50">
                      Jermaine Williams
                    </p>
                    <p className="font-inter text-xs text-white/30">Founder, NoTime Storage</p>
                    {/* Trust score — premium gold authority signal */}
                    <div className="mt-2 flex flex-col items-center gap-2">
                      <StarRow />
                      <span className="font-sora text-2xl font-bold" style={{ color: GOLD }}>
                        10 / 10
                      </span>
                      <span className="font-inter text-[10px] font-semibold uppercase tracking-widest text-white/25">
                        Recommends Drivn.AI
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Testimonial */}
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
                  <footer className="mt-10 space-y-2 pl-6 font-inter not-italic text-gray-400 md:mt-12 md:pl-8 lg:mt-14">
                    <StarRow />
                    <p className="text-lg font-semibold text-white/95 md:text-xl">
                      Jermaine Williams
                    </p>
                    <p className="text-base md:text-lg">Founder, NoTime Storage</p>
                  </footer>
                </blockquote>
              </motion.div>
            </div>

            {/* KPI metric cards */}
            <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {IMPACT_METRICS.map(({ icon, stat, title, body }, i) => (
                <MetricCard
                  key={title}
                  icon={icon}
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
            className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#7C3AED]/25 via-[#1a1025] to-blue-600/15 px-6 py-16 text-center shadow-[0_0_80px_-20px_rgba(124,58,237,0.5)] md:px-16 md:py-20"
          >
            <div className="pointer-events-none absolute inset-0 opacity-30" style={noiseBgStyle} />
            <div className="relative">
              <h2 className="font-sora text-3xl font-bold tracking-tight text-balance md:text-4xl">
                Ready to book jobs{" "}
                <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  while you sleep?
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl font-inter text-lg text-gray-300">
                If manual processes and a missing web presence are costing you bookings and
                credibility — let&apos;s build the system that closes those gaps.
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
                    className="min-h-12 w-full cursor-pointer bg-[#7C3AED] px-10 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#6d28d9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B14] sm:w-auto"
                    onClick={() => openAuditForm()}
                  >
                    Get a free AI audit →
                  </Button>
                </motion.div>
                <p className="font-inter text-sm text-gray-400">
                  No pressure — just clarity on what to build next.
                </p>
              </div>
              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <a
                  href="https://notimestorage.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-2 font-inter text-sm text-gray-400 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B14]"
                >
                  Visit notimestorage.co <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
                <span className="hidden text-gray-700 sm:block" aria-hidden>·</span>
                <Link
                  href="/"
                  className="font-inter text-sm text-gray-400 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B14]"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
