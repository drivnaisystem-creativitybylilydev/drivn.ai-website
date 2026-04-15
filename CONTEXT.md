# Drivn.AI Website — Session Context
> Last updated: 2026-04-13. Pick up any new session from here.

## What this repo is
Next.js 15 App Router (TypeScript, Tailwind v4, shadcn/ui, Framer Motion), deployed on Vercel, MongoDB Atlas backend. This is the public marketing site + internal admin OS for Finn's AI consulting agency.

---

## Admin OS — Architecture overview

### Auth
- Cookie: `leads_admin_session` — HMAC-signed, 7-day TTL, `path="/"`
- Password: `LEADS_ADMIN_PASSWORD` env var on Vercel
- **Konami code gate** (↑↑↓↓←→←→BA) must be typed before password field appears
- `lib/admin-session.ts` — all auth helpers (`isLeadsAdminAuthenticated`, `mintSessionToken`, `verifySessionToken`, `setLeadsAdminSessionCookie`, `clearLeadsAdminSessionCookie`, `setLoginErrorCookie`, `getLoginError`)
- `app/admin/layout.tsx` — auth-gates everything; sidebar never shown to logged-out users
- `app/admin/leads/actions.ts` — `loginLeadsAdmin`, `logoutLeadsAdmin` server actions

### Sidebar
- `components/admin/AdminSidebar.tsx` — collapsible, animates on hover
- Nav items: Overview, Leads, Clients, Revenue, Agents, Sourced Leads
- Footer: Back to site, **Sign out** (LogOut icon → `logoutLeadsAdmin`)

### Shared UI primitives
- `components/admin/hud-primitives.tsx` — `HudBrackets`, `AnimatedNumber`, `ScanLine`

---

## Pages

| Route | Component | Notes |
|-------|-----------|-------|
| `/admin` | `AdminOverview` | Stats: leads, clients, revenue |
| `/admin/leads` | `LeadsSaasDashboard` | Form submission leads from MongoDB |
| `/admin/clients` | `ClientsDashboard` | Client CRM |
| `/admin/revenue` | — | TBD |
| `/admin/agents` | `AgentsDashboard` | Agent run log + Pipeline Scout widget |
| `/admin/sourced-leads` | `SourcedLeadsDashboard` | AI-sourced leads with score rings + email drafts |

---

## Lead Sourcing System

### Pipeline Scout (triggered from `/admin/agents`)
Plain English brief → Claude Haiku generates Google Places queries → parallel searches → deterministic scoring → Claude Haiku drafts cold emails for top 10 → upserted to MongoDB.

### Files
```
lib/lead-sourcing/
  types.ts             — RawBusiness, ScoredLead, LeadSignal, EmailDraft, SourcingBrief, SourcingResult
  google-maps-agent.ts — Places API (New): https://places.googleapis.com/v1/places:searchText
  scoring-agent.ts     — deterministic 0-100 scoring (no AI needed)
  email-drafting-agent.ts — Claude Haiku, max_tokens 512, FINN_CONTEXT prompt
  master-agent.ts      — orchestrates all sub-agents, returns SourcingResult
lib/sourced-lead-db.ts — sourced_leads MongoDB collection (separate from form leads)
app/api/agents/source-leads/route.ts — POST endpoint, maxDuration=60
app/admin/sourced-leads/page.tsx + actions.ts
components/admin/SourcedLeadsDashboard.tsx
```

### Status flow
`new → emailed → called → booked → converted → dismissed`

### Required env vars
- `GOOGLE_PLACES_API_KEY` — Google Places (New) API key
- `ANTHROPIC_API_KEY` — for Claude Haiku email drafting
- `LEADS_ADMIN_PASSWORD` — admin login
- `MONGODB_URI` — MongoDB Atlas connection string

---

## MongoDB collections
- `leads` — form submission leads
- `clients` — client CRM
- `agent_runs` — agent execution log
- `sourced_leads` — AI-sourced leads (unique index on `placeId`)

---

## Agent Registry
- `lib/agent-registry.ts` — plain `.ts` (NOT "use client") — critical, exports `AGENTS` array with Lucide icons for both server and client components
- `lib/agent-db.ts` — `insertAgentRun`, `updateAgentRun`, `listAgentRuns`, `getLastRunByAgent`

---

## Vercel MCP
Connected: `claude mcp add --transport http --scope user vercel https://mcp.vercel.com`
Use this to check deployment logs without asking the user.

---

## Known issues / pending work

### 1. Test Pipeline Scout end-to-end
- Go to `/admin/agents` → Pipeline Scout widget → type "dentists in London"
- Verify leads appear in `/admin/sourced-leads` with scores and email drafts
- Both `ANTHROPIC_API_KEY` and `GOOGLE_PLACES_API_KEY` must be set on Vercel

### 2. Remote Control (PAUSED — needs Environment ID)
- User needs: claude.ai → Settings → Claude Code → Remote Control/Environments → copy Environment ID
- Once provided: create 4 triggers (KB Update, Weekly Review, New Client, Pipeline Check) using `RemoteTrigger` tool
- Then build `/admin/remote-control` page (preset buttons + free-form prompt + live output log in MongoDB)

### 3. Revenue page
`/admin/revenue` page is listed in the sidebar but not yet built.

### 4. Phase 2 lead sourcing
Apollo.io ($49/mo) for LinkedIn enrichment and verified email addresses — deferred until MRR allows.

---

## Recent commits (most recent first)
- `bc3fdfc` — security: Konami gate + layout auth + logout in sidebar
- `168d2f3` — fix: session cookie path / to fix API auth
- `2550ebd` — feat: full lead sourcing system (master agent + sourced leads dashboard)

---

## Gotchas to remember
- **"use client" boundary**: Never export React components (e.g. Lucide icons) from a `"use client"` file and import into a server component. Use a plain `.ts` file (`lib/agent-registry.ts` pattern).
- **Cookie path**: Session cookie must be `path="/"` so it's sent to `/api/*` routes, not just `/admin/*`.
- **MongoDB index guard**: Module-level `_indexesEnsured` boolean prevents redundant index creation on every request.
- **`getDb`** is the shared MongoDB connection helper (alias for `getLeadsDb` in `lib/mongodb.ts`).
- **`computeClientStats`** is a pure function in `lib/client-db.ts` — use it instead of calling `getClientStats()` when you already have client data.
