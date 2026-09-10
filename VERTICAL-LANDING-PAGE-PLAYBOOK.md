# Vertical / Service Landing Page Playbook

*How to build a standalone, productized landing page for one industry on the Drivn.AI
site — the way `/moving-and-logistics` was built (Sept 2026). Read this before
starting a new one (roofing, med spa, HVAC, restaurants, etc.). Every rule here came
out of Finn rejecting a first pass — the "Correction log" at the bottom is the point
of the file.*

Reference implementation: `app/moving-and-logistics/page.tsx` + `components/moving/*`
+ `app/api/moving-lead/route.ts` + `public/moving-and-logistics/*`.

---

## 0. TL;DR — the non-negotiables

1. **Match the homepage design system exactly. Do not invent one.** Same tokens, same
   fonts, same hero anatomy. A new vertical page is a re-skin of a known system, not a
   fresh design.
2. **Full width.** `container-max` sections, full-bleed backgrounds. Never wrap a whole
   section in `max-w-3xl`.
3. **Hero = the homepage hero, restyled.** Eyebrow stack → huge Geist headline (2-beat
   imperative, no periods) → mono sub → white pill CTA + purple bottom-glow.
4. **Hero background is generated with Higgsfield and is different from the homepage's.**
   Abstract, dark, on-palette, no stock photography.
5. **Body text is WHITE**, not the homepage's muted grey. Accent purple, borders, and
   hover/placeholder states stay muted; readable copy does not.
6. **CTAs open a stepped modal wizard**, they don't scroll to an on-page form.
7. **Scroll animations everywhere, bidirectional** (replay up and down).
8. **Never publish fixed prices.** Tier names + inclusions + ROI framing only
   (`PRODUCT.md` rule; internal numbers live in `~/Desktop/Drivn.AI/knowledge/pricing-menu.md`).
9. **Verify with `tsc` + `next lint` + `next build` + Playwright screenshots** after
   every change. Clean up any test leads written to Mongo.

---

## 1. Route & architecture

- **Flat route**, not localized, not under `/services`:
  `app/<slug>/page.tsx` + `app/<slug>/layout.tsx`.
  Slug mirrors how the vertical is named (e.g. `/moving-and-logistics`).
- **`layout.tsx`** carries `metadata` (title / description / OG / `alternates.canonical`).
  Real marketing pages are **indexable** — do NOT copy the `robots: { index: false }` from
  the named-prospect pages (`sheridan-movers`, `allset-moving`, `bellah-moving`). `fuer-coaches`
  is the indexable precedent.
- **`page.tsx`** is a single `"use client"` component, `export const dynamic = "force-static"`,
  self-contained: its own `<header>` and `<footer>`, all copy in `const` arrays at the bottom
  of the file. Mirrors `app/fuer-coaches/page.tsx` structure.
- **Middleware — REQUIRED.** next-intl rewrites `/<slug>` → `/en/<slug>` and 404s a flat route.
  Add the slug to the `matcher` exclusion in `middleware.ts` next to
  `sheridan-movers|bellah-moving|allset-moving`. (`fuer-coaches`/`services` happen to work
  without it, but the exclusion is the reliable fix — always add it.)
- **Provider split** so every CTA can open the modal:
  ```tsx
  export default function Page() {
    return <GetStartedProvider calendarUrl={CAL_LINK}><PageBody /></GetStartedProvider>;
  }
  function PageBody() { const { open } = useGetStarted(); /* ...whole page... */ }
  ```
  Flat routes have no `AuditFormProvider`, so the page brings its own
  (`components/moving/GetStartedDialog.tsx` → generalize per vertical).

---

## 2. Design system — match the homepage

