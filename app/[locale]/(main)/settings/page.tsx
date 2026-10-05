import { http } from "@/lib/http";
import { Banknote } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Financial from "@/components/settings/financial";
import { FinancialSettings, FinancialSettingsMeta } from "@/types/settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Page() {
  const t = await getTranslations("Settings");

  const { data, ok } = await http.get<{
    data: FinancialSettings;
    meta: FinancialSettingsMeta;
  }>("/api/admin/settings/financial");

  if (!ok) {
    throw new Error("Failed to fetch financial settings");
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="container max-w-5xl">
        <Tabs defaultValue="financial">
          <TabsList className="h-auto">
            <TabsTrigger
              value="financial"
              className="h-9 px-3 data-[state=active]:bg-white text-[13px]"
            >
              <Banknote />
              {t("financialSettings")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="mt-3">
            <Financial data={data.data} meta={data.meta} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
