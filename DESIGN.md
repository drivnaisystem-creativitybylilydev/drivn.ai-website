# Drivn.AI — Design System

## Brand Direction Update — 2026-07-17 v3 (supersedes "no accent" in v2 below)

Finn's explicit call, made after the v2 monochrome trade-off was laid out directly: bring purple back in, paired with white and black, glossy. **This is a deliberate reversal of v2's "no brand accent hue," not a mistake to correct** — v2 remains useful context for why gold was wrong and why the base system is monochrome-first, but the "no accent at all" conclusion is superseded.

**Execution, so this doesn't repeat the gold failure mode:** purple is a fresh value, `--color-accent: #7c4dff` / `--color-accent-light: #b79cff` — deliberately not the old `--color-brand-purple` (`#8b5cf6`), which is the specific lilac-leaning shade named as the generic-AI-startup tell. Applied as true glass (`.glass-card` / `.glass-glow` in `globals.css`): backdrop-blur, an inner white-10% highlight border, and an inset violet-tinted shadow to simulate real refraction — not a flat colored border copy-pasted onto every element, which is what made the gold version read as a muddy wash. Black and white still carry most of the page; purple/glass shows up at specific moments (the hero dashboard visual, key CTAs, card hover states), not smeared across every icon and eyebrow the way both earlier attempts did.

**Visual content:** no stock photography, matching both reference sites (`operatorprogram.com`, `operatoros.ai`) exactly on this point — they use zero lifestyle photos, only UI/dashboard mockups. Reviving a hero dashboard visual (deleted in v2) as a glass panel with live-feeling metrics tied to what Drivn.AI actually sells, plus small live-data snippets inside the Systems section cards.

## Brand Direction Update — 2026-07-17 v2 (background context — see v3 above for the current color call)

First pass (bronze/gold accent) was rejected on sight. Diagnosis, run through `/impeccable`'s category-reflex check: "premium/institutional" defaulting to a metallic gold accent on dark is the exact same first-order cliché as "finance → navy and gold" — the most predictable answer available, not a considered one. Execution made it worse: the accent was applied everywhere at once (every card border, every icon, every eyebrow, every divider) at low individual opacity, which reads as a muddy wash rather than either genuine restraint or deliberate confidence — the worst of both strategies at once.

**New direction: no separate brand-accent hue at all.** Pure monochrome system — tinted near-black background, off-white text, a gray scale for hierarchy. Confidence comes from typography scale, spacing, contrast, and motion, not from a "brand color." White itself is the only accent, used boldly and rarely (solid white primary CTA, the strongest text weight) rather than a colored token used everywhere at low opacity. Green stays reserved strictly for live/status semantics (already the pattern) — never promoted to a brand color. This is a `Restrained` color strategy per `/impeccable`'s framework (tinted neutrals + effectively zero separate accent), chosen deliberately because the reference sites this brand is modeled on (`operatorprogram.com`, `operatoros.ai`) read as monochrome/high-contrast, not color-driven — matching them means matching that restraint, not inventing a signature hue to compete with it.

**Typography: Geist for both display and body**, replacing Sora + Inter for the homepage (Inter is a hard ban per the design skill stack; Sora was separately flagged as increasingly SaaS-generic). One family, weight and size carry the hierarchy rather than a font pairing — matches the "operator tool" register of the reference sites more than an editorial serif would. Geist Mono for data labels, small numerals, and section eyebrows where a technical/data-forward moment is wanted. **Scoped to homepage only** — new `--font-display`/`--font-body`/`--font-mono` tokens added alongside the existing Sora/Inter ones (not replacing them), since `/admin`, case study pages, and `/services/websites` stay on the old system for now and shouldn't silently change typography.

**Also cut:** the numbered section labels (large faint "01" "02" "03" background numerals) — flagged directly by the design skill stack as a cheap, dated pattern ("SECTION 01"-style meta-labels). The orbital timeline widget in the old Core Offer section and the animated CRM pipeline panel in the hero are both being retired too — outcome-first typography and real content carry the page now, not decorative interactive widgets standing in for substance.

## Color Palette

### Current (in use — superseded, see Brand Direction Update above)
| Token | Value | Usage |
|---|---|---|
| `--color-brand-dark` | `#08091a` | Page background — **keep** |
| `--color-surface` | `#0f1220` | Card background — **keep** |
| `--color-surface-2` | `#161c30` | Elevated surface — **keep** |
| `--color-surface-3` | `#1d2440` | Highest elevation — **keep** |
| `--color-brand-purple` | `#8b5cf6` | Primary accent — **replace**, see Brand Direction Update |
| `--color-brand-purple-light` | `#a78bfa` | Secondary accent, icons — **replace** |
| `--color-text-primary` | `#eff0f3` | Body text — **keep** |
| text-muted | `rgba(239,240,243,0.68)` | Secondary text — **keep** |
| text-subtle | `rgba(239,240,243,0.40)` | Tertiary / timestamps — **keep** |

