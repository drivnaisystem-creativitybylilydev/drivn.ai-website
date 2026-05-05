# Drivn.AI Website - Claude Code Context

## Quick Start
```bash
# Open this project
drivn

# Resume previous session (if available)
/resume
```

---

## Current State (Updated 2026-05-03)

### ✅ Deployed Features
- **Dashboard** with 377 leads across 21 canonical niches
- **Search bar** to filter leads by business name
- **Add Business form** to manually add leads (auto-calculates score)
- **Niche merging** via drag-and-drop
- **Status tracking** for each lead (new, called, booked, converted, dismissed)
- **Services section** redesigned with 6-card outcome-focused showcase (NEW)
- **Interview Questionnaire** auto-save (localStorage + MongoDB + Email) (NEW)
- **Case Study Generator** for questionnaire responses (NEW)
- **Jarvis Model Switching** for cost optimization (dynamic Haiku/Sonnet selection) (NEW)

### 📊 Data
- **Total leads:** 377 (zero duplicates)
- **Top niches:** Landscaper (91), Roofing (63), Junk Removal (57)
- **Average score:** 77/100
- **Sources:** MongoDB + manual entries
- **Interview responses:** Auto-saved to MongoDB + emailed to drivn.ai.system@gmail.com

### 🔐 Security (CRITICAL)
- ✅ Old MongoDB password rotated (2026-04-25)
- ✅ Test files with exposed credentials removed from GitHub
- ✅ Scripts now use MONGODB_URI env var only
- ✅ `.env.local` in .gitignore (never commit)
- ✅ Vercel MONGODB_URI env var updated with new password (2026-04-25)
- ✅ Production deployment successful with correct credentials

---

## Folder Structure

```
drivn.ai-website/
├── /app/admin/sourced-leads/        # Dashboard pages & server actions
│   ├── page.tsx                      # Main dashboard (fetches 500 leads)
│   └── actions.ts                    # Server actions (update, merge, add business)
├── /components/admin/                # Dashboard components
│   ├── NicheDashboard.tsx            # Main dashboard with search
│   ├── AddBusinessModal.tsx          # Form to add business manually
│   └── hud-primitives.tsx            # UI decorative elements
├── /lib/sourced-lead-db.ts           # MongoDB queries & types
├── /scripts/export-leads-to-os.js    # Export MongoDB → OS folders
├── leads/                            # Synced from Drivn.AI OS/leads
│   ├── Landscaper/leads.json
│   ├── Roofing Contractor/leads.json
│   └── [19 more niches]/leads.json
└── .env.local                        # Local env vars (NOT committed)

Drivn.AI OS/
└── leads/                            # Master lead folder (synced with website)
    ├── [21 niche folders]/leads.json
    └── LEADS_SUMMARY.md
```

---

## Important: OS + Website Sync

⚠️ **The OS leads folder is synced with the website.**

When making changes:
1. **If updating leads display** → Change both `/components` AND `/app/admin`
2. **If adding niche** → Update both `/lib/sourced-lead-db.ts` AND `/Drivn.AI OS/leads/`
3. **After changes** → Run `scripts/export-leads-to-os.js` to sync MongoDB → OS folders

**Always check:** Does this change affect both the OS and website? If yes, update both.

---

## MongoDB Connection

**Local (.env.local):**
```
MONGODB_URI=mongodb+srv://drivnaisystem_db_user:PX3BdIz07Jmw6Lsr@drivn-website.sgh6j34.mongodb.net/drivn?retryWrites=true&w=majority
```

**Vercel:** Must update environment variables with same URI

**Test connection:**
```bash
MONGODB_URI="$(grep MONGODB_URI .env.local | cut -d= -f2-)" node scripts/export-leads-to-os.js
```

---

## Common Tasks

### Add a business manually
1. Click "Add Business" button in dashboard
2. Fill form: Name, Category, Phone, Website, Email, Rating, Reviews
3. Auto-calculates score, checks for duplicates
4. Saves to MongoDB with `source: "manual"`

### Search leads
1. Use search bar at top of dashboard
2. Type business name (case-insensitive)
3. Works within each niche detail view

### Merge duplicate niches
1. Click into niche detail
2. Drag one niche card onto another
3. Confirm merge dialog
4. Updates MongoDB + refreshes display

### Export MongoDB to OS folders
```bash
MONGODB_URI="$(grep MONGODB_URI .env.local | cut -d= -f2-)" node scripts/export-leads-to-os.js
```

---

## Types & Interfaces

**SourcedLeadDocument** (MongoDB):
- `_id`, `placeId`, `name`, `address`, `phone`, `website`, `email`
- `rating`, `reviewCount`, `category` (niche)
- `score` (0-100, auto-calculated)
- `signals` (tags/features)
- `sourcingQuery` (original search term)
- `status` ("new", "called", "booked", "converted", "dismissed")
- `source` ("google_maps", "apify", "manual")
- `createdAt`, `updatedAt`

**SourcedLeadRow**: Same as above but serializable (dates as ISO strings)

**NicheGroup**: Collection of leads grouped by niche with stats (count, avgScore, topScore, newCount)

---

## Next Steps / To-Do

- [ ] Test questionnaire auto-save in browser (verify localStorage + MongoDB + Email flow)
- [ ] Test case study generator (submit questionnaire, verify PDF/Markdown export)
- [ ] Verify Jarvis model switching in production (check logs for Haiku vs Sonnet selection)
- [ ] Test Services section on mobile (responsive design check)
- [ ] Monitor questionnaire submissions to drivn.ai.system@gmail.com
- [ ] Consider adding more services if case studies warrant
- [ ] Measure API cost reduction from Jarvis model optimization

---

## Key Decisions

1. **Niche consolidation:** 21 canonical niches (not dynamic) to keep data consistent
2. **Lead score:** Calculated as 50 + (rating×10, max 30) + (reviews×0.5, max 15) + bonuses for website/email
3. **Manual source:** Leads added via form get `source: "manual"` for tracking
4. **No soft deletes:** Dismissed leads have status="dismissed" but aren't deleted
5. **OS folder sync:** Exported from MongoDB on-demand (not real-time)

---

## Emergency / Debugging

**Dashboard shows 0 leads?**
1. Check MongoDB connection in .env.local
2. Check Vercel env vars have correct MONGODB_URI
3. Run: `MONGODB_URI="..." node scripts/export-leads-to-os.js`
4. Check browser cache (hard refresh Ctrl+Shift+R)

**Add Business form fails?**
1. Check browser console for error
2. Verify category is in NICHES array
3. Check name doesn't already exist in MongoDB
4. Verify email format if provided

**OS and website out of sync?**
1. Run export script: `node scripts/export-leads-to-os.js`
2. Commit changes to git
3. Push to GitHub (triggers Vercel deploy)

---

## Session Context

**Last session:** 2026-04-25, security fixes, MONGODB_URI restored to Vercel  
**Current session:** 2026-05-03, UI redesigns + interview automation  
**What was done today:**
- Redesigned Services section with 6-card outcome-focused showcase
- Added hybrid questionnaire auto-save (localStorage + MongoDB + Email)
- Built case study generator for questionnaire responses
- Optimized Jarvis cost efficiency with dynamic model switching (Haiku vs Sonnet)
- Linked Interview Questionnaire to admin sidebar
- Fixed ESLint/TypeScript errors (apostrophe escaping, unused vars)

**Current focus:** Website UX improvements + lead automation + case study generation  
**Immediate next:** Test questionnaire auto-save flow, verify case studies generate correctly, check Jarvis model switching in production
