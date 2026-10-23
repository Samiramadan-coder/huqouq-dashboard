import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LoginForm from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("login") };
}

export default async function LoginPage() {
  const t = await getTranslations("Auth.Login");

  return (
    <main>
      <Card className="w-75 sm:w-120 py-8 ring-0! shadow-sm">
        <CardContent className="flex flex-col gap-6 px-6">
          <div>
            <h1 className="text-xl font-bold text-center">{t("Title")}</h1>
            <p className="text-sm mt-2 text-center text-muted-foreground">
              {t("Description")}
            </p>
          </div>

          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
