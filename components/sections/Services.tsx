"use client";

import { Code2, Phone, Zap, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { viewRelaxed } from "@/lib/motion-viewport";

const services = [
  {
    icon: Code2,
    title: "Revenue That Books Itself",
    description:
      "Your business shouldn't depend on you being available 24/7 to capture every opportunity. We design systems that work while you work — so qualified leads become booked jobs without the back-and-forth.",
  },
  {
    icon: Phone,
    title: "Every Call Answered",
    description:
      "No more voicemail. No more \"sorry we missed you.\" The businesses we work with never lose a job to a missed call again. How we do it is part of the audit.",
  },
  {
    icon: Zap,
    title: "Follow-Up That Wins",
    description:
      "Leads go cold when they wait. Our clients respond in seconds, not hours — and they book more jobs because of it. The mechanics stay behind the scenes.",
  },
  {
    icon: FileText,
    title: "Operations That Scale",
    description:
      "Stop trading your time for revenue. We help service businesses grow without adding headcount — fewer manual hours, more closed deals, margins that improve.",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="pt-20 md:pt-24 pb-0"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-sora font-semibold text-neon-purple mb-2">
            The Shift
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sora font-semibold text-white text-center">
            What We Solve
          </h3>
        </motion.div>

        {/* Service cards with animated icon graphics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewRelaxed}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Card className="group h-full hover:border-brand-purple/50 hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)] hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 overflow-hidden">
                <CardHeader>
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 bg-brand-purple/20 rounded-lg blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative p-3 rounded-xl border border-brand-purple/20 bg-brand-purple/5 w-fit">
                      <service.icon className="h-8 w-8 text-brand-purple" />
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-sora font-semibold mt-4">
                    {service.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-base md:text-lg text-white/80">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
