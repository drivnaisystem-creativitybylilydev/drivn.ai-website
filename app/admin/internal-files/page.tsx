import { promises as fs } from "fs";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import ClientPage from "./client";

interface DocFile {
  name: string;
  title: string;
  description: string;
  content: string;
}

async function loadDocs(): Promise<DocFile[]> {
  const docs: DocFile[] = [];

  const docConfig = [
    {
      path: "/Users/finnschueler/Desktop/Drivn.AI OS/COMPLETE-OPERATING-SYSTEM.md",
      name: "COMPLETE-OPERATING-SYSTEM",
      title: "Complete Operating System",
      description: "Full workflow from lead sourcing to signed client. Jarvis commands, agent breakdown, and 60-day sprint.",
    },
    {
      path: "/Users/finnschueler/Desktop/Drivn.AI OS/knowledge-base/OS-PROJECT-DASHBOARD.md",
      name: "OS-PROJECT-DASHBOARD",
      title: "OS Project Dashboard",
      description: "Internal project tracking. Kanban view, financial dashboard, team allocation, deliverables tracking.",
    },
  ];

  for (const config of docConfig) {
    try {
      const content = await fs.readFile(config.path, "utf-8");
      docs.push({
        name: config.name,
        title: config.title,
        description: config.description,
        content,
      });
    } catch (err) {
      console.error(`Failed to load ${config.path}:`, err);
    }
  }

  return docs;
}

export default async function InternalFilesPage() {
  const docs = await loadDocs();

  return <ClientPage initialDocs={docs} />;
}
