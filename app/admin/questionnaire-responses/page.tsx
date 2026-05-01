import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { listQuestionnaireResponses } from "@/lib/questionnaire-db";
import { generateCaseStudyButton } from "./generate-button";
import Link from "next/link";
import { FileText, Zap } from "lucide-react";

export default async function QuestionnaireResponsesPage() {
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    return <AdminLoginPanel />;
  }

  const responses = await listQuestionnaireResponses();

  return (
    <AdminChrome>
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="space-y-6 max-w-7xl">
          {/* Header */}
          <div className="border-b border-white/10 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-sora text-4xl font-bold text-white mb-2">
                  Case Study Responses
                </h1>
                <p className="text-white/60 text-sm">
                  NoTime Storage questionnaire submissions • {responses.length} total
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-900/20 border border-violet-500/30 text-violet-300 hover:bg-violet-900/40 transition-colors text-sm font-medium"
                  title="Refresh page"
                >
                  <Zap className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {responses.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-12 text-center">
              <FileText className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60 font-medium">No responses yet</p>
              <p className="text-white/40 text-sm mt-1">
                Responses will appear here as they&apos;re submitted
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {responses.map((resp) => (
                <Link
                  key={resp._id}
                  href={`/admin/questionnaire-responses/${resp._id}`}
                >
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all hover:border-white/20 cursor-pointer group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-sora font-semibold text-white text-lg group-hover:text-violet-300 transition-colors">
                            {resp.data.client_name || "Unnamed Response"}
                          </h3>
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                              resp.status === "submitted"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-yellow-500/20 text-yellow-300"
                            }`}
                          >
                            {resp.status === "submitted" ? "Submitted" : "Draft"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-white/60">
                          {resp.data.client_email && (
                            <span>{resp.data.client_email}</span>
                          )}
                          {resp.data.business_name && (
                            <span>• {resp.data.business_name}</span>
                          )}
                          <span>
                            • Updated{" "}
                            {new Date(resp.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {resp.data.q01_challenge && (
                          <p className="text-white/50 text-sm mt-2 line-clamp-2">
                            &ldquo;{resp.data.q01_challenge}&rdquo;
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 flex flex-col gap-2">
                        {resp.status === "submitted" && (
                          <>{generateCaseStudyButton(resp._id)}</>
                        )}
                        <button
                          className="px-3 py-2 rounded-lg bg-white/[0.08] text-white/70 hover:bg-white/[0.12] text-xs font-medium transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </AdminChrome>
  );
}
