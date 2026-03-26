"use client";

import { AuditFormProvider } from "./AuditFormProvider";
import { ScrollRestoreNudge } from "./ScrollRestoreNudge";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuditFormProvider>
      <ScrollRestoreNudge />
      {children}
    </AuditFormProvider>
  );
}
