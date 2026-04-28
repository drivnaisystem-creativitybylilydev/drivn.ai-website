"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocFile {
  name: string;
  title: string;
  description: string;
  content: string;
}

// Content from OS folder - embedded directly
const COMPLETE_OPERATING_SYSTEM = `# Drivn.AI Complete Operating System
## Lead Sourcing → Signed Client (Full Workflow)

---

## **STAGE 1: LEAD SOURCING**
*Getting raw prospects into the system*

**Where leads come from:**
1. **Automated Scraping** — Lead sourcer agent pulls from Google Maps, Apify
2. **Manual Import** — Add from Instagram, LinkedIn, Google Sheets
3. **Inbound Forms** — Prospects submit contact form on drivn.ai-website

**How to add them to the system:**
- **Website Dashboard:** \`/admin/sourced-leads\` → Click "Add Business" button
  - Fills MongoDB \`sourced_leads\` collection automatically
  - No redeploy needed — appears instantly
- **Bulk Import:** Use the list view to import from sheets, then status track
- **Source Tracking:** System marks source as \`google_maps\`, \`apify\`, or \`manual\`

**Current inventory:**
- 402 leads in MongoDB (website dashboard)
- Organized by 22 service niches (Landscaper, Roofing, HVAC, etc.)
- Each has: name, contact, rating, score, status, notes field

---

See COMPLETE-OPERATING-SYSTEM.md in your OS folder for full details.`;

const OS_PROJECT_DASHBOARD = `# Drivn.AI Internal Project Dashboard
*Your view of all client projects, timeline, billing, and team assignments*

**Location:** \`/admin/projects\` on drivn.ai-website
**Data Source:** Master MongoDB (\`drivn.projects\` collection)
**Updated:** Real-time as status changes

---

## **What You See: Project Status Board**

**Portfolio Summary:**
- Active Projects: Number of clients in implementation
- In Pipeline: Deals in progress
- Current MRR: Monthly recurring revenue
- Team Capacity: Utilization percentage

**Active Projects Section:**
Shows each client with:
- Status (Week 1-4, Launched, Maintenance)
- Start date and go-live target
- Deliverables with % completion
- Blockers and next steps

---

See OS-PROJECT-DASHBOARD.md in your OS folder for full details.`;

