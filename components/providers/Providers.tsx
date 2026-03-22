"use client";

import { AuditFormProvider } from "./AuditFormProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuditFormProvider>{children}</AuditFormProvider>;
}
