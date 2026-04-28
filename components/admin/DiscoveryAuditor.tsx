"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HudBrackets } from "./hud-primitives";
import { AlertCircle, Copy, FileText, Loader2, Upload } from "lucide-react";

interface DiscoveryOutput {
  healthScore: number;
  buildRequirements: string;
  markdownBrief: string;
  auditReport: string;
}

interface DiscoverySession {
  _id: string;
  businessName: string;
  niche: string;
  status: "processing" | "completed" | "error";
  outputs?: DiscoveryOutput;
  errorMessage?: string;
  createdAt: string;
}

const NICHES = [
  "Roofing",
  "Landscaping",
  "HVAC",
  "Plumbing",
  "Junk Removal",
  "Pest Control",
  "Cleaning",
  "Electrical",
  "Other",
];

const NICHE_QUESTIONS: Record<string, string[]> = {
  Roofing: [
    "niche_roofing_seasonality: What months see the biggest slowdown?",
    "niche_roofing_insurance: What % of jobs are insurance-related?",
    "niche_roofing_storm: Do you pursue storm-chasing opportunities?",
    "niche_roofing_crew: How often is crew sitting idle between jobs?",
  ],
  Landscaping: [
    "niche_landscaping_staffing: How do you scale staff for off-season?",
    "niche_landscaping_routing: How much time do crews spend on routing/travel?",
    "niche_landscaping_mix: What % of work is recurring vs one-off?",
    "niche_landscaping_scheduling: What tool do you use for job scheduling?",
  ],
  HVAC: [
    "niche_hvac_split: What's your service vs install job ratio?",
    "niche_hvac_afterhours: How many after-hours emergency calls/week?",
    "niche_hvac_inventory: Are parts inventory issues costing you jobs?",
    "niche_hvac_contracts: What % of customers have service contracts?",
  ],
  Plumbing: [
    "niche_plumbing_emergency: Do you charge a premium for emergency calls?",
    "niche_plumbing_repeat: What % of customers are repeat/recurring?",
    "niche_plumbing_subs: What % of work do you subcontract?",
    "niche_plumbing_dispatch: What's your average dispatch time?",
  ],
  "Junk Removal": [
    "niche_junkremoval_volume: How many jobs per week on average?",
    "niche_junkremoval_crew: What's your typical crew size per job?",
    "niche_junkremoval_quoting: How do you quote jobs (in-person, phone, photo)?",
    "niche_junkremoval_scheduling: What's your biggest scheduling pain point?",
  ],
  "Pest Control": [
    "niche_pest_frequency: How many customer visits per technician per day?",
    "niche_pest_retention: What's your customer retention rate?",
    "niche_pest_upsell: How often do customers upgrade service plans?",
    "niche_pest_documentation: How do you document treatments and follow-ups?",
  ],
  Cleaning: [
    "niche_cleaning_capacity: Are you turning away jobs due to capacity?",
    "niche_cleaning_retention: What % of customers become repeat bookings?",
    "niche_cleaning_mix: Residential vs commercial work split?",
    "niche_cleaning_pricing: How do you price variable-size jobs?",
  ],
  Electrical: [
    "niche_electrical_volume: Residential, commercial, or mixed?",
    "niche_electrical_inspection: What % of jobs require permits/inspection?",
    "niche_electrical_complexity: Average job complexity level?",
    "niche_electrical_scheduling: Lead time for scheduling jobs?",
  ],
  Other: [
    "niche_other_seasonality: Does your business have seasonal patterns?",
    "niche_other_capacity: What limits your ability to take on more jobs?",
    "niche_other_tools: What tools/software do you rely on most?",
    "niche_other_timewaster: What's your biggest time-waster?",
  ],
};

