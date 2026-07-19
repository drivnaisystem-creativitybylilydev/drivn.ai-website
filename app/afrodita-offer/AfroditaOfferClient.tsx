'use client'

// Font: @fontsource/sora is installed. If bold weights don't render, also import in app/globals.css
import '@fontsource/sora'

import { motion } from 'framer-motion'
import {
  Check,
  Minus,
  X,
  CalendarDays,
  ArrowRight,
  FileText,
  Mail,
  Globe,
  MessageSquare,
  ClipboardCheck,
  type LucideIcon,
} from 'lucide-react'

const BRAND = '#E04E22'

// ── Paste your Google Meet link here (the one you'll send her in the email) ──
const MEET_LINK = 'https://calendar.app.google/YeZa7bCwDwrqdXrh9'

const GMAIL_COMPOSE = 'https://mail.google.com/mail/?view=cm&to=drivn.ai.system%40gmail.com&su=Frage+zum+Angebot'

// Animation primitives
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 90, damping: 22 },
  },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0 } },
}

// ── Data ────────────────────────────────────────────────────────────────────

type Service = {
  icon: LucideIcon
  name: string
  tag: string
  tagColor: string
  what: string
  includes: string[]
  price: string
  monthly: string | null
}

const SERVICES: Service[] = [
  {
    icon: FileText,
    name: 'Proposal Generator',
    tag: 'KI-Angebotserstellung',
    tagColor: BRAND,
    what: 'Aus Deinen Discovery-Call-Notizen entsteht ein fertiger Angebotsentwurf in Deinem Stil und Deiner Sprache. Von 2–3 Stunden auf unter 30 Minuten.',
    includes: [
      'Deinen Workflow analysiert und abgebildet',
      'KI generiert Proposal in Deiner Sprache',
      'Bilinguale Ausgabe (DE/EN) auf Wunsch',
      'Kopierbarer Text — kein neues Tool nötig',
    ],
    price: '€450',
    monthly: '€70/mo',
  },
  {
    icon: Mail,
    name: 'Newsletter-Automatisierung',
    tag: 'Content → E-Mail',
    tagColor: '#1d4ed8',
    what: 'Bestehende Inhalte werden automatisch aufbereitet und an Deine Mailingliste verschickt. Kanäle und Format klären wir im nächsten Call — das hängt von Deinem Setup ab.',
    includes: [
      'Kanalwahl und Workflow im nächsten Call',
      'Automatische Aufbereitung für E-Mail',
      'Kein manuelles Formulieren mehr',
      'Läuft komplett im Hintergrund',
    ],
    price: '€350',
    monthly: '€50/mo',
  },
  {
    icon: Globe,
    name: 'GEO — Sichtbarkeit in KI-Suchen',
    tag: 'ChatGPT · Gemini · Perplexity',
    tagColor: '#b45309',
    what: 'Potenzielle Klienten fragen nicht mehr nur Google — sie fragen ChatGPT oder Gemini. Wir prüfen, was diese Modelle heute über Dich wissen, und schließen die technischen Lücken.',
    includes: [
      'Entity Audit: was weiß ChatGPT heute über Dich?',
      'DBVC + EMCC Verzeichniseinträge',
      'Schema-Markup auf afrodita-panovska.com',
      'GEO-optimierte FAQ-Seite für Deine Website',
    ],
    price: '€150–650',
    monthly: null,
  },
  {
    icon: MessageSquare,
    name: 'Kundenanfragen-Automatisierung',
    tag: 'Lead-Qualifizierung',
    tagColor: '#7c3aed',
    what: 'Neue Anfragen über Deine Website oder E-Mail bekommen sofort eine personalisierte Antwort, die qualifiziert und den nächsten Schritt vorschlägt — 24/7, auch wenn Du im Meeting bist.',
    includes: [
      'Sofortantwort auf jede neue Anfrage',
      'KI qualifiziert: passt das zu Dir?',
      'Schlägt Calendly-Link oder nächsten Schritt vor',
      'Funktioniert rund um die Uhr',
    ],
    price: '€450',
    monthly: '€70/mo',
  },
  {
    icon: ClipboardCheck,
    name: 'Session-Zusammenfassung',
    tag: 'Post-Session Automation',
    tagColor: '#374151',
    what: 'Nach jeder Session: Aufnahme oder Notizen rein, strukturierte Zusammenfassung mit Action Points raus — automatisch an den Klienten geschickt.',
    includes: [
      'Kompatibel mit Zoom, Teams, manuellen Notizen',
      'Zusammenfassung in Deinem Format',
      'Auto-Versand an Klienten',
      'ICF-konforme Stundenerfassung optional',
    ],
    price: '€450',
    monthly: '€90/mo',
  },
]

