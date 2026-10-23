// Date format shared by every date shown in the lawyers and clients features.
export const DATE_FORMAT = {
  day: "2-digit",
  month: "short",
  year: "numeric",
} as const satisfies Intl.DateTimeFormatOptions;

// Masks the middle digits of a phone number for list views, keeping the
// country code and last digits readable, e.g. "+971 50 123 4567" → "+971 •• ••• 4567".
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "";

  const totalDigits = phone.replace(/\D/g, "").length;
  const keepStart = phone.startsWith("+") ? 3 : 0;
  const keepEnd = 4;
  if (totalDigits <= keepStart + keepEnd) return phone;

  let digitIndex = 0;
  return phone.replace(/\d/g, (digit) => {
    const index = digitIndex++;
    return index < keepStart || index >= totalDigits - keepEnd ? digit : "•";
  });
}
