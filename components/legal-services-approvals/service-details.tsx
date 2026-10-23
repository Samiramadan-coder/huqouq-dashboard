"use client";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetFooter,
  SheetTrigger,
  SheetContent,
} from "../ui/sheet";

import {
  ArrowRight,
  Calendar,
  FileText,
  LoaderPinwheel,
  MapPin,
  ShieldAlert,
  User,
} from "lucide-react";

import {
  ActionFailure,
  LegalServiceDetailsView,
} from "@/types/legal-services-approvals";

import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import DownloadFile from "./download-file";
import { useTranslations } from "next-intl";
import { cn, formatDate } from "@/lib/utils";
import { useId, useRef, useState } from "react";
import { Field, FieldGroup } from "../ui/field";
import UrgencyBadge from "../reusable/urgency-label";
import ServiceStatusBadge from "./service-status-badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import RejectLegalService from "./reject-legal-service";
import ApproveLegalService from "./approve-legal-service";
import { getLegalServiceDetails } from "@/lib/legal-services-approvals";

const conditions = [
  "Details.condition1",
  "Details.condition2",
  "Details.condition3",
  "Details.condition4",
] as const;

type Condition = (typeof conditions)[number];

type DetailsState =
  | { status: "loading" }
  | { status: "error"; error: ActionFailure }
  | { status: "ready"; service: LegalServiceDetailsView };

// "View" button that opens a sheet with the service details. Details are
// fetched through a server action each time the sheet opens.
export default function ServiceDetails({
  serviceId,
  serviceLabel,
}: {
  serviceId: number;
  serviceLabel: string;
}) {
  const t = useTranslations("LegalServicesApprovals");
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
          className=" rounded-sm text-xs"
          aria-label={t("viewService", { name: serviceLabel })}
        >
          {t("view")}
          <ArrowRight className="size-3 rtl:rotate-180" />
        </Button>
      </SheetTrigger>

      <SheetContent className="data-[side=right]:sm:max-w-2xl gap-0">
        {details.status === "ready" ? (
          <ServiceDetailsContent
            // Remount per service so the checklist starts empty each time.
            key={details.service.id}
            service={details.service}
            onDecided={() => handleOpenChange(false)}
          />
        ) : (
          <>
            <SheetHeader className="border-b border-border">
              <SheetTitle className="text-[15px] text-primary font-bold">
                {serviceLabel}
              </SheetTitle>
            </SheetHeader>

            {details.status === "loading" ? (
              <div className="p-4" role="status" aria-label={t("Details.loading")}>
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

// The loaded details, review checklist and decision controls.
function ServiceDetailsContent({
  service,
  onDecided,
}: {
  service: LegalServiceDetailsView;
  onDecided: () => void;
}) {
  const t = useTranslations("LegalServicesApprovals");
  const checklistId = useId();
  const [isDeciding, setIsDeciding] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>(
    [],
  );

  // Only services awaiting review can be approved or rejected.
  const canDecide = service.status === "pending_review";
  const allConfirmed = selectedConditions.length === conditions.length;

  function toggleCondition(condition: Condition) {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition],
    );
  }

  return (
    <>
      <SheetHeader className="border-b border-border">
        <SheetTitle className="flex flex-col items-start gap-2">
          <span className="text-[15px] text-primary font-bold">
            {service.service_type_label}
          </span>
          <UrgencyBadge
            urgency={service.urgency}
            urgency_label={service.urgency_label}
          />
        </SheetTitle>
      </SheetHeader>

      <div className="flex-1 overflow-auto p-4">
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <Badge className="text-[11px] bg-primary/5 text-primary border-primary/10">
              {service.service_type_label}
            </Badge>

            <div className="flex items-center gap-2">
              <UrgencyBadge
                urgency={service.urgency}
                urgency_label={service.urgency_label}
              />

              <ServiceStatusBadge
                status={service.status}
                label={service.status_label}
              />
            </div>
          </div>

          <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line wrap-break-word">
            {service.description}
          </p>
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            {t("Details.attachedDocuments")}
          </h3>

          {service.attachments.length ? (
            <ul className="space-y-2">
              {service.attachments.map((attach) => (
                <li
                  className="flex items-center justify-between gap-2 p-3 rounded-xl border border-gray-200 bg-white"
                  key={attach.id}
                >
                  <p className="flex items-center gap-2 min-w-0">
                    <FileText className="text-secondary size-4 shrink-0" />
                    <span className="text-gray-700 text-[13px] truncate">
                      {attach.name}
                    </span>
                  </p>

                  <DownloadFile id={attach.id} name={attach.name} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[12.5px] text-gray-400">
              {t("Details.noAttachments")}
            </p>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            {t("Details.client")}
          </h3>
          <div className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 bg-white">
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary text-white">
                {service.client.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="whitespace-nowrap text-gray-700 font-medium text-[11px]">
                {service.client.name}
              </p>
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <MapPin className="size-3" />
                  {service.client.location}
                </span>

                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <User className="size-3" />
                  {t("Details.joined")} {formatDate(service.client.joined_at)}
                </span>

                <span className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Calendar className="size-3" />
                  {t("Details.submitted")} {formatDate(service.submitted_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {canDecide && (
          <Card className="bg-amber-50 ring-0! border border-amber-200 rounded-xl px-5 py-4 gap-0 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert
                className="text-amber-600 size-4 shrink-0"
                aria-hidden="true"
              />
              <h3 className="text-[13px] font-semibold text-amber-800">
                {t("Details.reviewChecklist")}
              </h3>
              <span className="text-[11px] text-amber-600 ms-auto">
                {selectedConditions.length} / {conditions.length}{" "}
                {t("Details.confirmed")}
              </span>
            </div>

            <FieldGroup className="gap-2">
              {conditions.map((condition) => {
                const id = `${checklistId}-${condition}`;
                const checked = selectedConditions.includes(condition);

                return (
                  <Field orientation="horizontal" key={condition}>
                    <Checkbox
                      id={id}
                      checked={checked}
                      disabled={isDeciding}
                      onCheckedChange={() => toggleCondition(condition)}
                      className="
                        border-amber-300
                        data-[state=checked]:border-amber-500
                        data-[state=checked]:bg-amber-500
                        data-[state=checked]:text-white
                      "
                    />
                    <Label
                      htmlFor={id}
                      className={cn(
                        "text-[13px] leading-relaxed transition-colors text-amber-800 font-normal",
                        checked && "line-through",
                      )}
                    >
                      {t(condition)}
                    </Label>
                  </Field>
                );
              })}
            </FieldGroup>
          </Card>
        )}
      </div>

      {canDecide && (
        <SheetFooter className="border-t border-gray-100 flex-row">
          <ApproveLegalService
            serviceId={service.id}
            disabled={isDeciding || !allConfirmed}
            onPendingChange={setIsDeciding}
            onApproved={onDecided}
          />
          <RejectLegalService
            serviceId={service.id}
            disabled={isDeciding}
            onPendingChange={setIsDeciding}
            onRejected={onDecided}
          />
        </SheetFooter>
      )}
    </>
  );
}
