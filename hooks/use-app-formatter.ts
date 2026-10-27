import { useFormatter, useLocale } from "next-intl";
import { withLocaleDigits } from "@/lib/format";

// next-intl's formatter with the locale's digits (Arabic-Indic in Arabic).
// Works in client and non-async server components.
export function useAppFormatter() {
  return withLocaleDigits(useFormatter(), useLocale());
}
