import { TriangleAlert } from "lucide-react";

export default function PayoutDetailsMissing() {
  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
      <TriangleAlert className="text-amber-600 mt-0.5 shrink-0" />
      <div>
        <p className="text-[13px] font-semibold text-amber-800">
          Payout details missing
        </p>
        <p className="text-[12px] text-amber-700 mt-0.5">
          One or more lawyers have funds ready for payout but have not provided
          bank details. Contact them or check their profile to resolve.
        </p>
      </div>
    </div>
  );
}
