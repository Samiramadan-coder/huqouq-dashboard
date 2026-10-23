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
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import LawyerAvatar from "./lawyer-avatar";
import { useTranslations } from "next-intl";
import { confirmPayout } from "@/lib/payout";
import type { ByLawyerRow } from "@/types/payouts";
import { CircleCheck, Download } from "lucide-react";

// Confirmation dialog for marking a lawyer's ready balance as paid. It shows
// the recipient and the server-provided amount, and cannot be dismissed or
// resubmitted while the request is in flight.
export default function ConfirmPayout({
  lawyer,
  amount,
  maskedIban,
  canProcess,
}: {
  lawyer: ByLawyerRow["lawyer"];
  // Already formatted on the server from the API's `ready` amount.
  amount: string;
  maskedIban: string | null;
  canProcess: boolean;
}) {
  const t = useTranslations("Payouts.confirmPayout");
  const tByLawyer = useTranslations("Payouts.byLawyer");
  const [open, setOpen] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const [loading, setLoading] = useState(false);

  function handleOpenChange(next: boolean) {
    if (loading) return;
    setOpen(next);
    if (!next) setPaymentReference("");
  }

  async function handleConfirm() {
    if (loading) return;
    setLoading(true);

    try {
      const response = await confirmPayout(lawyer.id, paymentReference);
      if (response.success) {
        toast.success(response.message);
        setOpen(false);
        setPaymentReference("");
      } else {
        toast.error(t("payoutFailed"));
      }
    } catch {
      toast.error(t("payoutFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          disabled={!canProcess}
          title={canProcess ? undefined : tByLawyer("processPayoutUnavailable")}
          aria-label={tByLawyer("processPayoutFor", { name: lawyer.name })}
          className="bg-primary text-white text-[12px] font-semibold"
        >
          <Download aria-hidden className="size-3.5" />
          {tByLawyer("processPayout")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md ring-0!">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("srDescription", { name: lawyer.name, amount })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-secondary/8 border border-secondary/30 rounded-xl p-4 flex items-center gap-3">
            <LawyerAvatar lawyer={lawyer} />

            <div className="min-w-0">
              <p className="text-[13px] text-gray-500">{t("markAsPaidTo")}</p>
              <p className="text-[15px] font-bold text-gray-900 truncate">
                {lawyer.name}
              </p>
            </div>

            <div className="ms-auto text-end shrink-0">
              <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                {t("amount")}
              </p>
              <p className="text-[20px] font-bold text-secondary">
                <bdi>{amount}</bdi>
              </p>
            </div>
          </div>

          {maskedIban && (
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">
                {t("payoutAccount")}
              </p>
              <p
                dir="ltr"
                className="text-[13px] font-mono text-gray-700 break-all text-start"
              >
                {maskedIban}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`payment-reference-${lawyer.id}`}
              className="text-xs text-gray-600"
            >
              {t("paymentReference")}
            </label>

            <Input
              id={`payment-reference-${lawyer.id}`}
              className="h-9 placeholder:text-gray-300"
              placeholder={t("paymentReferencePlaceholder")}
              value={paymentReference}
              disabled={loading}
              onChange={(e) => setPaymentReference(e.target.value)}
            />
          </div>

          <p className="text-[12px] text-gray-500 leading-relaxed">
            {t.rich("notice", {
              name: lawyer.name,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="h-9 text-[13px] font-normal"
              disabled={loading}
            >
              {t("cancel")}
            </Button>
          </DialogClose>

          <Button
            type="button"
            className="bg-secondary h-9 text-[13px] font-normal"
            disabled={loading}
            aria-busy={loading}
            onClick={handleConfirm}
          >
            {loading ? (
              <Spinner className="size-3.5" />
            ) : (
              <CircleCheck aria-hidden className="size-3.5" />
            )}
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