const STAGE_3_CLIENT_DASHBOARD = `# Stage 3: Client Dashboard Architecture
*Real-time metrics collection from all business sources*

---

## **Overview**

Stage 3 is the complete client dashboard with real-time metrics flowing from 7+ data sources. Every client gets a unified view of their business performance across all channels we manage.

**Core Principle:** Client can see in one dashboard what we see in ours—calls, appointments, revenue, reviews, website activity, SMS, AI receptionist performance.

---

## **7 Data Sources**

### 1. **Google Business Profile**
- Monthly call volume
- Website clicks
- Direction requests
- Photo views
- Review metrics (rating, count, sentiment)
- **Sync:** Every 6 hours via Google Business API

### 2. **Phone System (Twilio/RingCentral)**
- Inbound call count
- Call duration
- Call recordings available
- Missed calls
- Call outcomes (booked, general inquiry, etc.)
- **Sync:** Every 15 minutes

### 3. **AI Receptionist (Bland AI / Retell)**
- Calls handled by AI
- Transfer rate to human
- Appointment setting rate
- Customer satisfaction score
- Conversation summaries
- **Sync:** Real-time to 15-min batches

### 4. **Chatbot (Intercom / Custom)**
- Chat volume
- Response time
- Resolution rate (solved without human)
- Lead capture rate
- Sentiment analysis
- **Sync:** Every 15 minutes

### 5. **SMS & Messaging (Twilio SMS / Zapier)**
- SMS sent/received count
- Appointment confirmations
- Customer responses
- Conversation summaries
- **Sync:** Every hour

### 6. **Google Analytics 4**
- Website visitors
- Visitor source (organic, paid, direct, referral)
- Conversion rate
- Time on site
- Top pages
- **Sync:** Every 6 hours (GA4 has 24-48h delay)

### 7. **Google Reviews Agent**
- New reviews posted
- Review sentiment
- Response status (replied/not replied)
- Impact on rating
- **Sync:** Daily at 6am

---

## **MongoDB Schema: \`client_realtime_metrics\`**

\`\`\`javascript
{
  clientId: ObjectId,
  businessName: String,

  // Timestamp of last update
  lastUpdated: Date,

  // Phone & Calls
  calls: {
    inbound: Number,        // total calls today
    missed: Number,
    avgDuration: Number,    // seconds
    outcomes: {
      booked: Number,
      inquiry: Number,
      spam: Number,
      transferred: Number
    },
    trend7d: [Number]       // array of daily counts
  },

  // AI Receptionist
  aiReceptionist: {
    callsHandled: Number,
    transferRate: Number,   // 0-1
    appointmentsSet: Number,
    avgSatisfaction: Number, // 0-5
    callsToday: Number
  },

  // Appointments
  appointments: {
    scheduled: Number,      // this month
    completed: Number,
    noshow: Number,
    rescheduled: Number,
    conversionRate: Number  // booked appointments / calls
  },

  // SMS & Messaging
  messaging: {
    smsToday: Number,
    chatToday: Number,
    responseTime: Number,   // seconds
    resolutionRate: Number  // 0-1
  },

  // Website
  website: {
    visitorsToday: Number,
    visitorsWeek: Number,
    conversionRate: Number, // 0-1
    topPages: [String],
    sources: {
      organic: Number,
      paid: Number,
      direct: Number,
      referral: Number
    }
  },

  // Reviews
  reviews: {
    rating: Number,         // 1-5
    totalReviews: Number,
    newThisMonth: Number,
    avgSentiment: Number,   // 0-1 (positive)
    unreplied: Number
  },

  // Revenue (if we track it)
  revenue: {
    today: Number,
    thisMonth: Number,
    trend7d: [Number]
  },

  // Metadata
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

---

## **Sync Jobs (Scheduled)**

| Source | Frequency | Method | Cost |
|--------|-----------|--------|------|
| Google Business | Every 6h | API | Free tier (300 req/day) |
| Twilio Calls | Every 15m | Webhooks | Twilio bill |
| AI Receptionist | Real-time | Webhooks | Included in Bland bill |
| Chatbot | Every 15m | API | Included in Intercom |
| SMS | Every 1h | API | Twilio bill |
| GA4 | Every 6h | API | Free (real time data) |
| Google Reviews | Daily 6am | API | Free |

**Estimated Cost at Scale:** $7/client/month (Twilio + API calls)

---

## **Dashboard Views**

### Daily Performance Card
- Calls received (↑/↓ vs yesterday)
- Appointments booked (↑/↓)
- Website visitors (↑/↓)
- Revenue today (if tracked)
- Reviews posted (new)

### Phone Performance
- Inbound calls graph (7 days)
- Call outcomes breakdown (pie)
- Top hours for calls (heat map)
- Missed calls alert

### Appointments
- Conversion funnel (calls → booked → completed)
- Calendar view of scheduled appointments
- No-show rate
- Reschedule reasons

### Website Traffic
- Visitor trend (30 days)
- Traffic by source (pie)
- Top pages (list)
- Conversion rate

### Reviews & Reputation
- Rating trend
- Sentiment timeline
- Unreplied reviews (alert)
- Recent reviews (with sentiment score)

### AI Receptionist Performance
- Calls handled vs transferred
- Satisfaction score
- Appointments set by AI
- Top call intents (if categorized)

---

## **Implementation Phases**

### Phase 1: Foundation (Week 1-2)
- [ ] Create \`client_realtime_metrics\` collection
- [ ] Set up MongoDB connection to Supabase (if using per-client DB)
- [ ] Build basic dashboard view (static mock data)
- [ ] Create Twilio webhook receiver
- [ ] Manual data entry form for testing

### Phase 2: API Integration (Week 3-4)
- [ ] Connect Twilio API (15-min sync)
- [ ] Connect Google Business API (6h sync)
- [ ] Connect GA4 API (6h sync)
- [ ] Create scheduled sync jobs (Node-cron)
- [ ] Test data flow end-to-end

### Phase 3: Advanced Sources (Week 5-6)
- [ ] Bland AI webhook integration
- [ ] Chatbot (Intercom) API
- [ ] SMS tracking
- [ ] Google Reviews API
- [ ] Chart visualizations (Chart.js / Recharts)

### Phase 4: Client Portal (Week 7-8)
- [ ] White-label client dashboard
- [ ] Email digests (daily/weekly)
- [ ] Alert system (low appointments, high missed calls)
- [ ] Export to PDF/CSV
- [ ] Performance benchmarks vs industry

---

## **Key Decisions**

1. **Per-client Supabase?** Yes, for isolation and real-time subscriptions, but master MongoDB for internal tracking.
2. **Sync frequency?** Calls/AI = 15m, website = 6h, reviews = daily. Balance freshness vs API quota.
3. **Data retention?** Keep 90 days detailed, 1 year aggregated.
4. **Client visibility?** Show all 7 data sources in one unified view.
5. **Alerts?** Notify client if missed calls > 5 in a day or 0 appointments in 3 days.`;

