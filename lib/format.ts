// Shared date and money formatting, so every page renders them the same way in
// both locales: "Oct 25, 2026" / "25 أكتوبر 2026" and "AED 1,500" / "1,500 درهم".
// Digits are always Latin, matching the rest of the platform.

// Date format shared by every date shown in the dashboard.
export const DATE_FORMAT = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  numberingSystem: "latn",
} as const satisfies Intl.DateTimeFormatOptions;

export const DATE_TIME_FORMAT = {
  ...DATE_FORMAT,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
} as const satisfies Intl.DateTimeFormatOptions;

// Localized currency names; codes without an entry are shown as-is.
const CURRENCY_LABELS: Record<string, Record<string, string>> = {
  AED: { ar: "درهم" },
};

// Formats a date in the given locale; defaults to DATE_FORMAT.
export function formatDate(
  date: string | Date,
  locale: string,
  options: Intl.DateTimeFormatOptions = DATE_FORMAT,
): string {
  return new Intl.DateTimeFormat(locale, {
    numberingSystem: "latn",
    ...options,
  }).format(new Date(date));
}

// Formats an amount exactly as the API sends it (no arithmetic) with a
// thousands separator, e.g. "AED 1,500" in English and "1,500 درهم" in Arabic.
export function formatMoney(
  amount: number,
  currency: string,
  locale: string,
): string {
  const value = new Intl.NumberFormat(locale, {
    numberingSystem: "latn",
    maximumFractionDigits: 2,
  }).format(amount);
  const label = CURRENCY_LABELS[currency]?.[locale] ?? currency;

  return locale === "ar" ? `${value} ${label}` : `${label} ${value}`;
}
