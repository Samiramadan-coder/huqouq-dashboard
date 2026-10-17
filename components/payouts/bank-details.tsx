"use client";

import { useState } from "react";
import { Popover } from "radix-ui";
import { useTranslations } from "next-intl";

export default function BankDetails({
  iban,
  accountName,
}: {
  iban: string;
  accountName: string | null;
}) {
  const t = useTranslations("Payouts.byLawyer");
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className="text-[12px] text-gray-800 underline underline-offset-2 cursor-pointer">
        {t("view")}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          className="z-50 w-56 rounded-lg border border-gray-100 bg-white p-4 shadow-lg"
        >
          {accountName && (
            <div className="mb-3">
              <p className="text-[10px] uppercase text-gray-400">
                {t("accountName")}
              </p>
              <p className="text-[13px] text-gray-800">{accountName}</p>
            </div>
          )}

          <p className="text-[10px] uppercase text-gray-400">{t("iban")}</p>
          <p className="font-mono text-[13px] text-gray-800 break-all">
            {iban.replace(/(.{4})/g, "$1 ").trim()}
          </p>

          <Popover.Close className="mt-3 text-[11px] text-gray-400 hover:text-gray-600 cursor-pointer">
            {t("close")}
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