const AGENT_BREAKDOWN = `# Drivn.AI Agent Breakdown
*What each agent does, when to use it, and where it creates value*

---

## **JARVIS — AI Chief of Staff**

**What It Does:**
- Strategic advisor for high-stakes decisions
- Reads your entire knowledge base (OS, CLAUDE.md, agency context)
- Evaluates client opportunities, pricing, build priorities
- Challenges weak assumptions and flags risks
- Quantifies decisions with ROI math

**When to Use It:**
- Should I take this client? What price?
- How do I hit my $1K MRR goal?
- What agent or feature should I build next?
- Is this decision aligned with my strategy?
- Review progress against quarterly goals

**Time Saved:**
- 30 min/decision on strategy calls (vs. manual thinking)
- Eliminates analysis paralysis on borderline clients
- Ensures every build decision has ROI math attached

**Revenue Impact:**
- **Direct:** Helps justify 10-15% price increases ($2-3K MRR gain)
- **Indirect:** Better client selection (fewer bad fits)
- **Strategic:** Forces you to think in terms of revenue, not just delivery

**Cost:** ~$0.04 per query (Haiku model)

---

## **PIPELINE SCOUT — Lead Sourcing Automation**

**What It Does:**
- Searches for ICP (Ideal Customer Profile) prospects
- Scrapes Google Maps, Apify, and other lead sources
- Auto-scores leads based on fit, rating, reviews, signals
- Adds qualified leads directly to your dashboard
- Tracks source (Google Maps, Apify, manual)

**When to Use It:**
- Daily/weekly to build pipeline
- When starting a new niche test
- To backfill empty niches (e.g., "find 50 roofing contractors in Florida")
- Quarterly to replenish cold leads

**Time Saved:**
- **Manual sourcing:** 2-4 hours/week → **Agent:** 30 min to set up, then automated
- Eliminates repetitive Google Maps/LinkedIn searching
- Auto-scores mean you don't spend time reading reviews manually

**Revenue Impact:**
- **Direct:** Qualified leads → faster sales cycle (close 10% more deals)
- **Indirect:** Fresh pipeline reduces feast/famine cycles
- **Leverage:** Pay-per-execution means zero upfront cost for sourcing

**Current State:**
- 402 leads across 21 niches
- Migration to Apify in progress (4x cheaper than current method, includes emails)

**Cost:** ~$0.02-0.05 per lead (depending on source)

---

## **LEAD NURTURE — Sales Follow-Up Automation**

**What It Does:**
- Identifies leads needing follow-up (30, 60, 90+ days since contact)
- Drafts personalized outreach messages (email, SMS, call scripts)
- Considers lead context (rating, reviews, signals) in messaging
- Prioritizes by fit score (warm leads first)
- Logs activity back to dashboard

**When to Use It:**
- 2-3x per week to keep pipeline moving
- When you have stale leads you've lost momentum on
- To automate the \"remind me to follow up\" burden
- Before closing a month (don't want dead leads in pipeline)

**Time Saved:**
- **Manual follow-up:** 1 hour/week → **Agent:** 5 minutes to review + send
- Removes decision fatigue on who to contact
- Ensures no lead falls through the cracks due to forgetting

**Revenue Impact:**
- **Direct:** Re-engages leads you forgot about (recover 5-10 deals/quarter)
- **Indirect:** Faster close rates (warm contacts → faster conversion)
- **Soft:** Builds predictable sales rhythm (less chaos)

**Cost:** ~$0.01 per lead nuture (Haiku model)

---

## **PROPOSAL WRITER — Sales Content Generation**

**What It Does:**
- Takes a client brief (goals, budget, timeline, pain points)
- Generates full proposal doc (scope, deliverables, timeline, pricing, terms)
- Matches your typical offer structure
- Customizes for client segment (startup, SMB, enterprise)
- Produces Word/PDF-ready output

**When to Use It:**
- After a prospect says \"send me a proposal\"
- When you have a qualified lead and want to move fast
- To create variations (different price tiers, timelines)
- When you're too busy to write manually

**Time Saved:**
- **Manual proposal:** 1.5-2 hours → **Agent:** 5 minutes to fill brief, 2 minutes to review
- Ensures consistent quality and structure
- Eliminates blank-page syndrome

**Revenue Impact:**
- **Direct:** Faster sales cycle (proposal in 10 min vs. 2 days = 50% faster close)
- **Indirect:** Higher close rate (polished proposal looks professional)
- **Strategic:** Experiment with pricing quickly (test $5K vs. $7K without rewriting)

**Cost:** ~$0.03 per proposal (includes custom formatting)

---

## **CASE STUDY BUILDER — Content Marketing**

**What It Does:**
- Takes a completed project (deliverables, results, client feedback)
- Turns it into a polished case study (problem, solution, results, quote)
- Optimizes for web: narrative arc, metrics, testimonial placement
- Exports as blog post (Markdown) or PDF
- Can be used for website, LinkedIn, sales deck

**When to Use It:**
- After completing a client project (Week 1 go-live)
- When you have strong metrics/testimonials to showcase
- To build social proof library (1-2 per month target)
- Before launching a new service line

**Time Saved:**
- **Manual case study:** 3-4 hours → **Agent:** 30 minutes to gather info, 10 min to polish
- Removes tedious editing and rewriting
- Creates consistent case study format

**Revenue Impact:**
- **Direct:** Builds authority (case studies → higher perceived value → 10-20% price premium)
- **Indirect:** SEO content (case studies rank, drive inbound leads)
- **Long-term:** Social proof snowball (3-4 case studies = portfolio effect)

**Cost:** ~$0.04 per case study

---

## **KB UPDATER — Knowledge Base Sync**

**What It Does:**
- Reads all files in your OS folder
- Syncs agency state to CLAUDE.md (a living snapshot of current status)
- Captures: MRR, clients, projects, open tasks, decision history
- Makes institutional knowledge accessible to all agents
- Keeps Jarvis context fresh and accurate

**When to Use It:**
- Daily (automated via schedule)
- After major changes (new client, major decision, milestone hit)
- Before running other agents (ensures context is current)

**Time Saved:**
- **Manual documentation:** 30 min/week → **Agent:** automated, 2 min to review
- Eliminates stale documentation
- Keeps institutional memory alive

**Revenue Impact:**
- **Indirect:** Better agent decisions because context is current
- **Soft:** Speeds up onboarding new team members
- **Strategic:** Enables handoff/scaling (everything documented)

**Cost:** ~$0.05 per sync

---

## **WEEKLY REVIEW — Operations Dashboard**

**What It Does:**
- Summarizes the week: MRR delta, pipeline changes, open tasks
- Extracts key metrics (leads sourced, calls made, proposals sent, deals closed)
- Flags bottlenecks (e.g., \"stuck on 3 proposals for 5 days\")
- Compares vs. goals (on track for $1K MRR? For 4 clients/month?)
- Outputs a readable weekly summary for Slack or email

**When to Use It:**
- Every Friday (automated)
- Before Monday planning (know where you stand)
- Mid-month check-in (course correction)
- To track trends (are you accelerating? decelerating?)

**Time Saved:**
- **Manual reporting:** 45 min → **Agent:** 5 min to review
- Removes guessing on metrics
- Speeds up decision-making (data at hand)

**Revenue Impact:**
- **Indirect:** Faster course correction (catch MRR dips early)
- **Strategic:** Accountability (forced to measure progress)
- **Soft:** Morale (see wins collected, not just day-to-day chaos)

**Cost:** ~$0.02 per report

---

## **Agent ROI Summary**

| Agent | Weekly Use | Time Saved/Week | Revenue Impact | Cost/Month |
|-------|-----------|---|---|---|
| **Jarvis** | 1-2 queries | 1 hour | $500-2K (better decisions) | $1-2 |
| **Pipeline Scout** | 2x/week | 7 hours | $2-5K (pipeline growth) | $20-50 |
| **Lead Nurture** | 3x/week | 2.5 hours | $1-3K (recovered deals) | $5-10 |
| **Proposal Writer** | 1-2x/week | 3 hours | $2-7K (faster close) | $3-5 |
| **Case Study Builder** | 1x/month | 3 hours | $2-5K (authority, SEO) | $1-2 |
| **KB Updater** | Daily | 5 hours/month | $500-1K (context) | $3 |
| **Weekly Review** | 1x/week | 2 hours/month | $500-1K (course correct) | $1 |
| **TOTAL** | | ~13 hours/week | **$8-25K/month potential** | **~$34-70/month** |

---

## **How to Maximize Agent Value**

### 1. **Run them in sequence**
   - KB Updater first (fresh context)
   - Then Pipeline Scout (get leads)
   - Then Lead Nurture (follow up on warm leads)
   - Then Proposal Writer (close)
   - Then Case Study Builder (showcase win)

### 2. **Chain decisions to Jarvis**
   - Ask Jarvis: \"Should I pursue [niche] based on pipeline Scout's leads?\"
   - Jarvis will consider: ICP fit, pricing, resource constraints, goal alignment

### 3. **Use Weekly Review as checkpoint**
   - Friday: Run Weekly Review
   - See what's working, what's stuck
   - Monday: Adjust agent priorities based on bottleneck

### 4. **Iterate the brief**
   - First case study might be rough
   - Second is better (you know what agents need)
   - By 5th, you have a formula

### 5. **Cost-per-outcome thinking**
   - Pipeline Scout costs $30/week but brings $2-5K in potential revenue
   - Proposal Writer costs $5/week but accelerates deals by 2 days = real revenue impact
   - Agents are only \"expensive\" if underutilized`;

