"use client";

import { Phone, Zap, Star, Receipt, BarChart3, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { viewRelaxed } from "@/lib/motion-viewport";

const services = [
  {
    icon: Phone,
    title: "Every Call Captured",
    description:
      "No more voicemail. No more \"sorry we missed you.\" Your calls get answered 24/7, leads get qualified, and appointments land directly in your calendar—whether you're on a job site or home for dinner.",
    metric: "40% More Appointments Booked",
    metricColor: "#10B981",
  },
  {
    icon: Zap,
    title: "Instant Follow-Up",
    description:
      "Leads go cold in hours, not days. Your prospects get an SMS within 60 seconds of inquiring, stay warm with automated check-ins, and book when they're ready—no manual chasing required.",
    metric: "25% More Leads Closed",
    metricColor: "#10B981",
  },
  {
    icon: Star,
    title: "Reviews On Autopilot",
    description:
      "Every completed job becomes a review request automatically. Your Google rating climbs while you sleep, and you stay ahead of competitors without ever asking customers manually.",
    metric: "3-5 New Reviews Every Month",
    metricColor: "#10B981",
  },
  {
    icon: Receipt,
    title: "Quotes In Seconds",
    description:
      "Customer fills out a form, they get a detailed quote via text or email instantly. No more spending your evenings writing estimates—close deals faster because you're the first to put a number in front of them.",
    metric: "5-10 Hours Saved Per Week",
    metricColor: "#3B82F6",
  },
  {
    icon: BarChart3,
    title: "Custom Operating Systems",
    description:
      "Custom dashboards that show bookings, revenue, and customer data in one place. Manage your entire business from your phone without hiring another admin—growth without adding headcount.",
    metric: "15+ Hours Saved Per Week",
    metricColor: "#3B82F6",
  },
  {
    icon: Globe,
    title: "Websites That Convert",
    description:
      "Fast, modern sites built for one job: turning visitors into booked appointments. No WordPress bloat, no outdated design—just clean code, mobile-first, and live in under two weeks.",
    metric: "Live In 1-2 Weeks",
    metricColor: "#7C3AED",
  },
];

export default function Services() {
  return (
    <section id="services" className="pt-20 md:pt-24 pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-sora font-semibold text-white mb-6">
            What We Solve
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            The businesses we work with book{" "}
            <span className="text-[#7C3AED]">40% more appointments</span> and
            save <span className="text-[#7C3AED]">15+ hours per week</span>.
            Here's what that looks like:
          </p>
        </motion.div>

        {/* 6-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
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
                className="group h-full"
              >
                <div
                  className="h-full p-8 md:p-10 rounded-3xl transition-all duration-300 hover:translate-y-[-4px] flex flex-col"
                  style={{
                    background: "rgba(17, 24, 39, 0.6)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(124, 58, 237, 0.2)",
                    boxShadow: "0 0 50px rgba(124, 58, 237, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(124, 58, 237, 0.4)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 70px rgba(124, 58, 237, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(124, 58, 237, 0.2)";
                    e.currentTarget.style.boxShadow =
                      "0 0 50px rgba(124, 58, 237, 0.3)";
                  }}
                >
                  {/* Icon circle */}
                  <div className="mb-6 inline-block">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: "rgba(124, 58, 237, 0.1)",
                        border: "1px solid rgba(124, 58, 237, 0.3)",
                        boxShadow: "0 0 30px rgba(124, 58, 237, 0.4)",
                      }}
                    >
                      <Icon className="w-10 h-10" style={{ color: "#A78BFA" }} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-sora font-semibold text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-base leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>

                  {/* Metric badge */}
                  <div
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                      background: `rgba(${parseInt(service.metricColor.slice(1, 3), 16)}, ${parseInt(service.metricColor.slice(3, 5), 16)}, ${parseInt(service.metricColor.slice(5, 7), 16)}, 0.1)`,
                      border: `1px solid rgba(${parseInt(service.metricColor.slice(1, 3), 16)}, ${parseInt(service.metricColor.slice(3, 5), 16)}, ${parseInt(service.metricColor.slice(5, 7), 16)}, 0.3)`,
                      color: service.metricColor,
                    }}
                  >
                    {service.metric}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
