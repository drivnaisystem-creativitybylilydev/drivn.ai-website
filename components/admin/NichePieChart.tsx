"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { TooltipContentProps } from "recharts";

const COLORS = [
  "#8B5CF6",
  "#A78BFA",
  "#34d399",
  "#f59e0b",
  "#60a5fa",
  "#f472b6",
] as const;

export interface NichePieSlice {
  niche: string;
  count: number;
  avgScore: number;
}

function NichePieTooltip(props: TooltipContentProps) {
  const { active, payload } = props;
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as NichePieSlice | undefined;
  if (!item) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#1A1A2E] px-3 py-2">
      <p className="font-inter text-sm font-medium text-white">{item.niche}</p>
      <p className="font-inter text-xs text-white/60">Count: {item.count}</p>
      <p className="font-inter text-xs text-white/60">
        Avg score: {Number(item.avgScore).toFixed(1)}
      </p>
    </div>
  );
}

export function NichePieChart({ data }: { data: NichePieSlice[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  if (data.length === 0) {
    return (
      <div
        ref={ref}
        className="flex min-h-[220px] items-center justify-center rounded-xl bg-[#0A0A1A]"
      >
        <p className="font-inter text-xs text-white/35">No niche data yet</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="bg-[#0A0A1A]">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="niche"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
            isAnimationActive={inView}
            animationBegin={0}
            animationDuration={900}
            stroke="transparent"
            strokeWidth={1}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.niche}
                fill={COLORS[index % COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            content={NichePieTooltip}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
        </PieChart>
      </ResponsiveContainer>
      <ul className="mt-3 flex flex-col gap-2">
        {data.map((item, index) => (
          <li
            key={item.niche}
            className="flex items-center gap-2 font-inter text-xs text-white/50"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate">{item.niche}</span>
            <span className="shrink-0 tabular-nums">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
