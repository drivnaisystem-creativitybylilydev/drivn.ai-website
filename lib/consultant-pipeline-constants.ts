// Client-safe constants — no MongoDB imports. Import from here in client components.

export type PipelineStage =
  | "new"
  | "emailed"
  | "followed_up"
  | "called"
  | "replied"
  | "meeting"
  | "won"
  | "lost";

export const PIPELINE_STAGES: PipelineStage[] = [
  "new",
  "emailed",
  "followed_up",
  "called",
  "replied",
  "meeting",
  "won",
  "lost",
];

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  new: "New",
  emailed: "Emailed",
  followed_up: "Followed Up",
  called: "Called",
  replied: "Replied",
  meeting: "Meeting",
  won: "Won",
  lost: "Lost",
};

export interface ActionLogEntry {
  action:
    | "emailed"
    | "followed_up"
    | "called"
    | "replied"
    | "meeting_booked"
    | "note_added";
  timestamp: string;
  note?: string;
}
