"use client";

/**
 * "Why movers lose jobs" — a full-bleed 2×2 image grid for /moving-and-logistics.
 * Sits directly under the hero: same black base (var(--color-mono-bg)), a mirrored
 * half-circle glow at the top edge (facing down) so the seam with the hero reads as
 * one continuous luminous band, and a matching glow + faint network echo bleeding
 * across the bottom edge into the calculator section below.
 */

import { motion } from "framer-motion";
import { ChapterLabel } from "@/components/ui/ChapterLabel";

const SPRING = [0.32, 0.72, 0, 1] as const;

type Beat = { lead: string; body: string; image: string };

const BEATS: Beat[] = [
  {
    lead: "Quote requests come in while the crew is on a job",
    body: "The form fills out at 2pm on a moving day. Nobody sees it until the truck is back and unloaded — hours later, if at all.",
    image: "/moving-and-logistics/pain/quote-lost.webp",
  },
  {
    lead: "Customers call three movers at once",
    body: "They are not waiting for you. They book whoever gets a real number back first, and move on.",
    image: "/moving-and-logistics/pain/three-movers.webp",
  },
  {
    lead: "There's no price on the site",
    body: "Every quote needs a callback. That callback is the single biggest gap between an interested lead and a booked truck.",
    image: "/moving-and-logistics/pain/no-price.webp",
  },
  {
    lead: "You're invisible past the map pack",
    body: "No service pages, thin Google Business Profile, no reviews strategy — so searches that should find you find a competitor.",
    image: "/moving-and-logistics/pain/invisible-map.webp",
  },
];

export default function PainScroller() {
  return (
    <section
      id="pain"
      className="relative scroll-mt-20 overflow-x-clip pt-40 md:pt-56"
      style={{ background: "var(--color-mono-bg)" }}
    >
      {/* ── Top seam — mirror of the hero's bottom glow, facing down ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-44 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: "min(1100px, 92%)",
            height: "170px",
            background:
              "radial-gradient(ellipse 55% 100% at 50% 0%, rgba(255,255,255,0.5) 0%, rgba(124,77,255,0.4) 32%, rgba(124,77,255,0.12) 55%, transparent 78%)",
            filter: "blur(36px)",
          }}
        />
        <div
          className="absolute left-1/2 top-0 h-px -translate-x-1/2"
          style={{
            width: "min(760px, 70%)",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
            boxShadow:
              "0 0 24px 4px rgba(255,255,255,0.5), 0 0 60px 12px rgba(124,77,255,0.5)",
          }}
        />
      </div>

      <div className="container-max relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-12% 0px -12% 0px" }}
          transition={{ duration: 0.6, ease: SPRING }}
          className="mx-auto max-w-3xl text-center"
        >
          <ChapterLabel title="Why movers lose jobs" />
          <h2 className="font-display text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.08] tracking-[-0.02em] text-white text-balance">
            The job is usually lost before anyone picks up the phone.
          </h2>
        </motion.div>
      </div>

      {/* Full-bleed 2×2 grid — each cell's render fades up out of the section
          colour so the heading flows straight into the images. */}
      <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 md:mt-8">
        {BEATS.map((b, i) => {
          const topRow = i < 2;
          return (
            <motion.article
              key={b.lead}
              initial={{ opacity: 0, x: i % 2 === 0 ? -44 : 44, y: 12 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: false, margin: "-12% 0px -12% 0px" }}
              transition={{ duration: 0.6, ease: SPRING, delay: (i % 2) * 0.08 }}
              className="group relative flex min-h-[400px] flex-col justify-end overflow-hidden p-8 sm:min-h-[460px] md:p-12 lg:min-h-[500px]"
              style={{
                borderRight:
                  i % 2 === 0 ? "1px solid rgba(255,255,255,0.055)" : undefined,
                borderBottom: topRow
                  ? "1px solid rgba(255,255,255,0.055)"
                  : undefined,
              }}
            >
              {/* render */}
              <img
                src={b.image}
                alt=""
                loading="lazy"
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-60 transition-[transform,opacity] duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-[0.78]"
              />
              {/* scrim — top row emerges from the section colour, all cells keep
                  the copy legible along the bottom */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: topRow
                    ? "linear-gradient(to bottom, var(--color-mono-bg) 0%, rgba(10,10,12,0.45) 16%, rgba(10,10,12,0.05) 40%, rgba(10,10,12,0.55) 78%, var(--color-mono-bg) 100%)"
                    : "linear-gradient(to bottom, rgba(10,10,12,0.28) 0%, rgba(10,10,12,0.05) 34%, rgba(10,10,12,0.62) 74%, var(--color-mono-bg) 100%)",
                }}
              />

              <div className="relative max-w-md">
                <span
                  className="font-display text-[13px] font-semibold tabular-nums tracking-[0.12em]"
                  style={{ color: "var(--color-accent-light)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                  <span className="text-white"> / 04</span>
                </span>
                <h3 className="font-display mt-3 text-[clamp(20px,2.4vw,27px)] font-semibold leading-[1.15] text-white text-balance">
                  {b.lead}
                </h3>
                <p
                  className="font-mono mt-3 text-[13px] leading-relaxed"
                  style={{ color: "#f5f5f4" }}
                >
                  {b.body}
                </p>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Closing beat — full-width display line, black field */}
      <div className="container-max relative z-10 pb-40 pt-16 text-center md:pb-56 md:pt-24">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-12% 0px -12% 0px" }}
          transition={{ duration: 0.6, ease: SPRING }}
          className="font-display mx-auto max-w-6xl text-[clamp(22px,3.1vw,40px)] font-semibold leading-[1.25] tracking-[-0.015em] text-white text-balance"
        >
          A typical regional mover fields around{" "}
          <span style={{ color: "var(--color-accent-light)" }}>
            <span className="whitespace-nowrap">5&ndash;7</span> quote requests a week
          </span>
          . Whoever gets{" "}
          <span style={{ color: "var(--color-accent-light)" }}>
            a real number back first
          </span>{" "}
          tends to book it &mdash; and right now, that&rsquo;s{" "}
          <span style={{ color: "var(--color-accent-light)" }}>rarely you</span>.
        </motion.p>
      </div>

      {/* ── Bottom seam — glow + faint network echo bleeding across the edge into
          the section below (z-0 so the next section's copy still paints on top) ── */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center"
        aria-hidden
      >
        <div
          style={{
            width: "min(1200px, 94%)",
            height: "260px",
            transform: "translateY(42%)",
            background:
              "radial-gradient(ellipse 55% 100% at 50% 100%, rgba(255,255,255,0.42) 0%, rgba(124,77,255,0.36) 30%, rgba(124,77,255,0.1) 55%, transparent 78%)",
            filter: "blur(40px)",
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-px -translate-x-1/2"
        aria-hidden
        style={{
          width: "min(760px, 70%)",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
          boxShadow:
            "0 0 20px 3px rgba(255,255,255,0.4), 0 0 50px 10px rgba(124,77,255,0.45)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-56"
        aria-hidden
        style={{
          backgroundImage: "url(/moving-and-logistics/hero-network.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center 90%",
          opacity: 0.26,
          transform: "translateY(28%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 55%, #000 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 55%, #000 100%)",
        }}
      />
    </section>
  );
}
