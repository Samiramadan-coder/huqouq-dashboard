import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";

import {
  NoteFormValues,
  noteSchema,
  NOTE_REASON_MAX_LENGTH,
  NOTE_REASON_MIN_LENGTH,
} from "@/types/legal-services-montoring";

import { toast } from "sonner";
import { Button } from "../ui/button";
import { addConsultationNote } from "@/lib/consultation-monitoring";
import { Spinner } from "../ui/spinner";
import { useMemo, useState } from "react";
import { NotebookPen } from "lucide-react";
import { useTranslations } from "next-intl";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";

// "Add internal note" button with a dialog; notes are only visible to admins.
export default function AddNote({
  consultationId,
  onSuccess,
}: {
  consultationId: number;
  onSuccess: () => void;
}) {
  const t = useTranslations("ConsultationMonitoring.Details");
  const [open, setOpen] = useState(false);

  const schema = useMemo(() => noteSchema((key) => t(`AddNote.${key}`)), [t]);

  const {
    control,
    register,
    setError,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<NoteFormValues>({
    defaultValues: { body: "" },
    resolver: zodResolver(schema),
  });

  const body = useWatch({ control, name: "body" });

  const onSubmit: SubmitHandler<NoteFormValues> = async (data) => {
    try {
      const result = await addConsultationNote(data, consultationId);

      if (result.success) {
        toast.success(result.message || t("AddNote.success"));
        reset();
        setOpen(false);
        onSuccess();
        return;
      }

      if (result.errors?.body) {
        setError("body", { type: "server", message: result.errors.body });
        return;
      }

      toast.error(
        t(
          result.error === "forbidden"
            ? "AddNote.forbidden"
            : "AddNote.failure",
        ),
      );
    } catch {
      toast.error(t("AddNote.failure"));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isSubmitting) return;
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-9 rounded-md border-gray-200 text-[13px] font-medium text-primary"
        >
          <NotebookPen className="size-3.5" />
          {t("addNote")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg gap-0 p-0">
        <DialogHeader className="gap-1.5 px-5 py-4 border-b border-gray-100">
          <DialogTitle className="text-[15px] font-bold text-primary">
            {t("addNote")}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            {t("AddNote.private")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2 px-5 py-5">
            <label htmlFor="body" className="block text-xs text-gray-700">
              {t("AddNote.label")}{" "}
              <span className="text-red-600">{t("AddNote.required")}</span>
            </label>

            <NormalFormTextarea<NoteFormValues>
              register={register}
              name="body"
              placeholder={t("AddNote.placeholder")}
              disabled={isSubmitting}
              maxLength={NOTE_REASON_MAX_LENGTH}
              textareaClassName="min-h-24 rounded-lg border-gray-200 bg-gray-50/40 text-[13px] placeholder:text-gray-300"
              errors={errors}
            />
          </div>

          <DialogFooter className="m-0 bg-white px-5 py-4 border-t border-gray-100">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="h-10 text-[13px]"
                disabled={isSubmitting}
              >
                {t("AddNote.cancel")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-10 text-[13px]"
              aria-busy={isSubmitting}
              disabled={
                isSubmitting || body.trim().length < NOTE_REASON_MIN_LENGTH
              }
            >
              {isSubmitting && <Spinner />}
              {t("AddNote.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
