import { Suspense } from "react";
import { http } from "@/lib/http";
import { Link } from "@/i18n/navigation";
import { ChevronLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Lawyer } from "@/types/lawyer-approvals";
import { getTranslations } from "next-intl/server";
import LawyerDetails from "@/components/lawyer-approvals/lawyer-details";

type Params = { id: string };

async function LawyerProfile({ params }: { params: Params }) {
  const t = await getTranslations("LawyerApprovals");

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
      <div className="p-4 sm:p-6 bg-white border-b border-gray-200">
        <Link href="/lawyer-approvals" className="flex items-center gap-3">
          <ChevronLeft className="rtl:rotate-180 size-4" />
          <p className="text-[13px] text-gray-500">{t("backToPending")}</p>
        </Link>
      </div>

      <LawyerDetails lawyer={data.user} />
    </div>
  );
}

export default async function Page({ params }: { params: Promise<Params> }) {
  return (
    <Suspense
      fallback={<Spinner className="h-10 w-10 text-primary m-4 sm:m-6" />}
    >
      <LawyerProfile params={await params} />
    </Suspense>
  );
}
