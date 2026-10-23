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
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useTranslations } from "next-intl";

// Approve button with a confirmation dialog. The dialog stays open, and cannot
// be dismissed, while the approval is in flight.
export default function ApproveBtn({
  open,
  onOpenChange,
  onConfirm,
  disabled,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  disabled: boolean;
  isPending: boolean;
}) {
  const t = useTranslations("CaseApprovals.Details");

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) onOpenChange(next);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent text-emerald-700 border-emerald-200 h-11"
          disabled={disabled}
        >
          {isPending && open ? <Spinner /> : <Check className="size-3" />}
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
            <Button
              type="button"
              className="bg-secondary h-9"
              disabled={isPending}
            >
              {t("cancel")}
            </Button>
          </DialogClose>

          <Button
            type="button"
            className="bg-secondary h-9"
            disabled={isPending}
            aria-busy={isPending}
            onClick={onConfirm}
          >
            {isPending && <Spinner />}
            {t("approve")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
