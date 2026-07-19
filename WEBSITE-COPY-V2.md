# Drivn.AI — Homepage Copy Direction (Draft v2, 2026-07-17)

*Direction/outline for Finn to react to before full polished copy is written. Supersedes `WEBSITE-COPY.md`, which was already stale/unused — keep that file as a copy-variant reference, not deleted. Section scaffolding follows the existing homepage (Hero → Problem → Core Offer → Services → How It Works → Who We Work With → Case Studies → Final CTA) since that shape still works; the copy inside each section is what's changing. Per `PRODUCT.md`: never publish fixed prices, never name the category ("boutique," "consultancy") in copy — earn the read through specificity and structure.*

---

## Hero — LOCKED 2026-07-17

> **Run the Business. Don't Let It Run You.**
> The right system depends on your business, not a template. We find it. We build it.

Landed after several rounds (see session history if ever needed) — moved away from listing outcomes (leads/bookings/content), away from any "AI" mention in the subline, and away from comparative "other businesses are pulling ahead" framing. Final version is ownership-framed in the headline (influenced by `operatorprogram.com` / `operatoros.ai` references — autonomy over the business, not a benefits list) and consultative in the subline: diagnose-then-build, explicitly not a template/productized package. Reinforces the "figure out the right solution first" positioning from `PRODUCT.md` without using the words "consulting" or "boutique."

CTA stays two-button pattern: primary "Book a Free [Growth/Systems] Audit" (name TBD, generalize from "Lead Conversion Audit"), secondary "See What We've Built" → scrolls to case studies.

Right-side visual: keep the animated pipeline/dashboard panel concept (`CRMPipeline` component) — actually reinforces the AI Operating Systems story now, don't need to replace it, just restyle with new accent.

---

## Structural Reference Research (2026-07-17)

Did a full section-by-section breakdown of all three reference sites (`aiconsultin.co`, `operatorprogram.com`/Summit AIS, `operatoros.ai`). Common pattern across all three, in order:

