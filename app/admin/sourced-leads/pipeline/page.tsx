import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { listSourcedLeadsByCategory } from "@/lib/sourced-lead-db";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { PriorityPipeline } from "@/components/admin/PriorityPipeline";

export const dynamic = "force-dynamic";

// The niches Finn is actively working (picked 2026-08-06: enough volume to
// run a real campaign on, split across a high-ticket lane (Roofing), a proven
// low-friction lane (Pressure Washing — Hydro-Clean already responded), and a
// volume test for the templated approach (Landscaper). Everything else in the
// 406-lead pool stays in the general dashboard until one of these three plays out.
// "North Easton" added 2026-08-07: a geography-based space (not a vertical) for the
// local batch sourced near Finn's new base — North Easton/Easton, Stoughton, Mansfield,
// Norton, Raynham, West Bridgewater, Brockton. See leads_us/north-easton-ma-leads-2026-08-07.md.
// "German Leads" added 2026-08-07: catch-all space for one-off German-market leads
// sourced outside the main pipeline/moving-co system (e.g. social/flyer finds).
// "MA Moving Companies" added 2026-08-07: statewide sweep (20 cities, Apify Google Maps)
// for the AI automation offer (instant quoting, speed-to-lead, booking) — the domestic
// counterpart to the German moving-co-system vertical. 272 leads. See
// leads_us/ma-moving-leads-2026-08-07-clean.csv and memory ma-moving-company-pipeline.
const PRIORITY_NICHES = ["Pressure Washing Service", "Roofing Contractor", "Landscaper", "North Easton", "German Leads", "MA Moving Companies"];

export default async function PriorityPipelinePage() {
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    return (
      <AdminChrome>
        <AdminLoginPanel />
      </AdminChrome>
    );
  }

  const leads = await listSourcedLeadsByCategory(PRIORITY_NICHES);

  return (
    <AdminChrome>
      <PriorityPipeline leads={leads} niches={PRIORITY_NICHES} />
    </AdminChrome>
  );
}
