import { promises as fs } from "fs";
import path from "path";

// Map of file names to their actual paths in the OS
const FILE_MAP: Record<string, string> = {
  "COMPLETE-OPERATING-SYSTEM": "/Users/finnschueler/Desktop/Drivn.AI OS/COMPLETE-OPERATING-SYSTEM.md",
  "STAGE-3-CLIENT-DASHBOARD-ARCHITECTURE": "/Users/finnschueler/Desktop/Drivn.AI OS/knowledge-base/STAGE-3-CLIENT-DASHBOARD-ARCHITECTURE.md",
  "DATABASE-STRATEGY": "/Users/finnschueler/Desktop/Drivn.AI OS/knowledge-base/DATABASE-STRATEGY.md",
  "OS-PROJECT-DASHBOARD": "/Users/finnschueler/Desktop/Drivn.AI OS/knowledge-base/OS-PROJECT-DASHBOARD.md",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const filePath = FILE_MAP[filename];

    if (!filePath) {
      return new Response("File not found", { status: 404 });
    }

    const content = await fs.readFile(filePath, "utf-8");
    return new Response(content, {
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  } catch (err) {
    console.error("Error reading file:", err);
    return new Response("Failed to read file", { status: 500 });
  }
}
