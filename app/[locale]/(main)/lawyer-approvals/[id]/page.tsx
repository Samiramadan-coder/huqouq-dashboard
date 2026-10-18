import { http } from "@/lib/http";
import { Lawyer } from "@/types/lawyer-approvals";
import LawyerDetails from "@/components/lawyer-approvals/lawyer-details";

type Params = { id: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  const { data } = await http.get<{
    user: Lawyer;
  }>(`/api/admin/lawyer-approvals/${id}`, {
    next: {
      tags: [`lawyer-approval-${id}`],
    },
  });

  return (
    <div>
      <LawyerDetails lawyer={data.user} />
    </div>
  );
}