### OKLCH Equivalents (use these for new work)
| Role | OKLCH | Notes |
|---|---|---|
| Background | `oklch(7% 0.015 268)` | Near-black with blue undertone — keep |
| Surface | `oklch(11% 0.015 268)` | Card bg — keep |
| Surface elevated | `oklch(15% 0.018 268)` | Modal, tooltip — keep |
| Accent | `oklch(70% 0.11 70)` *(proposed, confirm via `/ui-ux-pro-max`)* | Bronze/gold — limit to 8% of surface area, replaces brand purple |
| Accent light | *(derive lighter tint of new accent)* | Icons, eyebrow text |
| Text primary | `oklch(95% 0.005 255)` | Warm white — keep |
| Text muted | `oklch(68% 0.008 255)` | Secondary — keep |
| Text subtle | `oklch(45% 0.006 255)` | Tertiary — keep |

### Color Strategy
**Restrained.** Dark background with a single accent (bronze/gold direction, see above — was purple) used at ≤10% surface area. Green used only for live/online status. Never gradient text on headings. Never neon glows.

### Known Issues to Fix
- Purple gradient orbs (AI slop — replace with a single, very subtle radial vignette or nothing) — **now doubly true**: orbs are out regardless of color, and the color itself is being retired
- `text-neon-purple` class uses text-shadow glow — remove the glow entirely, don't just recolor it
- `btn-purple` uses gradient — flatten to solid accent (new accent color, not purple)
- Grid background pattern is overused — remove or limit to hero only at 30% opacity
- Every `-purple` suffixed class/token (`.card-bezel-purple`, `.flow-node` purple border, etc.) needs renaming to match the new accent during the build round — not done yet, this file only sets direction

---

## Typography

### Font Stack (Homepage — see Brand Direction Update v3, confirmed 2026-07-17)
| Role | Font | Fallback |
|---|---|---|
| Titles (H1 hero headline, section titles) | Geist (`font-display`) | system-ui, sans-serif |
| Subheadings + body text | Geist Mono (`font-mono`) | ui-monospace, monospace |
| Data / labels / eyebrows | Geist Mono (`font-mono`) | ui-monospace, monospace |

**Superseded from v2:** no longer "one family for display and body." Confirmed live in the Hero (2026-07-17) and now the standing rule for the rest of the homepage rebuild: big titles (the hero headline weight/register, and equivalent section titles elsewhere on the page) use `font-display` (Geist Sans). Subheadings and regular body copy use `font-mono` (Geist Mono) — the same font as the eyebrow/"For Business Owners & Operators" treatment — not Geist Sans. This is a deliberate pairing (display sans for titles, mono for everything else), not a single-family system anymore. Sora + Inter remain untouched on `/admin`, case studies, and `/services/websites` via the existing `--font-sora`/`--font-inter` tokens.

### Known Issues to Fix
- `tracking-[-0.03em]` on h1 is correct; ensure it's consistent across all headings
- No numbered section labels ("01" "02" "03" background numerals) anywhere — cut entirely, flagged as a cheap/dated pattern

### Scale (fluid, from tailwind.config.ts)
| Name | Range |
|---|---|
| xs | 0.75rem → 0.875rem |
| base | 1rem → 1.125rem |
| 2xl | 1.5rem → 2rem |
| 4xl | 2.25rem → 3rem |
| 6xl | 3.75rem → 5rem |

### Rules
- H1: `clamp(38px, 6.5vw, 72px)`, weight 600, tracking -0.03em, line-height 1.02
- H2: `clamp(28px, 4.5vw, 48px)`, weight 600, tracking -0.02em, line-height 1.1
- Body: 17px desktop / 16px mobile, line-height 1.6–1.75
- Eyebrow: 10px, tracking 0.24em, weight 600, uppercase
- Never use all-caps for body text
- Max line length: 65ch for body, 52ch for headings (text-balance helps)

---

## Motion System

### Easing Constants
```typescript
const SPRING = [0.32, 0.72, 0, 1];           // Primary — fast in, smooth decelerate
const SPRING_SNAP = [0.22, 1, 0.36, 1];       // Snappier — good for nav/overlays
const SPRING_TIGHT = { type: "spring", stiffness: 400, damping: 40 };  // Micro-interactions
```

