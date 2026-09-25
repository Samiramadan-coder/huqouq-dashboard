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
import { useRef, useState } from "react";
import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { approveLegalService } from "@/lib/legal-services-approvals";

export default function ApproveLegalService({
  serviceId,
  disabled,
}: {
  serviceId: number;
  disabled: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const t = useTranslations("LegalServicesApprovals.Details");
  const closeBtn = useRef<HTMLButtonElement | null>(null);

  async function handleApprove() {
    setLoading(true);
    const result = await approveLegalService(serviceId);
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
          className="bg-emerald-600 hover:bg-emerald-700 hover:text-white text-white font-semibold h-11 flex-1"
          disabled={disabled}
        >
          {loading ? <Spinner /> : <CircleCheck className="size-3" />}
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
            <Button type="button" className="hidden" ref={closeBtn}></Button>
          </DialogClose>

          <Button
            type="button"
            className="bg-emerald-600 hover:bg-emerald-700 hover:text-white text-white font-semibold h-9"
            onClick={handleApprove}
          >
            {loading && <Spinner />}
            {t("approve")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
