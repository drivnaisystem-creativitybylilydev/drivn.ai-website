"use client";

import { useState, useEffect } from "react";
import { FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocFile {
  name: string;
  title: string;
  description: string;
  content: string;
}

const DOCS = [
  {
    name: "COMPLETE-OPERATING-SYSTEM",
    title: "Complete Operating System",
    description: "Full workflow from lead sourcing to signed client. Jarvis commands, agent breakdown, and 60-day sprint.",
  },
  {
    name: "OS-PROJECT-DASHBOARD",
    title: "OS Project Dashboard",
    description: "Internal project tracking. Kanban view, financial dashboard, team allocation, deliverables tracking.",
  },
];

export default function InternalFilesPage() {
  const [selectedDoc, setSelectedDoc] = useState(DOCS[0].name);
  const [docs, setDocs] = useState<Map<string, DocFile>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocs = async () => {
      const newDocs = new Map<string, DocFile>();

      for (const doc of DOCS) {
        try {
          const res = await fetch(`/api/admin/internal-files/${doc.name}`);
          if (res.ok) {
            const content = await res.text();
            newDocs.set(doc.name, {
              name: doc.name,
              title: doc.title,
              description: doc.description,
              content,
            });
          }
        } catch (err) {
          console.error(`Failed to load ${doc.name}:`, err);
        }
      }

      setDocs(newDocs);
      setLoading(false);
    };

    loadDocs();
  }, []);

  const currentDoc = docs.get(selectedDoc);

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">Internal Files</h1>
        <p className="text-white/60">Process documentation, architecture guides, and operational playbooks</p>
      </div>

      {/* Layout: Sidebar + Content */}
      <div className="grid grid-cols-4 gap-6">
        {/* Sidebar: File List */}
        <div className="col-span-1 space-y-2">
          {DOCS.map((doc) => (
            <button
              key={doc.name}
              onClick={() => setSelectedDoc(doc.name)}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-left transition-all",
                selectedDoc === doc.name
                  ? "border-brand-purple/50 bg-brand-purple/10 text-white"
                  : "border-white/10 text-white/70 hover:border-white/20 hover:bg-white/[0.02] hover:text-white/90"
              )}
            >
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{doc.title}</p>
                  <p className="text-xs text-white/40 line-clamp-1">{doc.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content: Document */}
        <div className="col-span-3">
          {loading ? (
            <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] py-12">
              <p className="text-white/60">Loading documentation...</p>
            </div>
          ) : currentDoc ? (
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
              {/* Document Header */}
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">{currentDoc.title}</h2>
                <p className="text-sm text-white/60">{currentDoc.description}</p>
              </div>

              {/* Document Content */}
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto p-6">
                <div className="prose prose-invert max-w-none space-y-4 text-sm">
                  {currentDoc.content.split("\n").map((line, idx) => {
                    // Headings
                    if (line.startsWith("# ")) {
                      return (
                        <h1 key={idx} className="text-2xl font-bold text-white mt-6 mb-3">
                          {line.replace(/^# /, "")}
                        </h1>
                      );
                    }
                    if (line.startsWith("## ")) {
                      return (
                        <h2 key={idx} className="text-xl font-semibold text-white mt-5 mb-2">
                          {line.replace(/^## /, "")}
                        </h2>
                      );
                    }
                    if (line.startsWith("### ")) {
                      return (
                        <h3 key={idx} className="text-lg font-semibold text-white/90 mt-4 mb-2">
                          {line.replace(/^### /, "")}
                        </h3>
                      );
                    }

                    // Horizontal rule
                    if (line.trim() === "---") {
                      return <hr key={idx} className="my-4 border-white/10" />;
                    }

                    // Code blocks
                    if (line.startsWith("```")) {
                      return null; // Skip fence markers, handle below
                    }

                    // Lists
                    if (line.match(/^[\*\-\+]\s/)) {
                      return (
                        <li key={idx} className="text-white/80 ml-4 list-disc">
                          {line.replace(/^[\*\-\+]\s/, "")}
                        </li>
                      );
                    }

                    // Blockquotes
                    if (line.startsWith("> ")) {
                      return (
                        <blockquote key={idx} className="border-l-2 border-brand-purple/50 pl-4 italic text-white/70">
                          {line.replace(/^> /, "")}
                        </blockquote>
                      );
                    }

                    // Regular text
                    if (line.trim()) {
                      return (
                        <p key={idx} className="text-white/80 leading-relaxed">
                          {line}
                        </p>
                      );
                    }

                    // Empty lines
                    return <div key={idx} className="h-2" />;
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] py-12">
              <p className="text-white/60">Document not found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
