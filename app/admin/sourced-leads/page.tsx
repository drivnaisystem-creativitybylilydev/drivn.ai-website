import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { listSourcedLeads } from "@/lib/sourced-lead-db";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { SourcedLeadsDashboard } from "@/components/admin/SourcedLeadsDashboard";

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

  const leads = await listSourcedLeads(100);
  return <SourcedLeadsDashboard leads={leads} />;
}
