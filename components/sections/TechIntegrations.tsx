"use client";

import type { IconType } from "react-icons";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  SiAirtable,
  SiAnthropic,
  SiAsana,
  SiCalendly,
  SiClickup,
  SiClaude,
  SiGoogle,
  SiGoogleanalytics,
  SiHubspot,
  SiIntercom,
  SiMailchimp,
  SiMake,
  SiMeta,
  SiNotion,
  SiOpenai,
  SiQuickbooks,
  SiSalesforce,
  SiShopify,
  SiSlack,
  SiSquare,
  SiStripe,
  SiTrello,
  SiTwilio,
  SiTypeform,
  SiWordpress,
  SiXero,
  SiZendesk,
  SiZapier,
} from "react-icons/si";
import { viewRelaxed } from "@/lib/motion-viewport";

const CLAWDBOT_LOGO_SRC = "/brand/Clawdbot%20Logo.png";

type IconEntry = { type: "icon"; Icon: IconType; name: string };
type TextEntry = { type: "text"; name: string };
type ImageEntry = { type: "image"; src: string; name: string };

const PLATFORM_ITEMS: (IconEntry | TextEntry | ImageEntry)[] = [
  { type: "text", name: "Jobber" },
  { type: "text", name: "Housecall Pro" },
  { type: "text", name: "ServiceTitan" },
  { type: "text", name: "GoHighLevel" },
  { type: "icon", Icon: SiZapier, name: "Zapier" },
  { type: "icon", Icon: SiMake, name: "Make" },
  { type: "icon", Icon: SiQuickbooks, name: "QuickBooks" },
  { type: "icon", Icon: SiXero, name: "Xero" },
  { type: "icon", Icon: SiStripe, name: "Stripe" },
  { type: "icon", Icon: SiSquare, name: "Square" },
  { type: "icon", Icon: SiHubspot, name: "HubSpot" },
  { type: "icon", Icon: SiSalesforce, name: "Salesforce" },
  { type: "icon", Icon: SiGoogle, name: "Google" },
  { type: "icon", Icon: SiGoogleanalytics, name: "Google Analytics" },
  { type: "icon", Icon: SiMeta, name: "Meta" },
  { type: "icon", Icon: SiCalendly, name: "Calendly" },
  { type: "icon", Icon: SiSlack, name: "Slack" },
  { type: "text", name: "Microsoft 365" },
  { type: "icon", Icon: SiMailchimp, name: "Mailchimp" },
  { type: "icon", Icon: SiShopify, name: "Shopify" },
  { type: "icon", Icon: SiWordpress, name: "WordPress" },
  { type: "icon", Icon: SiAirtable, name: "Airtable" },
  { type: "icon", Icon: SiNotion, name: "Notion" },
  { type: "icon", Icon: SiTwilio, name: "Twilio" },
  { type: "icon", Icon: SiOpenai, name: "OpenAI" },
  { type: "icon", Icon: SiClaude, name: "Claude" },
  { type: "icon", Icon: SiAnthropic, name: "Anthropic" },
  { type: "image", src: CLAWDBOT_LOGO_SRC, name: "Clawdbot" },
  { type: "text", name: "monday.com" },
  { type: "icon", Icon: SiAsana, name: "Asana" },
  { type: "icon", Icon: SiTrello, name: "Trello" },
  { type: "icon", Icon: SiClickup, name: "ClickUp" },
  { type: "icon", Icon: SiZendesk, name: "Zendesk" },
  { type: "icon", Icon: SiIntercom, name: "Intercom" },
  { type: "icon", Icon: SiTypeform, name: "Typeform" },
  { type: "text", name: "FieldPulse" },
  { type: "text", name: "LMN" },
  { type: "text", name: "CompanyCam" },
  { type: "text", name: "Angi" },
  { type: "text", name: "Thumbtack" },
];

function LogoTile({ item }: { item: IconEntry | TextEntry | ImageEntry }) {
  const Icon = item.type === "icon" ? item.Icon : null;
  return (
    <div
      className="flex h-[4.5rem] min-w-[8.5rem] shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] px-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] md:h-[5rem] md:min-w-[9.5rem]"
      aria-label={item.name}
    >
      {item.type === "icon" && Icon ? (
        <Icon
          className="h-9 w-auto max-w-[7rem] text-white/90 md:h-10"
          aria-hidden
          title={item.name}
        />
      ) : item.type === "text" ? (
        <span className="text-center font-sora text-sm font-semibold tracking-tight text-white/90 md:text-base">
          {item.name}
        </span>
      ) : item.type === "image" ? (
        <div className="relative h-9 w-[7rem] md:h-10">
          <Image
            src={item.src}
            alt={item.name}
            fill
            className="object-contain object-center"
            sizes="112px"
          />
        </div>
      ) : null}
    </div>
  );
}

