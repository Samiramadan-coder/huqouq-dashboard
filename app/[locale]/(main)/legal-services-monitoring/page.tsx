import Stats from "@/components/legal-services-montoring/stats";
import { http } from "@/lib/http";
import { Summary } from "@/types/legal-services-montoring";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Legal Services Monitoring",
  };
}

export default async function Page() {
  const { data } = await http.get<{ summary: Summary }>(
    "/api/admin/legal-services-monitoring",
  );

  console.log(data);
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <Stats summary={data.summary} />
    </div>
  );
}
