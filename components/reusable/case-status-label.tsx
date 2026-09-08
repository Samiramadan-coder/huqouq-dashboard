"use client";

import { CaseStatus } from "@/types/case-approvals";
import { Badge } from "../ui/badge";
import { CircleCheck, CircleX } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CaseStatusLabel({ status }: { status: CaseStatus }) {
  const t = useTranslations("CaseApprovals");

  switch (status) {
    case "published":
      return (
        <Badge className="bg-green-50 text-green-700 border border-green-200 text-[11px]">
          <CircleCheck className="size-3" />
          {t(status)}
        </Badge>
      );
    case "in_progress":
      return (
        <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px]">
          {t(status)}
        </Badge>
      );
    case "pending_fees":
      return (
        <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-[11px]">
          {t(status)}
        </Badge>
      );
    case "pending_closure":
      return (
        <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-[11px]">
          {t(status)}
        </Badge>
      );
    case "closed":
      return (
        <Badge className="bg-gray-50 text-gray-700 border border-gray-200 text-[11px]">
          {t(status)}
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-50 text-red-600 border border-red-200 text-[11px]">
          <CircleX className="size-3" />
          {t("rejected")}
        </Badge>
      );
  }
  return <div>CaseStatus</div>;
}
