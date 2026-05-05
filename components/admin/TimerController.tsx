"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Square } from "lucide-react";
import type { TimerStatus } from "./TimeKeeperDashboard";

const CATEGORIES = [
  "Client Projects",
  "Client Calls",
  "Client Support",
  "Sales",
  "Marketing",
  "Strategy",
  "System Building",
  "Learning",
  "Admin",
  "Meetings",
];

interface Props {
  status: TimerStatus;
  onAction: () => Promise<void>;
  onStarted: () => void;
}

export function TimerController({ status, onAction, onStarted }: Props) {
  const [category, setCategory] = useState("Client Projects");
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/timekeeper/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          project_client: client || null,
          description: description || null,
        }),
      });

      if (res.ok) {
        setClient("");
        setDescription("");
        onStarted();
      }
    } catch (error) {
      console.error("Failed to start timer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await onAction();
    } finally {
      setLoading(false);
    }
  };

  if (status.active) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-lg border border-emerald-500/50 bg-gradient-to-br from-emerald-950/30 to-emerald-900/20 p-8 backdrop-blur"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.1),transparent_1%)]" style={{ backgroundSize: "6px 6px" }} />

        <div className="relative flex items-center justify-between gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-3 w-3 rounded-full bg-emerald-500"
              />
              <span className="font-inter text-sm font-bold uppercase tracking-widest text-emerald-400/80">
                Timer Active
              </span>
            </div>
            <div className="font-mono text-5xl font-bold tracking-tight text-white drop-shadow-lg">
              {status.duration_display}
            </div>
            <div className="space-y-1 font-inter text-sm text-white/70">
              <div><span className="text-white/50">Category:</span> {status.category}</div>
              {status.project_client && (
                <div><span className="text-white/50">Client:</span> {status.project_client}</div>
              )}
              {status.description && (
                <div><span className="text-white/50">Note:</span> {status.description}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleStop}
              disabled={loading}
              className="group flex items-center gap-2 rounded-lg bg-red-600/80 hover:bg-red-600 px-6 py-3 text-white font-inter font-semibold transition disabled:opacity-50 whitespace-nowrap"
            >
              <Square size={20} className="group-hover:scale-110 transition" />
              Stop
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-8 backdrop-blur"
    >
      <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.22em] text-brand-purple-light/80 mb-4">
        Start Timer
      </p>
      <div className="space-y-4">
        <div>
          <label className="block font-inter text-sm font-medium text-white/80 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-white/[0.07] bg-white/[0.04] px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-brand-purple/50 focus:outline-none focus:ring-1 focus:ring-brand-purple/30"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-brand-dark">
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-inter text-sm font-medium text-white/80 mb-2">
            Client/Project (optional)
          </label>
          <input
            type="text"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="e.g., NoTime Storage"
            className="w-full rounded-lg border border-white/[0.07] bg-white/[0.04] px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-brand-purple/50 focus:outline-none focus:ring-1 focus:ring-brand-purple/30"
          />
        </div>

        <div>
          <label className="block font-inter text-sm font-medium text-white/80 mb-2">
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Building dashboard"
            className="w-full rounded-lg border border-white/[0.07] bg-white/[0.04] px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-brand-purple/50 focus:outline-none focus:ring-1 focus:ring-brand-purple/30"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className="group w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-purple/60 to-brand-purple/40 hover:from-brand-purple/80 hover:to-brand-purple/60 px-6 py-3 text-white font-inter font-semibold transition disabled:opacity-50"
        >
          <Play size={20} className="group-hover:scale-110 transition" />
          Start Timer
        </button>
      </div>
    </motion.div>
  );
}
