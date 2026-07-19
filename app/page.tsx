// Middleware (next-intl) intercepts all requests to this path and routes them
// through app/[locale]/page.tsx. This file is never directly served.
export default function RootPage() {
  return null;
}
