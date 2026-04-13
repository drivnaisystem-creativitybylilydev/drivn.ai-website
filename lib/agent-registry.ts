import {
  Database,
  BarChart3,
  MessageSquare,
  FileText,
  Search,
  BookOpen,
} from "lucide-react";

export const AGENTS = [
  {
    id: "kb-updater",
    name: "KB Updater",
    description: "Reads OS folder, syncs CLAUDE.md with latest agency state",
    icon: Database,
    category: "ops" as const,
  },
  {
    id: "weekly-review",
    name: "Weekly Review",
    description: "Summarizes the week: MRR delta, pipeline changes, open tasks",
    icon: BarChart3,
    category: "ops" as const,
  },
  {
    id: "lead-nurture",
    name: "Lead Nurture",
    description: "Finds leads needing follow-up, drafts personalized outreach",
    icon: MessageSquare,
    category: "sales" as const,
  },
  {
    id: "proposal-writer",
    name: "Proposal Writer",
    description: "Takes a client brief and drafts a full proposal doc",
    icon: FileText,
    category: "sales" as const,
  },
  {
    id: "pipeline-scout",
    name: "Pipeline Scout",
    description: "Searches for ICP prospects, adds qualified leads to dashboard",
    icon: Search,
    category: "sales" as const,
  },
  {
    id: "case-study-builder",
    name: "Case Study Builder",
    description: "Turns a completed project into a polished case study",
    icon: BookOpen,
    category: "content" as const,
  },
] as const;

export type Agent = (typeof AGENTS)[number];
export type AgentCategory = Agent["category"];
