"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type SetStateAction,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DiscoveryDialogContent,
  type DiscoveryDialogView,
  type CalendlySchedulePrefill,
} from "@/components/booking/DiscoveryDialogContent";
import { hasCalendlyScheduling } from "@/lib/booking";
import { cn } from "@/lib/utils";

type AuditFormContextType = {
  openAuditForm: () => void;
  closeAuditForm: () => void;
};

const AuditFormContext = createContext<AuditFormContextType | null>(null);

export function useAuditForm() {
  const context = useContext(AuditFormContext);
  if (!context) {
    throw new Error("useAuditForm must be used within AuditFormProvider");
  }
  return context;
}

export function AuditFormProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpenRaw] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [dialogView, setDialogView] = useState<DiscoveryDialogView>("form");
  const [schedulePrefill, setSchedulePrefill] = useState<
    CalendlySchedulePrefill | undefined
  >(undefined);

  /** Radix + RemoveScroll require a real boolean — never persist a leaked click `Event` in state. */
  const setOpen = useCallback((value: SetStateAction<boolean>) => {
    setOpenRaw((prev) => {
      const safePrev = typeof prev === "boolean" ? prev : false;
      const next = typeof value === "function" ? value(safePrev) : value;
      return typeof next === "boolean" ? next : false;
    });
  }, []);

  const dialogOpen = open === true;
  const showCalendlyWide =
    hasCalendlyScheduling() && dialogView === "schedule";

  const openAuditForm = useCallback(() => {
    setFormKey((k) => k + 1);
    setSchedulePrefill(undefined);
    setDialogView("form");
    setOpen(true);
  }, [setOpen]);

  const handleFormFinishedForSchedule = useCallback(
    (answers: Record<string, string>) => {
      const name = answers.fullName?.trim();
      const email = answers.email?.trim();
      setSchedulePrefill(
        name || email
          ? {
              ...(name ? { name } : {}),
              ...(email ? { email } : {}),
            }
          : undefined,
      );
      setDialogView("schedule");
    },
    [],
  );

  const closeAuditForm = useCallback(() => setOpen(false), [setOpen]);

  return (
    <AuditFormContext.Provider value={{ openAuditForm, closeAuditForm }}>
      {children}
      <Dialog
        open={dialogOpen}
        onOpenChange={(next) => setOpen(next)}
      >
        <DialogContent
          className={cn(
            "max-h-[90vh] overflow-y-auto overflow-x-hidden",
            showCalendlyWide
              ? "w-[min(100%,980px)] max-w-[calc(100vw-1.5rem)] sm:max-w-5xl"
              : "max-w-xl",
          )}
          onClose={closeAuditForm}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-sora font-semibold">
              {hasCalendlyScheduling()
                ? "Book a discovery call"
                : "Request your audit"}
            </DialogTitle>
            <p className="mt-1 text-sm text-white/60">
              {showCalendlyWide
                ? "Step 2: Pick a time. You'll get a calendar invite with your meeting details."
                : hasCalendlyScheduling()
                  ? "Step 1: Complete every field so we're prepared — then tap Next to pick your call time."
                  : "Fill out the form and we'll reach out within 24 hours to schedule your discovery call."}
            </p>
          </DialogHeader>
          <div className="mt-6">
            <DiscoveryDialogContent
              formKey={formKey}
              view={dialogView}
              onViewChange={setDialogView}
              schedulePrefill={schedulePrefill}
              onFormFinishedForSchedule={
                hasCalendlyScheduling()
                  ? handleFormFinishedForSchedule
                  : undefined
              }
            />
          </div>
        </DialogContent>
      </Dialog>
    </AuditFormContext.Provider>
  );
}
