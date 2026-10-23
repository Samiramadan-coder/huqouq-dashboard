"use server";

import { getServerLanguage, saveToken } from "@/lib/actions";
import {
  LoginFormData,
  LoginResult,
  loginResponseSchema,
  loginSchema,
} from "@/types/auth";

/**
 * Authenticate the admin and store the token in an HTTP-only cookie.
 * The token never reaches client JavaScript.
 *
 * Uses `fetch` directly instead of the shared `http` client: its 401 handler
 * logs the user out and redirects, which is wrong for a failed login attempt.
 */
export async function login(credentials: LoginFormData): Promise<LoginResult> {
  // Messages are irrelevant here; the client already shows field errors.
  const parsed = loginSchema((key) => key).safeParse(credentials);
  if (!parsed.success) {
    return { success: false, error: "invalid_credentials" };
  }

  try {
    const language = await getServerLanguage();

    const response = await fetch(
      new URL("/api/admin/login", process.env.NEXT_PUBLIC_API_URL),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(language && { "Accept-Language": language }),
        },
        body: JSON.stringify(parsed.data),
      },
    );

    if (response.status >= 400 && response.status < 500) {
      return { success: false, error: "invalid_credentials" };
    }

    if (!response.ok) {
      return { success: false, error: "unexpected" };
    }

    const body = loginResponseSchema.safeParse(await response.json());
    if (!body.success) {
      return { success: false, error: "unexpected" };
    }

    await saveToken(body.data.token);
    return { success: true };
  } catch (error) {
    console.error("Login request failed:", error);
    return { success: false, error: "unexpected" };
  }
}
