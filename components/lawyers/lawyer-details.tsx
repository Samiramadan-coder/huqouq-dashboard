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
  FileText,
  ArrowRight,
  User,
  Activity,
  MessageSquare,
  Ban,
  History,
} from "lucide-react";

import {
  Activity as LawyerActivity,
  Lawyer,
  HistoryItem,
} from "@/types/lawyers";

import { http } from "@/lib/http";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import LawyerHistory from "./lawyer-history";
import ActivitySummary from "./lawyer-activity";
import { ProfileStatusLabel } from "./data-preview";
import { Avatar, AvatarFallback } from "../ui/avatar";
import LawyerProfileDetails from "./lawyer-profile-details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function LawyerDetails({ lawyerId }: { lawyerId: number }) {
  const t = useTranslations("Lawyers");
  const [open, setOpen] = useState(false);
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activity, setActivity] = useState<LawyerActivity | null>(null);

  useEffect(() => {
    if (!open) return;

    async function fetchData() {
      try {
        const { data } = await http.get<{
          data: Lawyer;
          activity: LawyerActivity;
          history: HistoryItem[];
        }>(`/api/admin/lawyers/${lawyerId}`);

        setLawyer(data.data);
        setActivity(data.activity);
        setHistory(data.history);

        // console.log(data);
        // const data = await response.json();
        // setLawyer(data);
      } catch (error) {
        console.error("Failed to fetch lawyer data:", error);
      }
    }

    void fetchData();
  }, [lawyerId, open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="default" className=" rounded-sm text-xs">
          {t("actions.view")}
          <ArrowRight className="size-3 rtl:rotate-180" />
        </Button>
      </SheetTrigger>

      <SheetContent className="data-[side=right]:sm:max-w-3xl gap-0">
        {lawyer && activity ? (
          <>
            <SheetHeader className="border-b border-border">
              <SheetTitle>
                <div className="flex items-center gap-2">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary text-white">
                      {lawyer.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-gray-800 font-semibold text-[13px]">
                      {lawyer.name}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate mt-1">
                      <ProfileStatusLabel
                        profileStatus={lawyer.profile_status}
                        profileStatusLabel={lawyer.status_label}
                      />{" "}
                      {lawyer.account_type_label}
                    </p>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-auto">
              <Tabs defaultValue="profile" className="gap-0">
                <TabsList
                  variant="line"
                  className="sticky z-50 top-0 h-auto! border-b border-border bg-gray-50/50 w-full justify-start"
                >
                  <TabsTrigger
                    value="profile"
                    className="h-10 text-xs text-gray-400 data-[state=active]:after:bg-secondary flex-none px-4"
                  >
                    <FileText className="size-3 text-primary" />
                    {t("Profile.tab")}
                  </TabsTrigger>

                  <TabsTrigger
                    value="activity"
                    className="h-10 text-xs text-gray-400 data-[state=active]:after:bg-secondary flex-none px-4"
                  >
                    <User className="size-3 text-primary" />
                    {t("Activity.tab")}
                  </TabsTrigger>

                  <TabsTrigger
                    value="history"
                    className="h-10 text-xs text-gray-400 data-[state=active]:after:bg-secondary flex-none px-4"
                  >
                    <Activity className="size-3 text-primary" />
                    {t("History.tab")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="p-4">
                  <LawyerProfileDetails lawyer={lawyer} />
                </TabsContent>

                <TabsContent value="activity" className="p-4">
                  <ActivitySummary activity={activity} />
                </TabsContent>

                <TabsContent value="history" className="p-4">
                  <LawyerHistory history={history} />
                </TabsContent>
              </Tabs>
            </div>

            <SheetFooter className="border-t border-gray-100">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="bg-transparent text-[13px] h-10 flex-1"
                >
                  <MessageSquare />
                  {t("actions.sendMessage")}
                </Button>

                <Button
                  variant="outline"
                  className="bg-transparent text-[13px] h-10 flex-1 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-600"
                >
                  <Ban />
                  {t("actions.suspend")}
                </Button>

                <Button
                  variant="outline"
                  className="bg-transparent text-[13px] h-10 flex-1 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-600"
                >
                  <History />
                  {t("actions.viewHistory")}
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <></>
        )}
      </SheetContent>
    </Sheet>
  );
}