const DATABASE_STRATEGY = `# Database Strategy: Supabase per Client vs Single MongoDB

---

## **The Question**

Where do we store client data? One big MongoDB instance, or a Supabase database per client?

---

## **Option 1: Single MongoDB (Master Only)**

**Setup:** All clients in one \`drivn\` MongoDB database.

**Pros:**
- Simpler operations (one DB to manage)
- Easier reporting across all clients
- Lower cost ($10-50/month MongoDB Atlas)
- Single backup/restore

**Cons:**
- ❌ Data isolation nightmare (one client could query another's data via SQL injection)
- ❌ Performance degrades as data grows (millions of docs)
- ❌ Scaling expensive (vertical, not horizontal)
- ❌ One client's bad query locks everyone
- ❌ Custom auth per client = complex

---

## **Option 2: Supabase per Client (RECOMMENDED)**

**Setup:** Each client gets their own Supabase PostgreSQL database.

**Pros:**
- ✅ Complete data isolation (database-level)
- ✅ Built-in auth per client (JWT tokens per Supabase instance)
- ✅ Real-time subscriptions (Supabase offers this natively)
- ✅ Row-level security (RLS) per client policies
- ✅ Scales infinitely (each client is independent)
- ✅ Easy onboarding (spin up new DB in seconds)
- ✅ Client can't access other client data (database is their own)

**Cons:**
- Higher cost at scale ($10-50/client/month depending on storage/bandwidth)
- Operational overhead (managing N databases)

---

## **Cost Comparison**

| Scenario | Single MongoDB | Supabase per Client |
|----------|---|---|
| **10 Clients** | $40/month | $100-500/month |
| **50 Clients** | $50/month | $500-2,500/month |
| **100 Clients** | $60/month | $1,000-5,000/month |

**At 10 clients:** Supabase is 2-12x more expensive.
**But:** Security isolation, built-in auth, and scalability worth the cost.

---

## **Our Architecture**

### Master MongoDB (Internal)
**Purpose:** Drivn.AI's internal data (not client-facing)

**Collections:**
- \`clients\` - Client info, contract, billing
- \`projects\` - Project status, milestones, deliverables
- \`invoices\` - Billing & revenue tracking
- \`agents\` - Agent execution logs
- \`leads\` - Sourced leads database

**Access:** Claude Code only (never exposed to client)

### Per-Client Supabase (Client-Facing)
**Purpose:** Client data and real-time metrics

**Tables:**
- \`calls\` - Phone call logs
- \`appointments\` - Scheduled appointments
- \`website_events\` - Google Analytics events
- \`reviews\` - Google Business reviews
- \`metrics_summary\` - Daily aggregated stats
- \`users\` - Client team members (email, role, permissions)

**Access:** Client via web dashboard, API authenticated with JWT

**Security:**
- Row-level security (RLS) policies
- Each user only sees their own business data
- API keys scoped per environment (dev/prod)

---

## **Data Flow**

\`\`\`
[External APIs]
    ↓
[Drivn.AI Backend]
    ↓
Master MongoDB ← Drivn internal logging
    ↓
Per-Client Supabase ← Real-time metrics pushed here
    ↓
[Client Dashboard] ← Client views via JWT auth
\`\`\`

**Example:** Twilio webhook hits Drivn backend → logs to MongoDB → pushes call data to client's Supabase → client dashboard updates real-time.

---

## **Implementation Strategy**

### Phase 1: Setup
1. Create Supabase project templates for standard tiers
2. Store Supabase project credentials in Master MongoDB (\`clients.supabase_url\`, \`supabase_key\`)
3. Set up environment-based secrets (dev vs prod)

### Phase 2: Connect APIs
1. Configure Twilio → Supabase (webhook)
2. Configure Google APIs → Supabase (scheduled sync)
3. Configure AI Receptionist → Supabase (real-time)

### Phase 3: Client Dashboard
1. Build universal dashboard that connects to client's Supabase instance
2. Use Supabase JWT for client authentication
3. Implement RLS policies to prevent cross-client access

### Phase 4: Scaling
1. Automate Supabase provisioning (Terraform or Supabase CLI)
2. Monitor per-client database size and performance
3. Archive old data (move to cold storage after 90 days)

---

## **Key Decisions Made**

1. **Master MongoDB** for Drivn internal data (leads, clients, invoices, projects)
2. **Per-Client Supabase** for client-facing data (calls, appointments, reviews, metrics)
3. **Data isolation at DB level** (not row level) for maximum security
4. **Real-time subscriptions** via Supabase websockets
5. **JWT auth per client** (Supabase handles this natively)

---

## **Why This Works**

- **Security:** Client A physically cannot access Client B's data (different database)
- **Scale:** Each client gets dedicated resources
- **Auth:** Supabase JWT means no custom auth code
- **Real-time:** Supabase native real-time subscriptions
- **Cost:** ~$15-40/client/month at scale (acceptable for paid tier)

---

## **When to Reconsider**

- If you have 1,000+ clients, per-client Supabase becomes unmanageable → switch to sharded MongoDB
- If you need cross-client reporting, single MongoDB is easier (but adds security complexity)
- If clients are very small (free tier), Master MongoDB only to save costs`;

