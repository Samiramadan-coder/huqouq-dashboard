"use server";

import { cookies } from "next/headers";

/**
 * Save token in HTTP-only cookie for authentication.
 */
export async function saveToken(token: string) {
  (await cookies()).set("token", token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Return Token
 */
export async function getTokenHeaders() {
  const token = (await cookies()).get("token")?.value || null;
  return token ? { Authorization: `Bearer ${token}` } : { Authorization: "" };
}

/**
 * Delete token from HTTP-only cookie for logout.
 */
export async function deleteToken() {
  (await cookies()).delete("token");
}

/**
 * Get Language
 */
export async function getServerLanguage() {
  const locale = (await cookies()).get("NEXT_LOCALE")?.value || null;
  return locale;
}
