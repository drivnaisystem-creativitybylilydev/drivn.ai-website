"use client";

import type { TimeEntry } from "./TimeKeeperDashboard";

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface Props {
  entries: TimeEntry[];
}

export function TimeEntriesList({ entries }: Props) {
  const roiBadge = (level: "high" | "medium" | "low") => {
    const styles = {
      high: "border-emerald-500/50 bg-emerald-950/30 text-emerald-300",
      medium: "border-amber-500/50 bg-amber-950/30 text-amber-300",
      low: "border-red-500/50 bg-red-950/30 text-red-300",
    };
    return styles[level];
  };

  const formatHours = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-8 text-center text-white/50 font-inter">
        No time entries yet. Start a timer above!
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] backdrop-blur overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/[0.07] bg-white/[0.02]">
            <tr>
              <th className="px-4 py-3 text-left font-inter font-semibold text-white/80">
                Category
              </th>
              <th className="px-4 py-3 text-left font-inter font-semibold text-white/80">
                Duration
              </th>
              <th className="px-4 py-3 text-left font-inter font-semibold text-white/80">
                ROI
              </th>
              <th className="px-4 py-3 text-left font-inter font-semibold text-white/80">
                Client/Project
              </th>
              <th className="px-4 py-3 text-left font-inter font-semibold text-white/80">
                Note
              </th>
              <th className="px-4 py-3 text-left font-inter font-semibold text-white/80">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {entries.map((entry) => (
              <tr
                key={entry._id}
                className="hover:bg-white/[0.04] transition"
              >
                <td className="px-4 py-3 font-inter font-medium text-white">
                  {entry.category}
                </td>
                <td className="px-4 py-3 font-mono font-semibold text-white">
                  {formatHours(entry.duration_minutes)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded border px-2 py-1 text-xs font-semibold ${roiBadge(entry.roi_level)}`}
                  >
                    {entry.roi_level.charAt(0).toUpperCase() +
                      entry.roi_level.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 font-inter text-white/70">
                  {entry.project_client || "—"}
                </td>
                <td className="px-4 py-3 max-w-xs truncate font-inter text-white/60">
                  {entry.description || "—"}
                </td>
                <td className="px-4 py-3 font-inter text-white/50 text-xs">
                  {formatTimeAgo(entry.start_time)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
