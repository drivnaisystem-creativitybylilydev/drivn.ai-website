"use client";

import { AuditFormProvider } from "./AuditFormProvider";
import { ScrollRestoreNudge } from "./ScrollRestoreNudge";
import { AdminEasterEgg } from "./AdminEasterEgg";
import { CookieConsent } from "./CookieConsent";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuditFormProvider>
      <ScrollRestoreNudge />
      <AdminEasterEgg />
      {children}
      <CookieConsent />
    </AuditFormProvider>
  );
}
