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
import z from "zod";
import { useRef } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { T } from "@/types/shared";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { rejectCase } from "@/lib/cases-approvals";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";

const rejectSchema = (t: T) =>
  z.object({
    reason: z.string().min(1, t("reason_required")),
  });

type RejectFormData = z.infer<ReturnType<typeof rejectSchema>>;

export default function RejectBtn({ caseId }: { caseId: number }) {
  const router = useRouter();
  const t = useTranslations("CaseApprovals.Details");
  const closeBtn = useRef<HTMLButtonElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RejectFormData>({
    defaultValues: { reason: "" },
    resolver: zodResolver(rejectSchema(t)),
  });

  const handleReject: SubmitHandler<RejectFormData> = async (data) => {
    const result = await rejectCase(caseId, data.reason);

    if (result.success) {
      toast.success(t("reject_success"));
      closeBtn.current?.click();
      router.back();
    } else {
      toast.error(t("reject_failure"));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-transparent text-red-700 border-red-200 h-11"
        >
          {isSubmitting ? <Spinner /> : <X className="size-3" />}
          {t("reject")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("rejectTitle")}</DialogTitle>
          <DialogDescription>{t("rejectDescription")}</DialogDescription>
        </DialogHeader>

        <div>
          <NormalFormTextarea
            register={register}
            name="reason"
            required
            errors={errors}
          />
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" className="bg-secondary h-9" ref={closeBtn}>
              {t("cancel")}
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              type="submit"
              className="bg-destructive h-9"
              disabled={isSubmitting}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(handleReject)();
              }}
            >
              {isSubmitting ? <Spinner /> : t("reject")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