| Thing | Value |
|---|---|
| Base bg | `var(--color-mono-bg)` `#0a0a0c` (hero + most sections). Alternate with `var(--color-mono-surface)` `#131316` sparingly. |
| Accent | `var(--color-accent)` `#7c4dff` · `var(--color-accent-light)` `#b79cff` |
| Headings | `font-display` (Geist), `clamp()` sizes, tight tracking, `text-balance` |
| Body / eyebrows | `font-mono` (Geist Mono) |
| Motion | `SPRING = [0.32, 0.72, 0, 1]` |
| Icons | `@phosphor-icons/react/dist/ssr` only, `weight="light"` / `"bold"` |
| Eyebrows | `ChapterLabel` component (mono, uppercase, `tracking-[0.22em]`, accent-light) |
| Container | `.container-max` (max-w-7xl + responsive px) |
| Featured panels | `.glass-card` |
| Texture | `<div className="grain-overlay" />` once at the page root |

- **Reference for the visual system in a standalone page:** `app/allset-moving/page.tsx`
  and `app/sheridan-movers/page.tsx` (already on the current tokens). Copy their
  token/font/motion usage.
- **Reference for section rhythm only:** `app/fuer-coaches/page.tsx` (its *visuals* are
  the old Sora/Inter/lucide system — do not copy those).
- **Full-width layout:** every `<section>` uses `container-max`. Section headers cap at
  `max-w-2xl` *inside* the wide container; the grid/content below runs the full container
  width. This is the homepage `IndustriesWeServe` / `Services` pattern.

---

## 3. Hero recipe

Anatomy (mirrors `components/sections/Hero.tsx`):

1. **Eyebrow stack** — big white mono line (the vertical name, e.g. "Moving & Logistics")
   + small accent-light mono line ("A Drivn.AI growth system").
2. **Headline** — `<h1>` `clamp(38px,7vw,84px)`, `leading-[0.93]`, word-by-word clip
   reveal (`WordReveal`, animates on mount). Two blocks:
   - Line 1: accent colour, `font-semibold`, `tracking-[-0.045em]` — the lead-in.
   - Line 2: white, `font-bold` — the payoff the eye lands on.
   - **No terminal periods.** They read timid at display scale.
3. **Sub** — two mono lines: a muted-then-white statement + an accent-light punch line.
   Keep it a general outcome, not a feature list (see §7 copy rules).
4. **CTA** — white pill, `pl-7 pr-2`, trailing pocket-circle arrow, purple glow
   (`boxShadow: 0 0 40px 4px rgba(124,77,255,0.35)` on an `-inset-2` pseudo-layer),
   `hover:scale-[1.02]`. Label: **"Get started"** or a task-specific verb — never "Book a call".
5. **Purple gradient bottom-glow** — copy verbatim from the homepage hero: a blurred
   radial ellipse anchored `50% 100%` (`rgba(255,255,255,0.5)` → `rgba(124,77,255,0.4)`
   → transparent, `blur(36px)`) + a bright hairline with a white+violet box-shadow.
6. Scroll-down arrow → points at the first section below.

### Hero legibility over a textured background — MANDATORY

A purple headline on a purple-tinted generated background **blends**. Two fixes, always
apply both:

- **Contrast scrim.** Replace any "purple ambient" wash behind the copy with a *dark*
  radial that calms the field only where the text sits:
  `radial-gradient(ellipse 64% 48% at 50% 41%, rgba(10,10,12,0.82) 0%, rgba(10,10,12,0.45) 46%, transparent 78%)`.
  The generated art stays fully present at the top, sides, and bottom.
- **Dark drop-shadow (not a glow).** A tight *black* `filter: drop-shadow(...)` on each
  headline **line-wrapper span** (not inside `WordReveal` — the word boxes' `overflow:hidden`
  clips it). e.g.
  `drop-shadow(0 1px 2px rgba(0,0,0,0.6)) drop-shadow(0 3px 16px rgba(0,0,0,0.45))`.
  A bright coloured text-glow was tried and rejected — looks cheap.

### Hero headline colour

