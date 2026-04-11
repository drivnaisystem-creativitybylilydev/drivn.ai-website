import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { listClients } from "@/lib/client-db";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { ClientsDashboard } from "@/components/admin/ClientsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const sp = await searchParams;
  const authed = await isLeadsAdminAuthenticated();

  if (!authed) {
    const err = sp.e === "1" || sp.e === "2" ? sp.e : undefined;
    return (
      <AdminChrome>
        <AdminLoginPanel error={err} />
      </AdminChrome>
    );
  }

  const clients = await listClients();

  return <ClientsDashboard clients={clients} />;
}
