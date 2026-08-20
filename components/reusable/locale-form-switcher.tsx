import { Locale } from "@/types/shared";
import { Button } from "../ui/button";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

export default function LocaleFormSwitcher({
  locale,
  onChange,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
}) {
  const t = useTranslations("Common");
  const versionLocale = useLocale();

  return (
    <div className="px-4 grid grid-cols-2 gap-2">
      <Button
        variant="outline"
        type="button"
        onClick={() => onChange("en")}
        className={cn(
          "h-10 hover:bg-primary hover:text-primary-foreground order-2",
          locale === "en" ? "bg-primary text-primary-foreground" : "",
          versionLocale === "ar" ? "order-2" : "order-1",
        )}
      >
        <Globe className="mr-2 h-4 w-4" />
        {t("English")}
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={() => onChange("ar")}
        className={cn(
          "h-10 hover:bg-primary hover:text-primary-foreground order-1",
          locale === "ar" ? "bg-primary text-primary-foreground" : "",
          versionLocale === "en" ? "order-2" : "order-1",
        )}
      >
        <Globe className="mr-2 h-4 w-4" />
        {t("Arabic")}
      </Button>
    </div>
  );
}
