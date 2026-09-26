"use client";

import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetFooter,
  SheetTrigger,
  SheetContent,
} from "../ui/sheet";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useTranslations } from "next-intl";
import { cn, formatDate } from "@/lib/utils";
import { Field, FieldGroup } from "../ui/field";
import UrgencyBadge from "../reusable/urgency-label";
import { Avatar, AvatarFallback } from "../ui/avatar";
import RejectLegalService from "./reject-legal-service";
import ApproveLegalService from "./approve-legal-service";
import {
  LegalService,
  LegalServiceDetails,
} from "@/types/legal-services-approvals";
import {
  ArrowRight,
  Calendar,
  ExternalLink,
  FileText,
  LoaderPinwheel,
  MapPin,
  ShieldAlert,
  User,
} from "lucide-react";
import { http } from "@/lib/http";
import { Link } from "@/i18n/navigation";

export default function ServiceDetails({
  legalServiceId,
}: {
  legalServiceId: number;
}) {
  const [open, setOpen] = useState(false);
  const [legalService, setLegalService] = useState<LegalServiceDetails | null>(
    null,
  );
  const t = useTranslations("LegalServicesApprovals");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const conditions = [
    "Details.condition1",
    "Details.condition2",
    "Details.condition3",
    "Details.condition4",
  ];

  useEffect(() => {
    if (!open) return;

    async function fetchLegalServiceDetails() {
      try {
        const { data } = await http.get<{ data: LegalServiceDetails }>(
          `/api/admin/legal-service-approvals/${legalServiceId}`,
        );
        setLegalService(data.data);
      } catch (error) {
        console.error("Failed to fetch legal service details:", error);
      }
    }

    void fetchLegalServiceDetails();
  }, [legalServiceId, open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" className=" rounded-sm text-xs">
          {t("view")}
          <ArrowRight className="size-3 rtl:rotate-180" />
        </Button>
      </SheetTrigger>

      <SheetContent className="data-[side=right]:sm:max-w-2xl gap-0">
        {legalService ? (
          <>
            <SheetHeader className="border-b border-border">
              <SheetTitle>
                <p className="text-[15px] text-primary font-bold">
                  {legalService.service_type_label}
                </p>
                <UrgencyBadge
                  urgency={legalService.urgency}
                  urgency_label={legalService.urgency_label}
                />
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-auto p-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge className="text-[11px] bg-primary/5 text-primary border-primary/10">
                    {legalService.service_type_label}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <UrgencyBadge
                      urgency={legalService.urgency}
                      urgency_label={legalService.urgency_label}
                    />

                    <StatusBadge
                      status={legalService.status}
                      statusLabel={legalService.status_label}
                    />
                  </div>
                </div>

                <p className="text-[13px] text-gray-700 leading-relaxed">
                  {legalService.description}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {t("Details.attachedDocuments")}
                </p>

                {legalService.attachments.map((attach) => (
                  <div
                    className="flex items-center justify-between gap-2 p-3 rounded-xl border border-gray-200 bg-white"
                    key={attach.id}
                  >
                    <p className="flex items-center gap-2">
                      <FileText className="text-secondary size-4" />
                      <span className="text-gray-700 text-[13px]">
                        {attach.name}
                      </span>
                    </p>

                    <Link href={attach.download_url}>
                      <Button size="icon" variant="ghost">
                        <ExternalLink />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {t("Details.client")}
                </p>
                <div className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 bg-white">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary text-white">
                      {legalService.client.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="whitespace-nowrap text-gray-700 font-medium text-[11px]">
                      {legalService.client.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <MapPin className="size-3" />
                        {legalService.client.location}
                      </span>

                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <User className="size-3" />
                        {t("Details.joined")}{" "}
                        {formatDate(legalService.client.joined_at)}
                      </span>

                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Calendar className="size-3" />
                        {t("Details.submitted")}{" "}
                        {formatDate(legalService.submitted_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {legalService.status === "pending_review" && (
                <Card className="bg-amber-50 ring-0! border border-amber-200 rounded-xl px-5 py-4 gap-0 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert
                      className="text-amber-600 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <h3 className="text-[13px] font-semibold text-amber-800">
                      {t("Details.reviewChecklist")}
                    </h3>
                    <span className="text-[11px] text-amber-600 ml-auto">
                      {selectedConditions.length} / 4 {t("Details.confirmed")}
                    </span>
                  </div>

                  <FieldGroup className="gap-2">
                    {conditions.map((condition) => (
                      <Field orientation="horizontal" key={condition}>
                        <Checkbox
                          id={condition}
                          name={condition}
                          checked={selectedConditions.includes(condition)}
                          onCheckedChange={() =>
                            setSelectedConditions((prev) =>
                              prev.includes(condition)
                                ? prev.filter((c) => c !== condition)
                                : [...prev, condition],
                            )
                          }
                          className="
                            border-amber-300
                            data-[state=checked]:border-amber-500
                            data-[state=checked]:bg-amber-500
                            data-[state=checked]:text-white
                          "
                        />
                        <Label
                          htmlFor={condition}
                          className={cn(
                            "text-[13px] leading-relaxed transition-colors text-amber-800 font-normal",
                            selectedConditions.includes(condition) &&
                              "line-through",
                          )}
                        >
                          {t(condition)}
                        </Label>
                      </Field>
                    ))}
                  </FieldGroup>
                </Card>
              )}
            </div>

            {legalService.status === "pending_review" && (
              <SheetFooter className="border-t border-gray-100 flex-row">
                <ApproveLegalService
                  serviceId={legalService.id}
                  disabled={selectedConditions.length !== 4}
                />
                <RejectLegalService serviceId={legalService.id} />
              </SheetFooter>
            )}
          </>
        ) : (
          <div className="p-4">
            <LoaderPinwheel className="animate-spin text-secondary" />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function StatusBadge({
  status,
  statusLabel,
}: {
  status: LegalService["status"];
  statusLabel: string;
}) {
  switch (status) {
    case "pending_review":
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] py-2.5 px-3">
          {statusLabel}
        </Badge>
      );
    case "approved":
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 text-[11px] py-2.5 px-3">
          {statusLabel}
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-50 text-red-700 border-red-200 text-[11px] py-2.5 px-3">
          {statusLabel}
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-50 text-gray-700 border-gray-200 text-[11px] py-2.5 px-3">
          {statusLabel}
        </Badge>
      );
  }
}
