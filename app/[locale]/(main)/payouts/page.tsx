import { http } from "@/lib/http";
import { TriangleAlert } from "lucide-react";
import type { Summary } from "@/types/payouts";
import Stats from "@/components/payouts/stats";

export default async function Page() {
  const { data: allTransactions } = await http.get(
    "/api/admin/payouts/transactions",
  );

  const { data: lawyerTransactions } = await http.get<{
    summary: Summary;
    payout_details_missing: boolean;
  }>("/api/admin/payouts");

  console.log(lawyerTransactions);
  return (
    <div className="p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-[22px] font-bold text-primary tracking-tight">
          Payouts
        </h1>
        <p className="text-[13px] text-gray-500 mt-0.5">
          Track lawyer earnings and process manual payouts for completed
          consultations and emergency calls.
        </p>
      </div>

      <Stats stats={lawyerTransactions.summary} />

      {lawyerTransactions.payout_details_missing && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <TriangleAlert className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-semibold text-amber-800">
              Payout details missing
            </p>
            <p className="text-[12px] text-amber-700 mt-0.5">
              One or more lawyers have funds ready for payout but have not
              provided bank details. Contact them or check their profile to
              resolve.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
