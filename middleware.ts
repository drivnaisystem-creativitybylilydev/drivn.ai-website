import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match root and locale-prefixed paths, skip admin/api/p/questionnaire/static files.
    // NOTE: "p" and "admin"/"consultant" are anchored to a full path segment (p(?:/|$) etc.) —
    // a bare "p" alternative previously matched any path starting with the letter p (e.g. /privacy),
    // silently 404ing it since it never reached next-intl's locale rewrite.
    "/((?!api|_next|admin(?:/|$)|consultant(?:/|$)|p(?:/|$)|afrodita-call-prep|afrodita-proposal|afrodita-offer|sheridan-movers|bellah-moving|allset-moving|apollonas-moving|apollonas-pitch|_vercel|work/notime-storage/questionnaire|.*\\..*).*)",
  ],
};
