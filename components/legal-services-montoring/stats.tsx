import { cn } from "@/lib/utils";
import { Summary } from "@/types/legal-services-montoring";
import {
  Activity,
  Banknote,
  Flag,
  RotateCcw,
  Timer,
  TriangleAlert,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

const cards = [
  {
    key: "active",
    Icon: Activity,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    key: "awaiting_approval",
    Icon: Timer,
    iconClassName: "bg-amber-50 text-amber-500",
  },
  {
    key: "revision",
    Icon: RotateCcw,
    iconClassName: "bg-orange-50 text-orange-600",
  },
  {
    key: "dispute",
    Icon: Flag,
    iconClassName: "bg-red-50 text-red-600",
  },
  {
    key: "held_in_escrow",
    Icon: Banknote,
    iconClassName: "bg-emerald-50 text-emerald-600",
  },
  {
    key: "need_attention",
    Icon: TriangleAlert,
    iconClassName: "bg-yellow-100 text-yellow-700",
  },
] as const satisfies readonly {
  key: keyof Summary;
  Icon: typeof Activity;
  iconClassName: string;
}[];

export default function Stats({ summary }: { summary: Summary }) {
  const t = useTranslations("LegalServicesMonitoring.Stats");
  const locale = useLocale();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
      {cards.map(({ key, Icon, iconClassName }) => {
        const value = summary[key].toLocaleString(locale);

        return (
          <div
            key={key}
            className="bg-white rounded-xl border border-gray-200 px-4 py-4 flex items-center gap-3"
          >
            <div
              className={cn(
                "size-9 shrink-0 rounded-lg flex items-center justify-center",
                iconClassName,
              )}
            >
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold leading-tight text-gray-900 truncate">
                {key === "held_in_escrow"
                  ? t("currency", { amount: value })
                  : value}
              </p>
              <p className="text-xs text-gray-500 truncate">{t(key)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
