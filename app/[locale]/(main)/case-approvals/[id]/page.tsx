import CaseDetailsPreview from "@/components/case-approvals/case-details-preview";
import { http } from "@/lib/http";
import { CaseDetails } from "@/types/case-approvals";

type Params = {
  id: string;
};

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  const { data, ok } = await http.get<{ data: CaseDetails }>(
    `/api/admin/case-approvals/${id}`,
  );

  if (!ok) {
    throw new Error("Failed to fetch case approval details");
  }

  console.log(data);

  return (
    <div className="p-4 sm:p-6">
      <CaseDetailsPreview caseDetails={data.data} />
    </div>
  );
}