type CompareRow = {
  label: string
  fl: string
  platform: string
  drivnai: string
}

const COMPARISON: CompareRow[] = [
  { label: 'Laufende Kosten', fl: 'Einmalig, kein Support', platform: '€80–200/Mo. Abo', drivnai: 'Setup + kleiner Retainer' },
  { label: 'Auf Dich zugeschnitten', fl: 'neutral', platform: 'bad', drivnai: 'good' },
  { label: 'KI & Automatisierung', fl: 'neutral', platform: 'neutral', drivnai: 'good' },
  { label: 'Laufender Support danach', fl: 'bad', platform: 'neutral', drivnai: 'good' },
  { label: 'Einrichtungszeit', fl: 'Wochen Briefing', platform: 'Sofort (vorgefertigt)', drivnai: '1–2 Wochen' },
  { label: 'Datenkontrolle', fl: 'good', platform: 'bad', drivnai: 'good' },
  { label: 'Du verstehst was gebaut wird', fl: 'bad', platform: 'bad', drivnai: 'good' },
]

const PACKAGES = [
  {
    name: 'Clarity',
    subtitle: 'Entscheidungsgrundlage',
    price: '€500',
    monthly: null,
    commitment: 'Einmalig · keine Bindung',
    highlight: false,
    items: [
      'Entity Audit (GEO Baseline)',
      '1 Stunde Strategie-Call',
      'Schriftliche Tool-Empfehlung',
      'Du entscheidest danach in Ruhe',
    ],
  },
  {
    name: 'Foundation',
    subtitle: 'Die zwei größten Zeitfresser weg',
    price: '€1.400',
    monthly: '+ €220/mo',
    commitment: 'Setup + monatliche Betreuung',
    highlight: true,
    items: [
      'Alles aus Clarity',
      'Proposal Generator (built + maintained)',
      'Session-Zusammenfassung (built + maintained)',
      'Monatliche Wartung + Anpassungen',
      'Direktkontakt zu mir',
    ],
  },
  {
    name: 'Full System',
    subtitle: 'Alles automatisiert',
    price: '€2.200',
    monthly: '+ €380/mo',
    commitment: 'Setup + monatliche Betreuung',
    highlight: false,
    items: [
      'Alles aus Foundation',
      'Kundenanfragen-Automatisierung',
      'GEO Technical Foundation',
      'Newsletter-Automatisierung',
      '1 Consulting-Stunde/Monat',
    ],
  },
]

// ── Sub-components ────────────────────────────────────────────────────────

