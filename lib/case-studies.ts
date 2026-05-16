export type CaseStudySlug = "notime-storage" | "creativity-by-lilly";

export type CaseStudyStat = {
  label: string;
  value: string;
  hint?: string;
};

export type CaseStudy = {
  slug: CaseStudySlug;
  title: string;
  subheading: string;
  sector: string;
  timeline: string;
  heroLine: string;
  intro: string;
  challenge: string;
  approach: string;
  stats: CaseStudyStat[];
  outcome: string;
  /** Short line for cards / meta */
  resultSummary: string;
  /** Homepage card: one bold line per point (centered) */
  cardResultLines: string[];
  /** Homepage case study card logo (path under /public) */
  cardLogoSrc: string;
  cardLogoAlt: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "notime-storage",
    title: "NoTime Storage",
    subheading: "College move-in & seasonal storage",
    sector: "Seasonal storage & logistics",
    timeline: "Ongoing partnership",
    heroLine:
      "A credible front door, bookings on the customer’s schedule, and operations that keep pace when demand surges.",
    intro:
      "Founder Jermaine Williams built demand through hustle—then needed a real presence and a single system for quotes, bookings, and payments. We partnered to bring the NoTime Storage vision online: professional, automated, and easy to run.",
    challenge:
      "Leads and bookings lived in DMs and word of mouth—hard to organize alongside payments and scheduling. A trustworthy website was missing as the first impression new customers expect.",
    approach:
      "We designed and built their branded booking path end-to-end: self-serve scheduling, card-ready checkout, confirmations, deposits, and a dashboard so the team can see traction without living in the inbox—flexible enough to match how they already sell the service.",
    stats: [
      {
        label: "Operations",
        value: "Unified",
        hint: "Bookings, payments, and follow-up in one flow",
      },
      {
        label: "Customer experience",
        value: "Always on",
        hint: "Instant booking when people are ready to commit",
      },
    ],
    outcome:
      "The heavy lifting moves through the product: less manual chasing, clearer credibility, and more room to focus on strategy and growth. For Jermaine, the through-line is simple—partnership with a team that treats the business like their own.",
    resultSummary:
      "Credibility, unified bookings & payments, and time back for growth—with a true partner in the build.",
    cardResultLines: [
      "Credible presence + bookings when customers are ready.",
      "Unified operations—more space for strategy, not spreadsheets.",
    ],
    cardLogoSrc: "/case-studies/notime-storage/notime-storage-logo.png",
    cardLogoAlt: "NoTime Storage logo",
  },
  {
    slug: "creativity-by-lilly",
    title: "Creativity by Lilly Co",
    subheading: "Jewellery & e-commerce",
    sector: "Retail & direct-to-customer",
    timeline: "Platform & ops rebuild",
    heroLine: "Direct revenue without the marketplace tax.",
    intro:
      "Limited to pop-ups and marketplaces that took a cut of every sale. She needed a different path. We built one. She runs it. The business scales.",
    challenge:
      "Every sale through third-party channels meant margin and customer relationship lived elsewhere. No owned channel meant no compounding growth.",
    approach:
      "We stood up owned commerce and the operational spine behind it: inventory, fulfilment signals, and customer touchpoints that feel human — without living in spreadsheets.",
    stats: [
      { label: "Platform fees (direct)", value: "Zero", hint: "On owned sales" },
      { label: "Workflow", value: "Streamlined", hint: "Fewer manual hops" },
    ],
    outcome:
      "Margins stay in the business. The team spends time on product and clients, not re-keying orders between tools.",
    resultSummary:
      "Margins reclaimed. Workflow streamlined. Zero platform fees on direct sales.",
    cardResultLines: [
      "Margins reclaimed.",
      "Workflow streamlined.",
      "Zero platform fees on direct sales.",
    ],
    cardLogoSrc: "/case-studies/creativity-by-lily/Logo.png",
    cardLogoAlt: "Creativity by Lilly Co logo",
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getAllCaseStudySlugs(): CaseStudySlug[] {
  return caseStudies.map((c) => c.slug);
}
