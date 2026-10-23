import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { http, HttpError } from "@/lib/http";
import { getTranslations } from "next-intl/server";
import { LawyerApprovalResponse } from "@/types/lawyer-approvals";
import LawyerDetails from "@/components/lawyer-approvals/lawyer-details";

type Params = { id: string };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("lawyerApprovalDetails") };
}

async function getLawyerApproval(id: string) {
  try {
    const { data } = await http.get<LawyerApprovalResponse>(
      `/api/admin/lawyer-approvals/${id}`,
      {
        next: {
          tags: [`lawyer-approval-${id}`],
        },
      },
    );

    return data.user;
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) notFound();
    throw error;
  }
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  // Only numeric ids may reach the admin API URL.
  if (!/^\d+$/.test(id)) notFound();

  const lawyer = await getLawyerApproval(id);

  return (
    <div>
      <LawyerDetails lawyer={lawyer} />
    </div>
  );
}
