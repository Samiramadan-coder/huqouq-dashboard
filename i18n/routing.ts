import { defineRouting } from "next-intl/routing";

export const locales = ["en", "ar"] as const;
export type AppLocale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  // Use 'as-needed' so default locale is served at `/` and
  // non-default locales are prefixed (e.g. `/en`).
  localePrefix: "as-needed",
});
