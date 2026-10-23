"use client";

import { useState } from "react";
import { Popover } from "radix-ui";
import { groupIban } from "./format";
import { Spinner } from "../ui/spinner";
import { useTranslations } from "next-intl";
import { getPayoutAccount } from "@/lib/payout";

type Account =
  | { status: "masked" }
  | { status: "loading" }
  | { status: "error"; error: "not_found" | "forbidden" | "failed" }
  | { status: "revealed"; iban: string; accountName: string | null };

const errorKeys = {
  not_found: "accountNotFound",
  forbidden: "accountForbidden",
  failed: "accountLoadFailed",
} as const;

// Shows a lawyer's masked IBAN. The full IBAN and account name are only
// fetched when the admin asks for them, and are dropped again on close.
export default function BankDetails({
  lawyerId,
  lawyerName,
  maskedIban,
}: {
  lawyerId: number;
  lawyerName: string;
  maskedIban: string;
}) {
  const t = useTranslations("Payouts.byLawyer");
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState<Account>({ status: "masked" });

  async function reveal() {
    setAccount({ status: "loading" });
    try {
      const result = await getPayoutAccount(lawyerId);
      setAccount(
        result.success
          ? {
              status: "revealed",
              iban: result.iban,
              accountName: result.accountName,
            }
          : { status: "error", error: result.error },
      );
    } catch {
      setAccount({ status: "error", error: "failed" });
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setAccount({ status: "masked" });
  }

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger
        aria-label={t("viewBankDetails", { name: lawyerName })}
        className="text-[12px] text-gray-800 underline underline-offset-2 cursor-pointer"
      >
        {t("view")}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          aria-label={t("bankDetails")}
          className="z-50 w-56 rounded-lg border border-gray-100 bg-white p-4 shadow-lg"
        >
          {account.status === "revealed" && account.accountName && (
            <div className="mb-3">
              <p className="text-[10px] uppercase text-gray-400">
                {t("accountName")}
              </p>
              <p className="text-[13px] text-gray-800">{account.accountName}</p>
            </div>
          )}

          <p className="text-[10px] uppercase text-gray-400">{t("iban")}</p>
          <p
            dir="ltr"
            className="font-mono text-[13px] text-gray-800 break-all text-start"
          >
            {account.status === "revealed"
              ? groupIban(account.iban)
              : maskedIban}
          </p>

          {account.status === "error" && (
            <p role="alert" className="mt-2 text-[11px] text-destructive">
              {t(errorKeys[account.error])}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between gap-2">
            {account.status !== "revealed" && (
              <button
                type="button"
                onClick={reveal}
                disabled={account.status === "loading"}
                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer disabled:opacity-50"
              >
                {account.status === "loading" && <Spinner className="size-3" />}
                {t("showFullIban")}
              </button>
            )}

            <Popover.Close className="ms-auto text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer">
              {t("close")}
            </Popover.Close>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
