import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { getQuestionnaireResponse } from "@/lib/questionnaire-db";
import Link from "next/link";

export default async function QuestionnaireResponseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    return <AdminLoginPanel />;
  }

  const response = await getQuestionnaireResponse(id);

  if (!response) {
    return (
      <AdminChrome>
        <AdminSidebar />
        <main className="flex-1">
          <div className="space-y-6 max-w-4xl">
            <h1 className="font-sora text-2xl font-bold text-white">
              Response not found
            </h1>
            <Link
              href="/admin/questionnaire-responses"
              className="text-violet-400 hover:text-violet-300"
            >
              ← Back to responses
            </Link>
          </div>
        </main>
      </AdminChrome>
    );
  }

  return (
    <AdminChrome>
      <AdminSidebar />
      <main className="flex-1">
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-sora text-3xl font-bold text-white mb-2">
                {response.data.client_name || "Unnamed Response"}
              </h1>
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span>
                  Status:{" "}
                  <span
                    className={`${
                      response.status === "submitted"
                        ? "text-green-300"
                        : "text-yellow-300"
                    }`}
                  >
                    {response.status === "submitted" ? "Submitted" : "Draft"}
                  </span>
                </span>
                <span>
                  Updated: {new Date(response.updatedAt).toLocaleDateString()}
                </span>
                {response.submittedAt && (
                  <span>
                    Submitted: {new Date(response.submittedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <Link
              href="/admin/questionnaire-responses"
              className="text-violet-400 hover:text-violet-300 text-sm"
            >
              ← Back
            </Link>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6 space-y-6">
            {/* Contact Info */}
            <section>
              <h2 className="font-sora text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">
                Contact Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-white/60 mb-1">Name</p>
                  <p className="text-white">{response.data.client_name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-white/60 mb-1">Email</p>
                  <p className="text-white">{response.data.client_email || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-white/60 mb-1">Business</p>
                  <p className="text-white">{response.data.business_name || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-white/60 mb-1">Date</p>
                  <p className="text-white">{response.data.interview_date || "—"}</p>
                </div>
              </div>
            </section>

            {/* Sections */}
            {[
              { title: "Before: Biggest Challenge", key: "q01_challenge" },
              { title: "Before: Typical Day", key: "q02_typical_day" },
              {
                title: "After: Biggest Change",
                key: "q09_biggest_change",
              },
              {
                title: "Testimonial",
                key: "q17_friend",
              },
              {
                title: "Final Thoughts",
                key: "q26_else",
              },
            ].map(
              (section) =>
                response.data[section.key] && (
                  <section key={section.key}>
                    <h3 className="font-medium text-white mb-2">{section.title}</h3>
                    <p className="text-white/70 text-sm whitespace-pre-wrap">
                      {response.data[section.key]}
                    </p>
                  </section>
                )
            )}

            {/* All Fields as JSON */}
            <details className="border-t border-white/10 pt-4">
              <summary className="cursor-pointer text-sm font-medium text-white/60 hover:text-white/80">
                View all data (JSON)
              </summary>
              <pre className="mt-4 bg-black/50 p-4 rounded text-xs overflow-auto text-white/70 max-h-96">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </main>
    </AdminChrome>
  );
}
