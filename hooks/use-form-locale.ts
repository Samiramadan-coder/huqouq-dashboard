"use client";

import { useMemo, useState } from "react";
import { AppLocale } from "@/i18n/routing";
import { messages } from "@/lib/create-translator";
import { createTranslator, useLocale } from "next-intl";

type Namespace = keyof (typeof messages)["en"];

export function useFormLocale(namespace: Namespace) {
  const locale = useLocale();
  const [activeLocale, setActiveLocale] = useState<AppLocale>(locale);

  const tLive = useMemo(() => {
    return createTranslator({
      locale: activeLocale,
      messages: messages[activeLocale],
      namespace,
    });
  }, [activeLocale, namespace]);

  const changeLocale = (locale: AppLocale) => {
    setActiveLocale(locale);
  };

  return {
    activeLocale,
    tLive,
    changeLocale,
    dir: activeLocale === "ar" ? "rtl" : "ltr",
    isArabic: activeLocale === "ar",
  };
}
