"use client";

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "../ui/dialog";
import z from "zod";
import { toast } from "sonner";
import { T } from "@/types/shared";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useTranslations } from "next-intl";
import NormalFormTextarea from "../form/textarea";
import { MessageSquare, Send } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { sendCheckInMessage } from "@/lib/case-monitoring";
import { useRef } from "react";

const messageSchema = (t: T) =>
  z.object({
    body: z
      .string()
      .min(10, t("messageMinLength"))
      .max(400, t("messageMaxLength")),
  });

export type MessageFormValues = z.infer<ReturnType<typeof messageSchema>>;

export default function SendCheckInMessage({ caseId }: { caseId: number }) {
  const t = useTranslations("CaseMonitoring");
  const closeBtn = useRef<HTMLButtonElement>(null);

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema(t)),
    defaultValues: { body: "" },
  });

  const onSubmit: SubmitHandler<MessageFormValues> = async (data) => {
    const result = await sendCheckInMessage(data, caseId);

    if (result.success) {
      toast.success(result.message);
      closeBtn.current?.click();
      return;
    }

    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => {
        if (!message) return;
        toast.error(message);
        setError(field as keyof MessageFormValues, {
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
        <Button className="font-normal text-[13px] h-9 bg-secondary px-4">
          <MessageSquare />
          {t("sendCheckInMessage")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md ring-0!">
        <DialogHeader>
          <DialogTitle>{t("sendCheckInMessage")}</DialogTitle>
          <DialogDescription className="mt-2">
            <span className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Send className="text-blue-500 shrink-0 size-4" />
              <span className="text-[12px] text-blue-700">
                {t("checkInMessageDescription")}
              </span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(onSubmit)(e)} className="space-y-4">
          <NormalFormTextarea<MessageFormValues>
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
              {t("sendCheckInMessage")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
