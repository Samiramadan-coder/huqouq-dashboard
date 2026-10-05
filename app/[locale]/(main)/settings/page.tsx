import { http } from "@/lib/http";
import Financial from "@/components/settings/financial";
import { FinancialSettings, FinancialSettingsMeta } from "@/types/settings";

export default async function Page() {
  const { data, ok } = await http.get<{
    data: FinancialSettings;
    meta: FinancialSettingsMeta;
  }>("/api/admin/settings/financial");

  if (!ok) {
    throw new Error("Failed to fetch financial settings");
  }

  console.log(data);
  return (
    <div className="p-4 sm:p-6">
      <div className="container max-w-5xl">
        <Financial data={data.data} meta={data.meta} />
      </div>
    </div>
  );
}
