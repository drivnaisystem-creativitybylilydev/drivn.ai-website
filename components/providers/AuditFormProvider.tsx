"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AuditForm from "@/components/forms/AuditForm";

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
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  /** Radix + RemoveScroll require a real boolean; never pass a stray Event/object into `open`. */
  const dialogOpen = open === true;
  useEffect(() => {
    if (typeof open !== "boolean") setOpen(false);
  }, [open]);

  const openAuditForm = useCallback(() => {
    setFormKey((k) => k + 1);
    setOpen(true);
  }, []);
  const closeAuditForm = useCallback(() => setOpen(false), []);

  return (
    <AuditFormContext.Provider value={{ openAuditForm, closeAuditForm }}>
      {children}
      <Dialog
        open={dialogOpen}
        onOpenChange={(next) => {
          if (typeof next === "boolean") setOpen(next);
        }}
      >
        <DialogContent
          className="max-w-xl max-h-[90vh] overflow-y-auto"
          onClose={closeAuditForm}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-sora font-semibold">
              Request Your Audit
            </DialogTitle>
            <p className="text-sm text-white/60 mt-1">
              Fill out the form below and we&apos;ll reach out within 24 hours to
              schedule your discovery call.
            </p>
          </DialogHeader>
          <div className="mt-6">
            <AuditForm key={formKey} />
          </div>
        </DialogContent>
      </Dialog>
    </AuditFormContext.Provider>
  );
}