const DOCS: DocFile[] = [
  {
    name: "AGENT-BREAKDOWN",
    title: "Agent Breakdown & ROI",
    description: "What each AI agent does, when to use it, time saved, and revenue impact. Jarvis, Pipeline Scout, Lead Nurture, Proposal Writer, Case Study Builder, KB Updater, Weekly Review.",
    content: AGENT_BREAKDOWN,
  },
  {
    name: "COMPLETE-OPERATING-SYSTEM",
    title: "Complete Operating System",
    description: "Full workflow from lead sourcing to signed client. Jarvis commands, agent breakdown, and 60-day sprint.",
    content: COMPLETE_OPERATING_SYSTEM,
  },
  {
    name: "OS-PROJECT-DASHBOARD",
    title: "OS Project Dashboard",
    description: "Internal project tracking. Kanban view, financial dashboard, team allocation, deliverables tracking.",
    content: OS_PROJECT_DASHBOARD,
  },
  {
    name: "STAGE-3-CLIENT-DASHBOARD",
    title: "Stage 3: Client Dashboard Architecture",
    description: "Real-time metrics collection from 7+ data sources. Phone, appointments, website, reviews, AI, SMS, revenue.",
    content: STAGE_3_CLIENT_DASHBOARD,
  },
  {
    name: "DATABASE-STRATEGY",
    title: "Database Strategy",
    description: "Supabase per client vs single MongoDB. Security, cost, and implementation comparison.",
    content: DATABASE_STRATEGY,
  },
];

