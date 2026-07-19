export function ChapterLabel({ title }: { title: string }) {
  return (
    <span
      className="block font-mono text-[11px] font-medium uppercase tracking-[0.22em] mb-5"
      style={{ color: "var(--color-accent-light)" }}
    >
      {title}
    </span>
  );
}
