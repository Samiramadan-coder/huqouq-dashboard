import { Suspense } from "react";
import { http } from "@/lib/http";
import { Spinner } from "@/components/ui/spinner";

async function ListOfCases() {
  const { data, ok } = await http.get("/api/admin/case-monitoring");

  if (!ok) {
    throw new Error("Failed to fetch data");
  }

  console.log(data);
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
