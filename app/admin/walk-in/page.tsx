import { AdminChrome } from "@/components/admin/AdminChrome";
import { WalkInDashboard } from "@/components/admin/WalkInDashboard";

export const metadata = {
  title: "Walk-In Sales — Drivn.AI OS",
};

export default function WalkInPage() {
  return (
    <AdminChrome>
      <WalkInDashboard />
    </AdminChrome>
  );
}