export default function TechIntegrations() {
  const row = PLATFORM_ITEMS;
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="integrations"
      className="relative overflow-hidden border-y border-white/[0.06] py-16 md:py-24"
      style={{
        background:
          "linear-gradient(180deg, #0A0A1A 0%, #0f0b1f 50%, #0A0A1A 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-brand-purple/12 via-transparent to-transparent opacity-90" />

      <div className="relative z-[1] mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto mb-10 max-w-3xl text-center md:mb-14"
        >
          <h2 className="mb-3 font-sora text-3xl font-bold text-white md:text-4xl">
            Tools We{" "}
            <span className="text-brand-purple-light">Build On &amp; Connect</span>
          </h2>
          <p className="font-inter text-sm font-bold leading-relaxed text-white md:text-base">
            Field-service CRMs, payments, ads, automation, and AI — the stack your
            customers already use, wired into systems that actually run the business.
          </p>
        </motion.div>
      </div>

      <div className="relative z-[1] mb-12 w-full md:mb-14">
        <div className="integrations-marquee relative overflow-hidden py-2">
          <div
            className={`integrations-marquee-track flex gap-6 md:gap-10 ${reduceMotion ? "mx-auto w-full max-w-6xl flex-wrap justify-center" : "w-max"}`}
            aria-hidden
          >
            {row.map((item, i) => (
              <LogoTile key={`a-${item.name}-${i}`} item={item} />
            ))}
            {!reduceMotion &&
              row.map((item, i) => (
                <LogoTile key={`b-${item.name}-${i}`} item={item} />
              ))}
          </div>

          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background:
                "radial-gradient(ellipse 52% 115% at 50% 50%, transparent 0%, transparent 28%, rgba(10, 10, 26, 0.45) 55%, rgba(10, 10, 26, 0.92) 78%, #0a0a1a 100%)",
              boxShadow:
                "inset 0 0 100px rgba(88, 28, 135, 0.12), inset 0 0 60px rgba(139, 92, 246, 0.08)",
            }}
            aria-hidden
          />
        </div>
      </div>

      <div className="relative z-[1] mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewRelaxed}
          transition={{ duration: 0.55, delay: 0.06, ease: "easeOut" }}
          className="mx-auto mb-10 max-w-3xl text-center md:mb-12"
        >
          <h3 className="mb-3 font-sora text-3xl font-bold text-white md:text-4xl">
            Enterprise{" "}
            <span className="text-brand-purple-light">AI Infrastructure</span>
          </h3>
          <p className="font-inter text-sm font-bold leading-relaxed text-white md:text-base">
            Named platforms buyers already trust — implemented so AI sits on governed
            workflows, not shadow tools. Setup, access patterns, and handoff so your team
            actually uses it.
          </p>

          <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 md:gap-6">
            <div className="rounded-2xl border border-brand-purple/25 bg-gradient-to-br from-brand-purple/10 via-white/[0.04] to-transparent p-6 shadow-[0_0_40px_-12px_rgba(139,92,246,0.35)] md:p-7">
              <div className="mb-5 flex flex-wrap items-center gap-4">
                <SiClaude
                  className="h-11 w-auto text-[#D97757] md:h-12"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-sora text-lg font-semibold text-white md:text-xl">
                    Claude Cowork setup
                  </h3>
                  <p className="mt-1 font-inter text-xs text-brand-purple-light md:text-sm">
                    AI that works in your tools, not against them
                  </p>
                </div>
              </div>
              <ul className="space-y-2.5 font-inter text-sm leading-relaxed text-white md:text-[0.9375rem]">
                <li>
                  Your team already uses Slack, email, and your CRM. We integrate Claude
                  directly into those tools — so using AI is easier than ignoring it.
                </li>
                <li>
                  Ops pulls invoices without digging through files. Sales gets prospect
                  summaries before calls. Support surfaces KB answers instantly.
                </li>
                <li>
                  <span className="text-brand-purple-light">Workflow fit</span> — AI that
                  gets used daily because it fits the workflow, not disrupts it.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-7">
              <div className="mb-5 flex flex-wrap items-center gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brand-purple/30 bg-brand-purple/15">
                  <Image
                    src={CLAWDBOT_LOGO_SRC}
                    alt="Clawdbot"
                    width={56}
                    height={56}
                    className="object-contain p-1.5"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-sora text-lg font-semibold text-white md:text-xl">
                    Clawdbot setup
                  </h3>
                  <p className="mt-1 font-inter text-xs text-brand-purple-light md:text-sm">
                    Every lead gets a response in under 60 seconds
                  </p>
                </div>
              </div>
              <ul className="space-y-2.5 font-inter text-sm leading-relaxed text-white md:text-[0.9375rem]">
                <li>
                  Every inbound question gets answered in under 60 seconds. Qualified leads get
                  routed to your team. Low-value inquiries get handled automatically.
                </li>
                <li>
                  Answers common questions like pricing, service area, and availability.
                  Collects details and qualifies before handoff. Filters spam and routes
                  conversations intelligently.
                </li>
                <li>
                  <span className="text-brand-purple-light">Pipeline impact</span> — your team
                  handles fewer interruptions and closes more qualified leads.
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