Use `var(--color-accent-light)` (`#b79cff`) — the **same token the homepage hero uses**.
Cross-page consistency wins over "make it darker". (We went `#b79cff` → `#7c4dff` → back
to `#b79cff` before this stuck.)

---

## 4. Higgsfield image workflow

DESIGN.md bans stock photography and lifestyle photos. Every image is an **abstract,
generated, on-palette render** that composites onto pure black.

### Process

1. `mcp__higgsfield__balance` — check credits first.
2. `mcp__higgsfield__generate_image` — `model: "nano_banana_pro"`, `count: 2` (variants),
   `aspect_ratio: "16:9"` for a hero background, `"4:3"` for per-section renders.
3. `mcp__higgsfield__jobs_wait` (assign `index` 0/1) to poll to terminal.
4. `curl` the `result_url`s, view both, pick the cleaner one.
5. **Optimize:** `sips -Z <maxdim>` to downscale, then
   `cwebp -q 80 -resize <targetWidth> 0 in.png -o out.webp`. These dark, low-detail
   images compress to **~35–70 KB**. Ship webp only; delete the PNG.
6. Save to `public/<slug>/hero-<name>.webp` and `public/<slug>/system/<name>.webp`.
   Keep the runner-up variant as `*-alt.webp` if it's decent.
7. **Before generating a new section render, look at an existing one in the set** and
   match its composition/lighting in the prompt.

### Prompt formula — hero background (abstract, industry-evocative)

> Abstract dark hero-section background texture for a premium enterprise software
> website. Near-black charcoal field, color #0a0a0c. A faint, elegant glowing network of
> [motif that evokes the industry without being literal — e.g. thin curved routes /
> connecting lines for logistics] rendered in deep violet #7c4dff and soft lavender
> #b79cff, with a few small softly glowing connection nodes. Loose and sparse with lots
> of negative space, drifting across the frame and **fading completely to pure black at
> every edge (strong vignette)**. Subtle faint topographic contour lines in the
> background. Very low contrast, cinematic, minimal, calm. Fine grainy film texture over
> everything. **Absolutely no text, no letters, no numbers, no labels, no UI, no
> photographic elements, no people, no [literal object].**

### Prompt formula — per-solution section render (matches the set)

