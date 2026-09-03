import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ReViewBtn() {
  const t = useTranslations("Common");
  return (
    <Button
      variant="outline"
      className="border-amber-200 bg-white rounded-sm text-amber-600 hover:text-white hover:bg-amber-600 text-xs"
    >
      {t("Review")}
      <ArrowRight className="size-4 rtl:rotate-180" />
    </Button>
  );
}
