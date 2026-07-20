"use client";

import Link from "next/link";
import { Link as IntlLink } from "@/i18n/navigation";
import { LinkedinLogo, InstagramLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  const footerLinks = [
    { href: "#problem", label: t("problem") },
    { href: "#systems", label: t("services") },
    { href: "#process", label: t("process") },
    { href: "#work", label: t("results") },
    { href: "#industries", label: t("industries") },
    { href: "#contact", label: t("contact") },
  ];

  return (
    <footer className="relative border-t py-10 md:py-14 font-display" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
      <div className="container-max">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span className="font-display font-bold tracking-tight text-2xl leading-none">
              <span className="text-white">Drivn</span>
              <span style={{ color: "var(--color-accent-light)" }}>.ai</span>
            </span>
            <p className="text-[13px] max-w-[220px] leading-relaxed" style={{ color: "rgba(245,245,244,0.38)" }}>
              {t("tagline")}
            </p>
            <div className="flex items-center gap-3 font-mono text-[11px]" style={{ color: "rgba(245,245,244,0.28)" }}>
              <span>{t("copyright")}</span>
              <IntlLink href="/privacy" className="underline-offset-2 hover:underline hover:text-white/50 transition-colors">
                {t("privacy")}
              </IntlLink>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] transition-colors duration-200"
                style={{ color: "rgba(245,245,244,0.45)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#f5f5f4")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,245,244,0.45)")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-1">
            {[
              { href: "https://linkedin.com", label: "LinkedIn", Icon: LinkedinLogo },
              { href: "https://instagram.com", label: "Instagram", Icon: InstagramLogo },
              { href: "mailto:hello@drivn.ai", label: "Email", Icon: EnvelopeSimple },
            ].map(({ href, label, Icon }) => (
              <Link
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
                style={{ color: "rgba(245,245,244,0.40)" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "#f5f5f4";
                  el.style.background = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "rgba(245,245,244,0.40)";
                  el.style.background = "transparent";
                }}
              >
                <Icon size={17} weight="light" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
