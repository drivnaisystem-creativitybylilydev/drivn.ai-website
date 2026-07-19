"use client";

export const dynamic = "force-static";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Linkedin,
  Globe,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  Mail,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

const fadeUpDelay = (delay: number) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay },
});

const MAILTO =
  "mailto:drivn.ai.system@gmail.com?subject=Kostenlose%20Analyse%20%E2%80%94%20Drivn.AI";

export default function FuerCoachesPage() {
  return (
    <div
      className="min-h-screen font-inter"
      style={{ backgroundColor: "#0a0a0a", color: "#f4f4f5" }}
    >
      {/* ── Nav bar ── */}
      <header
        style={{ borderBottom: "1px solid #27272a" }}
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md"
        aria-label="Navigation"
        role="banner"
      >
        <Link
          href="/"
          className="font-sora text-lg font-bold tracking-tight"
          style={{ color: "#f4f4f5" }}
        >
          Drivn<span style={{ color: "#7c3aed" }}>.AI</span>
        </Link>
        <a
          href={MAILTO}
          className="hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200"
          style={{ backgroundColor: "#7c3aed", color: "#fff" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
              "#6d28d9")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
              "#7c3aed")
          }
        >
          Kostenlose Analyse
          <ArrowRight size={14} />
        </a>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-36 text-center">
        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div
            className="h-[500px] w-[700px] rounded-full opacity-10 blur-[120px]"
            style={{ backgroundColor: "#7c3aed" }}
          />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <motion.p
            {...fadeUp}
            className="mb-4 inline-block rounded-full px-4 py-1 text-xs font-medium uppercase tracking-widest"
            style={{
              backgroundColor: "rgba(124,58,237,0.12)",
              color: "#a78bfa",
              border: "1px solid rgba(124,58,237,0.3)",
            }}
          >
            Für Coaches &amp; Berater in Deutschland
          </motion.p>

          <motion.h1
            {...fadeUpDelay(0.07)}
            className="font-sora text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
          >
            Ihr nächster Klient googelt&nbsp;Sie.{" "}
            <span style={{ color: "#7c3aed" }}>Findet er Sie?</span>
          </motion.h1>

          <motion.p
            {...fadeUpDelay(0.14)}
            className="mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed mb-10"
            style={{ color: "#a1a1aa" }}
          >
            Coaches, die online sichtbar sind, füllen ihren Kalender. Die
            anderen nicht. Wir bauen Ihre digitale Präsenz so auf, dass
            qualifizierte Klienten Sie finden — ohne Werbebudget.
          </motion.p>

          <motion.div
            {...fadeUpDelay(0.2)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={MAILTO}
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold transition-colors duration-200"
              style={{ backgroundColor: "#7c3aed", color: "#fff" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "#6d28d9")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  "#7c3aed")
              }
            >
              Kostenlose Analyse anfragen
              <ArrowRight size={16} />
            </a>
            <span className="text-sm" style={{ color: "#52525b" }}>
              Kein Pitch. Nur konkrete Empfehlungen.
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── PAIN POINTS ── */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="font-sora text-2xl sm:text-3xl font-bold mb-4">
              Kommt Ihnen das bekannt vor?
            </h2>
            <p style={{ color: "#a1a1aa" }} className="max-w-xl mx-auto">
              Das sind die vier Probleme, die wir bei fast jedem Coach in
              Deutschland sehen.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {painPoints.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUpDelay(i * 0.08)}
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                }}
              >
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
                >
                  <p.icon size={18} style={{ color: "#a78bfa" }} />
                </div>
                <h3 className="font-sora text-base font-semibold mb-2">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#71717a" }}>
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        className="px-6 py-20 sm:py-28"
        style={{ backgroundColor: "#111111" }}
      >
        <div className="mx-auto max-w-4xl">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="font-sora text-2xl sm:text-3xl font-bold mb-4">
              So arbeiten wir
            </h2>
            <p style={{ color: "#a1a1aa" }} className="max-w-xl mx-auto">
              Kein langer Onboarding-Prozess. Wir analysieren, planen und
              liefern — in dieser Reihenfolge.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.label}
                {...fadeUpDelay(i * 0.1)}
                className="relative flex flex-col items-start"
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl font-sora text-xl font-bold"
                  style={{ backgroundColor: "#7c3aed", color: "#fff" }}
                >
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute left-6 top-12 hidden h-[calc(100%+1.5rem)] w-px sm:block"
                    style={{ backgroundColor: "#27272a" }}
                  />
                )}
                <h3 className="font-sora text-lg font-semibold mb-2">
                  {s.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#71717a" }}>
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="font-sora text-2xl sm:text-3xl font-bold mb-4">
              Was wir liefern
            </h2>
            <p style={{ color: "#a1a1aa" }} className="max-w-xl mx-auto">
              Vier Bausteine. Jeder für sich wirkungsvoll — zusammen ein System,
              das konstant neue Klienten bringt.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                {...fadeUpDelay(i * 0.08)}
                className="group rounded-2xl p-7 transition-colors duration-200"
                style={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.borderColor =
                    "#7c3aed")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.borderColor =
                    "#27272a")
                }
              >
                <div
                  className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
                >
                  <s.icon size={20} style={{ color: "#a78bfa" }} />
                </div>
                <h3 className="font-sora text-lg font-semibold mb-3">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#71717a" }}>
                  {s.body}
                </p>
                <ul className="space-y-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm" style={{ color: "#a1a1aa" }}>
                      <CheckCircle
                        size={14}
                        className="mt-0.5 shrink-0"
                        style={{ color: "#7c3aed" }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST / REACH ── */}
      <section
        className="px-6 py-20 sm:py-28"
        style={{ backgroundColor: "#111111" }}
      >
        <div className="mx-auto max-w-4xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-sora text-2xl sm:text-3xl font-bold mb-4">
              Für Coaches in ganz Deutschland
            </h2>
            <p
              className="max-w-2xl mx-auto text-base leading-relaxed"
              style={{ color: "#a1a1aa" }}
            >
              Egal ob Berlin, Hamburg, München oder Frankfurt — wir arbeiten
              remote und kennen den deutschen Coaching-Markt. Wir bringen Ihre
              Profile in die Verzeichnisse, in denen Ihre Klienten suchen.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-3 mb-14">
            {trustPoints.map((t, i) => (
              <motion.div
                key={t.label}
                {...fadeUpDelay(i * 0.08)}
                className="rounded-2xl p-6 text-center"
                style={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                }}
              >
                <div
                  className="mb-3 text-3xl font-sora font-bold"
                  style={{ color: "#7c3aed" }}
                >
                  {t.stat}
                </div>
                <p className="text-sm" style={{ color: "#71717a" }}>
                  {t.label}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUpDelay(0.2)} className="text-center">
            <p className="text-sm mb-3" style={{ color: "#52525b" }}>
              Wir platzieren Sie in den relevanten Coaching-Verzeichnissen:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {directories.map((d) => (
                <span
                  key={d}
                  className="rounded-full px-4 py-1.5 text-xs font-medium"
                  style={{
                    backgroundColor: "rgba(124,58,237,0.1)",
                    color: "#a78bfa",
                    border: "1px solid rgba(124,58,237,0.2)",
                  }}
                >
                  {d}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-6 py-24 sm:py-36 text-center relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div
            className="h-[400px] w-[600px] rounded-full opacity-8 blur-[100px]"
            style={{ backgroundColor: "#7c3aed" }}
          />
        </div>

        <div className="relative mx-auto max-w-2xl">
          <motion.div {...fadeUp}>
            <div
              className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
            >
              <Clock size={24} style={{ color: "#a78bfa" }} />
            </div>

            <h2 className="font-sora text-3xl sm:text-4xl font-bold mb-5">
              15 Minuten. Kein Pitch.{" "}
              <span style={{ color: "#7c3aed" }}>
                Nur konkrete Empfehlungen.
              </span>
            </h2>

            <p
              className="text-base sm:text-lg leading-relaxed mb-8"
              style={{ color: "#a1a1aa" }}
            >
              Wir schauen uns Ihre aktuelle Online-Präsenz an und sagen Ihnen
              genau, wo die größten Hebel liegen — ohne Verpflichtung, ohne
              versteckte Agenda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={MAILTO}
                className="inline-flex items-center gap-2 rounded-full px-9 py-4 text-base font-semibold transition-colors duration-200"
                style={{ backgroundColor: "#7c3aed", color: "#fff" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "#6d28d9")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "#7c3aed")
                }
              >
                Kostenlose Analyse anfragen
                <ArrowRight size={16} />
              </a>
            </div>

            <p className="mt-5 text-sm" style={{ color: "#52525b" }}>
              Antwort innerhalb von 24 Stunden.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="px-6 py-10"
        style={{ borderTop: "1px solid #27272a" }}
      >
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-sora font-bold text-sm">
              Drivn<span style={{ color: "#7c3aed" }}>.AI</span>
            </p>
            <p className="text-xs mt-1" style={{ color: "#52525b" }}>
              Finn Schueler — Drivn.AI
            </p>
          </div>

          <a
            href={MAILTO}
            className="flex items-center gap-2 text-sm transition-colors duration-150"
            style={{ color: "#71717a" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "#a78bfa")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "#71717a")
            }
          >
            <Mail size={14} />
            drivn.ai.system@gmail.com
          </a>

          <p className="text-xs" style={{ color: "#3f3f46" }}>
            &copy; {new Date().getFullYear()} Drivn.AI. Alle Rechte vorbehalten.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ── Data ────────────────────────────────────────────────

const painPoints = [
  {
    icon: Search,
    title: "Ihre Klienten googeln Sie — und finden jemanden anderen",
    body: "Auf Google Seite 1 zu stehen ist keine Frage des Budgets, sondern des Aufbaus. Die meisten Coach-Websites sind für Suchmaschinen unsichtbar.",
  },
  {
    icon: Linkedin,
    title: "Ihr LinkedIn-Profil zeigt nicht, wer Sie wirklich sind",
    body: "Ein generisches Profil ohne klare Positionierung kostet Sie täglich potenzielle Klienten — die LinkedIn aktiv nach Coaches suchen.",
  },
  {
    icon: Globe,
    title: "Anfragen verschwinden, weil kein Follow-up-System existiert",
    body: "Wer nicht innerhalb von Stunden antwortet, verliert den Lead. Ohne automatisiertes System bleibt Geld auf dem Tisch.",
  },
  {
    icon: Clock,
    title: "Admin frisst die Zeit, die Sie für Klienten brauchen",
    body: "E-Mails, Terminabstimmung, Erstgespräche qualifizieren — alles manuell. Das kostet täglich Stunden, die keine Klienten bringen.",
  },
];

const steps = [
  {
    label: "Analyse",
    body: "Wir schauen uns Ihre Website, Ihr Google-Profil und LinkedIn an. Sie bekommen eine ehrliche Einschätzung — was fehlt, was bremst, was sofort wirkt.",
  },
  {
    label: "Strategie",
    body: "Kein Standardpaket. Wir legen fest, welche zwei oder drei Maßnahmen den größten Hebel haben — abgestimmt auf Ihre Nische und Ihre Zielklienten.",
  },
  {
    label: "Umsetzung",
    body: "Wir bauen. Website, SEO-Setup, LinkedIn-Optimierung, Automatisierungen — alles aus einer Hand, ohne dass Sie selbst technisch werden müssen.",
  },
];

const services = [
  {
    icon: Globe,
    title: "Professionelle Website",
    body: "Eine Website, die Vertrauen schafft und Besucher in Anfragen verwandelt — nicht nur gut aussieht.",
    bullets: [
      "Mobil-optimiert und schnell geladen",
      "Klar strukturierte Dienstleistungsseiten",
      "Conversion-Elemente: Kontaktformular, CTA, Testimonials",
    ],
  },
  {
    icon: Search,
    title: "Google-Sichtbarkeit",
    body: "Organisches SEO — Sie werden gefunden, ohne jeden Monat Werbebudget zu verbrennen.",
    bullets: [
      "Lokales SEO für Ihre Stadt und Nische",
      "Google Business Profile optimiert",
      "Keyword-Strategie auf Ihre Zielklienten zugeschnitten",
    ],
  },
  {
    icon: Linkedin,
    title: "LinkedIn-Profil",
    body: "Positionierung auf dem Niveau Ihrer Expertise — nicht irgendein Profil, sondern eines, das qualifizierte Anfragen anzieht.",
    bullets: [
      "Headline und About-Sektion neu geschrieben",
      "Klare Nischen-Positionierung",
      "Profil für Suchanfragen optimiert",
    ],
  },
  {
    icon: Zap,
    title: "KI-Automatisierung",
    body: "Ihr Erstkontakt läuft automatisch — Leads werden vorqualifiziert, bevor Sie das Telefon in die Hand nehmen.",
    bullets: [
      "Automatische Antworten auf Website-Anfragen",
      "Terminbuchung ohne manuelle Abstimmung",
      "Lead-Qualifizierung per KI vor dem Erstgespräch",
    ],
  },
];

const trustPoints = [
  {
    stat: "3–6 Wo.",
    label: "Bis zur ersten messbaren Sichtbarkeit bei Google",
  },
  {
    stat: "100%",
    label: "Remote — für ganz Deutschland",
  },
  {
    stat: "0 €",
    label: "Werbebudget nötig für organischen Traffic",
  },
];

const directories = ["ICF", "DGSv", "DBVC", "Google Business", "LinkedIn", "Bing Places"];
