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
import SendCheckInMessage from "./send-check-in-message";
import { CaseMonitoring } from "@/types/case-monitoring";
import CaseStatusLabel from "../reusable/case-status-label";
import FlagForDisputeReview from "./flag-for-dispute-review";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default async function CaseDetails({
  caseItem,
}: {
  caseItem: CaseMonitoring;
}) {
  const t = await getTranslations("CaseMonitoring");

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

        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="details" className="gap-0">
            <TabsList
              variant="line"
              className="sticky z-50 top-0 h-auto! border-b border-border bg-gray-50/50 w-full"
            >
              <TabsTrigger
                value="details"
                className="h-10 text-xs text-gray-400 data-[state=active]:after:bg-secondary"
              >
                <FileText className="size-3 text-primary" />
                {t("Details.tab")}
              </TabsTrigger>

              <TabsTrigger
                value="participants"
                className="h-10 text-xs text-gray-400 data-[state=active]:after:bg-secondary"
              >
                <User className="size-3 text-primary" />
                {t("Participants.tab")}
              </TabsTrigger>

              <TabsTrigger
                value="timeline"
                className="h-10 text-xs text-gray-400 data-[state=active]:after:bg-secondary"
              >
                <Activity className="size-3 text-primary" />
                {t("Timeline.tab")}
              </TabsTrigger>

              <TabsTrigger
                value="chat"
                className="h-10 text-xs text-gray-400 data-[state=active]:after:bg-secondary"
              >
                <MessageSquare className="size-3 text-primary" />
                {t("Chat.tab")}
              </TabsTrigger>

              <TabsTrigger
                value="adminNotes"
                className="h-10 text-xs text-gray-400 data-[state=active]:after:bg-secondary"
              >
                <Shield className="size-3 text-primary" />
                {t("AdminNotes.tab")}
              </TabsTrigger>
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
              <ChatContent caseItem={caseItem} />
            </TabsContent>

            <TabsContent value="adminNotes" className="p-4">
              <AdminNotesContent />
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter className="border-t border-gray-100 flex-row">
          <SendCheckInMessage caseId={caseItem.id} />
          <FlagForDisputeReview caseId={caseItem.id} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
