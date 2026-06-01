"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "upcoming";
  energy: number;
}

const ORBIT_R  = 200;
const CX       = 270;
const CY       = 270;
const SIZE     = 540;
const CANVAS_H = SIZE + 56;
const PANEL_W  = 420;
const PANEL_H  = 220; // approximate — used only for origin calc

export function RadialOrbitalTimeline({ timelineData }: { timelineData: TimelineItem[] }) {
  const [rotation, setRotation]   = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [paused, setPaused]       = useState(false);
  const [clickPos, setClickPos]   = useState<{ x: number; y: number }>({ x: CX, y: CY });
  const rafRef   = useRef<number>(0);
  const lastTRef = useRef<number>(0);

  const nodePos = useCallback(
    (idx: number, rot: number) => {
      const angle = ((idx / timelineData.length) * 360 + rot - 90) * (Math.PI / 180);
      return {
        x: CX + Math.cos(angle) * ORBIT_R,
        y: CY + Math.sin(angle) * ORBIT_R,
      };
    },
    [timelineData.length]
  );

  useEffect(() => {
    if (paused) return;
    const tick = (ts: number) => {
      if (!lastTRef.current) lastTRef.current = ts;
      const dt = ts - lastTRef.current;
      lastTRef.current = ts;
      setRotation((r) => (r + dt * 0.010) % 360);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTRef.current = 0;
    };
  }, [paused]);

  const selected = timelineData.find((t) => t.id === selectedId);

  const handleClick = (id: number) => {
    if (selectedId === id) {
      setSelectedId(null);
      setPaused(false);
    } else {
      const idx = timelineData.findIndex((t) => t.id === id);
      setClickPos(nodePos(idx, rotation));
      setSelectedId(id);
      setPaused(true);
    }
  };

  const statusColor = (s: TimelineItem["status"]) =>
    s === "completed" ? "#4ade80" : s === "in-progress" ? "#a78bfa" : "rgba(239,240,243,0.35)";
  const statusLabel = (s: TimelineItem["status"]) =>
    s === "completed" ? "Live" : s === "in-progress" ? "Active" : "Planned";

  // Transform origin for panel scale animation — relative to panel top-left (0–1)
  const panelLeft = (SIZE - PANEL_W) / 2;
  const panelTop  = (SIZE - PANEL_H) / 2;
  const originX   = (clickPos.x - panelLeft) / PANEL_W;
  const originY   = (clickPos.y - panelTop)  / PANEL_H;

  return (
    <div className="relative w-full flex flex-col items-center">

      {/* ── Orbital canvas ── */}
      <div
        className="relative flex-shrink-0"
        style={{ width: SIZE, height: CANVAS_H, maxWidth: "100%" }}
      >
        {/* SVG: orbit ring + spokes + connection lines */}
        <svg
          width={SIZE}
          height={SIZE}
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
          aria-hidden
        >
          {/* Dashed orbit ring */}
          <circle
            cx={CX} cy={CY} r={ORBIT_R}
            fill="none"
            stroke="rgba(139,92,246,0.18)"
            strokeWidth="1.5"
            strokeDasharray="5 8"
          />

          {/* Center glow layers */}
          <circle cx={CX} cy={CY} r="72" fill="rgba(139,92,246,0.04)" />
          <circle cx={CX} cy={CY} r="50" fill="rgba(139,92,246,0.08)" />
          <circle cx={CX} cy={CY} r="32"
            fill="rgba(139,92,246,0.16)"
            stroke="rgba(139,92,246,0.32)" strokeWidth="1.5"
          />

          {/* Spokes */}
          {timelineData.map((item, i) => {
            const pos = nodePos(i, rotation);
            const isSelected = selectedId === item.id;
            const isRelated  = selected?.relatedIds.includes(item.id);
            return (
              <line
                key={`spoke-${item.id}`}
                x1={CX} y1={CY} x2={pos.x} y2={pos.y}
                stroke={isSelected || isRelated ? "rgba(139,92,246,0.35)" : "rgba(139,92,246,0.08)"}
                strokeWidth={isSelected || isRelated ? "1.5" : "0.8"}
                strokeDasharray="4 6"
              />
            );
          })}

          {/* Related-node connection lines */}
          {selected && selected.relatedIds.map((relId) => {
            const selIdx = timelineData.findIndex((t) => t.id === selectedId);
            const relIdx = timelineData.findIndex((t) => t.id === relId);
            if (relIdx < 0 || selIdx < 0) return null;
            const sp = nodePos(selIdx, rotation);
            const rp = nodePos(relIdx, rotation);
            return (
              <line
                key={`conn-${relId}`}
                x1={sp.x} y1={sp.y} x2={rp.x} y2={rp.y}
                stroke="rgba(139,92,246,0.42)" strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {timelineData.map((item, i) => {
          const { x, y } = nodePos(i, rotation);
          const isSelected = selectedId === item.id;
          const isHovered  = hoveredId  === item.id;
          const isRelated  = selected?.relatedIds.includes(item.id) ?? false;
          const dimmed     = selectedId !== null && !isSelected && !isRelated;
          const Icon       = item.icon;

          return (
            <div
              key={item.id}
              className="absolute"
              style={{
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
                zIndex: isSelected ? 20 : 10,
                opacity: dimmed ? 0.20 : 1,
                transition: "opacity 0.28s ease",
              }}
            >
              <motion.button
                className="flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
                onHoverStart={() => setHoveredId(item.id)}
                onHoverEnd={() => setHoveredId(null)}
                onClick={() => handleClick(item.id)}
                animate={{ scale: isSelected ? 1.22 : isHovered ? 1.12 : 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: isSelected ? "rgba(139,92,246,0.28)" : "rgba(8,9,26,1)",
                    border: `2px solid ${isSelected ? "rgba(139,92,246,0.82)" : isRelated ? "rgba(139,92,246,0.50)" : "rgba(139,92,246,0.24)"}`,
                    boxShadow: isSelected
                      ? "0 0 28px rgba(139,92,246,0.40), inset 0 1px 1px rgba(255,255,255,0.10)"
                      : "inset 0 1px 1px rgba(255,255,255,0.05)",
                  }}
                >
                  {React.createElement(Icon as React.ElementType<{ style: React.CSSProperties; strokeWidth: number }>, {
                    style: { width: 24, height: 24, color: isSelected ? "#a78bfa" : "rgba(167,139,250,0.65)" },
                    strokeWidth: 1.75,
                  })}
                </div>
                <span
                  className="text-[11px] font-semibold leading-snug text-center"
                  style={{
                    color: isSelected ? "#a78bfa" : "rgba(239,240,243,0.55)",
                    maxWidth: 96,
                    whiteSpace: "normal",
                    display: "block",
                  }}
                >
                  {item.title}
                </span>
              </motion.button>
            </div>
          );
        })}

        {/* Center idle label */}
        <div
          className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
          style={{ left: CX, top: CY, transform: "translate(-50%, -50%)", width: 100, zIndex: 5 }}
        >
          <AnimatePresence mode="wait">
            {!selectedId && (
              <motion.div
                key="idle"
                className="flex flex-col items-center gap-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-[10px] uppercase tracking-[0.20em] font-semibold"
                  style={{ color: "rgba(139,92,246,0.42)" }}>
                  System
                </span>
                <span className="text-[10px]" style={{ color: "rgba(239,240,243,0.26)" }}>
                  tap a node
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Detail panel — overlaid on canvas, scales from clicked node ── */}
        <AnimatePresence>
          {selected && (
            <>
              {/* Backdrop dim */}
              <motion.div
                key="backdrop"
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ zIndex: 25, backdropFilter: "blur(2px)", background: "rgba(8,9,26,0.72)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              />

              {/* Panel */}
              <motion.div
                key={`panel-${selected.id}`}
                className="absolute flex flex-col gap-4 rounded-2xl px-7 py-6"
                style={{
                  width: PANEL_W,
                  left: (SIZE - PANEL_W) / 2,
                  top: "50%",
                  translateY: "-50%",
                  zIndex: 30,
                  background: "rgba(10,11,30,0.98)",
                  border: "1px solid rgba(139,92,246,0.36)",
                  boxShadow: "0 16px 56px rgba(0,0,0,0.70), 0 0 0 1px rgba(139,92,246,0.06)",
                  originX,
                  originY,
                }}
                initial={{ scale: 0.72, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.72, opacity: 0 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="text-[13px] uppercase tracking-[0.16em] font-semibold"
                    style={{ color: "rgba(139,92,246,0.75)" }}
                  >
                    {selected.category}
                  </span>
                  <span
                    className="text-[12px] font-medium px-3 py-1 rounded-full"
                    style={{
                      color: statusColor(selected.status),
                      background: `${statusColor(selected.status)}1A`,
                      border: `1px solid ${statusColor(selected.status)}44`,
                    }}
                  >
                    {statusLabel(selected.status)}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-sora text-[22px] font-semibold text-white leading-tight">
                  {selected.title}
                </h4>

                {/* Body */}
                <p className="text-[15px] leading-relaxed" style={{ color: "rgba(239,240,243,0.72)" }}>
                  {selected.content}
                </p>

                {/* Close */}
                <button
                  className="self-start text-[13px] font-medium px-3 py-1.5 rounded-xl"
                  style={{
                    color: "rgba(139,92,246,0.70)",
                    background: "rgba(139,92,246,0.10)",
                    border: "1px solid rgba(139,92,246,0.20)",
                  }}
                  onClick={() => { setSelectedId(null); setPaused(false); }}
                >
                  ✕ Close
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
