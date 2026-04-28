"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HudBrackets } from "./hud-primitives";
import { AlertCircle, Copy, FileText, Loader2, Upload, ChevronDown } from "lucide-react";

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

const REACTIVE_OBJECTIONS = {
  pricing: [
    { objection: "That's too expensive", response: "I hear that. But let's look at it this way — you're losing $[X]/month in revenue right now. This recovers that. The investment pays for itself in [Y] months, then you're just paying the retainer for pure profit. Fair comparison?" },
    { objection: "Can you lower the price?", response: "Price is based on the value we create. Instead of discounting, what if we shrink the scope? Start with just the biggest leak (#1), prove ROI in 30 days, then layer in the others. That's $[lower amount] to start." },
    { objection: "What's the ROI on this?", response: "Great question. You're losing $[X]/month. Recover 30% of that = $[Y]/month in new revenue. Setup is $[Z]. Payback is [Z/Y] months. Then you're ahead by $[Y]/month indefinitely." },
    { objection: "I can't afford this right now", response: "I get it. Here's the thing though — how much will this cost you waiting? $[X]/month in lost revenue. When would be a good time to revisit this?" },
  ],
  "we're-fine": [
    { objection: "Business is going well, don't need AI", response: "That's awesome. But you mentioned losing [X] leads per month. At $[Y] per job, that's $[Z] per month. Would recovering that be worth 20 minutes to explore?" },
    { objection: "We already have a receptionist", response: "Great. What about after hours? You said you don't have 24/7 coverage. How much is that costing you in missed after-hours calls?" },
    { objection: "We respond to all our leads", response: "Perfect. How long does it typically take? And how many fall through before you get back to them?" },
    { objection: "We've been doing this for 20 years without it", response: "Makes sense. The market's changed though. Your competitors are implementing this right now. The question isn't whether you can survive without it — it's whether you want to stay ahead." },
  ],
  skepticism: [
    { objection: "AI doesn't work for service businesses", response: "I'd have said the same thing. But look — we're not using AI to replace your team. We're using it to handle the stuff that's costing you money: after-hours calls, follow-ups, scheduling. Simple stuff, high impact." },
    { objection: "We tried automation before and it didn't work", response: "I hear that. What did you try? Because there's a big difference between generic automation and solving your specific leaks. Let me show you what we'd actually build for you." },
    { objection: "I don't trust AI", response: "Legit concern. Here's the deal — you don't have to trust it. You see the results in 30 days. After-hours calls are answered, leads get followed up. Either it works or we pause. No long contract." },
    { objection: "This sounds like a fad", response: "Maybe it is. But your competitors aren't waiting to find out. And honestly, you're losing $[X]/month right now. If it works, you recover that. If it doesn't, you know in 30 days." },
  ],
  timing: [
    { objection: "Not the right time, we're too busy", response: "I get it. But that's actually the problem — you're too busy. That's why we do this. How much time is the team spending on scheduling and follow-up right now? That's what we're automating." },
    { objection: "Let me think about it", response: "Of course. Quick question though — what specifically are you thinking about? The ROI, the timing, or something missing from the plan? Let's solve it right now." },
    { objection: "Call me next quarter", response: "Happy to. But how much are you leaving on the table between now and then? $[X]/month × 3 months = $[Y] in lost revenue while you think about it. Worth revisiting before then?" },
    { objection: "We have other priorities right now", response: "What's the priority? Because this isn't about adding something new — it's about recovering money that's already yours. Once we show you the ROI, you'll see why it should be the priority." },
  ],
  "buy-in": [
    { objection: "I need to talk to my partner", response: "Smart. Can they hop on right now? Or I'll send you both a one-pager and we can do a 20-minute call together. You'll both walk away seeing exactly where the opportunity is." },
    { objection: "I want to see it working first / want a pilot", response: "Absolutely the right call. Here's what I propose: We start with the biggest ROI piece (#1 — [solution]). One week to set up, 30 days to prove it. If you hate it, we stop. But I'm confident you'll see results immediately." },
    { objection: "What if my team rejects it?", response: "Good question. Usually the team loves it because it saves THEM time. The people doing scheduling and follow-up? They'll be thrilled. We'll handle the training and transition." },
    { objection: "We'd need to integrate with [tool] first", response: "We handle integrations. What tool? [Listen]. Most tools we already integrate with. Even if it's a custom one, we can make it work. Let's not let integration be the blocker." },
  ],
};

const REACTIVE_OBJECTIONS_BY_CATEGORY = [
  { category: "pricing", label: "Pricing Objections" },
  { category: "we're-fine", label: "We're Doing Fine" },
  { category: "skepticism", label: "Skepticism / Trust" },
  { category: "timing", label: "Timing / Priority" },
  { category: "buy-in", label: "Buy-In / Process" },
];

