import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { listQuestionnaireResponses } from "@/lib/questionnaire-db";
import Link from "next/link";

export default async function QuestionnaireResponsesPage() {
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    return <AdminLoginPanel />;
  }

  const responses = await listQuestionnaireResponses();

  return (
    <AdminChrome>
      <AdminSidebar />
      <main className="flex-1">
        <div className="space-y-6 max-w-6xl">
          <div>
            <h1 className="font-sora text-3xl font-bold text-white mb-2">
              Questionnaire Responses
            </h1>
            <p className="text-white/60">
              NoTime Storage case study responses ({responses.length} total)
            </p>
          </div>

          {responses.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-8 text-center">
              <p className="text-white/60">No responses yet</p>
            </div>
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="px-4 py-3 text-left font-medium text-white/80">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-white/80">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-white/80">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-white/80">
                      Updated
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-white/80">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((resp) => (
                    <tr
                      key={resp._id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 text-white/90">
                        {resp.data.client_name || "—"}
                      </td>
                      <td className="px-4 py-3 text-white/70 text-xs">
                        {resp.data.client_email || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            resp.status === "submitted"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          {resp.status === "submitted" ? "Submitted" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/60 text-xs">
                        {new Date(resp.updatedAt).toLocaleDateString()} at{" "}
                        {new Date(resp.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/questionnaire-responses/${resp._id}`}
                          className="text-violet-400 hover:text-violet-300 text-xs font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </AdminChrome>
  );
}
