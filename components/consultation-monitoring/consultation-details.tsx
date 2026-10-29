"use client";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from "../ui/sheet";

import {
  ActionFailure,
  ConsultationDetailsType,
  TIME_FORMAT,
  TIME_ZONE,
} from "@/types/consultation-monitoring";

import AddNote from "./add-note";
import { Button } from "../ui/button";
import { useRef, useState } from "react";
import StatusBadge from "./status-badge";
import CancelRefund from "./cancel-refund";
import NotesContent from "./notes-content";
import PartiesContent from "./parties-content";
import PaymentContent from "./payment-content";
import TimelineContent from "./timeline-content";
import { useLocale, useTranslations } from "next-intl";
import { DATE_FORMAT, formatMoney } from "@/lib/format";
import { useAppFormatter } from "@/hooks/use-app-formatter";
import { Section } from "../legal-services-montoring/section";
import { getConsultationDetails } from "@/lib/consultation-monitoring";
import { Phone, Video, ArrowRight, LoaderPinwheel } from "lucide-react";

type DetailsState =
  | { status: "loading" }
  | { status: "error"; error: ActionFailure }
  | { status: "ready"; consultation: ConsultationDetailsType };

// "View" button that opens a sheet with the consultation details. Details are
// fetched through a server action each time the sheet opens.
export default function ConsultationDetails({
  reference,
  consultationId,
}: {
  reference: string;
  consultationId: number;
}) {
  const t = useTranslations("ConsultationMonitoring");
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState<DetailsState>({ status: "loading" });
  const requestId = useRef(0);

  // A silent reload keeps the current details on screen while refetching,
  // e.g. after an admin action.
  async function loadDetails({ silent = false } = {}) {
    const current = ++requestId.current;
    if (!silent) setDetails({ status: "loading" });

    try {
      const result = await getConsultationDetails(consultationId);
      if (current !== requestId.current) return;

      setDetails(
        result.success
          ? { status: "ready", consultation: result.data }
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
          aria-label={t("Table.viewConsultation", { reference })}
        >
          {t("Table.view")}
          <ArrowRight className="size-3 rtl:rotate-180" />
        </Button>
      </SheetTrigger>

      <SheetContent className="data-[side=right]:sm:max-w-3xl gap-0">
        {details.status === "ready" ? (
          <DetailsContent
            consultation={details.consultation}
            onChanged={() => void loadDetails({ silent: true })}
          />
        ) : (
          <>
            <SheetHeader className="border-b border-border">
              <SheetTitle className="font-mono text-[15px] text-primary font-bold">
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
                      ? "Details.forbidden"
                      : "Details.failure",
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

function DetailsContent({
  consultation,
  onChanged,
}: {
  consultation: ConsultationDetailsType;
  onChanged: () => void;
}) {
  const t = useTranslations("ConsultationMonitoring.Details");
  const format = useAppFormatter();
  const locale = useLocale();

  const TypeIcon = consultation.type === "video" ? Video : Phone;
  const startsAt = new Date(consultation.starts_at);
  const cancelRefund = consultation.actions.cancel_refund;

  return (
    <>
      <SheetHeader className="border-b border-border gap-3 pe-12">
        <div className="flex flex-wrap items-center gap-2.5">
          <SheetTitle className="font-mono text-lg text-primary font-bold">
            {consultation.reference}
          </SheetTitle>
          <StatusBadge
            status={consultation.status}
            label={consultation.status_label}
          />
        </div>

        <SheetDescription asChild>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <TypeIcon aria-hidden className="size-3.5 text-gray-400" />
              {consultation.type_label}
            </span>
            <span>
              {format.dateTime(startsAt, {
                ...DATE_FORMAT,
                timeZone: TIME_ZONE,
              })}
              {" · "}
              {format.dateTime(startsAt, TIME_FORMAT)}
              {" – "}
              {format.dateTime(
                new Date(consultation.ends_at),
                TIME_FORMAT,
              )}{" "}
              {t("uae")}
            </span>
            <span>
              {t("minutes", {
                minutes: format.number(consultation.duration_minutes),
              })}
            </span>
            <span className="font-semibold text-gray-900">
              {formatMoney(consultation.amount, "AED", locale)}
            </span>
          </div>
        </SheetDescription>

        <div className="flex flex-wrap gap-2">
          <CancelRefund
            consultation={consultation}
            disabled={!cancelRefund.available}
            title={cancelRefund.available ? undefined : cancelRefund.reason}
            onSuccess={onChanged}
          />
          <AddNote consultationId={consultation.id} onSuccess={onChanged} />
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-auto bg-gray-50/50 p-6 space-y-4">
        {consultation.cancel_reason && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-[13px]">
            <p className="font-semibold text-red-700">
              {consultation.cancelled_by
                ? t("cancelledBy", { actor: consultation.cancelled_by })
                : t("cancelled")}
            </p>
            <p className="mt-1 text-red-700/80">{consultation.cancel_reason}</p>
          </div>
        )}

        <PartiesContent parties={consultation.parties} />

        <Section title={t("brief")}>
          <p className="whitespace-pre-line text-[13px] leading-relaxed text-gray-700">
            {consultation.brief || t("noBrief")}
          </p>
        </Section>

        <PaymentContent
          payment={consultation.payment}
          payout={consultation.payout}
        />

        {consultation.timeline && (
          <TimelineContent timeline={consultation.timeline} />
        )}

        <NotesContent notes={consultation.notes} />
      </div>
    </>
  );
}
