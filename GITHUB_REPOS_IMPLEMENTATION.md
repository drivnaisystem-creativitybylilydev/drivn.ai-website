# GitHub Repos Implementation Guide

**Created:** 2026-04-29  
**Research:** Claude.web GitHub investigation for AI consulting agency  
**Goal:** Build productizable MCP servers + specialized agents for Drivn.AI

---

## BEFORE YOU START

- [ ] Have GitHub account + SSH key configured
- [ ] Node.js/npm or Python installed (depending on server type)
- [ ] Claude Code + access to your Anthropic API key
- [ ] ~2-3 hours per week for 4 weeks

---

## WEEK 1: MCP Foundation (modelcontextprotocol/servers + anthropic/claude-code-examples)

### Goal
Clone MCP servers repo, understand architecture, build your first custom MCP server (reads your leads tracker).

### Step 1: Clone Official MCP Servers Repo

```bash
cd ~/Desktop
git clone https://github.com/modelcontextprotocol/servers.git mcp-servers-official
cd mcp-servers-official
```

Explore the structure:
```
servers/
├── src/
│   ├── gmail/              # Gmail MCP implementation
│   ├── google-drive/       # Google Drive MCP
│   ├── slack/              # Slack MCP
│   ├── postgres/           # PostgreSQL MCP
│   ├── puppeteer/          # Browser automation
│   └── [more servers]
├── README.md               # Start here
└── package.json
```

**What to read first:**
- `README.md` — explains MCP protocol
- `src/gmail/README.md` — simplest example
- `src/[server-name]/src/index.ts` — study pattern of one server

### Step 2: Understand MCP Architecture

Every MCP server has:
1. **Tools** — functions Claude can call (e.g., "get-emails", "list-files")
2. **Resources** — data Claude can read (e.g., file contents, email threads)
3. **Server** — listens on stdio, responds to Claude requests

Example pattern (from official repo):
```typescript
// MCP server exposes tools that Claude can call
server.setRequestHandler(ListToolsRequest, async () => ({
  tools: [
    {
      name: "get-emails",
      description: "Fetch recent emails",
      inputSchema: { /* params */ }
    }
  ]
}));

server.setRequestHandler(CallToolRequest, async (request) => {
  if (request.params.name === "get-emails") {
    // Fetch emails, return results
    return { content: [{ type: "text", text: emailData }] };
  }
});
```

### Step 3: Build Your First Custom MCP Server

**Goal:** Read your leads tracker JSON (at `~/Desktop/Drivn.AI OS/leads/leads-summary.json`)

**Create this file:**

```
~/Desktop/drivn-mcp-servers/
├── src/
│   └── drivn-leads/
│       ├── src/
│       │   └── index.ts          # Main server
│       ├── package.json
│       └── tsconfig.json
```

**`drivn-leads/src/index.ts`:**

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/stdio";
import { ListToolsRequest, CallToolRequest } from "@modelcontextprotocol/sdk/types";
import { readFileSync } from "fs";
import { resolve } from "path";

const server = new Server({
  name: "drivn-leads-mcp",
  version: "1.0.0",
});

