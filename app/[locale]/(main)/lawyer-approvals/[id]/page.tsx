import { Suspense } from "react";
import { http } from "@/lib/http";
import { Lawyer } from "@/types/lawyer-approvals";
import { LoaderPinwheel } from "lucide-react";
import LawyerDetails from "@/components/lawyer-approvals/lawyer-details";

type Params = { id: string };

async function LawyerProfile({ params }: { params: Params }) {
  const { data, ok } = await http.get<{
    user: Lawyer;
  }>(`/api/admin/lawyer-approvals/${params.id}`, {
    next: {
      tags: [`lawyer-approval-${params.id}`],
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch lawyer profile");
  }

  return (
    <div>
      <LawyerDetails lawyer={data.user} />
    </div>
  );
}

export default async function Page({ params }: { params: Promise<Params> }) {
  return (
    <Suspense
      fallback={
        <div className="p-4">
          <LoaderPinwheel className="animate-spin text-secondary" />
        </div>
      }
    >
      <LawyerProfile params={await params} />
    </Suspense>
  );
}
