import { Suspense } from "react";
import { LoaderPinwheel } from "lucide-react";
import { http } from "@/lib/http";
import { Counts } from "@/types/legal-services-approvals";
import { Pagination } from "@/types/shared";
import Stats from "@/components/legal-services-approvals/stats";

type SearchParams = {
  page?: string;
  tab?: string;
};

async function ListOfLegalServices({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, tab } = await searchParams;

  const { data, ok } = await http.get<{
    counts: Counts;
    meta: Pagination;
    urgent_count: number;
  }>("/api/admin/legal-service-approvals", {
    params: {
      page: page || "1",
      tab: tab || "",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch data");
  }

  console.log("Legal Services Approvals Data:", data);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Stats counts={data.counts} urgentCount={data.urgent_count} />
    </div>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-4">
          <LoaderPinwheel className="animate-spin text-secondary" />
        </div>
      }
    >
      <ListOfLegalServices searchParams={searchParams} />
    </Suspense>
  );
}
