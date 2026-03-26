"use client";

import { AuditFormProvider } from "./AuditFormProvider";
import { ScrollRestoreNudge } from "./ScrollRestoreNudge";
import { AdminEasterEgg } from "./AdminEasterEgg";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuditFormProvider>
      <ScrollRestoreNudge />
      <AdminEasterEgg />
      {children}
    </AuditFormProvider>
  );
}
