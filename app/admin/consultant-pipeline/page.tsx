import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { listConsultantLeads, getLeadStats } from "@/lib/consultant-pipeline-db";
import { ConsultantPipelineBoard } from "@/components/admin/ConsultantPipelineBoard";

export const dynamic = "force-dynamic";

export default async function ConsultantPipelinePage() {
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

  return (
    <AdminChrome>
      <ConsultantPipelineBoard leads={leads} stats={stats} />
    </AdminChrome>
  );
}
