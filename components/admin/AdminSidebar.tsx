"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users2,
  Briefcase,
  TrendingUp,
  Terminal,
  ArrowLeft,
  Zap,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview", exact: true },
  { href: "/admin/leads", icon: Users2, label: "Leads", exact: false },
  { href: "/admin/clients", icon: Briefcase, label: "Clients", exact: false },
  { href: "/admin/revenue", icon: TrendingUp, label: "Revenue", exact: false },
  { href: "/admin/agents", icon: Terminal, label: "Agents", exact: false },
  { href: "/admin/sourced-leads", icon: Zap, label: "Sourced Leads", exact: false },
  { href: "/admin/internal-files", icon: BookOpen, label: "Internal Files", exact: false },
];

// Remote Control removed — Finn works from Claude Code directly

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  expanded,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  expanded: boolean;
}) {
  return (
    <Link href={href} className="block">
      <div
        className={cn(
          "relative flex h-11 items-center overflow-hidden transition-colors",
          active
            ? "bg-brand-purple/[0.12] text-white"
            : "text-white/40 hover:bg-white/[0.04] hover:text-white/70",
        )}
      >
        {/* Active left border */}
        {active && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute left-0 top-0 h-full w-[2px] bg-brand-purple shadow-[0_0_8px_rgba(139,92,246,0.9)]"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}

        {/* Icon */}
        <div className="flex w-14 shrink-0 items-center justify-center">
          <Icon
            className={cn(
              "h-4 w-4 transition-colors",
              active ? "text-brand-purple-light" : "text-current",
            )}
          />
        </div>

        {/* Label */}
        <AnimatePresence>
          {expanded && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "whitespace-nowrap font-inter text-[0.8rem] font-medium",
                active ? "text-white" : "text-current",
              )}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
}

export function AdminSidebar() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <motion.aside
      animate={{ width: expanded ? 220 : 56 }}
      transition={{ type: "spring", stiffness: 420, damping: 38 }}
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      className="fixed left-0 top-0 z-50 flex h-full flex-col overflow-hidden border-r border-white/[0.06]"
      style={{ background: "rgba(4,4,14,0.97)", backdropFilter: "blur(12px)" }}
    >
      {/* Subtle scanline texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,92,246,1) 2px, rgba(139,92,246,1) 3px)",
          backgroundSize: "100% 6px",
        }}
      />

      {/* Header */}
      <div className="relative flex h-14 items-center border-b border-white/[0.06]">
        <div className="flex w-14 shrink-0 items-center justify-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-brand-purple/40 bg-brand-purple/20 shadow-[0_0_12px_rgba(139,92,246,0.5)]">
            <Zap className="h-3.5 w-3.5 text-brand-purple-light" />
          </div>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <p className="whitespace-nowrap font-inter text-[0.6rem] font-bold uppercase tracking-[0.22em] text-brand-purple-light/80">
                Drivn.AI
              </p>
              <p className="whitespace-nowrap font-inter text-[0.55rem] font-bold uppercase tracking-[0.18em] text-white/30">
                Operating System
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 py-2">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href, item.exact)}
            expanded={expanded}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="relative border-t border-white/[0.06]">
        <Link href="/" className="block">
          <div className="flex h-11 items-center text-white/30 transition-colors hover:bg-white/[0.04] hover:text-white/60">
            <div className="flex w-14 shrink-0 items-center justify-center">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap font-inter text-[0.8rem]"
                >
                  Back to site
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Link>
      </div>
    </motion.aside>
  );
}
