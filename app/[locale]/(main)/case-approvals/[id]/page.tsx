import { Suspense } from "react";
import { http } from "@/lib/http";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { CaseDetails } from "@/types/case-approvals";
import { ChevronLeft, LoaderPinwheel } from "lucide-react";
import CaseDetailsPreview from "@/components/case-approvals/case-details-preview";

type Params = {
  id: string;
};

async function CaseDetailsInfo({ params }: { params: Params }) {
  const t = await getTranslations("CaseApprovals.Details");
  const { id } = params;

  const { data, ok } = await http.get<{ data: CaseDetails }>(
    `/api/admin/case-approvals/${id}`,
    {
      next: { tags: [`case-approval-${id}`] },
    },
  );

  if (!ok) {
    throw new Error("Failed to fetch case approval details");
  }

  return (
    <div>
      <div className="p-4 sm:p-6 bg-white border-b border-gray-200">
        <Link href="/case-approvals" className="flex items-center gap-3">
          <ChevronLeft className="rtl:rotate-180 size-4" />
          <p className="text-[13px] text-gray-500">{t("backToPending")}</p>
        </Link>
      </div>

      <div className="p-4 sm:p-6">
        <CaseDetailsPreview caseDetails={data.data} />
      </div>
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
      <CaseDetailsInfo params={await params} />
    </Suspense>
  );
}
