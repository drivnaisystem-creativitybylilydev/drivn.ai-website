"use client";

import { useState, useEffect, useCallback, type SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuditForm } from "@/components/providers/AuditFormProvider";

const navLinks = [
  { href: "#problem",      label: "Problem" },
  { href: "#services",     label: "Services" },
  { href: "#work",         label: "Results" },
  { href: "#how-it-works", label: "Process" },
  { href: "#industries",   label: "Industries" },
];

export default function Navigation() {
  const [scrolled, setScrolled]      = useState(false);
  const [sheetOpen, setSheetOpenRaw] = useState(false);
  const { openAuditForm }            = useAuditForm();

  const setSheetOpen = useCallback((value: SetStateAction<boolean>) => {
    setSheetOpenRaw((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      return typeof next === "boolean" ? next : false;
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8,9,26,0.92)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
      }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container-max">
        <div className="flex items-center justify-between h-16 md:h-[68px]">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/brand/writingonlylogo.png"
              alt="Drivn.AI"
              width={200}
              height={100}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="h-9 px-4 flex items-center rounded-full text-[13.5px] font-medium text-white/55 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              onClick={() => openAuditForm()}
              className="group inline-flex items-center gap-2.5 pl-5 pr-1.5 py-1.5 rounded-full bg-white text-brand-dark font-semibold text-[13px] tracking-tight transition-transform duration-500 ease-spring active:scale-[0.97] cursor-pointer"
            >
              <span>Book Free Audit</span>
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center bg-black/10 transition-transform duration-500 ease-spring group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
                style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.55)" }}
                aria-hidden
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet
              open={sheetOpen}
              onOpenChange={(next) => {
                if (typeof next === "boolean") setSheetOpen(next);
              }}
            >
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="h-9 w-9 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                  aria-label="Open menu"
                >
                  <Menu className="h-[18px] w-[18px]" />
                </button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[min(300px,calc(100vw-2rem))] bg-surface border-white/[0.08]"
              >
                <SheetHeader className="mb-8">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <Image
                    src="/brand/writingonlylogo.png"
                    alt="Drivn.AI"
                    width={180}
                    height={90}
                    className="h-9 w-auto"
                  />
                </SheetHeader>

                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSheetOpen(false)}
                      className="flex min-h-11 items-center px-3 rounded-xl text-base text-white/70 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setSheetOpen(false);
                      openAuditForm();
                    }}
                    className="w-full justify-center inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-semibold text-white transition-opacity duration-200 hover:opacity-90 active:scale-[0.97]"
                    style={{ background: "#8b5cf6" }}
                  >
                    Book Free Audit
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
