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
import { Flag, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { flagForDisputeReview } from "@/lib/case-monitoring";

const flagSchema = (t: T) =>
  z.object({
    body: z
      .string()
      .min(10, t("messageMinLength"))
      .max(400, t("messageMaxLength")),
  });

export type FlagFormValues = z.infer<ReturnType<typeof flagSchema>>;

export default function FlagForDisputeReview({ caseId }: { caseId: number }) {
  const t = useTranslations("CaseMonitoring");
  const closeBtn = useRef<HTMLButtonElement>(null);

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FlagFormValues>({
    resolver: zodResolver(flagSchema(t)),
    defaultValues: { body: "" },
  });

  const onSubmit: SubmitHandler<FlagFormValues> = async (data) => {
    const result = await flagForDisputeReview(data, caseId);

    if (result.success) {
      toast.success(result.message);
      closeBtn.current?.click();
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        toast.error(message);
        setError(field as keyof FlagFormValues, {
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
          className="font-normal text-[13px] h-9 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4"
        >
          <Flag />
          {t("flagForDisputeReview")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md ring-0!">
        <DialogHeader>
          <DialogTitle>{t("flagForDisputeReview")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(onSubmit)(e)} className="space-y-4">
          <NormalFormTextarea<FlagFormValues>
            register={register}
            name="body"
            required
            errors={errors}
            textareaClassName="bg-white border-primary/10 placeholder:text-primary/40 placeholder:text-xs"
          />

          <div className="flex gap-4">
            <DialogClose asChild ref={closeBtn}>
              <Button variant="outline" type="button" className="flex-1 h-10">
                {t("cancel")}
              </Button>
            </DialogClose>

            <Button
              className="flex-1 bg-secondary h-10"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner />}
              <Send className="size-4" />
              {t("flagForDisputeReview")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
