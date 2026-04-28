"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HudBrackets } from "@/components/admin/hud-primitives";
import { Download, Copy, AlertCircle } from "lucide-react";

const INTERVIEW_SECTIONS = [
  {
    id: "daily-ops",
    title: "PART 1: Daily Operations (Time Sinks)",
    description: "Find repetitive tasks that eat hours every day",
    questions: [
      "Walk me through a typical day during [busy season]. What takes up most of your time?",
      "What tasks do you find yourself doing over and over again that feel like they shouldn't require your expertise?",
      "If you could eliminate one daily task completely, what would it be and why?",
      "How much time do you spend each week on: chasing clients for missing documents / answering the same client questions repeatedly / data entry or moving numbers between systems / reconciling accounts or checking for errors / scheduling meetings or follow-ups?",
      "What tasks do your staff spend most of their time on that don't require deep [expertise] knowledge?",
    ],
  },
  {
    id: "client-mgmt",
    title: "PART 2: Client Management (Communication & Follow-Up)",
    description: "Find gaps in client service that AI chatbots/automation could fill",
    questions: [
      "What questions do clients ask you repeatedly that you're tired of answering?",
      "How do you currently handle client communication outside of meetings? (Email, phone calls, portal, etc.)",
      "How many clients miss deadlines or forget to send documents? How do you follow up with them?",
      "Do you have clients who need hand-holding through every step? How time-consuming is that?",
      "What happens when a client reaches out after hours or on weekends? Do you lose business because you can't respond immediately?",
    ],
  },
  {
    id: "staffing",
    title: "PART 3: Staffing & Costs (Where Money Leaks)",
    description: "Identify expensive labor that AI could replace or augment",
    questions: [
      "What roles on your team cost the most but do work that's mostly administrative?",
      "If you could replace one staff position with automation, which would it be?",
      "How much do you spend annually on staff who primarily do: data entry and reconciliation / client communication and scheduling / document collection and organization?",
      "What percentage of your staff's time is spent on tasks that don't require human judgment?",
      "Have you had trouble hiring or retaining staff for certain roles? Why?",
    ],
  },
  {
    id: "tech-stack",
    title: "PART 4: Tech Stack & Systems (Integration Opportunities)",
    description: "Understand current tools and where AI could plug in",
    questions: [
      "What software/tools do you use daily? (e.g., QuickBooks, Excel, email, CRM, etc.)",
      "Do you use any automation already? If so, what? If not, why not?",
      "How much time do you spend moving data between different systems?",
      "What's the most frustrating part of your current tech setup?",
      "If there was a system that could automatically [specific task they mentioned], would you pay for it? How much?",
    ],
  },
  {
    id: "retirement",
    title: "PART 5: Retirement Decision (Why They're Getting Out)",
    description: "Understand if workflow inefficiency is driving the decision",
    questions: [
      "You mentioned retiring soon. What's the main reason?",
      "If you could automate the most tedious parts of your job, would you have stayed longer?",
      "What advice would you give to someone starting out today about technology?",
      "Do you think your industry is behind on technology compared to other industries?",
      "If you were starting over today, what would you do differently with technology?",
    ],
  },
  {
    id: "future-state",
    title: "PART 6: Ideal Future State (What Would Perfect Look Like)",
    description: "Get them to describe the AI-powered dream scenario",
    questions: [
      "If you had a magic wand and could automate anything, what would the perfect day look like?",
      "What tasks do you wish you could delegate but can't because they're too complex?",
      "If a system could handle all client communication, document collection, and data entry, what would YOU focus on instead?",
      "Would you recommend this profession to someone today? Why or why not?",
      "If I built an AI system that solved [their #1 pain point], would you refer others to it?",
    ],
  },
  {
    id: "market-insights",
    title: "PART 7: Market Insights (Who Else Has This Problem)",
    description: "Identify if this is an industry-wide gap or just them",
    questions: [
      "Do other [professionals] you know struggle with the same issues? Or is this unique to you?",
      "What do you hear others complaining about at conferences or networking events?",
      "Are younger [professionals] adopting technology faster, or is everyone struggling?",
      "Who do you think would benefit most from AI automation: solo practitioners, small firms, or large firms?",
      "If I wanted to sell AI automation to [your industry], what would be the hardest part? What objections would I face?",
    ],
  },
  {
    id: "closing",
    title: "CLOSING QUESTIONS (Actionable Next Steps)",
    description: "Build rapport and validate market opportunity",
    questions: [
      "If I built a solution to [their top 3 pain points], would you be willing to test it or give feedback?",
      "Can you introduce me to 2-3 others who might be facing similar challenges?",
      "Is there anything I didn't ask that I should have?",
    ],
  },
];

const TRANSCRIPTION_TOOLS = [
  {
    name: "Apple Transcription (iOS 17+)",
    cost: "Free",
    description: "Built into Voice Memos app. Tap transcribe after recording.",
  },
  {
    name: "Otter.ai",
    cost: "Free tier: 600 min/mo",
    description: "Upload audio files. Get transcripts in seconds. Free tier is perfect for occasional interviews.",
  },
  {
    name: "Claude API (via Whisper)",
    cost: "~$0.02 per min",
    description: "If you want to use your API credits. Upload audio to your dashboard, transcribe via API.",
  },
  {
    name: "Rev.com",
    cost: "$1.25/min (human)",
    description: "Human transcriptionists. Highest quality, best for important/nuanced interviews.",
  },
];

