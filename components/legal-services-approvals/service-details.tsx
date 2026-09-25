import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetFooter,
  SheetTrigger,
  SheetContent,
} from "../ui/sheet";

import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import UrgencyBadge from "../reusable/urgency-label";
import { LegalService } from "@/types/legal-services-approvals";
import ApproveLegalService from "./approve-legal-service";
import RejectLegalService from "./reject-legal-service";

export default async function ServiceDetails({
  legalService,
}: {
  legalService: LegalService;
}) {
  const t = await getTranslations("LegalServicesApprovals");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" className=" rounded-sm text-xs">
          {t("view")}
          <ArrowRight className="size-3 rtl:rotate-180" />
        </Button>
      </SheetTrigger>

      <SheetContent className="data-[side=right]:sm:max-w-xl gap-0">
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

        <div className="flex-1 overflow-auto">
          {/* <Tabs defaultValue="details" className="gap-0">
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
          </Tabs> */}
        </div>

        <SheetFooter className="border-t border-gray-100 flex-row">
          <ApproveLegalService serviceId={legalService.id} disabled={false} />
          <RejectLegalService serviceId={legalService.id} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
