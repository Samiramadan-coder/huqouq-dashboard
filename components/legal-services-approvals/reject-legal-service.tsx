"use client";

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
} from "../ui/dialog";
import z from "zod";
import { toast } from "sonner";
import { useRef } from "react";
import { T } from "@/types/shared";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { CircleX } from "lucide-react";
import { useTranslations } from "next-intl";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { rejectLegalService } from "@/lib/legal-services-approvals";

const rejectSchema = (t: T) =>
  z.object({
    reason: z
      .string()
      .min(10, t("reasonMinLength"))
      .max(400, t("reasonMaxLength")),
  });

export type RejectFormValues = z.infer<ReturnType<typeof rejectSchema>>;

export default function RejectLegalService({
  serviceId,
}: {
  serviceId: number;
}) {
  const t = useTranslations("LegalServicesApprovals.Details");
  const closeBtn = useRef<HTMLButtonElement>(null);

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RejectFormValues>({
    resolver: zodResolver(rejectSchema(t)),
    defaultValues: { reason: "" },
  });

  const onSubmit: SubmitHandler<RejectFormValues> = async (data) => {
    const result = await rejectLegalService(data, serviceId);

    if (result.success) {
      toast.success(result.message);
      closeBtn.current?.click();
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        toast.error(message);
        setError(field as keyof RejectFormValues, {
          type: "server",
          message,
        });
      });
      return;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 font-normal text-[13px] h-11 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4"
        >
          <CircleX />
          {t("reject")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md ring-0!">
        <DialogHeader>
          <DialogTitle>{t("rejectTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(onSubmit)(e)} className="space-y-4">
          <NormalFormTextarea<RejectFormValues>
            register={register}
            name="reason"
            required
            errors={errors}
            textareaClassName="bg-white border-primary/10 placeholder:text-primary/40 placeholder:text-xs"
          />

          <div className="flex gap-4">
            <DialogClose asChild ref={closeBtn}>
              <Button
                variant="outline"
                type="button"
                className="hidden"
              ></Button>
            </DialogClose>

            <div className="flex justify-end w-full">
              <Button
                className="font-normal text-[13px] h-11 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting && <Spinner />}
                <CircleX className="size-4" />
                {t("reject")}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