1. **Hero with dual CTA** (primary action + secondary "see proof") — Drivn.AI already does this.
2. **Product/dashboard visual right after or inside the hero** — every site shows something concrete immediately: aiconsultin's chat conversation demo, Summit AIS's CRM/dashboard screenshots + a live revenue ticker, OperatorOS's live-metrics dashboard. Drivn.AI's hero already has the `CRMPipeline` animated panel — keep and lean into it harder.
3. **Capabilities broken into named "systems," each with an icon, a one-liner, and a concrete micro-example** — not an abstract feature list. OperatorOS: "Five systems. One operating layer" (Knowledge/Workflow/Decision/Voice/Data, each with a tiny dialogue or stat example). Summit AIS: three pillars (CRM/Dashboard/Coms) with real sample data. aiconsultin: feature cards plus an actual chat transcript. The common thread: show the system working, don't just name it.
4. **A process/methodology section that mirrors the site's own core promise.** OperatorOS literally names theirs "Consult, then build" — two phases, matching their hero's implied structure. Summit AIS has a week-by-week timeline ending in a 90-day money-back guarantee. This is directly reusable: our locked subline is *"We find it. We build it."* — the process section should be that, literally, not a generic 5-step timeline.
5. **A trust/ownership section — this is genuinely missing from Drivn.AI's current homepage.** OperatorOS has "Built to be handed off" (client-owned infrastructure, data sovereignty, no lock-in). Given our positioning already leans on "not a template, we find the right system" and earlier ownership-framed headline drafts, an explicit trust/guarantee section is a real gap worth filling, not just reference-inspired decoration.
6. **Named, specific proof — real names, real numbers, verbatim quotes.** All three lean hard on this (Summit AIS most aggressively, with a live ticker showing named operators' dollar results). Drivn.AI's Case Studies section already does named/specific proof (Creativity by Lilly, NoTime Storage) — good foundation, but the reference sites pull stat callouts to the surface more prominently than our current card-based layout does.
7. **Founder credibility, on the homepage itself, not deferred to an /about page.** Both Summit AIS ("built by an operator who got off the truck") and OperatorOS (named founder, bio, expertise, availability status) treat founder credibility as homepage-worthy trust infrastructure, not a nice-to-have. Worth reconsidering pulling this forward from "deferred" in the original IA plan — Finn is a young solo founder selling to sophisticated buyers who explicitly judge on "can they deliver."
8. **FAQ near the end, before final CTA** — all three have this, objection-handling before the ask. Drivn.AI currently only has this on `/services/websites`, not the homepage.
9. **Low-commitment final CTA** — "no pitch," "30 minutes," explicit expectation-setting. Drivn.AI's existing FinalCTA trust-token pattern (15 min / no sales pitch / actual audit not a demo / keep insights either way) already matches this well — no change needed here, it's already doing what the references do.

**Not recommended to copy:** Summit AIS's live revenue ticker is compelling but dishonest to fake — it needs real, continuous client data volume we don't have yet with 2 case studies. Skip until there's enough real result velocity to make it true, per `PRODUCT.md`'s proof-over-claims principle. Also skipping OperatorOS's newsletter signup section — no content engine behind it yet, would be a dead CTA.

## Revised Section Plan

| # | Section | Status | Why |
|---|---|---|---|
| 1 | Hero | **Kept** (locked copy) | Already dual-CTA + dashboard visual, matches the pattern |
| 2 | Problem Statement | **Revised** (copy only) | Structure already matches the research, see below |
| 3 | Systems (was Core Offer + Services, merged) | **Revised, merged, strengthened** | Combine into one section styled like OperatorOS's "Five Systems" — each of the 4 service lines gets an icon + one-liner + a concrete micro-example, linking to its dedicated page. Stronger than the current split Core-Offer-then-Services structure. |
| 4 | Process — "We find it. We build it." | **Revised, reframed** | Was generic "How It Works" 5-step timeline — reframe as two phases (Find / Build) directly mirroring the locked hero subline, closer to OperatorOS's "Consult, then build" |
| 5 | Trust & Ownership | **NEW** | Not on the current site at all — fills a real gap, borrowed from OperatorOS's "Built to be handed off" |
| 6 | Who We Work With | **Kept** (copy only) | Already planned, no structural change |
| 7 | Case Studies / Results | **Revised** (surface stats more) | Keep card structure, pull 1-2 hard numbers to the surface per case study instead of only inside the card |
| 8 | Founder | **NEW, reconsidered** | Was "deferred to /about" in the original plan — recommend pulling a short version onto the homepage itself given how much the references lean on this as trust infrastructure |
| 9 | FAQ | **NEW** | Currently only exists on `/services/websites` — add a homepage-level one addressing "how is this different from a template/SaaS tool," timeline, commitment |
| 10 | Final CTA | **Kept** | Already matches the reference pattern well, no change needed |

---

## Problem Statement (section 02)

Keep the stat-row pattern (it tested well structurally per the research: concrete numbers > vague claims) but generalize the framing so it isn't only about phone calls — needs to cover the consultant/coach audience too (content, follow-up, visibility), not just missed-call trades pain:

- Response time: "5 min → <60 seconds" (keep, universal)
- Follow-up: "Manual, sometimes never → Always, automatically" (broadened from "web forms never answered")
- Consistency: "Posts/leads happen when there's time → Happens on schedule, every time" (new row, covers the content/LinkedIn angle)
- Visibility: "Scattered across tools → One dashboard" (new row, covers the AI OS angle)
- Reviews: keep "3.8★ → 4.8★" row, still broadly relevant

Bottom line, generalized from "You don't need more software... on the job": *"You don't need more tools. You need one system that works whether or not you're the one running it."*

---

## Systems (section 03 — merges old Core Offer + Services)

Replaces the current split (5-node connected-system visual, then a separate 4-card bento) with one section styled after OperatorOS's "Five Systems. One operating layer." — each system gets an icon, a one-line outcome, and a concrete micro-example (a mini dashboard stat, a snippet of a follow-up text, something real-feeling, not just a label), then links to its dedicated page:

1. **Speed-to-Lead** → `/services/speed-to-lead` — "Every lead gets an answer in under a minute, every time." Micro-example candidate: a mini text-thread snippet showing a lead message → instant reply.
2. **AI Operating Systems** → `/services/ai-operating-systems` — "Run leads, bookings, content, and reporting from one place." Micro-example candidate: a small live-looking stat cluster (leads this week / response time / open tasks), similar to OperatorOS's dashboard numbers.
3. **Websites** → `/services/websites` — "A site built to convert, not just exist."
4. **Organic Growth** → `/services/organic-growth` — "Content and outreach that runs itself, built for consultants and coaches." (Named "Organic Growth," not "LinkedIn Growth" — LinkedIn is the current channel, not a permanent lock-in.)

Each card: icon + one-line outcome + micro-example + "Learn more →". Detailed scope lives on the dedicated page, not here. This is a real structural upgrade from the current abstract feature cards — showing the system working (even in miniature) is what all three references do and Drivn.AI's current homepage doesn't.

---

## Process — "We find it. We build it." (section 04, reframed from "How It Works")

Was a generic 5-step timeline (Discovery → Audit → Build → Launch → Optimize). Reframing directly around the locked hero subline, closer to OperatorOS's "Consult, then build" two-phase structure:

**Phase 1 — Find it.** (was Discovery + Audit) What actually gets diagnosed: how the business runs today, where time/leads/attention are leaking, what a system needs to do vs. what a generic tool would assume.
**Phase 2 — Build it.** (was Build + Launch + Optimize) What gets delivered: the system built for that specific diagnosis, launched, then tuned against real usage.

Two clear phases reads more confident than five generic steps, and it's honest — it's literally what the hero promises. Keep enough sub-detail (timeline expectations, what happens in each phase) so it doesn't feel thin, but the two-phase framing is the structural change.

---

## Trust & Ownership — LOCKED 2026-07-17

> **You Own It. We Stay On.**
> Everything we build is yours outright — not something you rent from us. We stay on as a partner for as long as it's useful, never because you're locked in.

Three supporting points (styled like OperatorOS's guarantee list):
- **Full ownership** — accounts, systems, and data are yours from day one.
- **Ongoing support, not a subscription trap** — you stay because it's working, not because you're stuck.
- **A partner, not a vendor** — we're invested in it continuing to work, not just shipping it and moving on.

Confirmed with Finn: clients own everything after a build (accounts, systems, data); Drivn.AI offers ongoing support framed as partnership, not lock-in. This also resurrects the "systems you own, not tools you rent" idea that got cut from the hero — good home for it here instead.

---

## Who We Work With (was "Industries We Serve," section 06)

Replace the 12-tag trades-heavy list (HVAC, Plumbing, Roofing, Electrical, Landscaping, Pest Control...) with a broader category list that still includes the real existing clients:
**Professional Services & Consulting · Coaching & Executive Coaching · Hospitality & Luxury Service · Moving & Logistics · Home Services · Wellness & Med Spa**

Fewer, broader categories (6, not 12) — reads as deliberately curated rather than "we'll take anyone," which fits the credibility goal better than a long trades tag-cloud.

---

## Case Studies / Results (section 07)

Keep structurally, same data source (`lib/case-studies.ts`). New: pull 1-2 hard numbers per case study to the surface of the card itself (visible without a click), matching how all three reference sites lead with a number, not just a narrative snippet — e.g. NoTime Storage's card could surface a concrete stat instead of only the current qualitative "Credible presence + bookings when customers are ready" line. Minor heading shift from "Real businesses. Real results." to something that reads slightly more outcome-specific once there's a 3rd case study to point to — not urgent, current heading is fine, revisit once Susanne's site is live as a citable case study.

---

## Founder (NEW section, insert after Case Studies)

Was "deferred to /about" in the original IA plan — recommending pulling a short version onto the homepage itself. Both Summit AIS and OperatorOS treat founder credibility as homepage trust infrastructure, not a nice-to-have, which matters more for Drivn.AI now that the buyer includes sophisticated professionals (coaches, consultants) who explicitly judge "can this person deliver" — see `PRODUCT.md`'s Users section.

**Needs Finn's input before writing real copy:** what's the honest, confident version of this? OperatorOS leans on "architecture layer" expertise framing; Summit AIS leans on "built by an operator who got off the truck" (lived the exact pain the product solves). Neither would be honest to copy directly — Finn's real credibility story (what it actually is) needs to anchor this, not a borrowed frame. Short, one photo + 2-3 sentences + maybe a status line (available for new engagements), not a full bio — the full version can still live on a future `/about` page.

---

## FAQ (NEW section, insert before Final CTA)

Not currently on the homepage (exists only on `/services/websites`). Add a homepage-level FAQ addressing objections that apply across all service lines, not just websites — draft question set (answers TBD):
- "How is this different from just buying a SaaS tool / template?" (directly reinforces "not a template" from the hero)
- "How long does it take to see something live?"
- "What do we actually own after the build?" (ties to Trust & Ownership section above — answer needs to match whatever gets decided there)
- "Do you work with businesses that already have some of this in place?"
- "What if it doesn't work the way we expected?"

---

## Final CTA (section 08)

Generalize from "Lead Conversion Audit" framing (too narrow now) to something that covers all 4 service lines — e.g. **"Free Growth Audit"** or **"Free Systems Audit."** Keep the trust-token pattern (15 minutes / No sales pitch / Actual audit, not a demo / Keep insights either way) — it's a strong, specific trust mechanism, no change needed there.

---

## Nav / IA note
Once the 3 new `/services/*` pages exist, "Websites" as the lone real nav link should probably become a "Services" dropdown/section covering all 4 — flagging for the build round, not deciding the exact nav pattern here.