function CompareCell({ val }: { val: string }) {
  if (val === 'good')
    return (
      <div className="flex justify-center">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-50">
          <Check size={13} className="text-green-600" strokeWidth={2.5} />
        </span>
      </div>
    )
  if (val === 'neutral')
    return (
      <div className="flex justify-center">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-100">
          <Minus size={13} className="text-zinc-700" strokeWidth={2.5} />
        </span>
      </div>
    )
  if (val === 'bad')
    return (
      <div className="flex justify-center">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-50">
          <X size={13} className="text-red-400" strokeWidth={2.5} />
        </span>
      </div>
    )
  return (
    <span className="text-xs text-zinc-800 leading-snug block text-center">{val}</span>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────

export default function AfroditaOfferClient() {
  return (
    <div
      className="min-h-[100dvh]"
      style={{ fontFamily: "'Sora', 'Outfit', system-ui, sans-serif", background: '#FAFAF8', color: '#1C1C1A' }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 md:px-8 py-2.5"
        style={{ background: BRAND }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold tracking-wide"
            style={{ fontSize: 10, background: 'rgba(255,255,255,0.22)' }}
          >
            AP
          </div>
          <span className="text-white text-xs font-medium">
            Afrodita Panovska · Persönliches Angebot — Drivn.AI
          </span>
        </div>
        <span className="text-white/90 text-[11px] hidden sm:block">1. Juli 2026</span>
      </div>

      <div className="max-w-[900px] mx-auto px-5 md:px-10">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <motion.div
          className="pt-16 pb-14 border-b border-zinc-200/60"
          initial="hidden"
          animate="visible"
          variants={staggerFast}
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-semibold tracking-[0.16em] uppercase text-zinc-700 mb-5"
          >
            Nach unserem Gespräch vom 1. Juli
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-[38px] md:text-[54px] font-bold tracking-tight leading-[1.08] text-zinc-950 mb-5"
            style={{ maxWidth: 580 }}
          >
            Hallo Afrodita,<br />
            <span style={{ color: BRAND }}>hier ist mein konkreter Vorschlag.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-base text-zinc-800 leading-relaxed mb-8"
            style={{ maxWidth: '56ch' }}
          >
            Basierend auf unserem Gespräch habe ich konkrete Optionen zusammengestellt — was ich anbiete, was ich für Dich empfehle, und womit wir am sinnvollsten anfangen würden. Mit klaren Preisen, ohne Druck.
          </motion.p>
          <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap">
            <a
              href={MEET_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-3 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ background: BRAND }}
            >
              <CalendarDays size={15} strokeWidth={2} />
              See you on July 22nd
            </a>
            <span className="text-xs text-zinc-900">oder lies erstmal durch — der Call ist für Fragen</span>
          </motion.div>
        </motion.div>

        {/* ── Comparison ───────────────────────────────────────────── */}
        <motion.div
          className="py-16 border-b border-zinc-200/60"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-semibold tracking-[0.16em] uppercase text-zinc-700 mb-2"
          >
            Warum nicht einfach Freelancer oder eine Plattform?
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 mb-2"
            style={{ maxWidth: 480 }}
          >
            Drei Optionen — ein ehrlicher Vergleich.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-sm text-zinc-800 leading-relaxed mb-10"
            style={{ maxWidth: '52ch' }}
          >
            Du hast Freelancer genutzt und evaluierst Delenta, Satori und Simply.Coach. Hier ist mein ehrlicher Blick auf alle Optionen — einschließlich meines eigenen Angebots.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="overflow-x-auto -mx-5 md:mx-0 rounded-2xl border border-zinc-200"
          >
            <table className="w-full border-collapse" style={{ minWidth: 520 }}>
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-4 px-5 text-xs font-semibold text-zinc-700 bg-white rounded-tl-2xl" style={{ width: '36%' }}>
                    Kriterium
                  </th>
                  <th className="py-4 px-4 text-center text-xs font-semibold text-zinc-800 bg-white">
                    Freelancer
                  </th>
                  <th className="py-4 px-4 text-center bg-white">
                    <span className="block text-xs font-semibold text-zinc-800">Plattform</span>
                    <span className="block font-normal text-zinc-700 mt-0.5" style={{ fontSize: 10 }}>
                      Delenta · Satori · Simply.Coach
                    </span>
                  </th>
                  <th
                    className="py-4 px-4 text-center text-xs font-bold tracking-wide rounded-tr-2xl"
                    style={{ background: BRAND, color: '#fff' }}
                  >
                    Drivn.AI
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-b border-zinc-100 last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}`}
                  >
                    <td className="py-3.5 px-5 text-sm font-medium text-zinc-700">{row.label}</td>
                    <td className="py-3.5 px-4 text-center">
                      <CompareCell val={row.fl} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <CompareCell val={row.platform} />
                    </td>
                    <td className="py-3.5 px-4 text-center" style={{ background: `${BRAND}0D` }}>
                      <CompareCell val={row.drivnai} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-5 text-xs text-zinc-700 leading-relaxed"
            style={{ maxWidth: '52ch' }}
          >
            Plattformen eignen sich gut für ein Standard-CRM ohne Automatisierung. Freelancer sind sinnvoll für klar definierte Einmalprojekte. Für Deinen Fall — laufende Prozesse, persönliche Sprache, KI-Integration — ist keines davon ideal.
          </motion.p>
        </motion.div>

        {/* ── Services ─────────────────────────────────────────────── */}
        <motion.div
          className="py-16 border-b border-zinc-200/60"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-semibold tracking-[0.16em] uppercase text-zinc-700 mb-2"
          >
            Was ich anbiete
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 mb-10"
            style={{ maxWidth: 360 }}
          >
            Fünf Leistungen — alles einzeln buchbar.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon
              const featured = i === 0
              return (
                <motion.div
                  key={svc.name}
                  variants={fadeUp}
                  className={`rounded-2xl border p-6 md:p-7 ${featured ? 'md:col-span-2' : ''}`}
                  style={{
                    borderColor: featured ? `${BRAND}55` : '#E5E5E3',
                    background: featured ? '#FFF5F2' : '#ffffff',
                  }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: featured ? `${BRAND}18` : '#F2F2F0' }}
                      >
                        <Icon
                          size={16}
                          style={{ color: featured ? BRAND : '#71717A' }}
                          strokeWidth={1.8}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-900 leading-snug">{svc.name}</div>
                        <div className="text-xs mt-1" style={{ color: svc.tagColor }}>
                          {svc.tag}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-bold text-zinc-900">{svc.price}</div>
                      {svc.monthly && (
                        <div className="text-xs text-zinc-700 mt-0.5">{svc.monthly}</div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-800 leading-relaxed mb-4">{svc.what}</p>
                  <ul className={featured ? 'grid grid-cols-1 sm:grid-cols-2 gap-1.5' : 'space-y-1.5'}>
                    {svc.includes.map(item => (
                      <li key={item} className="flex items-start gap-2 text-xs text-zinc-900">
                        <Check
                          size={12}
                          className="flex-shrink-0 mt-0.5"
                          style={{ color: BRAND }}
                          strokeWidth={2.5}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* ── Packages ─────────────────────────────────────────────── */}
        <motion.div
          className="py-16 border-b border-zinc-200/60"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-semibold tracking-[0.16em] uppercase text-zinc-700 mb-2"
          >
            Pakete
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 mb-2"
            style={{ maxWidth: 380 }}
          >
            Alles auch einzeln buchbar.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-sm text-zinc-800 mb-10"
            style={{ maxWidth: '48ch' }}
          >
            Pakete sparen Geld und geben mir mehr Kontext — so kann ich besser helfen.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {PACKAGES.map(pkg => (
              <motion.div
                key={pkg.name}
                variants={fadeUp}
                className="rounded-2xl border-2 p-6 relative"
                style={{
                  borderColor: pkg.highlight ? BRAND : '#E5E5E3',
                  background: pkg.highlight ? '#FFF5F2' : '#ffffff',
                }}
              >
                {pkg.highlight && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-white px-3 py-1 rounded-full whitespace-nowrap"
                    style={{ background: BRAND }}
                  >
                    Empfohlen
                  </span>
                )}
                <div className="text-base font-bold text-zinc-950 mb-0.5">{pkg.name}</div>
                <div className="text-xs text-zinc-700 mb-5">{pkg.subtitle}</div>
                <div className="text-[32px] font-bold tracking-tight text-zinc-950 mb-1">
                  {pkg.price}
                </div>
                {pkg.monthly && (
                  <div className="text-sm text-zinc-700 mb-1">{pkg.monthly}</div>
                )}
                <div className="text-xs text-zinc-700 mb-5">{pkg.commitment}</div>
                <ul className="space-y-2">
                  {pkg.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-zinc-900">
                      <Check
                        size={12}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: pkg.highlight ? BRAND : '#A1A1AA' }}
                        strokeWidth={2.5}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Hourly option */}
          <motion.div
            variants={fadeUp}
            className="mt-3.5 rounded-2xl border border-zinc-200 bg-white p-5 flex items-center justify-between gap-4 flex-wrap"
          >
            <div>
              <div className="text-sm font-bold text-zinc-900 mb-1">Stundenweise Beratung</div>
              <div className="text-xs text-zinc-800" style={{ maxWidth: '38ch' }}>
                Strategie, Tool-Auswahl, KI-Training. Kein Commitment — Du bestimmst das Tempo.
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xl font-bold text-zinc-950">
                €150
                <span className="text-sm font-normal text-zinc-700">/Std.</span>
              </div>
              <div className="text-xs text-zinc-700 mt-0.5">5-Stunden-Block: €700</div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── How I work ───────────────────────────────────────────── */}
        <motion.div
          className="py-16 border-b border-zinc-200/60"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-semibold tracking-[0.16em] uppercase text-zinc-700 mb-2"
          >
            Wie ich arbeite
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 mb-10"
            style={{ maxWidth: 380 }}
          >
            Vier Prinzipien, die ich nicht breche.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-14 gap-y-8">
            {[
              {
                n: '01',
                title: 'Diagnose zuerst',
                text: 'Kein Build ohne Verständnis. Ich schaue mir Deinen Alltag an, bevor ich etwas anfasse.',
              },
              {
                n: '02',
                title: 'Auf Dich zugeschnitten',
                text: 'Keine Templates, die für 500 Coaches passen. Alles passt zu Deinen Tools, Deinem Format, Deiner Sprache.',
              },
              {
                n: '03',
                title: 'Du behältst die Kontrolle',
                text: 'Alles was wir bauen, gehört Dir. Kein Plattform-Lock-in, keine versteckten Abhängigkeiten.',
              },
              {
                n: '04',
                title: 'Ich bin Ansprechpartner',
                text: 'Monatlicher Retainer bedeutet: ich bin Dein direkter Kontakt — kein Ticket-System, kein Weiterleiten.',
              },
            ].map(item => (
              <motion.div key={item.n} variants={fadeUp}>
                <div className="text-xs font-bold mb-2" style={{ color: BRAND }}>
                  {item.n}
                </div>
                <div className="text-sm font-bold text-zinc-900 mb-1.5">{item.title}</div>
                <div className="text-sm text-zinc-800 leading-relaxed">{item.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Footer CTA ───────────────────────────────────────────── */}
        <motion.div
          className="py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-semibold tracking-[0.16em] uppercase text-zinc-700 mb-2"
          >
            Nächster Schritt
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 mb-4"
            style={{ maxWidth: 480 }}
          >
            Wir reden am 22. Juli.<br />
            Bis dahin hast Du Zeit zum Lesen.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-sm text-zinc-800 leading-relaxed mb-8"
            style={{ maxWidth: '48ch' }}
          >
            Kein Druck, keine Vorleistung. Wenn Du vorher Fragen hast, schreib mir direkt. Wenn Du den Termin bestätigen oder verschieben willst, hier ist mein Kalender.
          </motion.p>
          <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap">
            <a
              href={MEET_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-sm font-semibold text-white px-6 py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ background: BRAND }}
            >
              <CalendarDays size={15} strokeWidth={2} />
              See you on July 22nd
              <ArrowRight size={14} strokeWidth={2} />
            </a>
            <a
              href={GMAIL_COMPOSE}
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-800 px-5 py-3.5 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:text-zinc-700 transition-all"
            >
              Frage schreiben
            </a>
          </motion.div>
        </motion.div>

      </div>

      {/* Footer */}
      <div className="border-t border-zinc-200/60 px-5 md:px-10 py-5 flex items-center justify-between flex-wrap gap-3">
        <div className="text-xs text-zinc-700">
          <span className="font-semibold text-zinc-900">Finn Schueler</span> · Drivn.AI ·{' '}
          drivn.ai.system@gmail.com
        </div>
        <div className="text-xs text-zinc-600 tracking-widest uppercase">Drivn.AI</div>
      </div>
    </div>
  )
}
