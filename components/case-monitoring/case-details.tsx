import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetFooter,
  SheetTrigger,
  SheetContent,
} from "../ui/sheet";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import DetailsContent from "./details-content";
import PartiesContent from "./parties-content";
import { getTranslations } from "next-intl/server";
import UrgencyBadge from "../reusable/urgency-label";
import { CaseMonitoring } from "@/types/case-monitoring";
import CaseStatusLabel from "../reusable/case-status-label";
import { FileText, ArrowRight, TriangleAlert } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { StatusTimeline } from "./status-timeline";

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

              <TabsTrigger
                value="timeline"
                className="h-10 text-xs text-primary data-[state=active]:after:bg-secondary"
              >
                <FileText className="size-3 text-primary" />
                {t("Timeline.tab")}
              </TabsTrigger>
            </TabsList>

            <Separator className="bg-border" />

            <TabsContent value="details" className="p-4 space-y-6">
              <DetailsContent caseItem={caseItem} />
            </TabsContent>

            <TabsContent value="participants" className="p-4">
              <PartiesContent caseItem={caseItem} />
            </TabsContent>

            <TabsContent value="timeline" className="p-4">
              <StatusTimeline items={caseItem.timeline} />
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