### Section Entrance (standard pattern in use)
```typescript
hidden: { opacity: 0, y: 20, filter: "blur(6px)" }
show:   { opacity: 1, y: 0,  filter: "blur(0px)", duration: 0.65 }
staggerChildren: 0.12  // reduce to 0.08 for tighter feel
```

### Rules
- Never animate width/height — use transform/opacity only
- Scroll-triggered: `viewport={{ once: true, margin: "-10%" }}`
- Hero elements: animate on mount (no scroll trigger)
- Hover on CTAs: `whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.97 }}`
- Respect `prefers-reduced-motion` — already implemented in globals.css
- Never use bounce or elastic easing — use expo-out (SPRING constant above)

### Known Issues to Fix
- Stagger is 0.12s — feels slightly slow for dense grids, use 0.08s for cards
- Hero item y-offset is 20px — drop to 16px for more refined feel
- No cursor trailer or scroll-progress indicator — both would elevate the site

---

## Components

### Navigation
- Floating island pill style (`.island-shell`)
- Transparent until scrolled; backdrop blur + dark bg at scroll >20px
- Logo + nav links + CTA button
- Mobile: Sheet (slide-in drawer)
- Issue: nav links use anchor hrefs that feel like a 2019 landing page — consider a cleaner active-state indicator

### Eyebrow / Kicker
```css
.eyebrow — pill with purple bg + border, 10px uppercase, 0.24em tracking
```
- Used on every section header — creates monotony
- Fix: vary eyebrow treatment per section (some sections skip it, some use a line instead)

### Cards
- `.card-bezel` — surface bg, white/6 border, inset highlight
- `.card-bezel-purple` — same with purple border tint
- `.doppelrand-shell` — double-bezel nested premium look
- `GlowCard` (spotlight-card.tsx) — interactive glow that follows cursor

### Buttons
- `.btn-primary` — white pill with pocket icon (button-in-button pattern) — strong, keep
- `.btn-ghost` — outlined pill, purple border on hover — good secondary
- `.btn-purple` — gradient purple — REPLACE with flat solid purple; gradients are AI slop
- All use `cubic-bezier(0.32, 0.72, 0, 1)` spring — consistent, good

### Flow Nodes
- `.flow-node` — surface-2 bg, purple border — used in CRM pipeline viz
- `.flow-node-active` — stronger border + glow ring

### Orbs (to phase out)
- `.orb-a/.orb-b/.orb-c` — blurred radial gradient blobs
- These are the #1 AI slop tell flagged by impeccable detector
- **Replace with:** single subtle `radial-gradient` vignette at very low opacity, or nothing

### Grid Background
- `.grid-bg` — 64px grid lines at 2.5% opacity
- Flagged as cliché on AI sites
- **Keep only in hero** at reduced opacity (1.5%), remove from FinalCTA

---

## Section Inventory

| Section | Issues | Priority |
|---|---|---|
| Hero | Orbs (AI slop), grid bg, `text-neon-purple` glow, y=20px stagger | P0 |
| Services | `GlowCard` glassmorphism, identical card grid, icon-tile-above-heading | P0 |
| HowItWorks | Centered header default, icon tiles | P1 |
| ProblemStatement | Stats layout is good, check contrast | P2 |
| FinalCTA | Grid bg + orb again, left-aligned = good, CTA is correct | P1 |
| Navigation | Works well, minor: no active state on links | P2 |
| Footer | Not yet reviewed | P3 |

---

## Animation Wishlist (not yet implemented)
- [ ] Cursor trailer — 40px dot with spring lag, transforms to ring on CTA hover
- [ ] Scroll progress bar — 1px line at top, brand purple
- [ ] Word-by-word text reveal on H1 — clip-path mask wipe, not blur fade
- [ ] Parallax depth on hero CRM graphic — `useScroll` + `useTransform`, depth 0.3
- [ ] Magnetic button effect on primary CTA
- [ ] Section number counter (01 → 02 → 03) that updates in nav on scroll

---

## Do Not Rules (Impeccable Flags)
- No gradient text on headings
- No pure `#000` or `#fff` backgrounds
- No bounce/elastic easing
- No orb blobs (blurred radial gradients as decoration)
- No identical icon-tile-above-heading card grids
- No side-tab accent borders on cards
- No everything center-aligned
- No gradient on buttons — use flat solid accent
- No text-shadow glow on body text
- Keep line length ≤65ch for body, ≤52ch for headings
