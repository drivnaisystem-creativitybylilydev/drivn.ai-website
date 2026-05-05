"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { TimerController } from "./TimerController";
import { TimeEntriesList } from "./TimeEntriesList";
import { TimeKeeperStats } from "./TimeKeeperStats";

export interface TimeEntry {
  _id: string;
  category: string;
  project_client: string | null;
  description: string | null;
  duration_minutes: number;
  roi_level: "high" | "medium" | "low";
  start_time: string;
  end_time: string;
}

export interface TimerStatus {
  active: boolean;
  category?: string;
  project_client?: string | null;
  description?: string | null;
  duration_minutes?: number;
  duration_display?: string;
  start_time?: string;
}

export function TimeKeeperDashboard() {
  const pathname = usePathname();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [timerStatus, setTimerStatus] = useState<TimerStatus>({ active: false });
  const [timeframe, setTimeframe] = useState<"today" | "week" | "month">(
    "today"
  );
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [autoStarted, setAutoStarted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, entriesRes] = await Promise.all([
          fetch("/api/timekeeper/status"),
          fetch(`/api/timekeeper/entries?timeframe=${timeframe}`),
        ]);

        if (statusRes.ok) {
          const status = await statusRes.json();
          setTimerStatus(status);

          // Auto-start timer if not already running and not already auto-started this session
          if (!status.active && !autoStarted) {
            const autoStartRes = await fetch("/api/timekeeper/start", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                category: "Admin",
                project_client: null,
                description: "Admin work",
              }),
            });
            if (autoStartRes.ok) {
              setAutoStarted(true);
              const newStatus = await autoStartRes.json();
              console.log("Auto-started timer");
              // Refresh status after auto-start
              const freshStatus = await fetch("/api/timekeeper/status");
              if (freshStatus.ok) {
                const fresh = await freshStatus.json();
                setTimerStatus(fresh);
              }
            }
          }
        }

        if (entriesRes.ok) {
          const data = await entriesRes.json();
          setEntries(data.entries);
        }
      } catch (error) {
        console.error("Failed to fetch timekeeper data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe, refreshKey]);

  // Track page navigation
  useEffect(() => {
    const trackPage = async () => {
      try {
        await fetch("/api/timekeeper/track-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: pathname }),
        });
      } catch (error) {
        console.error("Failed to track page:", error);
      }
    };

    trackPage();
  }, [pathname]);

  useEffect(() => {
    if (!timerStatus.active) return;

    const interval = setInterval(() => {
      setTimerStatus((prev) => {
        if (!prev.active) return prev;
        const mins = (prev.duration_minutes ?? 0) + 1;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return {
          ...prev,
          duration_minutes: mins,
          duration_display: h > 0 ? `${h}h ${m}m` : `${m}m`,
        };
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [timerStatus.active]);

  const handleTimerAction = async () => {
    try {
      if (timerStatus.active) {
        const res = await fetch("/api/timekeeper/stop", { method: "POST" });
        if (res.ok) {
          setRefreshKey((k) => k + 1);
        }
      }
    } catch (error) {
      console.error("Timer action failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-svh overflow-hidden bg-brand-dark text-white">
        <div className="relative z-10 px-4 py-8">Loading timekeeper data...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-brand-dark text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-20%,rgba(139,92,246,0.18),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-[1400px] space-y-6 px-4 pb-20 pt-8 md:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-between border-b border-white/[0.07] pb-6"
        >
          <div>
            <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.22em] text-brand-purple-light/80">
              Drivn.AI OS · Operations
            </p>
            <h1 className="mt-1 bg-gradient-to-r from-white via-white to-brand-purple-light bg-clip-text font-sora text-2xl font-bold tracking-tight text-transparent md:text-3xl">
              TimeKeeper
            </h1>
          </div>

          <div className="flex gap-2">
            {(["today", "week", "month"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-2 rounded font-inter text-sm font-medium transition ${
                  timeframe === tf
                    ? "bg-brand-purple/30 border border-brand-purple text-brand-purple-light"
                    : "border border-white/[0.07] text-white/60 hover:text-white/80"
                }`}
              >
                {tf.charAt(0).toUpperCase() + tf.slice(1)}
              </button>
            ))}
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <TimerController
            status={timerStatus}
            onAction={handleTimerAction}
            onStarted={() => setRefreshKey((k) => k + 1)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <TimeKeeperStats entries={entries} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <TimeEntriesList entries={entries} />
        </motion.div>
      </div>
    </div>
  );
}
