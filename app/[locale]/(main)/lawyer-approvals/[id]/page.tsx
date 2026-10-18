import type { Metadata } from "next";
import { http } from "@/lib/http";
import { Lawyer } from "@/types/lawyer-approvals";
import LawyerDetails from "@/components/lawyer-approvals/lawyer-details";
import { getTranslations } from "next-intl/server";

type Params = { id: string };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("lawyerApprovalDetails") };
}

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