export function DiscoveryAuditor({ initialSessions }: { initialSessions: DiscoverySession[] }) {
  const [tab, setTab] = useState<"input" | "results" | "history">("input");
  const [currentSession, setCurrentSession] = useState<DiscoverySession | null>(null);
  const [sessions, setSessions] = useState(initialSessions);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [transcriptText, setTranscriptText] = useState("");
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [showPasteMode, setShowPasteMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({
    businessName: "",
    ownerName: "",
    niche: "",
    callsPerWeek: "",
    bookingConversion: "",
    phone24_7: "no",
    googleRating: "",
    reviewCount: "",
    respondsToReviews: "no",
    leadsLost: "",
    marketingSpend: "",
    painPoint: "",
  });
  const [error, setError] = useState("");

  const selectedNiche = formData.niche;
  const nicheQs = selectedNiche && NICHE_QUESTIONS[selectedNiche] ? NICHE_QUESTIONS[selectedNiche] : [];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTranscriptFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setTranscriptText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleFormChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNicheQuestionChange = (key: string, value: string) => {
    handleFormChange(key, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.businessName || !selectedNiche) {
      setError("Business name and niche are required");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/agents/discovery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName: formData.businessName,
            niche: selectedNiche,
            transcript: transcriptText || undefined,
            answers: formData,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to run audit");
        }

        const data = await response.json();
        const newSession: DiscoverySession = {
          _id: data.sessionId,
          businessName: formData.businessName,
          niche: selectedNiche,
          status: "completed",
          outputs: data.outputs,
          createdAt: new Date().toISOString(),
        };

        setCurrentSession(newSession);
        setSessions([newSession, ...sessions]);
        setTab("results");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    });
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Discovery Auditor</h1>
        <p className="text-white/60">Analyze prospects to generate audit reports and build specs</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {(["input", "results", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2 transition-colors capitalize",
              tab === t
                ? "border-b-2 border-brand-purple text-white"
                : "text-white/60 hover:text-white/90"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab: Input */}
      {tab === "input" && (
        <div className="grid grid-cols-2 gap-8">
          {/* Left: Transcript Upload */}
          <div className="space-y-4">
            <div>
              <h2 className="mb-4 font-semibold text-white">Loom Transcript</h2>
              {!showPasteMode ? (
                <div className="space-y-4">
                  <div className="relative rounded-lg border border-dashed border-white/20 p-8 text-center">
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-6 w-6 text-brand-purple" />
                        <p className="text-sm text-white/60">Drop transcript file here or click to browse</p>
                        <p className="text-xs text-white/40">.txt, .vtt, .srt, or .md</p>
                      </div>
                      <input
                        type="file"
                        accept=".txt,.vtt,.srt,.md"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <button
                    onClick={() => setShowPasteMode(true)}
                    className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/[0.03]"
                  >
                    Or paste transcript
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={transcriptText}
                    onChange={(e) => setTranscriptText(e.target.value)}
                    placeholder="Paste transcript here..."
                    className="h-48 w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
                  />
                  <button
                    onClick={() => setShowPasteMode(false)}
                    className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/[0.03]"
                  >
                    Upload file instead
                  </button>
                </div>
              )}
              {transcriptText && (
                <div className="mt-3 rounded-lg bg-white/[0.02] p-3">
                  <p className="text-xs text-white/40">
                    {transcriptFile ? `📄 ${transcriptFile.name}` : "📝 Pasted text"}
                  </p>
                  <p className="mt-1 text-xs text-white/60 line-clamp-2">{transcriptText.substring(0, 100)}...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Questionnaire Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="font-semibold text-white">Questionnaire</h2>

            {error && (
              <div className="flex gap-2 rounded-lg bg-red-500/10 border border-red-500/30 p-3">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Core Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Business Name *</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleFormChange("businessName", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
                  placeholder="e.g., Johnson Roofing"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Owner Name</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => handleFormChange("ownerName", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
                  placeholder="e.g., John Johnson"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Niche *</label>
                <select
                  value={formData.niche}
                  onChange={(e) => handleFormChange("niche", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
                >
                  <option value="">Select a niche...</option>
                  {NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Calls/Week</label>
                  <input
                    type="number"
                    value={formData.callsPerWeek}
                    onChange={(e) => handleFormChange("callsPerWeek", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
                    placeholder="e.g., 20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Booking Conv. %</label>
                  <input
                    type="number"
                    value={formData.bookingConversion}
                    onChange={(e) => handleFormChange("bookingConversion", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
                    placeholder="e.g., 25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Google Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.googleRating}
                    onChange={(e) => handleFormChange("googleRating", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
                    placeholder="e.g., 4.8"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Review Count</label>
                  <input
                    type="number"
                    value={formData.reviewCount}
                    onChange={(e) => handleFormChange("reviewCount", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
                    placeholder="e.g., 127"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">24/7 Coverage?</label>
                  <select
                    value={formData.phone24_7}
                    onChange={(e) => handleFormChange("phone24_7", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Responds to Reviews?</label>
                  <select
                    value={formData.respondsToReviews}
                    onChange={(e) => handleFormChange("respondsToReviews", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Leads Lost/Month</label>
                  <input
                    type="number"
                    value={formData.leadsLost}
                    onChange={(e) => handleFormChange("leadsLost", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
                    placeholder="e.g., 8"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1">Marketing Spend/Mo ($)</label>
                  <input
                    type="number"
                    value={formData.marketingSpend}
                    onChange={(e) => handleFormChange("marketingSpend", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
                    placeholder="e.g., 500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1">Biggest Pain Point</label>
                <textarea
                  value={formData.painPoint}
                  onChange={(e) => handleFormChange("painPoint", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
                  placeholder="What's keeping you up at night?"
                  rows={2}
                />
              </div>
            </div>

            {/* Niche-specific questions */}
            {nicheQs.length > 0 && (
              <div className="space-y-4 border-t border-white/10 pt-4">
                <p className="text-xs font-medium text-brand-purple-light">Niche-Specific ({selectedNiche})</p>
                {nicheQs.map((qStr) => {
                  const [key, label] = qStr.split(": ");
                  return (
                    <div key={key}>
                      <label className="block text-xs font-medium text-white/60 mb-1">{label}</label>
                      <input
                        type="text"
                        value={formData[key] || ""}
                        onChange={(e) => handleNicheQuestionChange(key, e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-brand-purple hover:bg-brand-purple/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Run AI Audit"
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Tab: Results */}
      {tab === "results" && currentSession?.outputs && (
        <div className="space-y-6">
          <HealthScoreCard score={currentSession.outputs.healthScore} />
          <OutputCard
            title="Build Requirements"
            content={currentSession.outputs.buildRequirements}
          />
          <OutputCard
            title="Internal Brief"
            content={currentSession.outputs.markdownBrief}
            copyable
          />
          <OutputCard
            title="Client Audit Report"
            content={currentSession.outputs.auditReport}
            copyable
            clientFacing
          />
        </div>
      )}

      {/* Tab: History */}
      {tab === "history" && (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-white/[0.02]">
              <tr>
                <th className="px-4 py-3 text-left text-white/60">Business</th>
                <th className="px-4 py-3 text-left text-white/60">Niche</th>
                <th className="px-4 py-3 text-left text-white/60">Score</th>
                <th className="px-4 py-3 text-left text-white/60">Date</th>
                <th className="px-4 py-3 text-left text-white/60">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session._id} className="border-b border-white/10 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white">{session.businessName}</td>
                  <td className="px-4 py-3 text-white/60">{session.niche}</td>
                  <td className="px-4 py-3">
                    {session.outputs && (
                      <span
                        className={cn(
                          "font-bold",
                          session.outputs.healthScore >= 70
                            ? "text-emerald-400"
                            : session.outputs.healthScore >= 40
                              ? "text-yellow-400"
                              : "text-red-400"
                        )}
                      >
                        {session.outputs.healthScore}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setCurrentSession(session);
                        setTab("results");
                      }}
                      className="text-brand-purple-light hover:text-brand-purple-light/80"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function HealthScoreCard({ score }: { score: number }) {
  const color = score >= 70 ? "text-emerald-400" : score >= 40 ? "text-yellow-400" : "text-red-400";
  const label =
    score >= 70 ? "Strong baseline" : score >= 40 ? "Significant opportunity" : "Critical issues";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-purple/40 bg-brand-purple/[0.08] p-6">
      <HudBrackets color="rgba(139,92,246,0.3)" size={8} />
      <div className="space-y-2">
        <p className="font-inter text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/40">Health Score</p>
        <div className="flex items-baseline gap-2">
          <p className={cn("font-sora text-4xl font-bold", color)}>{score}</p>
          <p className="text-sm text-white/60">/100</p>
        </div>
        <p className="text-sm text-white/70">{label}</p>
      </div>
    </div>
  );
}

function OutputCard({
  title,
  content,
  copyable = false,
  clientFacing = false,
}: {
  title: string;
  content: string;
  copyable?: boolean;
  clientFacing?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <FileText className="h-4 w-4 text-brand-purple" />
          {title}
          {clientFacing && <span className="ml-2 text-xs text-brand-purple-light">Client-facing</span>}
        </h3>
        {copyable && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-white/60 hover:text-white"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto p-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/80">{content}</p>
      </div>
    </div>
  );
}
