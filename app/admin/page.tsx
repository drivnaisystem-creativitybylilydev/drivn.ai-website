import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { listLeads } from "@/lib/lead-db";
import { listClients, computeClientStats } from "@/lib/client-db";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { AdminOverview } from "@/components/admin/AdminOverview";
import type { LeadAdminStats, LeadRowView } from "@/components/admin/LeadsSaasDashboard";

export const dynamic = "force-dynamic";

function computeLeadStats(rows: Awaited<ReturnType<typeof listLeads>>): LeadAdminStats {
  const byStatus: LeadAdminStats["byStatus"] = {
    form_submitted: 0,
    call_booked: 0,
    call_completed: 0,
    converted: 0,
    lost: 0,
  };
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  let upcomingCallsNext7Days = 0;
  for (const r of rows) {
    byStatus[r.status] += 1;
    const t = r.booking?.scheduledStart?.getTime();
    if (t !== undefined && t >= now && t <= now + weekMs && !r.booking?.canceled) {
      upcomingCallsNext7Days += 1;
    }
  }
  return { total: rows.length, byStatus, upcomingCallsNext7Days };
}

function toLeadRowView(rows: Awaited<ReturnType<typeof listLeads>>): LeadRowView[] {
  return rows.slice(0, 6).map((r) => ({
    id: r.id,
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    payload: r.payload,
    schemaVersion: r.schemaVersion,
    status: r.status,
    internalNotes: r.internalNotes,
    callNotes: r.callNotes,
    emailsSent: r.emailsSent.map((e) => ({
      type: e.type,
      sentAt: e.sentAt instanceof Date ? e.sentAt.toISOString() : String(e.sentAt),
      opened: e.opened,
    })),
    booking: r.booking
      ? {
          calendlyEventUri: r.booking.calendlyEventUri,
          calendlyInviteeUri: r.booking.calendlyInviteeUri,
          eventTypeName: r.booking.eventTypeName,
          joinUrl: r.booking.joinUrl,
          timezone: r.booking.timezone,
          scheduledStart: r.booking.scheduledStart?.toISOString(),
          scheduledEnd: r.booking.scheduledEnd?.toISOString(),
          lastWebhookAt: r.booking.lastWebhookAt?.toISOString(),
          canceled: r.booking.canceled,
          invitees: r.booking.invitees?.map((i) => ({ email: i.email, name: i.name })),
        }
      : null,
  }));
}

export default async function AdminHomePage({
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

  const [leads, clients] = await Promise.all([listLeads(50), listClients()]);

  return (
    <AdminOverview
      clientStats={computeClientStats(clients)}
      leadStats={computeLeadStats(leads)}
      recentClients={clients.slice(0, 5)}
      recentLeads={toLeadRowView(leads)}
    />
  );
}
