import { isLeadsAdminAuthenticated } from "@/lib/admin-session";
import { listAgentRuns, getLastRunByAgent } from "@/lib/agent-db";
import { AdminChrome } from "@/components/admin/AdminChrome";
import { AdminLoginPanel } from "@/components/admin/AdminLoginPanel";
import { AgentsDashboard } from "@/components/admin/AgentsDashboard";
import { AGENTS } from "@/lib/agent-registry";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    return (
      <AdminChrome>
        <AdminLoginPanel />
      </AdminChrome>
    );
  }

  const agentIds = AGENTS.map((a) => a.id);
  const [runs, lastRuns] = await Promise.all([
    listAgentRuns(40),
    getLastRunByAgent(agentIds),
  ]);

  return <AgentsDashboard runs={runs} lastRuns={lastRuns} />;
}
