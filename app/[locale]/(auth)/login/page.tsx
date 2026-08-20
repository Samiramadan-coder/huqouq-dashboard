"use client";

import { toast } from "sonner";
import { http } from "@/lib/http";
import { saveToken } from "@/lib/actions";
import Input from "@/components/form/input";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginFormData, loginSchema } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("Auth.Login");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema(t)),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const { data: loginResponse } = await http.post<{
        token: string;
      }>("/api/admin/login", data);

      console.log("Login response:", loginResponse.token);

      saveToken(loginResponse.token);
      toast.success(t("LoginSuccess"));
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(t("LoginFailed"));
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="w-75 sm:w-120 py-8 ring-0! shadow-sm">
          <CardContent className="flex flex-col gap-6 px-6">
            <div>
              <p className="text-xl font-bold text-center">{t("Title")}</p>
              <p className="text-sm mt-2 text-center text-muted-foreground">
                {t("Description")}
              </p>
            </div>

            <Input
              register={register}
              errors={errors}
              required
              name="login"
              label={t("Email")}
            />

            <Input
              register={register}
              errors={errors}
              required
              name="password"
              label={t("Password")}
              type="password"
            />

            <Button type="submit" className="w-full h-11 bg-primary">
              {isSubmitting ? <Spinner /> : t("Submit")}
            </Button>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}
