import fs from "fs";
import path from "path";
import { marked } from "marked";

export const metadata = {
  title: "Afrodita — Call Prep",
  robots: { index: false, follow: false },
};

export default async function AfroditaCallPrepPage() {
  const filePath = path.join(process.cwd(), "content", "afrodita-call-prep.md");
  const raw = fs.readFileSync(filePath, "utf8");
  const html = await marked(raw);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div
          className="prose-afrodita"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <style>{`
        .prose-afrodita { font-family: -apple-system, 'Inter', sans-serif; font-size: 15px; line-height: 1.7; color: #d1d5db; }
        .prose-afrodita h1 { font-size: 26px; font-weight: 700; color: #fff; margin-bottom: 4px; padding-bottom: 14px; border-bottom: 1px solid #2a2a2a; }
        .prose-afrodita h2 { font-size: 13px; font-weight: 600; color: #6366f1; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 36px; margin-bottom: 12px; padding-top: 4px; border-top: 1px solid #1f1f1f; }
        .prose-afrodita h3 { font-size: 15px; font-weight: 600; color: #e5e7eb; margin-top: 22px; margin-bottom: 8px; }
        .prose-afrodita p { margin-bottom: 10px; }
        .prose-afrodita ul { margin: 8px 0 14px 20px; }
        .prose-afrodita li { margin-bottom: 5px; color: #d1d5db; }
        .prose-afrodita strong { color: #fff; font-weight: 600; }
        .prose-afrodita em { color: #a5b4fc; font-style: normal; }
        .prose-afrodita blockquote { border-left: 3px solid #6366f1; background: #18182a; padding: 12px 18px; margin: 14px 0; border-radius: 0 8px 8px 0; color: #c7d2fe; font-size: 14px; }
        .prose-afrodita blockquote p { margin: 0; }
        .prose-afrodita table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 13px; }
        .prose-afrodita th { background: #1a1a2e; color: #a5b4fc; font-weight: 600; padding: 8px 12px; text-align: left; border: 1px solid #2d2d3a; }
        .prose-afrodita td { padding: 8px 12px; border: 1px solid #1f1f2e; color: #d1d5db; vertical-align: top; }
        .prose-afrodita tr:nth-child(even) td { background: #131320; }
        .prose-afrodita code { background: #1e1e2e; color: #a5b4fc; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-family: 'SF Mono', 'Fira Code', monospace; }
        .prose-afrodita hr { border: none; border-top: 1px solid #1f1f1f; margin: 24px 0; }
        .prose-afrodita ol { margin: 8px 0 14px 20px; }
        .prose-afrodita ol li { margin-bottom: 5px; }
      `}</style>
    </div>
  );
}
