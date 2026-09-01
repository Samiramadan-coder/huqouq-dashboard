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
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { approveCase } from "@/lib/cases-approvals";

export default function ApproveBtn({ caseId }: { caseId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("CaseApprovals.Details");
  const closeBtn = useRef<HTMLButtonElement | null>(null);

  async function handleApprove() {
    setLoading(true);

    const result = await approveCase(caseId);

    if (result.success) {
      toast.success(t("approve_success"));
      closeBtn.current?.click();
      router.back();
    } else {
      toast.error(t("approve_failure"));
    }

    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent text-emerald-700 border-emerald-200 h-11"
        >
          {loading ? <Spinner /> : <Check className="size-3" />}
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
            <Button type="button" className="bg-secondary h-9" ref={closeBtn}>
              {t("cancel")}
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              type="button"
              className="bg-secondary h-9"
              onClick={handleApprove}
            >
              {t("approve")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
