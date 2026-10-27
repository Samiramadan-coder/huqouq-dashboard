import { useAppFormatter } from "@/hooks/use-app-formatter";
import { DATE_TIME_FORMAT } from "@/lib/format";
import {
  NoteFormValues,
  noteSchema,
  NOTE_REASON_MAX_LENGTH,
  NOTE_REASON_MIN_LENGTH,
  LegalServiceDetails,
} from "@/types/legal-services-montoring";
import { toast } from "sonner";
import { useMemo } from "react";
import { Lock } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useNow, useTranslations } from "next-intl";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { addLegalServiceNote } from "@/lib/legal-services-monitoring";

// Form for adding an internal note to the service; not visible to users.
export default function Notes({
  serviceId,
  notes,
  onSuccess,
}: {
  serviceId: number;
  notes: LegalServiceDetails["notes"];
  onSuccess: () => void;
}) {
  const t = useTranslations("LegalServicesMonitoring.Details.Notes");
  const format = useAppFormatter();
  const now = useNow({ updateInterval: 60_000 });

  const schema = useMemo(() => noteSchema(t), [t]);

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

  const reason = useWatch({ control, name: "body" });

  const onSubmit: SubmitHandler<NoteFormValues> = async (data) => {
    try {
      const result = await addLegalServiceNote(data, serviceId);

      if (result.success) {
        toast.success(result.message || t("success"));
        reset();
        onSuccess();
        return;
      }

      if (result.errors?.body) {
        setError("body", { type: "server", message: result.errors.body });
        return;
      }

      toast.error(t(result.error === "forbidden" ? "forbidden" : "failure"));
    } catch {
      toast.error(t("failure"));
    }
  };

  return (
    <div className="space-y-4">
      <form
        className="bg-white border border-gray-200 rounded-xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-[13px] font-semibold text-primary">
            {t("title")}
          </h3>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-400">
            <Lock aria-hidden className="size-3" />
            {t("private")}
          </span>
        </div>

        <div className="p-5 space-y-4">
          <NormalFormTextarea<NoteFormValues>
            register={register}
            name="body"
            required
            disabled={isSubmitting}
            maxLength={NOTE_REASON_MAX_LENGTH}
            errors={errors}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="text-[13px] h-10"
              aria-busy={isSubmitting}
              disabled={
                isSubmitting || reason.trim().length < NOTE_REASON_MIN_LENGTH
              }
            >
              {isSubmitting ? <Spinner /> : t("submit")}
            </Button>
          </div>
        </div>
      </form>

      {notes.length ? (
        <ul className="space-y-3">
          {notes.map((note) => {
            const createdAt = new Date(note.created_at);

            return (
              <li
                key={note.id}
                className="rounded-xl border border-amber-100 bg-amber-50/40 px-5 py-4"
              >
                <p className="whitespace-pre-line text-[13px] text-gray-800">
                  {note.body}
                </p>
                <p className="mt-2 text-[11px] text-gray-400">
                  {note.author} ·{" "}
                  {format.dateTime(createdAt, DATE_TIME_FORMAT)} ·{" "}
                  {format.relativeTime(createdAt, now)}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-[13px] text-gray-400">{t("noNotes")}</p>
      )}
    </div>
  );
}
