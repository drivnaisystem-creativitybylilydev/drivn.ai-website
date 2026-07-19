"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link as IntlLink } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "drivnai-cookie-consent";

export type ConsentChoice = "accepted" | "rejected";

export function getCookieConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function CookieConsent() {
  const t = useTranslations("CookieConsent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getCookieConsent() === null) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const choose = (choice: ConsentChoice) => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    window.dispatchEvent(new CustomEvent("drivnai-cookie-consent", { detail: choice }));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label={t("title")}
          className="fixed inset-x-0 bottom-0 z-[70] flex justify-center px-4 pb-4 md:px-6 md:pb-6"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 32, mass: 0.9 }}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border p-5 md:p-6 backdrop-blur-xl"
            style={{
              background: "rgba(15,15,18,0.92)",
              borderColor: "rgba(255,255,255,0.08)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.06), 0 12px 40px rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex-1">
                <p className="font-display font-semibold text-[15px] text-white mb-1">
                  {t("title")}
                </p>
                <p className="font-mono text-[12.5px] leading-relaxed" style={{ color: "rgba(245,245,244,0.55)" }}>
                  {t("body")}{" "}
                  <IntlLink
                    href="/privacy"
                    className="underline underline-offset-2 transition-colors duration-200"
                    style={{ color: "var(--color-accent-light)" }}
                  >
                    {t("linkLabel")}
                  </IntlLink>
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => choose("rejected")}
                  className="h-10 px-4 rounded-full text-[13px] font-medium font-display transition-colors duration-200 cursor-pointer"
                  style={{ color: "rgba(245,245,244,0.65)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  {t("reject")}
                </button>
                <button
                  type="button"
                  onClick={() => choose("accepted")}
                  className="h-10 px-5 rounded-full bg-white text-[#0a0a0c] text-[13px] font-semibold font-display transition-transform duration-500 ease-spring active:scale-[0.97] cursor-pointer"
                >
                  {t("accept")}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
