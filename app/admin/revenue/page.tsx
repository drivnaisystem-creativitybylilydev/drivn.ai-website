import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { listClients, computeClientStats } from "@/lib/client-db";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { RevenueDashboard } from "@/components/admin/RevenueDashboard";

export const dynamic = "force-dynamic";

const MRR_TARGET = 10000;

export default async function RevenuePage() {
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    return (
      <AdminChrome>
        <AdminLoginPanel />
      </AdminChrome>
    );
  }

  const clients = await listClients();
  const { totalMrr } = computeClientStats(clients);

  return (
    <AdminChrome>
      <RevenueDashboard
        clients={clients}
        currentMrr={totalMrr}
        targetMrr={MRR_TARGET}
      />
    </AdminChrome>
  );
}