> 3D product render on a pure black background. A single sheet of frosted translucent
> glass floating at a slight three-quarter perspective tilt, representing [the solution].
> In its top-left corner, a small circular glass badge holding a simple minimal white
> [icon concept] that glows soft violet (#7c4dff). On the glass sheet, three or four
> abstract rounded bars in muted grey and glowing violet standing in for [the content] —
> purely abstract shapes, **no real text, no letters, no numbers**. Beside the sheet,
> two or three concentric violet pulse rings radiating outward. A soft violet glow pools
> beneath the floating sheet. Deep blacks, high contrast, minimal, premium, cinematic
> product-render lighting, fine film grain. **No text, no numbers, no readable
> interface, no people, no literal device sitting on a desk.**

### Placing renders without a visible rectangle — `BlendedRender`

The renders are near-black but not the *exact* page tone, so a hard CSS mask leaves a
faint rectangle. `BlendedRender` (in `page.tsx`) fixes it: it paints the real page
colour back over the edges with a `--color-mono-bg` radial vignette (seamless by
construction), plus a soft mask for the outermost pixels, plus a faint violet glow
behind. `bias` param shifts the visual toward the copy side in an alternating row.
Reuse this component verbatim.

---

## 5. Section patterns

### `SectionHeading` (left + `centered` variants)

- Left variant: `max-w-2xl`, eyebrow → `clamp(28px,4.5vw,48px)` h2 → optional mono intro.
- `centered` variant: `max-w-4xl` centered, `clamp(30px,5vw,56px)`, centered eyebrow,
  a **short accent-gradient rule** beneath the eyebrow, a soft purple radial glow behind
  the block. Use it for a pillar section (e.g. the solutions section).
- `title` is a **`ReactNode`** — wrap individual words in
  `<span style={{ color: "var(--color-accent-light)" }}>` to accent them
  (e.g. "**Solutions** we offer, tailored to your **daily problems**").

### Seamless section seams

Adjacent sections should feel continuous, not stacked:

- Give the next section the **same bg as the hero** (`--color-mono-bg`; images excluded).
- **Mirror the hero's bottom half-circle glow at the top of the next section, facing
  down** — the same radial ellipse anchored at `50% 0%` + the bright hairline. The two
  half-glows sit back-to-back and read as one luminous band.
- Optionally bleed a glow + a faint copy of the hero art across the **bottom** edge into
  the following section. Put those layers at `z-0` (so the next section's copy still
  paints on top) and give the section `overflow-x-clip` (wide glows can't cause an
  h-scrollbar, vertical bleed still works — `overflow-x: clip` does not force
  `overflow-y: auto`).
- Push the section heading's top padding down (`pt-40 md:pt-56`) so it clears the top
  glow's bright zone.

### Full-width display lines

A punchy one-liner (a closing "pain" beat, a stat sentence) spans wide —
`max-w-6xl` centered with a bumped `clamp`, on a black field. Do not cap it at `max-w-3xl`.

---

## 6. Interactive "try it yourself" tool

The hero CTA scrolls to an **interactive calculator/playground**, not a form. See
`components/moving/TryItYourself.tsx`. Generalize per vertical:

- Tabbed, all client-side, nothing saved, no network. Assumptions shown on screen.
- Tab 1 — **missed-revenue calculator**: 3–4 sliders → an animated annual `$` figure
  ("what slow follow-up costs you"). `useCountUp` (rAF, respects `prefers-reduced-motion`).
- Tab 2 — **instant-quote demo**: a playable mini version of the actual product feature
  ("what a customer sees the second they land").
- Tab 3 — **response-speed impact**: a slider → "Nx more likely to book", cites
  lead-response research (HBR / InsideSales-LRM), directional.
- Range inputs: `style={{ accentColor: "#7c4dff" }}`.
- Result card: `self-start` so it hugs its content instead of stretching to the grid
  row height (a tall empty card looks broken).
- A "Get started" handoff at the bottom that calls `open()`.

---

## 7. CTA / lead capture

### Stepped modal wizard — not an on-page form

`components/moving/GetStartedDialog.tsx` — a context provider + Radix `Dialog` holding a
3-step wizard. Generalize per vertical:

- Radix `Dialog` gives focus-trap, ESC, click-outside, scroll-lock for free. Style
  `DialogContent` to `--color-mono-surface`, `!p-0`, own scroll container `max-h-[85vh]`.
- **3 logical steps**, grouped: company basics → what to fix first → contact details.
- Progress bar + "Step X of 3", per-step required-field validation (Next disabled until
  complete), slide between steps (`AnimatePresence mode="wait"`).
- Submit → `POST` to the vertical's API endpoint → show a **"pick a time" calendar
  handoff inside the modal** ("You're in." + a link to `CAL_LINK`). Do not yank the user
  off-page. Error path keeps a direct calendar + `mailto:` fallback.
- Every CTA on the page calls `useGetStarted().open()`. Consistent label: **"Get started"**
  (audit CTA can say "Book a free audit"). Never "Book a call".
- Header, hero sub-link, calculator handoff, and the packaging-section one-liner all open
  this same modal.

### Dedicated API endpoint

`app/api/<vertical>-lead/route.ts` — **do not extend the shared `LEAD_FIELD_KEYS`**
contract (`components/forms/AuditForm.tsx` depends on it). Own parser for the wizard's
fields, then map onto `LeadPayload` for storage so leads land in the existing admin
pipeline. Reuse `insertLead` / `sendLeadConfirmationEmail` / the Formspree relay. Tag
the source via `hearAboutUs: "<Vertical> landing page"`. Honeypot `website` field, same
as `AuditForm`.

### Homepage entry point

The only entry for now is a link under the matching card in
`components/sections/IndustriesWeServe.tsx`:

- Add an optional `link?: string` to the `items` array type (optional so the other cards
  render unchanged), render a conditional "See solutions →" link styled like the
  section's `footer_cta` (`font-display`, `text-[13px]`, `var(--color-accent-light)`,
  Phosphor `ArrowRight`).
