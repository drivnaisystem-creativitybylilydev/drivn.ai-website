#!/usr/bin/env bash
# Push Resend / questionnaire env vars from .env.local to Vercel Production.
# Run from repo root: npm run vercel:env:push-questionnaire
# Requires: npm run vercel:link (once), `vercel login`, and .env.local populated.

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.local ]]; then
  echo "Missing .env.local — add RESEND_API_KEY, RESEND_FROM_EMAIL, QUESTIONNAIRE_INBOX_EMAIL first."
  exit 1
fi

if [[ ! -d .vercel ]]; then
  echo "Not linked to Vercel. Run: npm run vercel:link"
  exit 1
fi

set -a
# shellcheck disable=SC1091
source ".env.local"
set +a

require() {
  local name="$1"
  local val="${!name-}"
  if [[ -z "${val}" ]]; then
    echo "Missing ${name} in .env.local"
    exit 1
  fi
}

require RESEND_API_KEY
require RESEND_FROM_EMAIL
require QUESTIONNAIRE_INBOX_EMAIL

echo "Adding RESEND_API_KEY (Production, sensitive)…"
printf '%s' "${RESEND_API_KEY}" | npx vercel env add RESEND_API_KEY production --sensitive --yes --force

echo "Adding RESEND_FROM_EMAIL (Production)…"
printf '%s' "${RESEND_FROM_EMAIL}" | npx vercel env add RESEND_FROM_EMAIL production --yes --force

echo "Adding QUESTIONNAIRE_INBOX_EMAIL (Production)…"
printf '%s' "${QUESTIONNAIRE_INBOX_EMAIL}" | npx vercel env add QUESTIONNAIRE_INBOX_EMAIL production --yes --force

echo "Done. Redeploy the project (or trigger a new deployment) so the runtime picks up changes."
echo "Optional: npm run vercel:env:ls"
