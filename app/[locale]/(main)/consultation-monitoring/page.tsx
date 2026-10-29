import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { SummaryType } from "@/types/consultation-monitoring";
import Summary from "@/components/consultation-monitoring/summary";

export async function generateMetadata() {
  return {
    title: "Consultation Monitoring",
  };
}

type SearchParams = {
  page?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page } = await searchParams;

  const { data } = await http.get<{
    summary: SummaryType;
    meta: Pagination;
  }>("/api/admin/consultations", {
    params: {
      page: page ?? "1",
    },
    next: {
      tags: ["consultation-monitoring"],
    },
  });
  console.log(data);
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <p className="text-[13px] text-gray-500 max-w-2xl">
        Follow every booked voice and video consultation, from payment to
        payout, and decide on problems reported by clients.
      </p>

      <Summary summary={data.summary} />
    </div>
  );
}
