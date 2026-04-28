# Vercel + Git: deploy runbook (Drivn.AI website)

**Agents:** When `git push` to `main` does not produce a new Vercel deployment, follow this doc before guessing at app or build bugs.

## Project facts

| Item | Value |
|------|--------|
| GitHub repo | `drivnaisystem-creativitybylilydev/drivn.ai-website` |
| Production branch | `main` |
| Vercel project name | `drivn-ai-website` |
| Vercel Git settings (human) | https://vercel.com/drivnaisystem-creativitybylilydevs-projects/drivn-ai-website/settings/git |
| GitHub webhooks (human) | https://github.com/drivnaisystem-creativitybylilydev/drivn.ai-website/settings/hooks |

Local link metadata (if `.vercel/project.json` exists): `projectName` **drivn-ai-website** — use that file for `projectId` / `orgId` when using the Vercel CLI.

## What usually goes wrong

**GitHub has the new commit, but Vercel never starts a build.**  
That means the **GitHub → Vercel webhook / Git integration** is broken or out of sync — **not** (by default) a Next.js compile error.

**Historical note (2026-04-27):** The Vercel GitHub App lost sync with the repo; pushes updated GitHub but Vercel stayed on an older SHA until Git was **disconnected and reconnected** in Vercel, which restored webhooks.

## Isolate in the repo (commands)

Run from the project root:

1. **Confirm GitHub matches local**
   ```bash
   git rev-parse HEAD
   git ls-remote origin refs/heads/main
   ```
   Same SHA → push is on GitHub.

2. **Confirm Vercel CLI is linked**
   ```bash
   test -f .vercel/project.json && cat .vercel/project.json
   ```

3. **Manual deploy (critical test)**
   ```bash
   npx vercel deploy --prod
   ```
   (Requires `vercel login` if not authenticated.)

| Manual deploy | Conclusion |
|---------------|------------|
| **Succeeds** | App builds; fix **Git integration / webhooks**, not application code. |
| **Fails** | Fix **build / config / env** from CLI output first. |

## Fix Git → Vercel (when manual deploy succeeds)

1. **Vercel → Project → Settings → Git**  
   - **Disconnect** the repository, then **Reconnect** and re-authorize GitHub.  
   - Confirm **Production branch** is **`main`**.

2. **GitHub → Settings → Webhooks**  
   - Open the **Vercel** webhook.  
   - Check **Recent Deliveries** — look for non-2xx responses.  
   - After a successful reconnect, new pushes should show green deliveries.

3. **Verify end-to-end**
   ```bash
   git commit --allow-empty -m "chore: trigger Vercel deploy"
   git push origin main
   ```
   Wait ~30 seconds, then open Vercel → **Deployments** and confirm the latest production deployment shows the **new commit SHA**.

## Copy-paste prompt (for Cursor chat)

Use when you want the agent to drive the same diagnosis:

```markdown
## Vercel: push to `main` but no new deployment

**Repo:** `drivnaisystem-creativitybylilydev/drivn.ai-website`, branch `main`.

**Symptom:** `git ls-remote origin refs/heads/main` shows the new SHA, but Vercel Production still shows an older `githubCommitSha` — automatic deploy did not run.

**First:** Read `docs/VERCEL-GIT-DEPLOY.md` in this repo and follow it.

**Then:** Run isolation (`git rev-parse` vs `ls-remote`, then `npx vercel deploy --prod`). If manual deploy works, guide reconnecting Git in Vercel and checking GitHub webhook deliveries; if it fails, fix the build from logs.
```

## Escalation

- If reconnect + webhook checks do not help: **Vercel support** with the deployment URL and failing webhook response (from GitHub).
- Optional: `vercel logs <deployment-url>` for a specific failed deployment.
