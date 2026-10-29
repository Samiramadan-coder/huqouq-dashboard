import { useTranslations } from "next-intl";
import { DATE_TIME_FORMAT } from "@/lib/format";
import { useAppFormatter } from "@/hooks/use-app-formatter";
import { Section } from "../legal-services-montoring/section";
import { ConsultationDetailsType } from "@/types/consultation-monitoring";

export default function NotesContent({
  notes,
}: {
  notes: ConsultationDetailsType["notes"];
}) {
  const t = useTranslations("ConsultationMonitoring.Details.Notes");
  const format = useAppFormatter();

  return (
    <Section title={t("title", { count: format.number(notes.length) })}>
      {notes.length ? (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded-lg bg-gray-50 px-3 py-2.5">
              <p className="whitespace-pre-line text-[13px] text-gray-700">
                {note.body}
              </p>
              <p className="mt-1.5 text-[11px] text-gray-400">
                {note.author} ·{" "}
                {format.dateTime(new Date(note.created_at), DATE_TIME_FORMAT)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-gray-400">{t("noNotes")}</p>
      )}
    </Section>
  );
}
