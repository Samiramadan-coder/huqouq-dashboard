"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import LawyerAvatar from "./lawyer-avatar";
import { useTranslations } from "next-intl";
import { confirmPayout } from "@/lib/payout";
import type { ByLawyerData } from "@/types/payouts";
import { CircleCheck, Download } from "lucide-react";

type Props = {
  byLawyerData: Pick<
    ByLawyerData,
    "lawyer" | "ready" | "iban" | "can_process_payout"
  >;
};

export default function ConfirmPayout({ byLawyerData }: Props) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Payouts.confirmPayout");
  const tByLawyer = useTranslations("Payouts.byLawyer");
  const [paymentReference, setPaymentReference] = useState("");
  const [loading, setLoading] = useState(false);

  const { lawyer, ready, iban } = byLawyerData;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          disabled={!byLawyerData.can_process_payout}
          className="bg-primary text-white text-[12px] font-semibold"
        >
          <Download className="size-3.5" />
          {tByLawyer("processPayout")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md ring-0!">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
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
                {tByLawyer("amount", { value: ready.toLocaleString("en-US") })}
              </p>
            </div>
          </div>

          {iban && (
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">
                {t("payoutAccount")}
              </p>
              <p
                dir="ltr"
                className="text-[13px] font-mono text-gray-700 break-all text-start"
              >
                {iban.replace(/(.{4})/g, "$1 ").trim()}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="payment-reference"
              className="text-xs text-gray-600"
            >
              {t("paymentReference")}
            </label>

            <Input
              id="payment-reference"
              className="h-9 placeholder:text-gray-300"
              placeholder={t("paymentReferencePlaceholder")}
              value={paymentReference}
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
          <Button
            type="button"
            className="bg-secondary h-9 text-[13px] font-normal"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const response = await confirmPayout(lawyer.id, paymentReference);
              setLoading(false);
              if (response.success) {
                toast.success(response.message);
                setOpen(false);
              } else {
                toast.error(t("payoutFailed"));
              }
            }}
          >
            <CircleCheck className="size-3.5" />
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
