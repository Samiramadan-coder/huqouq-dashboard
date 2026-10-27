import { Button } from "../ui/button";
import CancelRefund from "./cancel-refund";
import { useTranslations } from "next-intl";
import { LegalServiceDetails } from "@/types/legal-services-montoring";
import { CalendarClock, CircleCheck, Send, Timer } from "lucide-react";

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
] as const satisfies readonly {
  key: ActionKey;
  Icon: typeof Send;
  labelKey: string;
}[];

export default function Actions({
  service,
  onChanged,
}: {
  service: LegalServiceDetails;
  onChanged: () => void;
}) {
  const t = useTranslations("LegalServicesMonitoring.Details");
  const cancelRefund = service.actions.cancel_refund;

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(({ key, Icon, labelKey }) => {
        const action = service.actions[key];

        return (
          <Button
            key={key}
            variant="outline"
            disabled={!action.available}
            title={action.available ? undefined : action.reason}
            className="h-9 rounded-md text-[13px] font-medium"
          >
            <Icon className="size-3.5" />
            {t(`Actions.${labelKey}`)}
          </Button>
        );
      })}

      <CancelRefund
        service={service}
        disabled={!cancelRefund.available}
        title={cancelRefund.available ? undefined : cancelRefund.reason}
        onSuccess={onChanged}
      />
    </div>
  );
}