- Update the item's `desc` to reflect the full bundle.
- Edit **both** `messages/en.json` and `messages/de.json` (DE currently mirrors EN;
  keep the same link — the site is English-only for now).
- No nav link, no sitemap entry, no `/services/*` restructuring. This is a
  low-commitment niche test.

---

## 8. Section order & content rules

- **Order:** Hero → **Pain** → **Calculator** → Solutions → Proof → Packaging (+ audit
  one-liner) → FAQ → Get-started band → Footer.
  Rationale: create the pain, *then* quantify it, *then* show the fix.
- **Solutions ordered by implementation cost / dependency, ascending.** For moving:
  website → GBP → local SEO → instant quoting → missed-call text-back → speed-to-lead →
  answering agent → paid marketing → the "Operating System" layer last (rendered
  separately, not in the alternating group). **No pricing shown.**
- **Solution rows alternate** image-left / image-right down the page.
- **No pricing anywhere on the page.** Packaging section shows tier *names* + inclusion
  bullets + an ROI sentence ("most recoup setup within the first few jobs…"). Internal
  dollar figures live in `~/Desktop/Drivn.AI/knowledge/pricing-menu.md`.
- **Kill weak sections.** A two-box "how we work / phase 1 / phase 2" process section was
  cut as filler — folded into a one-liner + "Book a free audit" CTA at the bottom of the
  packaging section ("Not sure what you need? That's what the audit is for.").
