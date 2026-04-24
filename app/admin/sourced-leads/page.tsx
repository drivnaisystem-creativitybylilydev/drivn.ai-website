import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { listSourcedLeads, groupLeadsByNiche } from "@/lib/sourced-lead-db";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { NicheDashboard } from "@/components/admin/NicheDashboard";

export const dynamic = "force-dynamic";

export default async function SourcedLeadsPage() {
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    return (
      <AdminChrome>
        <AdminLoginPanel />
      </AdminChrome>
    );
  }

  const leads = await listSourcedLeads(500);
  const niches = groupLeadsByNiche(leads);

  return (
    <AdminChrome>
      <NicheDashboard niches={niches} totalLeads={leads.length} />
    </AdminChrome>
  );
}
