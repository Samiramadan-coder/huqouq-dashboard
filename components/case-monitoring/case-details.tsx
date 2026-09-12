import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  FileText,
  MapPin,
  Paperclip,
  Star,
  TriangleAlert,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { getTranslations } from "next-intl/server";
import { CaseMonitoring } from "@/types/case-monitoring";
import CaseStatusLabel from "../reusable/case-status-label";
import UrgencyBadge from "../reusable/urgency-label";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { formatDate, timeAgo } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <div className="flex items-center gap-1.5 text-[13.5px] font-medium text-gray-800">
        {icon}
        {value}
      </div>
    </div>
  );
}

export default async function CaseDetails({
  caseItem,
}: {
  caseItem: CaseMonitoring;
}) {
  const t = await getTranslations("CaseMonitoring");
  const tCommon = await getTranslations("Common");

  const lastActivity = [
    caseItem.closed_at,
    caseItem.fee_paid_at,
    caseItem.closure_requested_at,
    caseItem.hired_at,
    caseItem.reviewed_at,
    caseItem.payment?.paid_at,
    caseItem.created_at,
  ]
    .filter((date): date is string => Boolean(date))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" className=" rounded-sm text-xs">
          {t("view")}
          <ArrowRight className="size-3 rtl:rotate-180" />
        </Button>
      </SheetTrigger>

      <SheetContent className="data-[side=right]:sm:max-w-3xl gap-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle>
            <div className="flex items-center gap-4">
              <div className="rounded-full size-7 grid place-content-center text-amber-600 bg-amber-100">
                <TriangleAlert className="size-4!" />
              </div>
              <div>
                <p className="text-[15px] text-primary font-bold">
                  {caseItem.title}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <CaseStatusLabel status={caseItem.status} />
                  <Badge className="font-normal h-6 bg-primary/5 border-primary/20 text-primary/75">
                    {caseItem.specialization.name}
                  </Badge>
                  <UrgencyBadge
                    urgency={caseItem.urgency}
                    urgency_label={caseItem.urgency_label}
                  />
                </div>
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="">
          <Tabs defaultValue="details" className="gap-0">
            <TabsList variant="line" className="h-auto! border-b border-border">
              <TabsTrigger
                value="details"
                className="h-10 text-xs text-primary data-[state=active]:after:bg-secondary"
              >
                <FileText className="size-3 text-primary" />
                {t("Details.tab")}
              </TabsTrigger>

              <TabsTrigger
                value="participants"
                className="h-10 text-xs text-primary data-[state=active]:after:bg-secondary"
              >
                <FileText className="size-3 text-primary" />
                {t("Participants.tab")}
              </TabsTrigger>
            </TabsList>

            <Separator className="bg-border" />

            <TabsContent value="details" className="p-4 space-y-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <DetailItem
                  label={t("Details.caseId")}
                  value={`#case-${caseItem.id}`}
                />
                <DetailItem
                  label={t("Details.category")}
                  value={caseItem.specialization.name}
                />
                <DetailItem
                  label={t("Details.posted")}
                  value={formatDate(caseItem.created_at)}
                />
                <DetailItem
                  label={t("Details.hiredDate")}
                  value={
                    caseItem.hired_at ? formatDate(caseItem.hired_at) : "-"
                  }
                />
                <DetailItem
                  label={t("Details.location")}
                  icon={<MapPin className="size-3.5 text-gray-400" />}
                  value={caseItem.city}
                />
                <DetailItem
                  label={t("Details.budget")}
                  icon={<Banknote className="size-3.5 text-gray-400" />}
                  value={
                    caseItem.budget_disclosed
                      ? `${tCommon("AED")} ${caseItem.budget_min} - ${caseItem.budget_max}`
                      : t("Details.notDisclosed")
                  }
                />
                <DetailItem
                  label={t("Table.agreedPrice")}
                  value={
                    caseItem.payment
                      ? `${caseItem.payment.currency} ${caseItem.payment.agreed_amount}`
                      : "-"
                  }
                />
                <DetailItem
                  label={t("Table.lastActivity")}
                  value={lastActivity ? timeAgo(lastActivity) : "-"}
                />
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  {t("Details.description")}
                </p>
                <p className="p-3 rounded-lg bg-gray-50 text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">
                  {caseItem.description}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  {t("Details.attachedDocuments")}
                </p>
                {caseItem.documents_count > 0 ? (
                  <div className="flex items-center gap-2 text-[13px] text-gray-700">
                    <Paperclip className="size-3.5 text-gray-400" />
                    {t("Details.documentsAttached", {
                      count: caseItem.documents_count,
                    })}
                  </div>
                ) : (
                  <p className="text-[13px] text-gray-400">
                    {t("Details.noDocuments")}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="participants" className="p-4">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Client */}
                <Card className="rounded-xl border-blue-200 bg-blue-50/30 shadow-none">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-12">
                        <AvatarFallback className="bg-primary text-base font-semibold text-white">
                          {caseItem.client.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="text-[16px] font-semibold text-primary">
                          {caseItem.client.name}
                        </h3>
                        <p className="mt-0.5 text-[11px] font-medium uppercase text-blue-600">
                          {t("Participants.Client.role")}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-3 bg-blue-200/70" />

                    <div className="space-y-4">
                      <InfoRow
                        label={t("Participants.Client.email")}
                        value={"-"}
                      />

                      <InfoRow
                        label={t("Participants.Client.phone")}
                        value={"-"}
                      />

                      <InfoRow
                        label={t("Participants.Client.joined")}
                        value={"-"}
                      />

                      <InfoRow
                        label={t("Participants.Client.totalCases")}
                        value={"-"}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Lawyer */}
                <Card className="rounded-xl border-emerald-200 bg-emerald-50/30 shadow-none">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-12">
                        <AvatarFallback className="bg-emerald-700 text-base font-semibold text-white">
                          {caseItem.hired_lawyer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-[16px] font-semibold text-primary">
                            {caseItem.hired_lawyer.name}
                          </h3>

                          <BadgeCheck className="size-4 fill-emerald-500 text-white" />
                        </div>

                        <p className="mt-0.5 text-[11px] font-medium uppercase text-emerald-700">
                          {t("Participants.Lawyer.role")}
                        </p>
                      </div>
                    </div>

                    <Separator className="my-3 bg-emerald-200/70" />

                    <div className="space-y-4">
                      <InfoRow
                        label={t("Participants.Lawyer.specialization")}
                        value={caseItem.specialization.name}
                      />

                      <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                        <span className="text-[11px] text-primary/45">
                          {t("Participants.Lawyer.rating")}
                        </span>

                        <div className="flex items-center gap-1">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-[13px] font-medium text-primary/80">
                            4.8
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter>
          {/* <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] items-center gap-2">
      <span className="text-[11px] text-primary/45">{label}</span>
      <span className="text-[13px] font-medium text-primary/80">{value}</span>
    </div>
  );
}
