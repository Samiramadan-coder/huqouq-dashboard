import type { useFormatter } from "next-intl";

type Formatter = Pick<ReturnType<typeof useFormatter>, "number">;

// Date format shared by every date shown on the payouts page.
export const DATE_FORMAT = {
  day: "2-digit",
  month: "short",
  year: "numeric",
} as const satisfies Intl.DateTimeFormatOptions;

// Formats an amount exactly as the API sends it (no arithmetic) in the given
// ISO currency, falling back to the plain number when the code is unknown.
export function formatMoney(
  format: Formatter,
  amount: number,
  currency: string,
): string {
  try {
    return format.number(amount, { style: "currency", currency });
  } catch {
    return `${currency} ${format.number(amount)}`.trim();
  }
}

// Groups an IBAN in blocks of four for readability.
export function groupIban(iban: string): string {
  return iban.replace(/\s+/g, "").replace(/(.{4})/g, "$1 ").trim();
}

// Masks an IBAN down to its country code and last four characters,
// e.g. "AE07 0331 2345 6789 0123 456" → "AE•• •••• •••• •••• •••• 3456".
export function maskIban(iban: string | null): string | null {
  if (!iban) return null;

  const compact = iban.replace(/\s+/g, "");
  if (compact.length <= 6) return groupIban(compact);

  const masked =
    compact.slice(0, 2) +
    "•".repeat(compact.length - 6) +
    compact.slice(-4);
  return groupIban(masked);
}
