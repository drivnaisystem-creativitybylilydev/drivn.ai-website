"use client";

import { motion } from "framer-motion";
import {
  TreePine,
  Home,
  Sun,
  Snowflake,
  Sparkles,
  Activity,
  ShoppingBag,
  Droplets,
  Zap,
  Paintbrush,
  Car,
  Scissors,
  Thermometer,
  Truck,
  Key,
  Bug,
  Wrench,
  Shirt,
  Dumbbell,
  SprayCan,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuditForm } from "@/components/providers/AuditFormProvider";

const industries: { label: string; Icon: LucideIcon }[] = [
  { label: "Landscaping", Icon: TreePine },
  { label: "Roofing", Icon: Home },
  { label: "Solar", Icon: Sun },
  { label: "Snowplowing", Icon: Snowflake },
  { label: "Med Spas", Icon: Sparkles },
  { label: "Dental Clinics", Icon: Activity },
  { label: "E-Commerce", Icon: ShoppingBag },
  { label: "Plumbing", Icon: Droplets },
  { label: "Electricians", Icon: Zap },
  { label: "Painters", Icon: Paintbrush },
  { label: "Car Detailers", Icon: Car },
  { label: "Barbers", Icon: Scissors },
  { label: "HVAC", Icon: Thermometer },
  { label: "Moving", Icon: Truck },
  { label: "Locksmiths", Icon: Key },
  { label: "Pest Control", Icon: Bug },
  { label: "Auto Repair", Icon: Wrench },
  { label: "Dry Cleaning", Icon: Shirt },
  { label: "Gyms", Icon: Dumbbell },
  { label: "Cleaning", Icon: SprayCan },
];

// Teaser row - more industries that fade out
const teaserIndustries: { label: string; Icon: LucideIcon }[] = [
  { label: "Pool Service", Icon: Droplets },
  { label: "Flooring", Icon: Home },
  { label: "Handyman", Icon: Wrench },
  { label: "Photography", Icon: Sparkles },
  { label: "Catering", Icon: ShoppingBag },
  { label: "Event Planning", Icon: Sparkles },
  { label: "Pet Grooming", Icon: Scissors },
  { label: "Tutoring", Icon: Activity },
  { label: "Real Estate", Icon: Home },
  { label: "Legal", Icon: Activity },
];

export default function IndustriesWeServe() {
  const { openAuditForm } = useAuditForm();

  return (
    <section id="industries" className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-sora font-semibold text-center text-white mb-12 md:mb-16"
        >
          Industries We Serve
        </motion.h2>

        {/* Main grid of industries */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3 md:gap-4 mb-8">
          {industries.map(({ label, Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.4,
                delay: i * 0.03,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-brand-purple/40 hover:bg-brand-purple/10 transition-all duration-300"
            >
              <div className="p-2.5 rounded-lg bg-brand-purple/20 border border-brand-purple/20 group-hover:border-brand-purple/40 transition-colors">
                <Icon className="h-6 w-6 md:h-7 md:w-7 text-brand-purple-light" />
              </div>
              <span className="text-xs md:text-sm font-medium text-white/90 text-center leading-tight">
                {label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Teaser row - dark purple gradient mist from bottom, covers more, cards half blurred */}
        <div className="relative mb-12 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3 md:gap-4"
          >
            {teaserIndustries.map(({ label, Icon }) => (
              <div
                key={label}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-brand-purple/40 hover:bg-brand-purple/10 transition-all duration-300"
              >
                <div className="p-2.5 rounded-lg bg-brand-purple/20 border border-brand-purple/20 group-hover:border-brand-purple/40 transition-colors">
                  <Icon className="h-6 w-6 md:h-7 md:w-7 text-brand-purple-light" />
                </div>
                <span className="text-xs md:text-sm font-medium text-white/90 text-center leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
          {/* Clean gradient mist - bottom 65% fades to dark purple */}
          <div
            className="absolute left-0 right-0 bottom-0 h-[65%] pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, #0a0a1a 0%, #150a20 25%, #1e0f35 50%, transparent 100%)",
            }}
            aria-hidden
          />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            className="px-8 bg-violet-900 hover:bg-violet-800 shadow-[0_0_24px_rgba(88,28,135,0.6)]"
            onClick={openAuditForm}
          >
            Book Free Audit
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
