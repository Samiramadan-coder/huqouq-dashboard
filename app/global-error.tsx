"use client";

import "@/assets/css/globals.css";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import { useParams } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import ErrorState from "@/components/reusable/error-state";

const errorMessages = { en: en.Errors, ar: ar.Errors };

// Replaces the root layout when it fails, so it renders its own
// <html>/<body> and intl provider.
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const params = useParams<{ locale?: string }>();
  const locale = hasLocale(routing.locales, params?.locale)
    ? params.locale
    : routing.defaultLocale;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className="min-h-screen bg-background antialiased">
        <NextIntlClientProvider
          locale={locale}
          messages={{ Errors: errorMessages[locale] }}
        >
          <title>{errorMessages[locale].title}</title>
          <ErrorState
            error={error}
            onRetry={unstable_retry}
            className="min-h-screen"
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
