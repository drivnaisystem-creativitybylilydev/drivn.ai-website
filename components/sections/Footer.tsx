"use client";

import Image from "next/image";
import Link from "next/link";
import { Linkedin, Instagram, Mail } from "lucide-react";

const footerLinks = [
  { href: "#problem",    label: "Problem" },
  { href: "#services",   label: "Services" },
  { href: "#work",       label: "Results" },
  { href: "#how-it-works", label: "Process" },
  { href: "#industries", label: "Industries" },
  { href: "#contact",    label: "Contact" },
];

export default function Footer() {
  return (
    <footer
      className="relative border-t py-10 md:py-14"
      style={{ borderColor: "rgba(255,255,255,0.07)" }}
    >
      <div className="container-max">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Image
              src="/brand/writingonlylogo.png"
              alt="Drivn.AI"
              width={200}
              height={100}
              className="h-10 w-auto"
            />
            <p
              className="text-[13px] max-w-[220px] leading-relaxed"
              style={{ color: "rgba(239,240,243,0.38)" }}
            >
              AI Growth Partner for Service Businesses Ready to Scale.
            </p>
            <span
              className="text-[12px]"
              style={{ color: "rgba(239,240,243,0.28)" }}
            >
              © 2026 Drivn.AI
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] transition-colors duration-200"
                style={{ color: "rgba(239,240,243,0.45)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "#eff0f3")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "rgba(239,240,243,0.45)")
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-1">
            {[
              {
                href: "https://linkedin.com",
                label: "LinkedIn",
                Icon: Linkedin,
              },
              {
                href: "https://instagram.com",
                label: "Instagram",
                Icon: Instagram,
              },
              {
                href: "mailto:hello@drivn.ai",
                label: "Email",
                Icon: Mail,
              },
            ].map(({ href, label, Icon }) => (
              <Link
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
                style={{ color: "rgba(239,240,243,0.40)" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "#eff0f3";
                  el.style.background = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "rgba(239,240,243,0.40)";
                  el.style.background = "transparent";
                }}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
