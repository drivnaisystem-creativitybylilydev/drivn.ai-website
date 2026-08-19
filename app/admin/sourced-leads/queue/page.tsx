import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { listQueueEligibleLeads } from "@/lib/sourced-lead-db";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { WeeklyQueue } from "@/components/admin/WeeklyQueue";

export const dynamic = "force-dynamic";

// Same US niches as the Priority Pipeline, minus "German Leads" — this view
// is the US outreach queue specifically. Keep in sync with PRIORITY_NICHES
// in ../pipeline/page.tsx if that list changes.
const QUEUE_NICHES = ["Pressure Washing Service", "Roofing Contractor", "Landscaper", "North Easton", "MA Moving Companies"];

export default async function WeeklyQueuePage() {
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    return (
      <AdminChrome>
        <AdminLoginPanel />
      </AdminChrome>
    );
  }

  const leads = await listQueueEligibleLeads(QUEUE_NICHES);

  return (
    <AdminChrome>
      <WeeklyQueue leads={leads} niches={QUEUE_NICHES} />
    </AdminChrome>
  );
}
