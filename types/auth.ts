import z from "zod";

type T = (key: string) => string;

export const loginSchema = (t: T) =>
  z.object({
    login: z.email({ message: t("InvalidEmail") }),
    password: z
      .string()
      .min(1, { message: t("PasswordIsRequired") })
      .min(8, { message: t("PasswordMinLength") }),
  });

export type LoginFormData = z.infer<ReturnType<typeof loginSchema>>;

// Shape of a successful `POST /api/admin/login` response.
export const loginResponseSchema = z.object({
  token: z.string().min(1),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export type LoginError = "invalid_credentials" | "unexpected";

export type LoginResult =
  | { success: true }
  | { success: false; error: LoginError };
