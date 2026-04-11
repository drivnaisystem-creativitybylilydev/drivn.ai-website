"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/** Classic Konami (↑↑↓↓←→←→ B A) — skips when focus is in inputs. */
const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
] as const;

function normalizeKey(key: string) {
  return key.length === 1 ? key.toLowerCase() : key;
}

export function AdminEasterEgg() {
  const router = useRouter();
  const step = useRef(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable)
      ) {
        return;
      }

      const k = normalizeKey(e.key);
      const expected = normalizeKey(SEQUENCE[step.current]);

      if (k === expected) {
        step.current += 1;
        if (step.current >= SEQUENCE.length) {
          step.current = 0;
          router.push("/admin");
        }
      } else {
        step.current = k === normalizeKey(SEQUENCE[0]) ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return null;
}
