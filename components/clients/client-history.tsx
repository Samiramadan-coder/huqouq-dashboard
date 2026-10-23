import { useTranslations } from "next-intl";
import type { HistoryItem } from "@/types/clients";
import HistoryList from "../people-directory/history-list";

export default function ClientHistory({ history }: { history: HistoryItem[] }) {
  const t = useTranslations("Clients.History");

  return (
    <HistoryList
      title={t("Title")}
      history={history}
      positiveStatus="active"
      typeClassNames={{
        case: "border-blue-200 bg-blue-50 text-blue-700",
        consultation: "bg-secondary/20 text-secondary border-secondary/30",
      }}
    />
  );
}
