"use client";

import { useState, useEffect, useCallback, type SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuditForm } from "@/components/providers/AuditFormProvider";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#problem", label: "Problem" },
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#industries", label: "Industries" },
  { href: "#integrations", label: "Stack" },
  { href: "#work", label: "Results" },
  { href: "#why-us", label: "Why Us" },
  { href: "#contact", label: "Contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [sheetOpen, setSheetOpenRaw] = useState(false);
  const { openAuditForm } = useAuditForm();

  const setSheetOpen = useCallback((value: SetStateAction<boolean>) => {
    setSheetOpenRaw((prev) => {
      const safePrev = typeof prev === "boolean" ? prev : false;
      const next = typeof value === "function" ? value(safePrev) : value;
      return typeof next === "boolean" ? next : false;
    });
  }, []);

  const sheetIsOpen = sheetOpen === true;

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "backdrop-blur-xl bg-brand-dark/80 border-b border-white/5" : ""
      )}
    >
      <nav className="max-w-screen-2xl mx-auto px-3 sm:px-4 md:px-5 lg:px-5 xl:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/brand/writingonlylogo.png"
            alt="Drivn.AI"
            width={280}
            height={80}
            className="h-12 md:h-16 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button type="button" onClick={() => openAuditForm()}>
              Book Free Audit
            </Button>
          </motion.div>
        </div>

        <div className="md:hidden flex-1" />
        <div className="md:hidden">
          <Sheet
            open={sheetIsOpen}
            onOpenChange={(next) => {
              if (typeof next === "boolean") setSheetOpen(next);
            }}
          >
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(280px,calc(100vw-2rem))]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSheetOpen(false)}
                    className="flex min-h-11 items-center rounded-md py-2 text-lg text-white/80 transition-colors hover:text-white active:bg-white/5"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button
                  type="button"
                  onClick={() => {
                    setSheetOpen(false);
                    openAuditForm();
                  }}
                  className="mt-4 w-full"
                >
                  Book Free Audit
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Calendly Dialog - shared between desktop and mobile */}
    </header>
  );
}
