"use client";

import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import { login } from "@/lib/auth";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "../ui/field";
import {
  useForm,
  SubmitHandler,
  type FieldError as FormFieldError,
  type UseFormRegister,
} from "react-hook-form";
import { LoginError, LoginFormData, loginSchema } from "@/types/auth";

const errorMessageKeys: Record<LoginError, string> = {
  invalid_credentials: "LoginFailed",
  unexpected: "UnexpectedError",
};

export default function LoginForm() {
  const router = useRouter();
  const t = useTranslations("Auth.Login");
  const [isNavigating, startNavigation] = useTransition();

  const schema = useMemo(() => loginSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: { login: "", password: "" },
  });

  const isPending = isSubmitting || isNavigating;

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const result = await login(data);

      if (!result.success) {
        toast.error(t(errorMessageKeys[result.error]));
        return;
      }

      toast.success(t("LoginSuccess"));
      startNavigation(() => router.replace("/"));
    } catch {
      toast.error(t("UnexpectedError"));
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <LoginField
        name="login"
        type="email"
        autoComplete="username"
        label={t("Email")}
        register={register}
        error={errors.login}
      />

      <LoginField
        name="password"
        type="password"
        autoComplete="current-password"
        label={t("Password")}
        register={register}
        error={errors.password}
      />

      <Button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="w-full h-11 bg-primary"
      >
        {isPending ? <Spinner aria-label={t("Submitting")} /> : t("Submit")}
      </Button>
    </form>
  );
}

// LoginField renders a required, accessible input with its error linked via aria-describedby.
function LoginField({
  name,
  type,
  autoComplete,
  label,
  register,
  error,
}: {
  name: keyof LoginFormData;
  type: "email" | "password";
  autoComplete: "username" | "current-password";
  label: string;
  register: UseFormRegister<LoginFormData>;
  error?: FormFieldError;
}) {
  const id = `login-${name}`;
  const errorId = `${id}-error`;

  return (
    <Field data-invalid={!!error}>
      <FieldLabel
        htmlFor={id}
        className="text-sm font-semibold after:ms-1 after:text-destructive after:content-['*']"
      >
        {label}
      </FieldLabel>

      <FieldContent>
        <div className="space-y-1.5">
          <Input
            {...register(name)}
            id={id}
            type={type}
            autoComplete={autoComplete}
            required
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className="h-10 border-border bg-background"
          />
          <FieldError id={errorId} errors={[error]} />
        </div>
      </FieldContent>
    </Field>
  );
}