export function DiscoveryAuditor({ initialSessions }: { initialSessions: DiscoverySession[] }) {
  const [tab, setTab] = useState<"input" | "results" | "history" | "objections">("input");
  const [currentSession, setCurrentSession] = useState<DiscoverySession | null>(null);
  const [sessions, setSessions] = useState(initialSessions);
  const [isPending, startTransition] = useTransition();

  // Objections state
  const [objectionSearch, setObjectionSearch] = useState("");
  const [objectionCategory, setObjectionCategory] = useState<string>("all");
  const [expandedObjection, setExpandedObjection] = useState<string | null>(null);

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
        {(["input", "results", "history", "objections"] as const).map((t) => (
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

      {/* Tab: Objections */}
      {tab === "objections" && (
        <div className="space-y-8">
          {/* Predictive Objections */}
          <div className="space-y-4">
            <h2 className="font-semibold text-white text-lg">Predictive Objections</h2>
            <p className="text-sm text-white/60">Based on {formData.businessName || "their"} answers, they might say:</p>

            {formData.businessName ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.bookingConversion && parseInt(formData.bookingConversion) < 50 && (
                  <PredictiveObjectionCard
                    objection="We're doing fine, don't need this"
                    response={`You're at ${formData.bookingConversion}% conversion. That means ${Math.round((parseInt(formData.callsPerWeek || "0") || 0) * (1 - parseInt(formData.bookingConversion) / 100))} calls/week aren't booking. At $${formData.painPoint || "2500"} per job, that's roughly $${Math.round((parseInt(formData.callsPerWeek || "0") || 0) * (1 - parseInt(formData.bookingConversion) / 100) * 4 * 2500)}/month sitting on the table. Is that acceptable?`}
                  />
                )}

                {formData.phone24_7 === "no" && (
                  <PredictiveObjectionCard
                    objection="We call back next day, that's good enough"
                    response={`After-hours calls are lost revenue. Even if you call back the next day, you've lost the urgency and they've called 3 other contractors. What's your average job worth? Let's calculate what that's costing you.`}
                  />
                )}

                {formData.respondsToReviews === "no" && (
                  <PredictiveObjectionCard
                    objection="Reviews don't affect our business"
                    response={`Actually, 72% of customers check reviews before calling. Not responding tells them you don't care. How many leads are you losing to lower-rated competitors?`}
                  />
                )}

                {formData.marketingSpend && (
                  <PredictiveObjectionCard
                    objection="We're already spending on marketing"
                    response={`You're spending $${formData.marketingSpend}/month. But if your conversion is only ${formData.bookingConversion}%, you're wasting a lot of that on unconverted leads. This fixes the conversion side.`}
                  />
                )}

                {!formData.bookingConversion && !formData.phone24_7 && formData.callsPerWeek === "" && (
                  <div className="col-span-full rounded-lg border border-white/10 bg-white/[0.02] p-4 text-center">
                    <p className="text-sm text-white/60">Fill in the questionnaire to see predicted objections with their real numbers.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-center">
                <p className="text-sm text-white/60">Enter a business name to see predicted objections.</p>
              </div>
            )}
          </div>

          {/* Reactive Objections */}
          <div className="space-y-4">
            <h2 className="font-semibold text-white text-lg">Objection Handling Library</h2>

            {/* Search */}
            <input
              type="text"
              placeholder="Search objections (e.g., 'price', 'busy', 'trust')..."
              value={objectionSearch}
              onChange={(e) => setObjectionSearch(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
            />

            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setObjectionCategory("all")}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                  objectionCategory === "all"
                    ? "bg-brand-purple/30 text-brand-purple-light border border-brand-purple/50"
                    : "bg-white/[0.05] text-white/60 hover:bg-white/[0.1]"
                )}
              >
                All
              </button>
              {REACTIVE_OBJECTIONS_BY_CATEGORY.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => setObjectionCategory(cat.category)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                    objectionCategory === cat.category
                      ? "bg-brand-purple/30 text-brand-purple-light border border-brand-purple/50"
                      : "bg-white/[0.05] text-white/60 hover:bg-white/[0.1]"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Objections list */}
            <div className="space-y-2">
              {REACTIVE_OBJECTIONS_BY_CATEGORY.map((cat) => {
                if (objectionCategory !== "all" && objectionCategory !== cat.category) return null;

                const objections = REACTIVE_OBJECTIONS[cat.category as keyof typeof REACTIVE_OBJECTIONS] || [];
                const filtered = objections.filter(
                  (obj) =>
                    objectionSearch === "" ||
                    obj.objection.toLowerCase().includes(objectionSearch.toLowerCase()) ||
                    obj.response.toLowerCase().includes(objectionSearch.toLowerCase())
                );

                if (filtered.length === 0) return null;

                return (
                  <div key={cat.category} className="space-y-2">
                    {filtered.map((obj, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedObjection(
                              expandedObjection === `${cat.category}-${idx}` ? null : `${cat.category}-${idx}`
                            )
                          }
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.05] transition-colors"
                        >
                          <p className="text-sm text-white/80 text-left">{obj.objection}</p>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-white/60 shrink-0 transition-transform",
                              expandedObjection === `${cat.category}-${idx}` && "rotate-180"
                            )}
                          />
                        </button>

                        {expandedObjection === `${cat.category}-${idx}` && (
                          <div className="px-4 py-3 border-t border-white/10 bg-white/[0.01]">
                            <p className="text-sm text-white/70 leading-relaxed">{obj.response}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
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

function PredictiveObjectionCard({
  objection,
  response,
}: {
  objection: string;
  response: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-brand-purple/30 bg-brand-purple/[0.08] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-brand-purple/[0.12] transition-colors"
      >
        <p className="text-sm font-medium text-white text-left">Might say: &ldquo;{objection}&rdquo;</p>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-brand-purple-light shrink-0 transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>

      {expanded && (
        <div className="px-4 py-3 border-t border-brand-purple/30 bg-brand-purple/[0.05]">
          <p className="text-sm text-white/80 leading-relaxed">{response}</p>
        </div>
      )}
    </div>
  );
}
