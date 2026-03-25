"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Phone,
  AlertTriangle,
  Clock,
  FileText,
  DollarSign,
  X,
  Check,
  Zap,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

const chaosFloat = {
  duration: 4,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export default function ChaosToOrderGraphic() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const orderItems = [
    {
      Icon: Phone,
      label: "All Calls Answered",
      iconClass: "text-green-400",
      delay: 0,
    },
    {
      Icon: Zap,
      label: "Instant Follow-Up",
      iconClass: "text-brand-purple",
      delay: 0.2,
    },
    {
      Icon: FileText,
      label: "Automated Quotes",
      iconClass: "text-blue-400",
      delay: 0.4,
    },
    {
      Icon: DollarSign,
      label: "Revenue Captured",
      iconClass: "text-green-400",
      delay: 0.6,
    },
  ];

  return (
    <div
      ref={ref}
      className="flex h-full w-full flex-col items-center justify-center gap-6 p-4 md:flex-row md:gap-8 md:p-6"
    >
      {/* LEFT — Before (chaos) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.6 }}
        className="relative h-[22rem] w-full overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/30 to-orange-950/15 p-6 backdrop-blur-sm md:h-96 md:w-80 md:p-8"
      >
        <p className="mb-6 text-xs font-medium uppercase tracking-wider text-red-400/80 md:mb-8">
          Before Drivn.AI
        </p>

        {/* Missed call */}
        <motion.div
          className="absolute left-[12%] top-[18%]"
          animate={{
            x: [0, 6, -4, 0],
            y: [0, -6, 8, 0],
            rotate: [-12, -10, -14, -12],
          }}
          transition={{ ...chaosFloat, duration: 5 }}
        >
          <div className="relative">
            <Phone className="h-9 w-9 text-red-400/60 md:h-10 md:w-10" strokeWidth={1.5} />
            <X className="absolute -right-1 -top-1 h-4 w-4 text-red-300 md:h-5 md:w-5" strokeWidth={3} />
          </div>
        </motion.div>
        <span className="absolute left-[8%] top-[38%] text-[10px] text-red-400/60 opacity-70 md:text-xs">
          Missed Calls
        </span>

        {/* Warning */}
        <motion.div
          className="absolute right-[15%] top-[22%]"
          animate={{
            x: [0, -5, 5, 0],
            y: [0, 4, -4, 0],
            rotate: [6, 4, 8, 6],
          }}
          transition={{ ...chaosFloat, duration: 3.2 }}
        >
          <AlertTriangle className="h-10 w-10 text-orange-400/60 md:h-12 md:w-12" />
        </motion.div>

        {/* Clock */}
        <motion.div
          className="absolute bottom-[38%] left-[20%]"
          animate={{
            x: [0, 4, 0],
            y: [0, 6, 0],
            rotate: [3, 0, 3],
          }}
          transition={{ ...chaosFloat, duration: 6 }}
        >
          <Clock className="h-7 w-7 text-red-400/50 md:h-8 md:w-8" />
        </motion.div>
        <span className="absolute bottom-[28%] left-[12%] text-[10px] text-orange-400/60 opacity-70 md:text-xs">
          Manual Entry
        </span>

        {/* File manual */}
        <motion.div
          className="absolute right-[8%] top-[45%]"
          animate={{
            x: [0, -4, 4, 0],
            y: [0, -5, 5, 0],
            rotate: [-6, -4, -8, -6],
          }}
          transition={{ ...chaosFloat, duration: 4.5 }}
        >
          <FileText className="h-9 w-9 text-orange-400/50 md:h-11 md:w-11" />
        </motion.div>

        {/* Lost money */}
        <motion.div
          className="absolute bottom-[14%] right-[22%]"
          animate={{
            y: [0, 8, 4, 0],
            rotate: [12, 14, 10, 12],
          }}
          transition={{ ...chaosFloat, duration: 5.5 }}
        >
          <div className="relative">
            <DollarSign className="h-12 w-12 text-red-500/60 md:h-14 md:w-14" strokeWidth={1.5} />
            <X className="absolute right-0 top-0 h-4 w-4 text-red-300 md:h-5 md:w-5" strokeWidth={3} />
          </div>
        </motion.div>
        <span className="absolute bottom-[8%] right-[12%] text-[10px] text-red-400/60 opacity-70 md:text-xs">
          Lost Revenue
        </span>

        {/* Small alert */}
        <motion.div
          className="absolute right-[8%] top-[8%]"
          animate={{
            scale: [1, 1.15, 1],
            y: [0, -3, 0],
            rotate: [-3, -5, -3],
          }}
          transition={{ ...chaosFloat, duration: 2.5 }}
        >
          <AlertTriangle className="h-5 w-5 text-red-300/50 md:h-6 md:w-6" />
        </motion.div>
      </motion.div>

      {/* CENTER — Arrow (mobile: down, desktop: right) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.35, duration: 0.45, type: "spring", stiffness: 260, damping: 20 }}
        className="flex shrink-0 flex-col items-center"
      >
        {/* Mobile: vertical */}
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
        {/* Desktop: horizontal */}
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
        className="h-[22rem] w-full rounded-2xl border border-brand-purple/30 bg-gradient-to-br from-purple-950/25 to-blue-950/15 p-6 shadow-[0_0_40px_rgba(139,92,246,0.12)] backdrop-blur-sm md:h-96 md:w-80 md:p-8"
      >
        <p className="mb-6 text-xs font-medium uppercase tracking-wider text-brand-purple/80 md:mb-8">
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
              className="group flex items-center gap-3 rounded-lg py-2 md:gap-4 md:py-2.5"
            >
              <div className="relative shrink-0">
                <Icon className={`h-7 w-7 md:h-8 md:w-8 ${iconClass}`} strokeWidth={1.75} />
                <motion.span
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: delay * 0.5 }}
                  className="absolute -bottom-0.5 -right-0.5 flex rounded-full bg-black/90 p-0.5"
                >
                  <Check className="h-3 w-3 text-green-400 md:h-4 md:w-4" strokeWidth={3} />
                </motion.span>
              </div>
              <span className="text-sm font-medium text-white/90">{label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
