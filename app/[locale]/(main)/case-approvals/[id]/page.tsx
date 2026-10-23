import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import { http, HttpError } from "@/lib/http";
import { getTranslations } from "next-intl/server";
import { CaseApprovalResponse } from "@/types/case-approvals";
import UrgencyBadge from "@/components/reusable/urgency-label";
import CaseDetailsPreview from "@/components/case-approvals/case-details-preview";

type Params = {
  id: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return { title: t("caseApprovalDetails") };
}

async function getCaseApproval(id: string) {
  try {
    const { data } = await http.get<CaseApprovalResponse>(
      `/api/admin/case-approvals/${id}`,
      {
        next: { tags: [`case-approval-${id}`] },
      },
    );

    return data.data;
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) notFound();
    throw error;
  }
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  // Only numeric ids may reach the admin API URL.
  if (!/^\d+$/.test(id)) notFound();

  const t = await getTranslations("CaseApprovals.Details");
  const caseDetails = await getCaseApproval(id);

  return (
    <div>
      <div className="p-4 sm:p-6 bg-white border-b border-gray-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/case-approvals" className="flex items-center gap-3">
            <ChevronLeft className="rtl:rotate-180 size-4" />
            <p className="text-[13px] text-gray-500">{t("backToPending")}</p>
          </Link>
          <span aria-hidden className="text-gray-200 text-lg">
            /
          </span>
          <h1 className="text-[13px] font-semibold text-gray-800 line-clamp-1">
            {caseDetails.title}
          </h1>
        </div>

        <UrgencyBadge
          urgency={caseDetails.urgency}
          urgency_label={caseDetails.urgency_label}
        />
      </div>

      <div className="px-4 pt-4 sm:px-6 sm:pt-6 min-h-[calc(100vh-124px)] flex flex-col justify-between">
        <CaseDetailsPreview caseDetails={caseDetails} />
      </div>
    </div>
  );
}
