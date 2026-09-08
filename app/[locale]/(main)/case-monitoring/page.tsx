import { Suspense } from "react";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { Spinner } from "@/components/ui/spinner";
import { CaseMonitoring, Counts } from "@/types/case-monitoring";

async function ListOfCases() {
  const { data, ok } = await http.get<{
    counts: Counts;
    data: CaseMonitoring[];
    meta: Pagination;
  }>("/api/admin/case-monitoring");

  if (!ok) {
    throw new Error("Failed to fetch data");
  }

  console.log(data.counts);
  return <></>;
}

export default function Page() {
  return (
    <Suspense
      fallback={<Spinner className="h-10 w-10 text-primary m-4 sm:m-4" />}
    >
      <ListOfCases />
    </Suspense>
  );
}
