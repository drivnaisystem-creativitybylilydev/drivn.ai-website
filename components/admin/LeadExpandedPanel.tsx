"use client";

export function LeadExpandedPanel({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="presentation"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
