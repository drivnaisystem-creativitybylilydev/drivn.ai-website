# Design Skills Usage Guide — Drivn.AI

## TL;DR

Skills need to be **explicitly invoked** with a slash command. The context files `PRODUCT.md` and `DESIGN.md` now exist — this means every command is brand-aware from this point forward. You no longer need to explain what drivn.ai is before a design request.

---

## How Skills Actually Work in Claude Code

| What you think | What actually happens |
|---|---|
| Skill is installed → auto-activates | Skills are slash commands — you must call them |
| "Make this look better" → skill runs | Vague prompt → Claude uses generic knowledge |
| MCPs = design intelligence | MCPs = infrastructure tools (Vercel, MongoDB, 21st.dev = component library) |
| PRODUCT.md is optional | Without it, impeccable defaults to generic AI output |

**PRODUCT.md and DESIGN.md now exist in this project.** Impeccable reads them automatically on every run. This is the unlock.

---

## The Skill Stack

### 1. `/impeccable` — The Primary Design Intelligence
**What it does:** Full-cycle design work with 23 sub-commands. Brand-aware once PRODUCT.md + DESIGN.md are present. Audits, rebuilds, animates, polishes.

**How to invoke correctly:**
```
/impeccable craft hero
/impeccable craft services section
/impeccable overdrive hero
/impeccable audit
/impeccable critique
/impeccable animate
/impeccable polish
/impeccable typeset
/impeccable bolder
```

**The single most powerful command for this site:**
```
/impeccable overdrive hero
```
This is cinematic mode — 60fps, physics-based motion, shaders if warranted. Use it for the hero section.

**For a full rebuild of any section:**
```
/impeccable craft [section]
```
This enters shape (plan) → approve → build → iterate. Never gets generic because it reads PRODUCT.md first.

### 2. `ui-ux-pro-max` — Design System & Style Selection
**What it does:** 67 styles, 96 palettes, 57 font pairings. Best for choosing direction before implementing.

**How to invoke:**
```
Use ui-ux-pro-max: [task]
```

**Example prompts that work:**
```
Use ui-ux-pro-max to select a bold agency typography pairing for drivn.ai — dark theme, service business audience, must not use Sora or Space Grotesk.

Use ui-ux-pro-max to generate a premium dark agency color palette that avoids purple (too AI-generic) — the site sells to tradespeople, needs to feel credible and sharp.
```

### 3. `design-taste-frontend` — Anti-Slop Layout Enforcement
**What it does:** Enforces metric-based layout rules, spacing rhythm, component architecture, CSS performance. Think of it as the QA pass that prevents AI slop patterns from slipping in.

**How to invoke:**
```
Use design-taste-frontend: review this component for layout issues, spacing rhythm, and slop patterns.
```

Or combine with impeccable:
```
Use design-taste-frontend + /impeccable polish on the Services section — fix the icon-tile pattern, equalize card heights, tighten stagger.
```

### 4. `21st.dev Magic MCP` — Premium Component Library
**What it does:** Searches a curated library of production-ready, animated React/Tailwind components. Use it to find 80% of what you need, then polish with impeccable.

**How to invoke (in Claude Code):**
```
Use the 21st magic MCP to find: [component type]
```

**High-value searches for this site:**
```
Use 21st magic to find a kinetic word-by-word text reveal component — React, Tailwind, Framer Motion.

Use 21st magic to find a magnetic button effect for the primary CTA.

Use 21st magic to find a scroll-driven parallax hero component — dark theme.

Use 21st magic to find a cursor trailer component — spring physics, transforms to ring on hover.

Use 21st magic to find a premium timeline/process visualization — dark theme, animated connector lines.
```

> **Note:** 21st.dev magic runs as an MCP tool in Claude Code. It's also worth adding to Cursor's MCP config if you want to use it from Cursor's composer too (Settings → MCP).

---

## The Right Prompt Pattern

**Wrong (gives generic output):**
> "Make the hero look more premium"

