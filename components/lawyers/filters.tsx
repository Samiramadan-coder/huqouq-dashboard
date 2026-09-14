import { getTranslations } from "next-intl/server";
import QuerySearch from "../reusable/query-search";
import QuerySelect from "../reusable/query-select";

export default async function Filters() {
  const t = await getTranslations("Lawyers.filters");

  return (
    <div className="flex items-center gap-2">
      <QuerySearch placeholder={t("searchPlaceholder")} className="max-w-sm" />
      <QuerySelect
        placeholder={t("allStatus")}
        className="max-w-xs"
        options={[]}
      />
      <QuerySelect
        placeholder={t("allSpecializations")}
        className="max-w-xs"
        options={[]}
      />
    </div>
  );
}
