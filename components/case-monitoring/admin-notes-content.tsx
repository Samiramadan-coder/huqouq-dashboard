"use client";

import z from "zod";
import { T } from "@/types/shared";
import { Button } from "../ui/button";
import { Save, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";

const adminNotesSchema = (t: T) =>
  z.object({
    notes: z.string().min(10, t("noteMinLength")).max(400, t("noteMaxLength")),
  });

type AdminNotesFormValues = z.infer<ReturnType<typeof adminNotesSchema>>;

export default function AdminNotesContent() {
  const t = useTranslations("CaseMonitoring.AdminNotes");

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<AdminNotesFormValues>({
    resolver: zodResolver(adminNotesSchema(t)),
    defaultValues: {
      notes: "",
    },
  });

  const onSubmit: SubmitHandler<AdminNotesFormValues> = async (data) => {
    console.log("Admin Notes Submitted:", data);
  };

  return (
    <div>
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/10 mb-8">
        <Shield className="size-4 text-primary/80 mt-0.5" />
        <p className="text-[12px] text-primary/80 leading-relaxed">
          {t("noteDescription")}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <NormalFormTextarea<AdminNotesFormValues>
          register={register}
          name="notes"
          required
          errors={errors}
          placeholder={t("notePlaceholder")}
          textareaClassName="bg-white border-primary/10 h-50 placeholder:text-primary/40 placeholder:text-xs"
        />

        <Button type="submit" disabled={isSubmitting} className="px-4 h-10">
          <Save /> {t("saveNote")}
        </Button>
      </form>
    </div>
  );
}