export default function InternalFilesPage() {
  const [selectedDoc, setSelectedDoc] = useState(DOCS[0].name);
  const currentDoc = DOCS.find((d) => d.name === selectedDoc);

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Internal Files</h1>
        <p className="text-white/60">Process documentation, architecture guides, and operational playbooks</p>
      </div>

      {/* Layout: Sidebar + Content */}
      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar: File List */}
        <div className="col-span-1 space-y-2">
          {DOCS.map((doc) => (
            <button
              key={doc.name}
              onClick={() => setSelectedDoc(doc.name)}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-left transition-all",
                selectedDoc === doc.name
                  ? "border-brand-purple/50 bg-brand-purple/10 text-white"
                  : "border-white/10 text-white/70 hover:border-white/20 hover:bg-white/[0.02] hover:text-white/90"
              )}
            >
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{doc.title}</p>
                  <p className="text-xs text-white/40 line-clamp-1">{doc.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content: Document */}
        <div className="col-span-3">
          {currentDoc ? (
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
              {/* Document Header */}
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">{currentDoc.title}</h2>
                <p className="text-sm text-white/60">{currentDoc.description}</p>
              </div>

              {/* Document Content */}
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto p-6">
                <div className="prose prose-invert max-w-none space-y-4 text-sm whitespace-pre-wrap">
                  {currentDoc.content}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] py-12">
              <p className="text-white/60">No documents loaded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
