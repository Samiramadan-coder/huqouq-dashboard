import type {
  DateTimeFormatOptions,
  Formats,
  NumberFormatOptions,
  useFormatter,
} from "next-intl";

// Shared date, number and money formatting, so every page renders them the
// same way in both locales: "Oct 25, 2026" / "٢٥ أكتوبر ٢٠٢٦" and
// "AED 1,500" / "١٬٥٠٠ درهم". Arabic uses Arabic-Indic digits.

type Formatter = ReturnType<typeof useFormatter>;

// Date format shared by every date shown in the dashboard.
export const DATE_FORMAT = {
  day: "2-digit",
  month: "short",
  year: "numeric",
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

// Digits used for a locale. Set explicitly because "ar" defaults to Latin
// digits in current browsers.
export function getNumberingSystem(locale: string) {
  return locale === "ar" ? ("arab" as const) : ("latn" as const);
}

// Global next-intl formats. Messages write numbers as {count, number, digits}
// so counts follow the locale's digits too.
export function getMessageFormats(locale: string) {
  return {
    number: { digits: { numberingSystem: getNumberingSystem(locale) } },
  } satisfies Formats;
}

// Formats a date in the given locale; defaults to DATE_FORMAT.
export function formatDate(
  date: string | Date,
  locale: string,
  options: Intl.DateTimeFormatOptions = DATE_FORMAT,
): string {
  return new Intl.DateTimeFormat(locale, {
    numberingSystem: getNumberingSystem(locale),
    ...options,
  }).format(new Date(date));
}

export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, {
    numberingSystem: getNumberingSystem(locale),
    ...options,
  }).format(value);
}

// Formats an amount exactly as the API sends it (no arithmetic) with a
// thousands separator, e.g. "AED 1,500" in English and "١٬٥٠٠ درهم" in
// Arabic.
export function formatMoney(
  amount: number,
  currency: string,
  locale: string,
): string {
  const value = formatNumber(amount, locale, { maximumFractionDigits: 2 });
  const label = CURRENCY_LABELS[currency]?.[locale] ?? currency;

  return locale === "ar" ? `${value} ${label}` : `${label} ${value}`;
}

// Wraps a next-intl formatter so dates, numbers and relative times use the
// locale's digits. Use through useAppFormatter / getAppFormatter.
export function withLocaleDigits(format: Formatter, locale: string): Formatter {
  const numberingSystem = getNumberingSystem(locale);

  return {
    ...format,
    dateTime: (value: Date | number, options?: DateTimeFormatOptions) =>
      format.dateTime(value, { numberingSystem, ...options }),
    number: (value: number | bigint, options?: NumberFormatOptions) =>
      format.number(value, { numberingSystem, ...options }),
    relativeTime: (
      date: Date | number,
      nowOrOptions?: Date | number | Parameters<Formatter["relativeTime"]>[1],
    ) =>
      format.relativeTime(date, {
        numberingSystem,
        ...(nowOrOptions instanceof Date || typeof nowOrOptions === "number"
          ? { now: nowOrOptions }
          : nowOrOptions),
      } as Parameters<Formatter["relativeTime"]>[1]),
  } as Formatter;
}
