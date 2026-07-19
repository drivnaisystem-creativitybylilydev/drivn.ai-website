"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Box, Home, Star, Truck } from "lucide-react";

const COFFEE = "#4B2E25";
const LATTE = "#C9A47E";
const PAPER = "#F7F3EE";
const INK = "#0B0B0B";
const easeOut = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  { Icon: Truck, label: "Schedule Pickup", desc: "Book a time for us to collect your items" },
  { Icon: Box, label: "Secure Storage", desc: "Climate-controlled, 24/7 monitored facility" },
  { Icon: Home, label: "Schedule Move-In", desc: "Delivered straight to your dorm room" },
];

const PRICING = [
  { boxes: "1 Box", price: "$80", note: "/box/mo", featured: false },
  { boxes: "2–3 Boxes", price: "$55", note: "/box/mo", featured: true, badge: "Best Value" },
  { boxes: "4 Boxes", price: "$60", note: "/box/mo", featured: false },
];

/** Miniaturised browser-framed recreation of notimestorage.co */
export function HomepageMockup() {
  const reduce = useReducedMotion();

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-gray-800 shadow-2xl">
      {/* ── Browser chrome ── */}
      <div className="flex h-7 shrink-0 items-center gap-1.5 bg-[#1C1C1E] px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" aria-hidden />
        <div className="ml-2 flex h-4 flex-1 items-center justify-center rounded bg-[#2C2C2E]">
          <span className="font-inter text-[9px] text-white/35">notimestorage.co</span>
        </div>
      </div>

      {/* ── Site content ── */}
      <div
        className="flex h-[calc(100%-28px)] flex-col overflow-hidden"
        style={{ backgroundColor: PAPER }}
      >
        {/* Nav */}
        <div
          className="flex shrink-0 items-center justify-between border-b px-4 py-1.5"
          style={{ borderColor: `${COFFEE}12` }}
        >
          <span className="font-sora text-[10px] font-bold" style={{ color: COFFEE }}>
            NoTime Storage
          </span>
          <div className="flex items-center gap-3">
            {["How It Works", "Pricing", "FAQ"].map((item) => (
              <span key={item} className="hidden font-inter text-[8px] text-gray-400 sm:block">
                {item}
              </span>
            ))}
            <span
              className="rounded px-2 py-0.5 font-inter text-[8px] font-semibold text-white"
              style={{ backgroundColor: COFFEE }}
            >
              Get Started
            </span>
          </div>
        </div>

        {/* Hero */}
        <div className="flex flex-col items-center px-4 pt-3 text-center">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, ease: easeOut }}
            className="font-inter text-[8px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: LATTE }}
          >
            Secure · Climate-Controlled · Door-to-Door
          </motion.p>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: reduce ? 0 : 0.08, ease: easeOut }}
            className="mt-1 font-sora text-sm font-bold leading-tight tracking-tight sm:text-base md:text-lg lg:text-xl"
            style={{ color: INK }}
          >
            Stress-Free{" "}
            <span style={{ color: COFFEE }}>Door-to-Door Storage</span>
            <br />
            for College Students
          </motion.p>

          {/* Social proof */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, delay: reduce ? 0 : 0.18, ease: easeOut }}
            className="mt-2 flex flex-wrap items-center justify-center gap-2"
          >
            <span
              className="flex items-center gap-0.5 rounded-full border px-2 py-0.5"
              style={{ borderColor: "#fde68a", backgroundColor: "#fffbeb" }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-2 w-2 fill-amber-400 text-amber-400" aria-hidden />
              ))}
              <span className="ml-0.5 font-inter text-[8px] font-bold text-amber-700">5.0</span>
            </span>
            <span className="font-inter text-[8px] text-gray-500">300+ Students Served</span>
          </motion.div>

          <motion.span
            initial={reduce ? false : { opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, delay: reduce ? 0 : 0.26, ease: easeOut }}
            className="mt-2 inline-block rounded-lg px-4 py-1 font-inter text-[9px] font-bold text-white shadow-md"
            style={{ backgroundColor: COFFEE }}
          >
            Get Started →
          </motion.span>
        </div>

        {/* How It Works */}
        <div className="mt-auto grid grid-cols-3 gap-2 px-4 pb-3 pt-3">
          {STEPS.map(({ Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: reduce ? 0 : 0.32 + i * 0.09, ease: easeOut }}
              className="flex flex-col items-center rounded-xl border bg-white p-2 text-center shadow-sm"
              style={{ borderColor: `${COFFEE}10` }}
            >
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ backgroundColor: `${COFFEE}14` }}
              >
                <Icon className="h-3 w-3" style={{ color: COFFEE }} strokeWidth={1.5} aria-hidden />
              </div>
              <p
                className="mt-1 font-sora text-[8px] font-bold leading-tight"
                style={{ color: INK }}
              >
                {label}
              </p>
              <p className="mt-0.5 font-inter text-[7px] leading-tight text-gray-400">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Pricing strip */}
        <div className="grid shrink-0 grid-cols-3 gap-2 px-4 pb-3">
          {PRICING.map(({ boxes, price, note, featured, badge }, i) => (
            <motion.div
              key={boxes}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.38, delay: reduce ? 0 : 0.5 + i * 0.07, ease: easeOut }}
              className="relative flex flex-col items-center rounded-xl border p-2 shadow-sm"
              style={{
                backgroundColor: featured ? COFFEE : "white",
                borderColor: featured ? COFFEE : `${COFFEE}12`,
              }}
            >
              {badge && (
                <motion.span
                  animate={reduce ? undefined : { opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-0.5 rounded-full px-1.5 py-px font-inter text-[6px] font-bold"
                  style={{ backgroundColor: LATTE, color: COFFEE }}
                >
                  {badge}
                </motion.span>
              )}
              <span
                className="font-inter text-[7px]"
                style={{ color: featured ? LATTE : "#888" }}
              >
                {boxes}
              </span>
              <span
                className="font-sora text-[11px] font-bold leading-none"
                style={{ color: featured ? "white" : INK }}
              >
                {price}
                <span
                  className="font-inter text-[6px] font-normal"
                  style={{ color: featured ? `${LATTE}99` : "#aaa" }}
                >
                  {note}
                </span>
              </span>
              <span
                className="mt-0.5 rounded px-1.5 py-px font-inter text-[7px] font-semibold"
                style={{
                  backgroundColor: featured ? `${LATTE}25` : `${COFFEE}10`,
                  color: featured ? LATTE : COFFEE,
                }}
              >
                Select
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
