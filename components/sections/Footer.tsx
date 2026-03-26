"use client";

import Image from "next/image";
import Link from "next/link";
import { Linkedin, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-8 md:py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Image
            src="/brand/logo-nobg.png"
            alt="Drivn.AI"
            width={100}
            height={34}
            className="h-8 w-auto drop-shadow-[0_0_20px_rgba(88,28,135,0.6)]"
          />
          <span className="text-sm text-white/60">© 2026 Drivn.AI</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center text-white/60 transition-colors hover:text-white active:scale-95"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center text-white/60 transition-colors hover:text-white active:scale-95"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </Link>
          <Link
            href="mailto:hello@drivn.ai"
            className="flex h-11 w-11 items-center justify-center text-white/60 transition-colors hover:text-white active:scale-95"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
