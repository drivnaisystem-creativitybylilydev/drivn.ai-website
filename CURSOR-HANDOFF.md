# Cursor Handoff — NichePieChart

## What Claude Code already built
- `components/admin/NicheDashboard.tsx` — niche grid overview + lead detail view (full logic, animations, status actions)
- `components/admin/NichePieChart.tsx` — STUB that you need to replace
- `lib/sourced-lead-db.ts` — `groupLeadsByNiche()` data function
- `app/admin/sourced-leads/page.tsx` — wired up and working

## Your job: implement NichePieChart

Replace the stub in `components/admin/NichePieChart.tsx` with a real animated pie chart.

### Exact Composer prompt to use:

---

Replace the stub in `components/admin/NichePieChart.tsx` with a fully animated Recharts pie chart. Here is the exact interface and design spec:

**Props (already defined, do not change):**
```ts
interface NichePieSlice {
  niche: string;
  count: number;
  avgScore: number;
}
// component receives: { data: NichePieSlice[] }
```

**Design requirements:**
- Dark theme: background is `#0A0A1A`, no white backgrounds
- Use Recharts `PieChart` + `Pie` + `Cell`
- Donut style (innerRadius ~55, outerRadius ~80)
- Color palette: cycle through `["#8B5CF6", "#A78BFA", "#34d399", "#f59e0b", "#60a5fa", "#f472b6"]`
- On mount, animate the pie slices drawing in using Framer Motion `useInView` + Recharts `startAngle`/`endAngle` or the built-in `isAnimationActive`
- Custom tooltip: dark card (`bg-[#1A1A2E]`, `border border-white/10`), shows niche name, count, avg score
- Below the chart, render a legend: colored dot + niche name + count, using `font-inter text-xs text-white/50`
- No outer border or box shadow on the chart itself — it sits inside a card that already has a border
- Responsive: use `ResponsiveContainer` with `width="100%"` and `height={220}`

**File to edit:** `components/admin/NichePieChart.tsx`
**Do not touch:** any other file

---

## Color tokens for reference
```
brand-purple: #8B5CF6
brand-purple-light: #A78BFA
brand-dark: #0A0A1A
surface: #1A1A2E
font-sora (headings), font-inter (body)
```

## recharts is already installed
Run `npm install` if needed — recharts is in package.json.
