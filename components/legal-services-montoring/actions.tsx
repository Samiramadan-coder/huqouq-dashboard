import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { LegalServiceDetails } from "@/types/legal-services-montoring";
import { CalendarClock, CircleCheck, Send, Timer, Undo2 } from "lucide-react";

type ActionKey = keyof LegalServiceDetails["actions"];
const actions = [
  {
    key: "checkin",
    Icon: Send,
    labelKey: "checkin",
  },
  {
    key: "extend_deadline",
    Icon: CalendarClock,
    labelKey: "extendDeadline",
  },
  {
    key: "extend_review",
    Icon: Timer,
    labelKey: "extendReview",
  },
  {
    key: "approve_on_behalf",
    Icon: CircleCheck,
    labelKey: "approveOnBehalf",
  },
  {
    key: "cancel_refund",
    Icon: Undo2,
    labelKey: "cancelRefund",
  },
] as const satisfies readonly {
  key: ActionKey;
  Icon: typeof Send;
  labelKey: string;
}[];

export default function Actions({
  serviceActions,
}: {
  serviceActions: LegalServiceDetails["actions"];
}) {
  const t = useTranslations("LegalServicesMonitoring.Details");

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(({ key, Icon, labelKey }) => {
        const action = serviceActions[key];
        const isDestructive = key === "cancel_refund";

        return (
          <Button
            key={key}
            variant="outline"
            disabled={!action.available}
            title={action.available ? undefined : action.reason}
            className={cn(
              "h-9 rounded-md text-[13px] font-medium",
              isDestructive &&
                "border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800",
            )}
          >
            <Icon className="size-3.5" />
            {t(`Actions.${labelKey}`)}
          </Button>
        );
      })}
    </div>
  );
}
