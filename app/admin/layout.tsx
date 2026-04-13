import type { Metadata } from "next";
import { isLeadsAdminAuthenticated, getLoginError } from "@/lib/admin-session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";

export const metadata: Metadata = {
  title: "OS — Drivn.AI",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isLeadsAdminAuthenticated();

  if (!authed) {
    const error = await getLoginError();
    return (
      <AdminChrome>
        <div className="flex min-h-svh items-center justify-center">
          <AdminLoginPanel error={error ?? undefined} />
        </div>
      </AdminChrome>
    );
  }

  return (
    <>
      <AdminSidebar />
      <div className="pl-14">{children}</div>
    </>
  );
}
