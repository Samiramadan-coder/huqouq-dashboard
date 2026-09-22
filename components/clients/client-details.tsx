import {
  Sheet,
  SheetTitle,
  SheetHeader,
  SheetFooter,
  SheetTrigger,
  SheetContent,
} from "../ui/sheet";

import {
  User,
  Ban,
  History,
  FileText,
  Activity,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

import { Button } from "../ui/button";
import { Client } from "@/types/clients";
import ClientHistory from "./client-history";
import ActivitySummary from "./client-activity";
import { getTranslations } from "next-intl/server";
import { ProfileStatusLabel } from "./data-preview";
import { Avatar, AvatarFallback } from "../ui/avatar";
import ClientProfileDetails from "./client-profile-details";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default async function ClientDetails({ client }: { client: Client }) {
  const t = await getTranslations("Clients");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" className=" rounded-sm text-xs">
          {t("actions.view")}
          <ArrowRight className="size-3 rtl:rotate-180" />
        </Button>
      </SheetTrigger>

      <SheetContent className="data-[side=right]:sm:max-w-3xl gap-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle>
            <div className="flex items-center gap-2">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary text-white">
                  {client.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-gray-800 font-semibold text-[13px]">
                  {client.name}
                </p>
                <p className="text-[11px] text-gray-400 truncate mt-1">
                  <ProfileStatusLabel
                    status={client.status}
                    statusLabel={client.status_label}
                  />
                </p>
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
                value="profile"
                className="h-10 text-xs text-gray-400 data-[state=active]:after:bg-secondary"
              >
                <FileText className="size-3 text-primary" />
                {t("Profile.tab")}
              </TabsTrigger>

              <TabsTrigger
                value="activity"
                className="h-10 text-xs text-gray-400 data-[state=active]:after:bg-secondary"
              >
                <User className="size-3 text-primary" />
                {t("Activity.tab")}
              </TabsTrigger>

              <TabsTrigger
                value="history"
                className="h-10 text-xs text-gray-400 data-[state=active]:after:bg-secondary"
              >
                <Activity className="size-3 text-primary" />
                {t("History.tab")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="p-4">
              <ClientProfileDetails client={client} />
            </TabsContent>

            <TabsContent value="activity" className="p-4">
              <ActivitySummary />
            </TabsContent>

            <TabsContent value="history" className="p-4">
              <ClientHistory />
            </TabsContent>
          </Tabs>
        </div>

        <SheetFooter className="border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="bg-transparent text-[13px] h-10"
            >
              <MessageSquare />
              {t("actions.sendMessage")}
            </Button>

            <Button
              variant="outline"
              className="bg-transparent text-[13px] h-10 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-600"
            >
              <Ban />
              {t("actions.suspend")}
            </Button>

            <Button
              variant="outline"
              className="text-[13px] h-10 text-secondary border-secondary/40 bg-secondary/8 hover:bg-secondary/10 hover:text-secondary"
            >
              <ShieldCheck />
              {t("actions.verify")}
            </Button>

            <Button
              variant="outline"
              className="bg-transparent text-[13px] h-10 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-600"
            >
              <History />
              {t("actions.viewHistory")}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
