/**
 * Gmail Sync — Consultant Pipeline
 *
 * STATUS: STUB — Gmail OAuth not configured
 *
 * HOW TO WIRE THIS UP WHEN READY:
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Install the googleapis package:
 *    npm install googleapis
 *
 * 2. Create a Google Cloud project + OAuth 2.0 credentials (Web Application):
 *    - Authorized redirect URI: https://yourdomain.com/api/auth/google/callback
 *    - Scopes needed: https://www.googleapis.com/auth/gmail.readonly
 *
 * 3. Store the tokens in MongoDB after the OAuth dance:
 *    Collection: gmail_tokens
 *    Document: { account: "drivn.ai.system@gmail.com", access_token, refresh_token, expiry_date }
 *
 * 4. Implement the sync logic:
 *    a. Load tokens from MongoDB
 *    b. Init OAuth2Client with credentials from env (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
 *    c. Set oauth2Client.setCredentials(tokens)
 *    d. Use gmail.users.messages.list({ userId: 'me', labelIds: ['SENT'], maxResults: 100 })
 *       to fetch recently sent messages
 *    e. For each message, parse the To: header to extract recipient email addresses
 *    f. Cross-reference against consultant_leads.email_primary in MongoDB
 *    g. For matching leads: call logLeadAction(id, "emailed", subject) and
 *       optionally moveLeadToStage(id, "emailed")
 *    h. Track last-synced timestamp to avoid double-logging (store in gmail_tokens doc)
 *
 * 5. Trigger this route:
 *    - Manually: POST /api/consultant-pipeline/gmail-sync
 *    - Via cron: add a Vercel cron job in vercel.json targeting this route
 *
 * ENV VARS NEEDED:
 *    GOOGLE_CLIENT_ID=...
 *    GOOGLE_CLIENT_SECRET=...
 *    (tokens stored in MongoDB, not env vars — they rotate)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { isLeadsAdminAuthenticated } from "@/lib/admin-session";

export async function POST() {
  const authed = await isLeadsAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: replace this stub with the real implementation described above
  return NextResponse.json({
    synced: 0,
    message:
      "Gmail OAuth not configured — see setup instructions in the route file.",
  });
}

export async function GET() {
  return NextResponse.json({
    status: "stub",
    message:
      "Gmail sync is not yet configured. POST to this endpoint once OAuth is set up.",
  });
}
