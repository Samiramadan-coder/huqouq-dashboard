"use client";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetFooter,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from "../ui/sheet";

import {
  Clock,
  Gavel,
  Users,
  Upload,
  Timer,
  Undo2,
  Send,
  History,
  FileText,
  ArrowRight,
  CreditCard,
  CircleCheck,
  CalendarClock,
  ClipboardList,
  MessageSquare,
  TriangleAlert,
  LoaderPinwheel,
  SquarePen,
} from "lucide-react";

import {
  ActionFailure,
  LegalServiceDetails as LegalServiceDetailsType,
} from "@/types/legal-services-montoring";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import StatusBadge from "./status-badge";
import RequestContent from "./request-content";
import OffersContent from "./offers-content";
import PartiesContent from "./parties-content";
import PaymentContent from "./payment-content";
import DeliveriesContent from "./deliveries-content";
import ActivityContent from "./activity-content";
import UrgencyBadge from "../reusable/urgency-label";
import { useFormatter, useTranslations } from "next-intl";
import { DATE_FORMAT, formatMoney } from "@/types/case-monitoring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { getLegalServiceDetails } from "@/lib/legal-services-monitoring";

// The API doesn't send a currency for legal services; fees are always in AED.
const CURRENCY = "AED";

type DetailsState =
  | { status: "loading" }
  | { status: "error"; error: ActionFailure }
  | { status: "ready"; service: LegalServiceDetailsType };

type ActionKey = keyof LegalServiceDetailsType["actions"];

const actions = [
  { key: "checkin", Icon: Send, labelKey: "checkin" },
  { key: "extend_deadline", Icon: CalendarClock, labelKey: "extendDeadline" },
  { key: "extend_review", Icon: Timer, labelKey: "extendReview" },
  {
    key: "approve_on_behalf",
    Icon: CircleCheck,
    labelKey: "approveOnBehalf",
  },
  { key: "cancel_refund", Icon: Undo2, labelKey: "cancelRefund" },
] as const satisfies readonly {
  key: ActionKey;
  Icon: typeof Send;
  labelKey: string;
}[];

const tabs = [
  { value: "request", Icon: ClipboardList },
  { value: "offers", Icon: Gavel },
  { value: "parties", Icon: Users },
  { value: "payment", Icon: CreditCard },
  { value: "timeline", Icon: Clock },
  { value: "deliveries", Icon: Upload },
  { value: "chat", Icon: MessageSquare },
  { value: "notes", Icon: FileText },
  { value: "activity", Icon: History },
] as const;

type TabValue = (typeof tabs)[number]["value"];

