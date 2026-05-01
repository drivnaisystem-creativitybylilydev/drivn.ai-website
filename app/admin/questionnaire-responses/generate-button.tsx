"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export function generateCaseStudyButton(responseId: string) {
  return (
    <GenerateButton responseId={responseId} />
  );
}

function GenerateButton({ responseId }: { responseId: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<{
    ok: boolean;
    caseStudy: {
      imageRecommendations?: Record<string, string>;
      [key: string]: unknown;
    };
  } | null>(null);

  const handleGenerate = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch("/api/case-studies/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseId }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
        setShowModal(true);
        setIsDone(true);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Failed to generate case study:", err);
      alert("Failed to generate case study. Check the console.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={handleGenerate}
        disabled={isGenerating || isDone}
        className="px-3 py-2 rounded-lg bg-violet-900/30 border border-violet-500/40 text-violet-300 hover:bg-violet-900/50 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
      >
        <Sparkles className="w-3.5 h-3.5" />
        {isDone ? "Generated!" : isGenerating ? "Building…" : "Generate Case Study"}
      </button>

      {showModal && result && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-white/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-white/10 sticky top-0 bg-gray-950">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Case Study Generated</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-2">Next Steps:</h3>
                <ol className="text-white/70 text-sm space-y-2 list-decimal list-inside">
                  <li>Copy the case study JSON below</li>
                  <li>Add to <code className="bg-black/50 px-1.5 py-0.5 rounded text-xs">lib/case-studies.ts</code> in the <code className="bg-black/50 px-1.5 py-0.5 rounded text-xs">caseStudies</code> array</li>
                  <li>Use image recommendations below to source or create hero images</li>
                  <li>Deploy and verify at <code className="bg-black/50 px-1.5 py-0.5 rounded text-xs">/work/[slug]</code></li>
                </ol>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Case Study Data (copy to lib/case-studies.ts):</h3>
                <pre className="bg-black/50 p-4 rounded text-xs text-white/80 overflow-auto max-h-64 border border-white/10">
                  {JSON.stringify(result.caseStudy, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Image Recommendations:</h3>
                <div className="space-y-3 text-sm">
                  {result.caseStudy.imageRecommendations &&
                    Object.entries(result.caseStudy.imageRecommendations).map(
                      ([key, desc]: [string, string]) => (
                        <div
                          key={key}
                          className="bg-white/[0.04] border border-white/10 p-3 rounded"
                        >
                          <p className="text-white/80 font-medium capitalize">{key}:</p>
                          <p className="text-white/60 mt-1">{desc}</p>
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
