"use client";

import { useTranslations } from "next-intl";

export default function CellDataNotFound() {
  const tCommon = useTranslations("Common");

  return (
    <span className="text-primary font-semibold text-xs italic underline">
      {tCommon("NotFound")}
    </span>
  );
}
