"use client";

import { motion } from "framer-motion";
import { Globe, Zap, Calendar, LayoutDashboard, Star, ArrowRight } from "lucide-react";
import { viewRelaxed } from "@/lib/motion-viewport";
import { useAuditForm } from "@/components/providers/AuditFormProvider";
import { RadialOrbitalTimeline, type TimelineItem } from "@/components/ui/radial-orbital-timeline";

const SPRING = [0.32, 0.72, 0, 1] as const;

const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Website & Lead Capture",
    date: "Foundation",
    content:
      "High-converting site with forms wired directly into your follow-up system so every inquiry is captured.",
    category: "Web",
    icon: Globe,
    relatedIds: [2, 5],
    status: "completed",
    energy: 85,
  },
  {
    id: 2,
    title: "Instant Follow-Up",
    date: "Automation",
    content:
      "Every inquiry gets an automatic SMS or email within 60 seconds — before they call anyone else.",
    category: "AI",
    icon: Zap,
    relatedIds: [1, 3],
    status: "in-progress",
    energy: 95,
  },
  {
    id: 3,
    title: "Appointment Booking",
    date: "Scheduling",
    content:
      "Leads book directly into your calendar. No phone tag, no back-and-forth. Jobs land while you work.",
    category: "Booking",
    icon: Calendar,
    relatedIds: [2, 4],
    status: "completed",
    energy: 80,
  },
  {
    id: 4,
    title: "CRM & Lead Tracking",
    date: "Pipeline",
    content:
      "Every inquiry tracked in one place — see who's new, booked, or needs a nudge at a glance.",
    category: "CRM",
    icon: LayoutDashboard,
    relatedIds: [3, 5],
    status: "in-progress",
    energy: 75,
  },
  {
    id: 5,
    title: "Review Automation",
    date: "Growth",
    content:
      "After every completed job, your system automatically asks for a Google review. Your rating climbs without you lifting a finger.",
    category: "Reviews",
    icon: Star,
    relatedIds: [4, 1],
    status: "upcoming",
    energy: 70,
  },
];

export default function CoreOffer() {
  const { openAuditForm } = useAuditForm();

  return (
    <section id="offer" className="relative py-20 md:py-24 overflow-hidden">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 65%)",
        }}
        aria-hidden
      />
      <hr className="section-divider absolute top-0 left-0 right-0" />

      <div className="relative z-10 container-max">
        {/* Header — left-aligned, block number replaces eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.6, ease: SPRING }}
          className="mb-12 md:mb-14 max-w-[640px]"
        >
          <span
            className="block font-sora text-[clamp(56px,8vw,96px)] font-bold leading-none tracking-tight mb-4 select-none"
            style={{ color: "rgba(139,92,246,0.12)" }}
            aria-hidden
          >
            03
          </span>
          <h2 className="font-sora text-[clamp(28px,4.5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-balance text-white">
            One connected system that turns leads into booked appointments.
          </h2>
          <p
            className="mt-4 text-[16px] leading-relaxed"
            style={{ color: "rgba(239,240,243,0.72)" }}
          >
            Five pieces. All connected. Tap any node to explore.
          </p>
        </motion.div>

        {/* Orbital timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.7, ease: SPRING, delay: 0.1 }}
          className="max-w-[580px] mx-auto"
        >
          <RadialOrbitalTimeline timelineData={timelineData} />
        </motion.div>

        {/* CTA — centered, stacked */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.55, delay: 0.2, ease: SPRING }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <button
            type="button"
            onClick={() => openAuditForm()}
            className="btn-primary group"
          >
            <span className="btn-primary-text">Book a Free Lead Conversion Audit</span>
            <span className="btn-pocket" aria-hidden>
              <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
            </span>
          </button>
          <p
            className="text-[13px] text-center"
            style={{ color: "rgba(239,240,243,0.40)" }}
          >
            15-minute call. No pitch. Just clarity on where you&apos;re losing leads.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
