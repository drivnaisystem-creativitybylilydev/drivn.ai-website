import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "leads_admin_session";

function adminSecret() {
  return process.env.LEADS_ADMIN_PASSWORD?.trim() ?? "";
}

export function timingSafeEqualStr(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "utf8");
    const bb = Buffer.from(b, "utf8");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

function signExp(exp: number, secret: string) {
  return createHmac("sha256", secret).update(String(exp)).digest("hex");
}

export function mintSessionToken(secret: string): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  return `${exp}.${signExp(exp, secret)}`;
}

export function verifySessionToken(
  token: string | undefined,
  secret: string,
): boolean {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = signExp(exp, secret);
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export async function isLeadsAdminAuthenticated(): Promise<boolean> {
  const secret = adminSecret();
  if (!secret) return false;
  const c = (await cookies()).get(COOKIE)?.value;
  return verifySessionToken(c, secret);
}

export async function setLeadsAdminSessionCookie() {
  const secret = adminSecret();
  if (!secret) return;
  const token = mintSessionToken(secret);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearLeadsAdminSessionCookie() {
  (await cookies()).delete(COOKIE);
}

// ─── Show-form cookie (set on logout so next visit skips Konami) ─────────────

const SHOW_FORM_COOKIE = "leads_show_form";

export async function setShowFormCookie() {
  (await cookies()).set(SHOW_FORM_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60,
  });
}

export async function getShowForm(): Promise<boolean> {
  return (await cookies()).get(SHOW_FORM_COOKIE)?.value === "1";
}

// ─── Login error cookie (short-lived, read from layout) ──────────────────────

const LOGIN_ERROR_COOKIE = "leads_login_error";

export async function setLoginErrorCookie(code: "1" | "2") {
  (await cookies()).set(LOGIN_ERROR_COOKIE, code, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30,
  });
}

export async function getLoginError(): Promise<"1" | "2" | null> {
  const val = (await cookies()).get(LOGIN_ERROR_COOKIE)?.value;
  return val === "1" || val === "2" ? val : null;
}