// Tool: Get all leads
server.setRequestHandler(ListToolsRequest, async () => ({
  tools: [
    {
      name: "get-all-leads",
      description: "Fetch all leads from Drivn.AI tracker",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "get-leads-by-niche",
      description: "Get leads filtered by niche",
      inputSchema: {
        type: "object",
        properties: {
          niche: {
            type: "string",
            description: "Niche name (e.g., 'Landscaper', 'Roofing')",
          },
        },
        required: ["niche"],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequest, async (request) => {
  const leadsPath = resolve(
    process.env.HOME,
    "Desktop/Drivn.AI OS/leads/LEADS_SUMMARY.md"
  );

  if (request.params.name === "get-all-leads") {
    try {
      const data = readFileSync(leadsPath, "utf-8");
      return {
        content: [{ type: "text", text: data }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error: ${err}` }],
        isError: true,
      };
    }
  }

  if (request.params.name === "get-leads-by-niche") {
    const niche = request.params.arguments.niche;
    try {
      const data = readFileSync(leadsPath, "utf-8");
      const filtered = data
        .split("\n")
        .filter((line) => line.includes(niche))
        .join("\n");
      return {
        content: [{ type: "text", text: filtered || "No leads found" }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error: ${err}` }],
        isError: true,
      };
    }
  }

  return {
    content: [{ type: "text", text: "Unknown tool" }],
    isError: true,
  };
});

server.connect(process.stdin, process.stdout);
```

**`package.json`:**

```json
{
  "name": "drivn-leads-mcp",
  "version": "1.0.0",
  "type": "module",
  "main": "src/index.ts",
  "scripts": {
    "start": "node src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.7.0"
  }
}
```

### Step 4: Wire Into Claude Code

In your Claude Code `.mcp.json` or settings, register the server:

```json
{
  "mcpServers": {
    "drivn-leads": {
      "command": "node",
      "args": ["/path/to/drivn-mcp-servers/src/drivn-leads/src/index.ts"]
    }
  }
}
```

Then ask Claude Code: *"What are all my leads in the Landscaper niche?"*

Claude will call your MCP server → reads your leads → answers.

---

## WEEK 2: Agent Skills (msitarzewski/agency-agents)

### Goal
Clone agency-agents repo, study 3 proven agent personalities, adapt for home service contractors.

### Step 1: Clone Repo

```bash
cd ~/Desktop
git clone https://github.com/msitarzewski/agency-agents.git
cd agency-agents
```

Explore:
```
agency-agents/
├── agents/
│   ├── sales_specialist/
│   ├── marketing_specialist/
│   ├── proposal_writer/
│   ├── account_manager/
│   ├── recruiter/
│   └── [140+ more agents]
└── README.md
```

### Step 2: Study These 3 Agents

1. **sales_specialist/** — Cold outreach, objection handling, lead qualification
2. **proposal_writer/** — Pricing, ROI calculations, contract generation
3. **account_manager/** — Client retention, upsell opportunities, health checks

For each, read:
- `instructions.md` — personality, values, approach
- `system_prompt.txt` — exact prompt to copy
- `tools.json` — what tools it needs access to

### Step 3: Adapt for Home Service Contractors

Copy the Sales Specialist prompt into a new file:

```
~/Drivn.AI OS/agents/
├── sales-specialist-contractor.md
├── proposal-writer-contractor.md
├── account-manager-contractor.md
```

**Example adaptation (sales-specialist):**

Original mentions: "B2B SaaS, enterprise clients, ROI calculation"

Your version: "Home service contractors, 5-50 employees, lead conversion focus"

Replace:
- "annual contract value" → "job value ($500-$5000)"
- "enterprise stakeholders" → "owner + operations manager"
- "implementation timeline" → "service schedule + crew availability"

### Step 4: Build Jarvis Variants

Create specialized Jarvis agents:
- `jarvis-sales.md` — focuses on lead scoring + objection handling
- `jarvis-proposals.md` — focuses on pricing structure for contractors
- `jarvis-strategy.md` — focuses on revenue growth for home service business

---

## WEEK 3: Integrations (github/gh-aw + MCP Gmail)

### Goal
Build Gmail MCP server + one internal automation workflow.

### Step 1: Clone Gmail MCP from Official Repo

Already in your cloned `mcp-servers-official/`:

```bash
cd ~/Desktop/mcp-servers-official/src/gmail
```

Study:
- `README.md` — Gmail setup, OAuth flow
- `src/index.ts` — implementation

### Step 2: Deploy Gmail MCP Locally

```bash
cd ~/Desktop/mcp-servers-official/src/gmail
npm install
# Follow README for OAuth setup with your Gmail account
```

### Step 3: Test It

Ask Claude Code: *"What are my recent emails from leads?"*

Claude calls Gmail MCP → reads your emails → summarizes.

### Step 4: Build One Internal Workflow

**Use case:** Daily client health check

Create file: `~/Drivn.AI OS/workflows/daily-client-health-check.md`

```markdown
# Daily Client Health Check (Agentic Workflow)

## Goal
Every morning, Jarvis reviews:
- Active client projects
- Revenue at risk
- Follow-ups needed
- Opportunities to upsell

## Tools Available
- drivn-leads MCP (get client data)
- Gmail MCP (get client emails)
- Jarvis agent (analyze + recommend)

## Steps
1. Get all active clients from leads tracker
2. Fetch recent emails from each client
3. Analyze sentiment + needs from emails
4. Jarvis generates "Daily Brief" with:
   - Red flags (client at risk?)
   - Green flags (upsell opportunity?)
   - Next actions (send this, follow up on that)
5. Save brief to ~/Drivn.AI OS/reports/daily-brief.md

## Trigger
Run every morning at 8am (you'll set up with cron/automation later)
```

---

## WEEK 4: Production (Puppeteer MCP + First Client Deploy)

### Goal
Build lead enrichment MCP OR deploy first integration to a client.

### Option A: Lead Enrichment MCP

```bash
cd ~/Desktop/mcp-servers-official/src/puppeteer
```

Build a server that:
1. Takes a contractor name + location
2. Puppeteer scrapes: Google rating, review count, website info
3. Returns enriched lead data

Claude + this server = "Give me a contractor in Atlanta + I'll auto-enrich their online presence data"

### Option B: Deploy to First Client

Pick ONE client pain point:
- "Missed calls going to voicemail" → Build Twilio + Gmail MCP integration
- "Leads stuck in email inbox" → Build lead classification workflow
- "Manual proposal creation" → Connect your Proposal Writer agent to their CRM

Deploy it. Get feedback. Document.

---

## QUICK REFERENCE: Commands to Know

```bash
# Clone official repo
git clone https://github.com/modelcontextprotocol/servers.git

# Clone agent templates
git clone https://github.com/msitarzewski/agency-agents.git

# View your custom MCP in Claude Code
# (Check your .mcp.json or Claude Code settings)

# Test MCP server
node src/index.ts

# Verify MCP is running
# (Ask Claude Code to use a tool from that MCP)
```

---

## How to Know You're Done

- [ ] Week 1: Custom MCP server reads your leads, Claude Code can query it
- [ ] Week 2: Copied 3 agent personalities, adapted for contractors
- [ ] Week 3: Gmail MCP working, daily brief workflow documented
- [ ] Week 4: First integration deployed or lead enrichment MCP built
- [ ] All work documented in `~/Drivn.AI OS/` with README files

---

## Next: Build Your Drivn.AI OS Repository

Once you've completed 4 weeks, create:

```
~/Drivn.AI OS/agents/
├── jarvis-sales.md
├── jarvis-proposals.md
├── jarvis-strategy.md
└── ...

~/Drivn.AI OS/integrations/
├── drivn-leads-mcp/         (your custom MCP)
├── gmail-mcp-setup/         (Gmail integration)
├── puppeteer-enrichment/    (lead scraping)
└── ...

~/Drivn.AI OS/workflows/
├── daily-client-health-check.md
├── proposal-generation.md
└── ...
```

This becomes your open-source competitive advantage.