// "View" button that opens a sheet with the service details. Details are
// fetched through a server action each time the sheet opens.
export default function LegalServiceDetails({
  reference,
  serviceId,
}: {
  reference: string;
  serviceId: number;
}) {
  const t = useTranslations("LegalServicesMonitoring");
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState<DetailsState>({ status: "loading" });
  // Ignores responses from requests that were superseded or closed.
  const requestId = useRef(0);

  async function loadDetails() {
    const current = ++requestId.current;
    setDetails({ status: "loading" });

    try {
      const result = await getLegalServiceDetails(serviceId);
      if (current !== requestId.current) return;

      console.log(result);

      setDetails(
        result.success
          ? { status: "ready", service: result.data }
          : { status: "error", error: result.error },
      );
    } catch {
      if (current === requestId.current) {
        setDetails({ status: "error", error: "failed" });
      }
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      void loadDetails();
    } else {
      requestId.current++;
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className="rounded-sm text-xs"
          aria-label={t("Table.viewService", { reference })}
        >
          {t("Table.view")}
          <ArrowRight className="size-3 rtl:rotate-180" />
        </Button>
      </SheetTrigger>

      <SheetContent className="data-[side=right]:sm:max-w-3xl gap-0">
        {details.status === "ready" ? (
          <DetailsContent service={details.service} />
        ) : (
          <>
            <SheetHeader className="border-b border-border">
              <SheetTitle className="text-[15px] text-primary font-bold">
                {reference}
              </SheetTitle>
            </SheetHeader>

            {details.status === "loading" ? (
              <div
                className="p-4"
                role="status"
                aria-label={t("Details.loading")}
              >
                <LoaderPinwheel className="animate-spin text-secondary" />
              </div>
            ) : (
              <div role="alert" className="p-4 space-y-3">
                <p className="text-[13px] text-gray-600">
                  {t(
                    details.error === "forbidden"
                      ? "Details.actionForbidden"
                      : "Details.details_failure",
                  )}
                </p>
                {details.error !== "forbidden" && (
                  <Button variant="outline" onClick={() => void loadDetails()}>
                    {t("Details.retry")}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DetailsContent({ service }: { service: LegalServiceDetailsType }) {
  const t = useTranslations("LegalServicesMonitoring.Details");
  const format = useFormatter();

  const acceptedOffer = service.offers.find((offer) => offer.accepted);
  const counts: Partial<Record<TabValue, number>> = {
    offers: service.offers.length,
    deliveries: service.deliveries.length,
    notes: service.notes.length,
  };

  return (
    <>
      <SheetHeader className="border-b border-border gap-3 pe-12">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
          <span className="font-mono font-semibold text-gray-800">
            {service.reference}
          </span>
          <span aria-hidden>·</span>
          <span>{service.service_type_label}</span>
          <StatusBadge status={service.status} label={service.status_label} />
          <UrgencyBadge
            urgency={service.urgency}
            urgency_label={service.urgency_label}
          />
        </div>

        <div className="space-y-1">
          <SheetTitle className="text-lg text-primary font-bold leading-snug">
            {service.summary}
          </SheetTitle>
          <SheetDescription className="text-[13px] text-gray-500">
            {[
              service.lawyer
                ? `${service.client.name} → ${service.lawyer.name}`
                : service.client.name,
              service.agreed_fee !== null &&
                formatMoney(format, service.agreed_fee, CURRENCY),
              acceptedOffer?.delivery_time_label,
            ]
              .filter(Boolean)
              .join(" · ")}
          </SheetDescription>
        </div>

        {service.attention.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {service.attention.map((attention) => (
              <span
                key={attention.value}
                className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-medium text-amber-700"
              >
                <TriangleAlert aria-hidden className="size-3" />
                {attention.label}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {actions.map(({ key, Icon, labelKey }) => {
            const action = service.actions[key];
            const isDestructive = key === "cancel_refund";

            return (
              <Button
                key={key}
                variant="outline"
                disabled={!action.available}
                // Explains why an action is unavailable.
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
      </SheetHeader>

      <div className="flex-1 overflow-auto bg-gray-50/50">
        <Tabs defaultValue="request" className="gap-0">
          <div className="sticky z-50 top-0 overflow-x-auto border-b border-border bg-white">
            <TabsList variant="line" className="h-auto! w-max">
              {tabs.map(({ value, Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="h-11 px-3 text-[13px] text-gray-500 data-[state=active]:text-primary data-[state=active]:after:bg-secondary"
                >
                  <Icon className="size-3.5" />
                  {t(`Tabs.${value}`)}
                  {counts[value] ? (
                    <span className="min-w-4.5 h-4.5 px-1 text-[11px] grid place-content-center font-semibold rounded-full bg-gray-100 text-gray-600">
                      {counts[value]}
                    </span>
                  ) : null}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tabs.map(({ value }) => (
            <TabsContent key={value} value={value} className="p-6">
              {value === "request" && <RequestContent service={service} />}
              {value === "offers" && <OffersContent offers={service.offers} />}
              {value === "parties" && (
                <PartiesContent parties={service.parties} />
              )}
              {value === "payment" && (
                <PaymentContent payment={service.payment} />
              )}
              {value === "deliveries" && (
                <DeliveriesContent deliveries={service.deliveries} />
              )}
              {value === "activity" && (
                <ActivityContent activity={service.activity} />
              )}
              {/* TODO: fill in the remaining tabs. */}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <SheetFooter className="border-t border-gray-100">
        <p className="flex items-center gap-2 text-[11px] text-gray-400">
          <SquarePen aria-hidden className="size-3 shrink-0" />
          {t("footer")}
          {service.last_activity_at &&
            ` ${t("lastUpdated", {
              date: format.dateTime(new Date(service.last_activity_at), {
                ...DATE_FORMAT,
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
            })}`}
        </p>
      </SheetFooter>
    </>
  );
}
