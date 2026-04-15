import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { listSourcedLeads } from "@/lib/sourced-lead-db";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { PipelineScoutPage } from "@/components/admin/PipelineScoutPage";

export const dynamic = "force-dynamic";

export default async function PipelineScoutRoute() {
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    return (
      <AdminChrome>
        <AdminLoginPanel />
      </AdminChrome>
    );
  }

  const leads = await listSourcedLeads(500);

  return (
    <AdminChrome>
      <PipelineScoutPage initialLeads={leads} />
    </AdminChrome>
  );
}
