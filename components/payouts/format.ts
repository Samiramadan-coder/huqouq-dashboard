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
