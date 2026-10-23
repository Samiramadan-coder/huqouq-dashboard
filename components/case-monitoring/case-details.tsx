import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetFooter,
  SheetTrigger,
  SheetContent,
} from "../ui/sheet";

import {
  FileText,
  ArrowRight,
  TriangleAlert,
  User,
  Activity,
  MessageSquare,
  Shield,
} from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import ChatContent from "./chat-content";
import DetailsContent from "./details-content";
import PartiesContent from "./parties-content";
import { getTranslations } from "next-intl/server";
import { StatusTimeline } from "./status-timeline";
import UrgencyBadge from "../reusable/urgency-label";
import AdminNotesContent from "./admin-notes-content";
import CaseMessageDialog from "./case-message-dialog";
import { CaseMonitoring } from "@/types/case-monitoring";
import CaseStatusLabel from "../reusable/case-status-label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const tabs = [
  { value: "details", Icon: FileText, labelKey: "Details.tab" },
  { value: "participants", Icon: User, labelKey: "Participants.tab" },
  { value: "timeline", Icon: Activity, labelKey: "Timeline.tab" },
  { value: "chat", Icon: MessageSquare, labelKey: "Chat.tab" },
  { value: "adminNotes", Icon: Shield, labelKey: "AdminNotes.tab" },
] as const;

export default async function CaseDetails({
  caseItem,
}: {
  caseItem: CaseMonitoring;
}) {
  const t = await getTranslations("CaseMonitoring");
  const needsAttention = caseItem.attention_flags.length > 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className=" rounded-sm text-xs"
          aria-label={t("viewCase", { title: caseItem.title })}
        >
          {t("view")}
          <ArrowRight className="size-3 rtl:rotate-180" />
        </Button>
      </SheetTrigger>

      <SheetContent className="data-[side=right]:sm:max-w-3xl gap-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle asChild>
            <div className="flex items-center gap-4">
              {needsAttention && (
                <div className="rounded-full size-7 grid place-content-center text-amber-600 bg-amber-100">
                  <TriangleAlert aria-hidden className="size-4!" />
                  <span className="sr-only">{t("needs_attention")}</span>
                </div>
              )}
              <div>
                <h2 className="text-[15px] text-primary font-bold">
                  {caseItem.title}
                </h2>
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

        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="details" className="gap-0">
            <TabsList
              variant="line"
              className="sticky z-50 top-0 h-auto! border-b border-border bg-gray-50/50 w-full"
            >
              {tabs.map(({ value, Icon, labelKey }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="h-10 text-xs text-gray-400 data-[state=active]:after:bg-secondary"
                >
                  <Icon className="size-3 text-primary" />
                  {t(labelKey)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="details" className="p-4 space-y-6">
              <DetailsContent caseItem={caseItem} />
            </TabsContent>

            <TabsContent value="participants" className="p-4">
              <PartiesContent caseItem={caseItem} />
            </TabsContent>

            <TabsContent value="timeline" className="p-4">
              <StatusTimeline items={caseItem.timeline} />
            </TabsContent>

            <TabsContent value="chat" className="p-4">
              {/* Only the fields the transcript needs are sent to the client. */}
              <ChatContent
                participants={{
                  caseId: caseItem.id,
                  client: {
                    id: caseItem.client.id,
                    name: caseItem.client.name,
                    photo_url: caseItem.client.photo_url,
                  },
                  lawyer: {
                    name: caseItem.hired_lawyer.name,
                    photo_url: caseItem.hired_lawyer.photo_url,
                  },
                }}
              />
            </TabsContent>

            <TabsContent value="adminNotes" className="p-4">
              <AdminNotesContent />
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter className="border-t border-gray-100 flex-row">
          <CaseMessageDialog caseId={caseItem.id} variant="checkIn" />
          <CaseMessageDialog caseId={caseItem.id} variant="dispute" />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
