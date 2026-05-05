#!/bin/bash
# Auto-save progress on session exit
set -e

cd "$(pwd)" || exit 1

# Only run if in a git repo and CLAUDE.md exists
if [ ! -d .git ] || [ ! -f CLAUDE.md ]; then
  exit 0
fi

# Get recent commits (last 5)
COMMITS=$(git log --oneline -5 2>/dev/null || echo "")

if [ -z "$COMMITS" ]; then
  exit 0
fi

# Get current timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Create updated session context using a Python script (more reliable than sed)
python3 << 'PYTHON_EOF'
import os
import re
from datetime import datetime

claude_md_path = "CLAUDE.md"

if not os.path.exists(claude_md_path):
    exit(0)

# Read current CLAUDE.md
with open(claude_md_path, 'r') as f:
    content = f.read()

# Get git log
try:
    import subprocess
    commits = subprocess.check_output(['git', 'log', '--oneline', '-5'],
                                     stderr=subprocess.DEVNULL).decode().strip()
except:
    commits = ""

if not commits:
    exit(0)

# Update or add Session Context section
timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
new_context = f"""## Session Context

**Last session updated:** {timestamp}
**Last 5 commits:**
{commits}
**Status:** Progress auto-saved
"""

# Replace existing session context section
pattern = r'## Session Context\n\n.*?(?=\n\n---|\n\n##|\Z)'
if re.search(pattern, content, re.DOTALL):
    content = re.sub(pattern, new_context.strip(), content, flags=re.DOTALL)
else:
    # Append if not found
    content = content.rstrip() + "\n\n" + new_context

# Write back
with open(claude_md_path, 'w') as f:
    f.write(content)

PYTHON_EOF

exit 0
