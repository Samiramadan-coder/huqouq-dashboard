import { FileQuestion } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("Errors");

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 sm:p-6">
      <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-gray-200 bg-white px-6 py-10 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/6">
          <FileQuestion className="size-5 text-primary" strokeWidth={1.8} />
        </div>

        <h1 className="mt-4 text-base font-semibold text-gray-800">
          {t("notFoundTitle")}
        </h1>
        <p className="mt-1.5 text-[13px] text-gray-500">
          {t("notFoundDescription")}
        </p>

        <Button asChild className="mt-6 h-10 px-5 text-[13px]">
          <Link href="/">{t("backToDashboard")}</Link>
        </Button>
      </div>
    </div>
  );
}
