import { getFormatter, getLocale } from "next-intl/server";
import { withLocaleDigits } from "./format";

// Async server component counterpart of useAppFormatter.
export async function getAppFormatter() {
  const [format, locale] = await Promise.all([getFormatter(), getLocale()]);
  return withLocaleDigits(format, locale);
}
