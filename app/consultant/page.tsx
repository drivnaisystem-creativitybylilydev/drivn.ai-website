import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { listConsultantLeads, getLeadStats } from "@/lib/consultant-pipeline-db";
import { ConsultantOS } from "@/components/consultant/ConsultantOS";

export const dynamic = "force-dynamic";

export default async function ConsultantOSPage() {
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    return (
      <AdminChrome>
        <AdminLoginPanel />
      </AdminChrome>
    );
  }

  const [leads, stats] = await Promise.all([
    listConsultantLeads(),
    getLeadStats(),
  ]);

  return <ConsultantOS initialLeads={leads} initialStats={stats} />;
}