- Proof section is framed as **capability, not client results** ("the same system,
  already running on real mover sites" — demo builds, labelled as such) until there's a
  paying client in the vertical.

---

## 9. Scroll animation system

- Shared config, **bidirectional** (re-plays scrolling up *and* down), matching the
  homepage's `viewRelaxed` philosophy:
  ```ts
  const VIEW = { once: false, margin: "-12% 0px -12% 0px" } as const;
  ```
  Every `whileInView` on the page (headings, cards, rows, calculator, tiers) uses it.
- `fadeUp` / `fadeUpDelay(delay)` — the default reveal.
- `slideIn(fromX)` — directional. **Solution rows:** the image slides in from its outer
  edge and the copy from the opposite edge, and the direction **flips row to row**
  (`imgFrom = reversed ? 90 : -90`, `txtFrom = reversed ? -70 : 70`).
- **Pain grid cells** slide from left/right by column (`x: i % 2 === 0 ? -44 : 44`).
- Any section with x-slides gets `overflow-x-clip` so mid-animation transforms don't
  create a horizontal scrollbar.
- Hero animates **on mount** (`animate`, not `whileInView`) — don't re-trigger a hero.

---

## 10. Text colour

**Body / caption / label text is solid white** (`#f5f5f4` / `text-white`) on these
pages, not the homepage's `rgba(245,245,244,0.5–0.7)` muted greys. Finn wants high
contrast throughout on the vertical landing pages — this is a deliberate divergence from
the homepage's muted-text hierarchy.

Keep muted: accent-purple text, borders (`border-white/10`, `divide-white/[0.08]`),
backgrounds (`bg-white/[0.03]`), glow/box-shadow colour stops, and `hover:` /
`placeholder:` states.

---

## 11. Verification (every change)

```
npx tsc --noEmit
npx next lint --file <changed files>
npm run build                 # exit 0; "Compiled successfully"
                              # (a turbopack chunk unhandledRejection during cleanup is noise)
rm -rf .next && npm run dev    # restart clean
```

Then **Playwright screenshots** — the script must live in the project dir (so it
resolves `playwright` from `node_modules`). Scope selectors to `[role="dialog"]` etc.;
prefer `getByRole` over text-includes. Screenshot the hero, each section seam, the
calculator tabs, and the modal steps.

**Clean up test leads** written to Mongo during form testing:
```js
col.deleteMany({ "payload.email": "<test email>" })
```

**Parallel-session awareness:** the page file may be edited by another session between
your reads. Re-read before context-dependent edits, target unique stable strings, and
don't revert changes you didn't make.

---

## 12. Correction log — what Finn rejected, and the fix

Chronological. This is the part to actually internalize.

| # | First pass (rejected) | Correction |
|---|---|---|
| 1 | Narrow `max-w-3xl`/`max-w-5xl` containers, cramped centered column | "terrible ui" → full-width `container-max`, full-bleed section backgrounds, alternating bg bands |
| 2 | Generic scaffold hero | Hero must mirror the **homepage hero** exactly: eyebrow stack, huge Geist clamp headline, word reveal, white pill CTA, purple bottom-glow |
| 3 | (needed a hero visual) | Generate it with **Higgsfield**, and make it **different from the homepage's** dotted-sphere/dashboard. Abstract route-network map for "logistics". |
| 4 | Long "pain-sentence" headlines (two rounds) | Short **two-beat imperative** in the homepage register ("Run the Business. Don't Let It Run You." energy) → "Book the jobs. Lose the busywork." |
| 5 | Feature-list subtext ("website, SEO, GBP…") | General outcome only — the combined payoff is "easy to find, easy to trust". Don't name the channels in the sub. |
| 6 | Headline periods, twin weight/size lines | Drop terminal periods; weight hierarchy (semibold lead-in / bold payoff); tighter leading so the two lines lock as one block |
| 7 | Bright purple text-glow on the headline | "looks bad" → remove. Use a **dark** drop-shadow for legibility instead. |
| 8 | `#7c4dff` headline still blends into the purple-tinted bg | Add a **dark contrast scrim** behind the copy + the dark per-line drop-shadow. Fix the *background contrast*, don't just brighten the text. |
| 9 | (headline colour churn) | Match the **exact homepage token** `--color-accent-light` `#b79cff` for cross-page consistency. |
| 10 | Hero CTA → on-page booking form | CTA → an interactive **calculator / try-it-yourself** section. Booking comes later. |
| 11 | CTA scrolls to a long single-page form | CTA opens a **stepped modal wizard** (3 logical steps, progress bar, calendar handoff inside the modal). Label "Get started", not "Book a call". |
| 12 | "How it's packaged" heading left-aligned, narrow | `centered` `SectionHeading` variant: wider, centered, accent rule, glow behind. `title` accepts JSX so words can be accent-purple. |
| 13 | Section heading "Six parts…" with a number | Drop the count: "**Solutions** we offer, tailored to your **daily problems**" (accent words in purple). |
| 14 | Solutions in arbitrary order | Order **by implementation cost / dependency**, ascending. Website first, then GBP + SEO, etc. No pricing. |
| 15 | Standalone "How we work / Phase 1 / Phase 2" two-box section | "that's ass" → delete. Fold into a one-liner + "Book a free audit" CTA at the bottom of the packaging section. |
| 16 | Hard cut between hero and next section | Match bg to the hero; **mirror the hero's bottom half-circle glow at the top of the next section, facing down**; bleed a glow + faint art across the bottom edge too. |
| 17 | Closing pain line capped at `max-w-3xl` | Span it **full width** (`max-w-6xl`, bigger clamp), centered, black field. |
| 18 | Static sections | **Scroll animations on every section, bidirectional.** Solution rows slide in from alternating left/right. |
| 19 | Muted grey body text (homepage hierarchy) | **All gray text → white** across the whole page. Keep only accent/border/bg/hover muted. |
