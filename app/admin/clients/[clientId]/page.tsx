import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { getClientById } from "@/lib/client-db";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { ClientDetailView } from "./ClientDetailView";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ clientId: string }>;
  searchParams: Promise<{ e?: string }>;
}) {
  const p = await params;
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

  const client = await getClientById(p.clientId);

  if (!client) {
    notFound();
  }

  return <ClientDetailView client={client} />;
}
