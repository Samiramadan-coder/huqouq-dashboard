import CaseDetailsPreview from "@/components/case-approvals/case-details-preview";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "@/i18n/navigation";
import { http } from "@/lib/http";
import { CaseDetails } from "@/types/case-approvals";
import { ChevronLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

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
        <Link href="/lawyer-approvals" className="flex items-center gap-3">
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
      fallback={<Spinner className="h-10 w-10 text-primary m-4 sm:m-6" />}
    >
      <CaseDetailsInfo params={await params} />
    </Suspense>
  );
}
