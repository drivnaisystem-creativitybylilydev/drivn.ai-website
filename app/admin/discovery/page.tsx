import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { DiscoveryAuditor } from "@/components/admin/DiscoveryAuditor";
import { listSessions } from "@/lib/discovery-db";

export const dynamic = "force-dynamic";

export default async function DiscoveryPage() {
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    return (
      <AdminChrome>
        <AdminLoginPanel />
      </AdminChrome>
    );
  }

  const sessions = await listSessions(20);

  return <DiscoveryAuditor initialSessions={sessions} />;
}