**Right (gets full skill intelligence):**
> "Use /impeccable craft on the hero section. Read PRODUCT.md and DESIGN.md first. Direction: remove the orbs entirely, replace with a single subtle radial vignette. Word-by-word clip-path reveal on the H1 instead of the blur fade. The CRM pipeline card enters with a physics spring that slightly overshoots. Cursor trailer on desktop. No purple gradients — flat accent only."

The more art direction you give, the more the skill enforces it rather than defaulting.

---

## Prioritized Fix List (What to Build Next)

These are in order of visual impact:

### P0 — Hero (biggest first impression)
- [ ] Remove orb blobs (`.orb-a/b/c`) — replace with single radial vignette at 6% opacity
- [ ] Replace blur-fade stagger on H1 with word-by-word clip-path mask wipe
- [ ] Add cursor trailer (find via 21st magic, or `/impeccable delight`)
- [ ] Add parallax depth on CRM pipeline card (`useScroll` + `useTransform`, factor 0.3)
- [ ] Reduce y-offset from 20px to 16px in entrance animation
- [ ] Reduce stagger from 0.12s to 0.08s
- [ ] Remove `text-neon-purple` text-shadow glow — keep color, drop the glow

**Command:**
```
/impeccable overdrive hero
```

### P0 — Services Section
- [ ] Break the identical-card-grid pattern — vary card sizes or use asymmetric layout
- [ ] Remove icon-tile-above-heading pattern — put icon inline or remove containers
- [ ] Replace `GlowCard` glassmorphism with `.doppelrand-shell` or flat bordered cards
- [ ] Flatten `btn-purple` gradient to solid

**Command:**
```
/impeccable craft services section
```

### P1 — FinalCTA
- [ ] Remove grid background (second usage = worse)
- [ ] Remove radial orb gradient — use negative space instead
- [ ] Make the section feel more urgent — `/impeccable bolder`

**Command:**
```
/impeccable bolder FinalCTA
```

### P1 — HowItWorks
- [ ] Audit icon-tile pattern on step icons
- [ ] Consider replacing centered header with left-aligned editorial style
- [ ] Add draw-on animation to the connecting line (partially implemented — verify)

**Command:**
```
/impeccable craft how it works section
```

### P2 — Global
- [ ] Add scroll progress bar (1px, brand accent, top of viewport)
- [ ] Add magnetic effect to primary CTA button
- [ ] Audit all eyebrow pills — vary treatment so not every section looks identical
- [ ] Run impeccable CLI detector: `npx impeccable detect components/`

---

## Full Power Session Template

Copy this as your starting message for any design session:

```
Context: PRODUCT.md and DESIGN.md are in the project root. Read them before any design work.

Task: [describe what section/component to work on]

Direction: [your art direction — colors, motion style, layout approach]

Constraints:
- No orb blobs, no grid backgrounds (except hero at ≤1.5% opacity)
- No gradient text on headings
- No icon-tile-above-heading pattern
- Flat solid accent color only (no gradient buttons)
- Use clip-path mask wipes for text reveals, not blur fades
- Use 21st magic MCP to find components before building from scratch
- Run /impeccable craft → shape step → get my approval → then build

Stack: Next.js App Router, Tailwind CSS v4, Framer Motion, TypeScript
```

---

## MCP Quick Reference

| MCP | What it's for | How to invoke |
|---|---|---|
| `21st magic` | Find premium UI components | "Use 21st magic to find..." |
| `vercel` | Deploy, logs, env vars | "Use vercel MCP to deploy / check logs" |
| `mongodb` | Query leads database | "Use mongodb MCP to find leads where..." |

---

## Files That Feed the Skills

| File | Purpose | Status |
|---|---|---|
| `PRODUCT.md` | Brand, audience, voice, anti-references | ✅ Created |
| `DESIGN.md` | Colors, typography, components, known issues | ✅ Created |
| `DESIGN_SKILLS_GUIDE.md` | This file — how to use the stack | ✅ |
| `CLAUDE.md` | Project instructions + session context | ✅ Exists |

**Keep PRODUCT.md and DESIGN.md updated as the design evolves.** Impeccable reads them on every run — stale files = stale output.
