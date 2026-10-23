"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { approveLegalService } from "@/lib/legal-services-approvals";

// Approve button with a confirmation dialog that stays open, and cannot be
// dismissed, while the approval is in flight.
export default function ApproveLegalService({
  serviceId,
  disabled,
  onPendingChange,
  onApproved,
}: {
  serviceId: number;
  disabled: boolean;
  onPendingChange: (pending: boolean) => void;
  onApproved: () => void;
}) {
  const t = useTranslations("LegalServicesApprovals.Details");
  const tCommon = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    onPendingChange(true);
    startTransition(async () => {
      try {
        const result = await approveLegalService(serviceId);

        if (result.success) {
          toast.success(result.message || t("approve_success"));
          setOpen(false);
          onApproved();
          return;
        }

        toast.error(
          t(result.error === "forbidden" ? "actionForbidden" : "approve_failure"),
        );
      } catch {
        toast.error(t("approve_failure"));
      } finally {
        onPendingChange(false);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-emerald-600 hover:bg-emerald-700 hover:text-white text-white font-semibold h-11 flex-1"
          disabled={disabled}
        >
          {isPending ? <Spinner /> : <CircleCheck className="size-3" />}
          {t("approve")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("approveTitle")}</DialogTitle>
          <DialogDescription>{t("approveDescription")}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              {tCommon("Cancel")}
            </Button>
          </DialogClose>

          <Button
            type="button"
            className="bg-emerald-600 hover:bg-emerald-700 hover:text-white text-white font-semibold h-9"
            disabled={isPending}
            aria-busy={isPending}
            onClick={handleApprove}
          >
            {isPending && <Spinner />}
            {t("approve")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
