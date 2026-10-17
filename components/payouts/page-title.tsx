import { getTranslations } from "next-intl/server";

export default async function PageTitle() {
  const t = await getTranslations("Payouts");

  return (
    <div>
      <h1 className="text-[22px] font-bold text-primary tracking-tight">
        {t("title")}
      </h1>
      <p className="text-[13px] text-gray-500 mt-0.5">{t("description")}</p>
    </div>
  );
}
