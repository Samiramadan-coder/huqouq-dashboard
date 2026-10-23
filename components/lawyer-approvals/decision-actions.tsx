"use client";

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState, useTransition } from "react";
import { CheckCircle, CircleX, Lock } from "lucide-react";
import { approveProfile, rejectProfile } from "@/lib/lawyer-approvals";
import { ApprovalStatus, ReviewActionResult } from "@/types/lawyer-approvals";

type Decision = "approve" | "reject";

const decisions: Record<
  Decision,
  {
    request: (lawyerId: number) => Promise<ReviewActionResult>;
    redirectStatus: ApprovalStatus;
    labelKey: string;
    titleKey: string;
    descriptionKey: string;
    successKey: string;
    failureKey: string;
  }
> = {
  reject: {
    request: rejectProfile,
    redirectStatus: "rejected",
    labelKey: "reject",
    titleKey: "confirmRejectTitle",
    descriptionKey: "confirmRejectDescription",
    successKey: "profileRejected",
    failureKey: "profileRejectFailed",
  },
  approve: {
    request: approveProfile,
    redirectStatus: "approved",
    labelKey: "approve",
    titleKey: "confirmApproveTitle",
    descriptionKey: "confirmApproveDescription",
    successKey: "profileApproved",
    failureKey: "profileApproveFailed",
  },
};

// Final approve / reject buttons. Each decision is confirmed in a dialog and only
// one can run at a time.
export default function DecisionActions({
  lawyerId,
  allReviewed,
  hasFlagged,
}: {
  lawyerId: number;
  allReviewed: boolean;
  hasFlagged: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("LawyerApprovals");
  const [openDecision, setOpenDecision] = useState<Decision | null>(null);
  const [isPending, startTransition] = useTransition();

  function confirm(decision: Decision) {
    const config = decisions[decision];

    startTransition(async () => {
      try {
        const result = await config.request(lawyerId);

        if (!result.success) {
          toast.error(
            t(result.error === "forbidden" ? "actionForbidden" : config.failureKey),
          );
          return;
        }

        toast.success(t(config.successKey));
        setOpenDecision(null);
        router.replace(`/lawyer-approvals?status=${config.redirectStatus}`);
      } catch {
        toast.error(t(config.failureKey));
      }
    });
  }

  return (
    <div className="p-4 sm:p-6 bg-white flex justify-end border-t border-gray-200 gap-4">
      <DecisionDialog
        decision="reject"
        open={openDecision === "reject"}
        onOpenChange={(open) => setOpenDecision(open ? "reject" : null)}
        onConfirm={() => confirm("reject")}
        disabled={isPending || !allReviewed || !hasFlagged}
        isPending={isPending}
        className="bg-red-50 border-red-200 text-red-600 text-[13px] h-10 hover:bg-red-100 hover:text-red-700"
        icon={<CircleX className="size-3" />}
      />

      <DecisionDialog
        decision="approve"
        open={openDecision === "approve"}
        onOpenChange={(open) => setOpenDecision(open ? "approve" : null)}
        onConfirm={() => confirm("approve")}
        disabled={isPending || !allReviewed || hasFlagged}
        isPending={isPending}
        className="bg-green-50 border-green-200 text-green-600 text-[13px] h-10 hover:bg-green-100 hover:text-green-700"
        icon={<CheckCircle className="size-3" />}
      />
    </div>
  );
}

// Trigger button plus confirmation dialog for one final decision.
function DecisionDialog({
  decision,
  open,
  onOpenChange,
  onConfirm,
  disabled,
  isPending,
  className,
  icon,
}: {
  decision: Decision;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  disabled: boolean;
  isPending: boolean;
  className: string;
  icon: React.ReactNode;
}) {
  const t = useTranslations("LawyerApprovals");
  const tCommon = useTranslations("Common");
  const config = decisions[decision];

  return (
    <Dialog
      open={open}
      // Keep the dialog open while the request is in flight.
      onOpenChange={(next) => {
        if (!isPending) onOpenChange(next);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled} className={className}>
          {isPending && open && <Spinner className="size-3" />}
          <Lock className="size-3" />
          {icon}
          {t(config.labelKey)}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t(config.titleKey)}</DialogTitle>
          <DialogDescription>{t(config.descriptionKey)}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              {tCommon("Cancel")}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={decision === "reject" ? "destructive" : "default"}
            disabled={isPending}
            aria-busy={isPending}
            onClick={onConfirm}
          >
            {isPending && <Spinner className="size-3" />}
            {tCommon("Confirmation")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
