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
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "notime-storage",
    title: "NoTime Storage",
    subheading: "College move-in service",
    sector: "Seasonal storage & logistics",
    timeline: "Ongoing partnership",
    heroLine: "From chaotic peaks to a system that books while the team sleeps.",
    intro:
      "They came to us with a problem: growth was chaos. We solved it. The details of how stay between us and our clients — but the outcome speaks for itself.",
    challenge:
      "Demand spiked hard at semester boundaries. Manual follow-up, scattered tools, and no single view of the pipeline meant revenue leaked every rush.",
    approach:
      "We replaced ad-hoc workflows with revenue infrastructure: capture, qualification, and booking paths that run without constant human babysitting — tuned to their seasonality and brand voice.",
    stats: [
      { label: "Bookings / semester", value: "50 → 200+", hint: "Same core team" },
      { label: "Headcount", value: "0 added", hint: "Automation-first" },
    ],
    outcome:
      "Qualified demand now converts on the clock, not when someone happens to check the inbox. The business scales through peaks without hiring into the spike.",
    resultSummary: "50 → 200+ bookings per semester. No additional staff.",
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
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getAllCaseStudySlugs(): CaseStudySlug[] {
  return caseStudies.map((c) => c.slug);
}
