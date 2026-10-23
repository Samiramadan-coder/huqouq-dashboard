import "server-only";

import { cookies } from "next/headers";

// Session helpers for server code only. This module is deliberately NOT a
// "use server" file: every export of a "use server" module becomes a public
// endpoint the browser can call, which would hand out the HTTP-only token.
// `server-only` makes the build fail if a client component imports it.

const TOKEN_COOKIE = "token";
const LOCALE_COOKIE = "NEXT_LOCALE";
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/**
 * Save token in HTTP-only cookie for authentication.
 * Only call this from a server action or route handler.
 */
export async function saveToken(token: string) {
  (await cookies()).set(TOKEN_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: TOKEN_MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Authorization header for API requests, or no header when signed out.
 */
export async function getTokenHeaders(): Promise<Record<string, string>> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Locale chosen by next-intl, used for the API's Accept-Language header.
 */
export async function getServerLanguage(): Promise<string | null> {
  return (await cookies()).get(LOCALE_COOKIE)?.value ?? null;
}
