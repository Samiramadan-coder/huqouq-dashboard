import z from "zod";
import { T } from "@/types/shared";
import { Lock } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { Spinner } from "../ui/spinner";

const noteSchema = (t: T) =>
  z.object({
    reason: z
      .string()
      .trim()
      .min(1, "Reason Is Required")
      .min(10, "At Leaset 10 Charecter")
      .max(1000, "Max Is 1000"),
  });

export type NoteFormValues = z.infer<ReturnType<typeof noteSchema>>;

export default function Notes({ serviceId }: { serviceId: number }) {
  const t = useTranslations("LegalServicesMonitoring");

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<NoteFormValues>({
    defaultValues: { reason: "" },
    resolver: zodResolver(noteSchema(t)),
  });

  const reason = useWatch({ control: control, name: "reason" });

  const onSubmit: SubmitHandler<NoteFormValues> = async (data) => {
    console.log(data);
  };

  return (
    <form
      className="bg-white border border-gray-200 rounded-xl"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-gray-100">
        <h3 className="text-[13px] font-semibold text-primary">
          Add internal note
        </h3>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-400">
          <Lock />
          Not visible to users
        </span>
      </div>

      <div className="p-5 space-y-4">
        <NormalFormTextarea
          register={register}
          name="reason"
          label="Reason"
          required
          errors={errors}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="text-[13px] h-10"
            disabled={isSubmitting || reason.length < 10}
          >
            {isSubmitting ? <Spinner /> : "Save Note"}
          </Button>
        </div>
      </div>
    </form>
  );
}
