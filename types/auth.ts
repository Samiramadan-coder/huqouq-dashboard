import z from "zod";

type T = (key: string) => string;

export const loginSchema = (t: T) =>
  z.object({
    login: z.email({ message: t("InvalidEmail") }),
    password: z
      .string()
      .min(1, { message: t("PasswordIsRequired") })
      .min(8, { message: t("passwordMinLength") }),
  });

export type LoginFormData = z.infer<ReturnType<typeof loginSchema>>;
