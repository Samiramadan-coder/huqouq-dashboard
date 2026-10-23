import { useTranslations } from "next-intl";
import { HistoryItem } from "@/types/lawyers";
import HistoryList from "../people-directory/history-list";

export default function LawyerHistory({ history }: { history: HistoryItem[] }) {
  const t = useTranslations("Lawyers.History");

  return (
    <HistoryList
      title={t("Title")}
      history={history}
      positiveStatus="accepted"
      typeClassNames={{
        case: "border-blue-200 bg-blue-50 text-blue-700",
        offer: "border-secondary/15 bg-secondary/8 text-secondary",
      }}
    />
  );
}
