"use client";

import { useState, useEffect, useCallback, type SetStateAction } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Link as IntlLink } from "@/i18n/navigation";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { useAuditForm } from "@/components/providers/AuditFormProvider";

const SPRING = { type: "spring" as const, stiffness: 340, damping: 30 };

export default function Navigation() {
  const t = useTranslations("Navigation");
  const locale = useLocale();

  const navLinks = [
    { href: "#problem", label: t("problem") },
    { href: "#systems", label: t("services") },
    { href: "#process", label: t("process") },
    { href: "#work", label: t("results") },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpenRaw] = useState(false);
  const { openAuditForm } = useAuditForm();

  const setMenuOpen = useCallback((value: SetStateAction<boolean>) => {
    setMenuOpenRaw((prev) => (typeof value === "function" ? value(prev) : value));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen, setMenuOpen]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-8 z-50 w-full flex items-center justify-between h-20 md:h-24 px-6 md:px-10 transition-colors duration-500"
        style={{
          // Solid-enough dark fill so the bar stays legible over both dark AND the light
          // Trust section — a faint tint previously washed out to near-invisible there.
          background: scrolled ? "rgba(10,10,12,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
        }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <IntlLink href="/" locale={locale} className="flex items-center shrink-0">
          <span className="font-display font-bold tracking-tight text-[26px] md:text-[30px] leading-none">
            <span className="text-white">Drivn</span>
            <span style={{ color: "var(--color-accent-light)" }}>.ai</span>
          </span>
        </IntlLink>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1 font-display">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="h-9 px-4 flex items-center rounded-full text-[13.5px] font-medium text-white/50 hover:text-white transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => openAuditForm()}
            className="group inline-flex items-center gap-2.5 pl-5 pr-1.5 py-1.5 rounded-full bg-white text-[#0a0a0c] font-display font-semibold text-[13px] tracking-tight transition-transform duration-500 ease-spring active:scale-[0.97] cursor-pointer"
          >
            <span>{t("cta")}</span>
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center bg-black/10 transition-transform duration-500 ease-spring group-hover:translate-x-[2px] group-hover:-translate-y-[1px]"
              aria-hidden
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="md:hidden h-10 w-10 flex items-center justify-center rounded-full text-white/70 hover:text-white transition-colors duration-200"
          aria-label="Open menu"
        >
          <List size={20} weight="light" />
        </button>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col"
            style={{ background: "rgba(10,10,12,0.97)", backdropFilter: "blur(24px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container-max flex items-center justify-between h-16 pt-4">
              <span className="font-display font-bold tracking-tight text-[22px] leading-none">
                <span className="text-white">Drivn</span>
                <span style={{ color: "var(--color-accent-light)" }}>.ai</span>
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full text-white/70 hover:text-white transition-colors duration-200"
                aria-label="Close menu"
              >
                <X size={20} weight="light" />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center container-max gap-2 font-display">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING, delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 text-[32px] font-medium tracking-tight text-white/85 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="container-max pb-10 flex flex-col gap-4">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openAuditForm();
                }}
                className="w-full justify-center inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-[15px] font-display font-semibold bg-white text-[#0a0a0c] active:scale-[0.97] transition-transform duration-300"
              >
                {t("cta")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
