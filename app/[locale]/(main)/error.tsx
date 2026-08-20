"use client";

import { useTranslations } from "next-intl";

export default function ErrorPage() {
  const t = useTranslations("Common");

  return (
    <main className="space-y-2">
      <h1 className="text-2xl font-bold text-red-400">{t("Error")}</h1>
      <p>{t("ErrorOccurred")}</p>
    </main>
  );
}
