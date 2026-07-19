"use client";

import { useTranslations } from "next-intl";

export default function Ticker() {
  const t = useTranslations("Ticker");
  const items = t.raw("items") as string[];
  const loop = [...items, ...items];

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-8 flex items-center"
      style={{ background: "var(--color-accent)" }}
      aria-hidden
    >
      {/* Mask lives on the fixed outer bar (stays put at the real viewport edges) — the
          gradient fade needs to be independent of the scrolling track's transform, otherwise
          it moves with the content instead of masking it. */}
      <div
        className="w-full h-full overflow-hidden flex items-center"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div className="flex flex-nowrap gap-x-10 pl-4 marquee-track will-change-transform">
          {loop.map((item, i) => (
            <span
              key={i}
              className="shrink-0 font-mono text-[11px] font-semibold tracking-[0.12em] whitespace-nowrap text-[#0a0a0c]"
            >
              {item}
              <span className="ml-10 opacity-40">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
