"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  UserX,
  FileText,
  DollarSign,
  X,
  Check,
  Zap,
  ArrowRight,
  ArrowDown,
  Globe2,
  MonitorSmartphone,
  CalendarCheck2,
} from "lucide-react";

export default function ChaosToOrderGraphic() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const chaosItems = [
    {
      Icon: UserX,
      label: "Missed Leads",
      iconClass: "text-red-400/80",
      delay: 0,
    },
    {
      Icon: FileText,
      label: "Manual Entry",
      iconClass: "text-orange-400/70",
      delay: 0.12,
    },
    {
      Icon: DollarSign,
      label: "Lost Revenue",
      iconClass: "text-red-500/70",
      delay: 0.24,
    },
    {
      Icon: Globe2,
      label: "Weak Digital Presence",
      iconClass: "text-orange-400/65",
      delay: 0.36,
    },
    {
      Icon: MonitorSmartphone,
      label: "Website Isn’t a Sales Channel",
      iconClass: "text-red-400/65",
      delay: 0.48,
    },
  ];

  const orderItems = [
    {
      Icon: CalendarCheck2,
      label: "Interested leads followed up & booked",
      iconClass: "text-green-400",
      delay: 0,
    },
    {
      Icon: Zap,
      label: "Instant Follow-Up",
      iconClass: "text-brand-purple",
      delay: 0.12,
    },
    {
      Icon: FileText,
      label: "Automated Quotes",
      iconClass: "text-blue-400",
      delay: 0.24,
    },
    {
      Icon: DollarSign,
      label: "Revenue Captured",
      iconClass: "text-green-400",
      delay: 0.36,
    },
    {
      Icon: Globe2,
      label: "Digital Presence That Drives Revenue",
      iconClass: "text-brand-purple-light",
      delay: 0.48,
    },
  ];

  return (
    <div
      ref={ref}
      className="flex h-full w-full min-w-0 flex-col items-stretch justify-center gap-6 p-4 md:flex-row md:items-stretch md:justify-center md:gap-5 lg:gap-6 md:p-6"
    >
      {/* LEFT — Before (structured list, problem styling) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.6 }}
        className="flex min-h-[22rem] w-full min-w-0 flex-1 basis-0 flex-col rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/30 to-orange-950/15 p-6 backdrop-blur-sm md:min-h-[26rem] md:p-8"
      >
        <p className="mb-5 text-xs font-medium uppercase tracking-wider text-red-400/80 md:mb-6">
          Before Drivn.AI
        </p>
        <div className="flex flex-col gap-1">
          {chaosItems.map(({ Icon, label, iconClass, delay }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.08 + delay, duration: 0.45 }}
              whileHover={{ x: 2 }}
              className="group flex items-start gap-3 rounded-lg py-2 md:gap-3.5 md:py-2.5"
            >
              <div className="relative mt-0.5 shrink-0">
                <Icon className={`h-7 w-7 md:h-8 md:w-8 ${iconClass}`} strokeWidth={1.75} />
                <span className="absolute -bottom-0.5 -right-0.5 flex rounded-full bg-black/90 p-0.5">
                  <X className="h-3 w-3 text-red-400 md:h-4 md:w-4" strokeWidth={3} />
                </span>
              </div>
              <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-white/90">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CENTER — Arrow (mobile: down, desktop: right) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.35, duration: 0.45, type: "spring", stiffness: 260, damping: 20 }}
        className="flex shrink-0 flex-col items-center self-center md:self-stretch md:justify-center"
      >
        <div className="flex flex-col items-center md:hidden">
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-full border-2 border-brand-purple/40 bg-brand-purple/20 p-2.5"
          >
            <ArrowDown className="h-8 w-8 text-brand-purple" />
          </motion.div>
          <span className="mt-2 font-sora text-xs text-brand-purple">We Fix Here</span>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="hidden flex-col items-center md:flex"
        >
          <div className="rounded-full border-2 border-brand-purple/40 bg-brand-purple/20 p-3">
            <ArrowRight className="h-10 w-10 text-brand-purple md:h-12 md:w-12" />
          </div>
          <span className="mt-2 font-sora text-xs text-brand-purple">We Fix Here</span>
        </motion.div>
      </motion.div>

      {/* RIGHT — After (order) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.15 }}
        className="flex min-h-[22rem] w-full min-w-0 flex-1 basis-0 flex-col rounded-2xl border border-brand-purple/30 bg-gradient-to-br from-purple-950/25 to-blue-950/15 p-6 shadow-[0_0_40px_rgba(139,92,246,0.12)] backdrop-blur-sm md:min-h-[26rem] md:p-8"
      >
        <p className="mb-5 text-xs font-medium uppercase tracking-wider text-brand-purple/80 md:mb-6">
          After Drivn.AI
        </p>
        <div className="flex flex-col gap-1">
          {orderItems.map(({ Icon, label, iconClass, delay }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.25 + delay, duration: 0.5 }}
              whileHover={{ x: 4 }}
              className="group flex items-start gap-3 rounded-lg py-2 md:gap-3.5 md:py-2.5"
            >
              <div className="relative mt-0.5 shrink-0">
                <Icon className={`h-7 w-7 md:h-8 md:w-8 ${iconClass}`} strokeWidth={1.75} />
                <motion.span
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: delay * 0.5 }}
                  className="absolute -bottom-0.5 -right-0.5 flex rounded-full bg-black/90 p-0.5"
                >
                  <Check className="h-3 w-3 text-green-400 md:h-4 md:w-4" strokeWidth={3} />
                </motion.span>
              </div>
              <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-white/90">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