export default function InterviewQuestionnairePage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["daily-ops"]));
  const [notes, setNotes] = useState("");
  const [intervieweeName, setIntervieweeName] = useState("");
  const [intervieweeCompany, setIntervieweeCompany] = useState("");
  const [showTips, setShowTips] = useState(true);

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const expandAll = () => {
    setExpandedSections(new Set(INTERVIEW_SECTIONS.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  const downloadAsText = () => {
    let text = `INTERVIEW QUESTIONNAIRE\n`;
    text += `═══════════════════════════════════════\n\n`;
    text += `Interviewee: ${intervieweeName || "[Name]"}\n`;
    text += `Company: ${intervieweeCompany || "[Company]"}\n`;
    text += `Date: ${new Date().toLocaleDateString()}\n`;
    text += `Recording Status: [Record this interview with Voice Memos]\n\n`;

    INTERVIEW_SECTIONS.forEach((section) => {
      text += `\n${section.title}\n`;
      text += `${section.description}\n`;
      text += `─────────────────────────────────────\n`;
      section.questions.forEach((q) => {
        text += `• ${q}\n  [Notes: ____________________________]\n`;
      });
    });

    text += `\n\nADDITIONAL NOTES:\n`;
    text += notes || "[Your interview notes here]";

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Interview-${intervieweeName || "Questionnaire"}-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Interview Questionnaire</h1>
        <p className="text-white/60">Structured interview guide for discovering pain points and AI opportunities</p>
      </div>

      {/* Quick Tips */}
      {showTips && (
        <div className="relative overflow-hidden rounded-lg border border-amber-500/30 bg-amber-500/[0.08] p-4">
          <HudBrackets color="rgba(217,119,6,0.2)" size={8} />
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-amber-100">Before the Interview</p>
                <p className="text-sm text-amber-100/80">
                  1. <strong>Record with iPhone Voice Memos</strong> (Settings → Privacy → Microphone, allow access first)
                  2. <strong>Download this questionnaire</strong> and bring printed or on tablet
                  3. <strong>Customize the questions</strong> with their industry (e.g., replace &quot;staff&quot; with &quot;team&quot;)
                  4. <strong>Take notes in the Notes section below</strong> during the call
                  5. <strong>After the call, transcribe</strong> using Otter.ai or Apple Transcription
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTips(false)}
              className="text-amber-100/60 hover:text-amber-100 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Interview Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white/60">Interviewee Name</label>
          <input
            type="text"
            value={intervieweeName}
            onChange={(e) => setIntervieweeName(e.target.value)}
            placeholder="e.g., John Smith"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 mt-2 text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
          />
        </div>
        <div>
          <label className="text-sm text-white/60">Company / Role</label>
          <input
            type="text"
            value={intervieweeCompany}
            onChange={(e) => setIntervieweeCompany(e.target.value)}
            placeholder="e.g., Smith & Associates CPA"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 mt-2 text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20"
          />
        </div>
      </div>

      {/* Section Controls */}
      <div className="flex gap-2">
        <Button
          onClick={expandAll}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Expand All
        </Button>
        <Button
          onClick={collapseAll}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Collapse All
        </Button>
      </div>

      {/* Interview Sections */}
      <div className="space-y-3">
        {INTERVIEW_SECTIONS.map((section) => (
          <div
            key={section.id}
            className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-start justify-between px-4 py-4 hover:bg-white/[0.05] transition-colors"
            >
              <div className="text-left">
                <h3 className="font-semibold text-white">{section.title}</h3>
                <p className="text-sm text-white/50">{section.description}</p>
              </div>
              <span className="text-white/60 shrink-0 ml-4">
                {expandedSections.has(section.id) ? "−" : "+"}
              </span>
            </button>

            {expandedSections.has(section.id) && (
              <div className="border-t border-white/10 px-4 py-4 space-y-3 bg-white/[0.01]">
                {section.questions.map((question, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-sm text-white/80">
                      <span className="text-white/40">Q{idx + 1}:</span> {question}
                    </p>
                    <textarea
                      placeholder="Your notes here..."
                      className="w-full h-16 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20 resize-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* General Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-white">Interview Notes & Key Takeaways</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Top 3 pain points, market opportunities, referral potential, next steps..."
          className="w-full h-32 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder-white/40 focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20 resize-none"
        />
      </div>

      {/* Transcription Options */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-white">Recording & Transcription Setup</h3>
          <p className="text-sm text-white/60">
            After the interview, use one of these tools to transcribe your Voice Memos recording:
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {TRANSCRIPTION_TOOLS.map((tool, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-2"
            >
              <div className="flex items-start justify-between">
                <p className="font-medium text-white text-sm">{tool.name}</p>
                <span className="text-xs text-brand-purple-light">{tool.cost}</span>
              </div>
              <p className="text-xs text-white/60">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-white/10">
        <Button
          onClick={downloadAsText}
          className="flex items-center gap-2 bg-brand-purple hover:bg-brand-purple/90"
        >
          <Download className="h-4 w-4" />
          Download as PDF/Text
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {
            navigator.clipboard.writeText(
              INTERVIEW_SECTIONS.map(
                (s) =>
                  `${s.title}\n${s.questions.map((q) => `• ${q}`).join("\n")}`
              ).join("\n\n")
            );
          }}
        >
          <Copy className="h-4 w-4" />
          Copy to Clipboard
        </Button>
      </div>

      {/* Summary Box */}
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 space-y-2">
        <p className="text-sm font-medium text-white">Post-Interview: Synthesize the Data</p>
        <ul className="text-xs text-white/70 space-y-1 list-disc list-inside">
          <li>What were the top 3 pain points mentioned?</li>
          <li>Which of those could AI realistically solve today?</li>
          <li>What would they pay monthly to solve each pain point?</li>
          <li>Are these problems unique to them or industry-wide?</li>
          <li>What&apos;s the urgency level?</li>
          <li>Is this niche viable for Drivn.AI, or just market research?</li>
        </ul>
      </div>
    </div>
  );
}
