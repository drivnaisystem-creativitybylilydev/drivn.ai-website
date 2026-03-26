import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { isLeadStorageConfigured, listLeads } from "@/lib/lead-db";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import {
  LeadsSaasDashboard,
  type LeadRowView,
} from "@/components/admin/LeadsSaasDashboard";

export const dynamic = "force-dynamic";

function toLeadRows(
  rows: Awaited<ReturnType<typeof listLeads>>,
): LeadRowView[] {
  return rows.map((r) => ({
    id: r.id,
    created_at:
      r.created_at instanceof Date
        ? r.created_at.toISOString()
        : String(r.created_at),
    payload: r.payload,
  }));
}

export default async function AdminLeadsPage({
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

  const rows = await listLeads();
  const storageConfigured = isLeadStorageConfigured();

  return (
    <AdminChrome>
      <LeadsSaasDashboard
        leads={toLeadRows(rows)}
        storageConfigured={storageConfigured}
      />
    </AdminChrome>
  );
}
