"use client";

import { motion } from "framer-motion";
import { Globe, TrendingUp, Phone, Zap, Settings2 } from "lucide-react";
import { viewRelaxed } from "@/lib/motion-viewport";

const SPRING = [0.32, 0.72, 0, 1] as const;

// ── Tag pill pattern (replaces CheckCircle2 bullet list) ──────────────────
function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-auto pt-4">
      {items.map((tag) => (
        <span
          key={tag}
          className="inline-flex text-[11px] font-medium px-2.5 py-[5px] rounded-full"
          style={{
            background: "rgba(139,92,246,0.07)",
            color: "rgba(167,139,250,0.72)",
            border: "1px solid rgba(139,92,246,0.14)",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

// ── Doppelrand card shell ─────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="doppelrand-shell h-full">
      <div className={`doppelrand-core p-7 h-full flex flex-col ${className}`}>
        {children}
      </div>
    </div>
  );
}

// ── Inline icon + heading ─────────────────────────────────────────────────
function CardHead({
  icon: Icon,
  title,
}: {
  icon: React.ElementType<React.SVGProps<SVGSVGElement> & { strokeWidth?: number }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <Icon
        style={{ width: 18, height: 18, color: "#a78bfa", flexShrink: 0 }}
        strokeWidth={1.75}
      />
      <h3 className="font-sora text-[17px] font-semibold text-white leading-tight">
        {title}
      </h3>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
export default function Services() {
  return (
    <section id="services" className="relative py-14 md:py-20 overflow-hidden">
      <div className="container-max">

        {/* Header — left-aligned, no eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.6, ease: SPRING }}
          className="mb-10 md:mb-12"
        >
          <div className="flex items-center gap-3 mb-5">
            <div style={{ width: 28, height: 1, background: "rgba(139,92,246,0.55)", borderRadius: 1 }} />
            <span
              className="text-[11px] font-medium uppercase tracking-[0.20em]"
              style={{ color: "rgba(139,92,246,0.60)" }}
            >
              What We Build
            </span>
          </div>
          <h2 className="font-sora text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] max-w-[580px] text-balance text-white">
            Everything your business needs to turn leads into booked jobs.
          </h2>
        </motion.div>

        {/* ── Row 1: AI Receptionist (wide) + Instant Follow-Up (narrow) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-4 mb-4">

          {/* Card 1 — AI Receptionist: hero card, y entrance */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewRelaxed}
            transition={{ duration: 0.6, ease: SPRING, delay: 0.05 }}
            className="h-full"
          >
            <Card>
              <CardHead icon={Phone} title="AI Receptionist" />
              <p
                className="text-[14px] leading-relaxed mb-2"
                style={{ color: "rgba(239,240,243,0.72)" }}
              >
                An AI that answers calls, chats, and form submissions around the clock — qualifying inquiries and booking appointments without you picking up the phone. Runs while you work.
              </p>
              <div
                className="my-4 rounded-xl px-4 py-3"
                style={{
                  background: "rgba(139,92,246,0.05)",
                  border: "1px solid rgba(139,92,246,0.12)",
                }}
              >
                <span
                  className="text-[13px] font-semibold font-sora"
                  style={{ color: "#a78bfa" }}
                >
                  &ldquo;You missed 11 calls last month. That&apos;s 11 potential jobs.&rdquo;
                </span>
              </div>
              <Tags
                items={["Answers calls 24/7", "Qualifies leads", "Books to calendar", "No staff needed"]}
              />
            </Card>
          </motion.div>

          {/* Card 2 — Instant Follow-Up: x entrance from right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewRelaxed}
            transition={{ duration: 0.6, ease: SPRING, delay: 0.12 }}
            className="h-full"
          >
            <Card>
              <CardHead icon={Zap} title="Instant Follow-Up" />
              <p
                className="text-[14px] leading-relaxed"
                style={{ color: "rgba(239,240,243,0.72)" }}
              >
                Every new inquiry gets an automatic SMS or email within seconds — before they contact anyone else. Speed is your biggest competitive advantage.
              </p>
              <Tags
                items={["SMS + email under 60s", "Nurture sequences", "Cold lead re-engagement", "Source-based triggers"]}
              />
            </Card>
          </motion.div>
        </div>

        {/* ── Row 2: Website + Visibility (narrow) + Automation (wide) — inverted ratio ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-4">

          {/* Card 3 — Website & Visibility: x entrance from left */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewRelaxed}
            transition={{ duration: 0.6, ease: SPRING, delay: 0.08 }}
            className="h-full"
          >
            <Card>
              {/* Two sub-services in one card */}
              <div className="flex flex-col gap-5 h-full">
                <div>
                  <CardHead icon={Globe} title="Website & Lead Capture" />
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "rgba(239,240,243,0.68)" }}
                  >
                    Designed to convert, not just look good. Live in under 2 weeks with forms wired to your follow-up system.
                  </p>
                </div>
                <div
                  className="border-t"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                />
                <div className="flex-1">
                  <CardHead icon={TrendingUp} title="Visibility & Trust" />
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "rgba(239,240,243,0.68)" }}
                  >
                    Automatic review requests, Google Business Profile optimization, and local SEO — so your reputation grows on autopilot.
                  </p>
                </div>
                <Tags items={["Live in 2 weeks", "Auto reviews", "Local SEO", "Google profile"]} />
              </div>
            </Card>
          </motion.div>

          {/* Card 4 — Automation & Operations: y entrance from below */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewRelaxed}
            transition={{ duration: 0.6, ease: SPRING, delay: 0.15 }}
            className="h-full"
          >
            <Card>
              <CardHead icon={Settings2} title="Automation & Operations" />
              <p
                className="text-[14px] leading-relaxed mb-2"
                style={{ color: "rgba(239,240,243,0.72)" }}
              >
                Stop doing manually what a system can do for you. Confirmations, reminders, follow-up sequences, and pipeline updates — all running on autopilot so you can focus on the job.
              </p>
              {/* Stat callout */}
              <div className="flex gap-6 my-4">
                {[
                  { value: "3.2×", label: "more leads contacted" },
                  { value: "—47%", label: "admin time saved" },
                ].map(({ value, label }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span
                      className="font-sora text-[22px] font-semibold leading-none"
                      style={{ color: "#a78bfa" }}
                    >
                      {value}
                    </span>
                    <span
                      className="text-[11px] leading-snug"
                      style={{ color: "rgba(239,240,243,0.42)" }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <Tags
                items={["Appointment reminders", "Follow-up sequences", "CRM pipeline", "Custom workflows"]}
              />
            </Card>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
