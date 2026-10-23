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
  Ban,
  User,
  History,
  Activity,
  FileText,
  ArrowRight,
  MessageSquare,
  LoaderPinwheel,
} from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { type ReactNode, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export type DetailsError = "not_found" | "forbidden" | "failed";

export type DetailsResult<Data> =
  | ({ success: true } & Data)
  | { success: false; error: DetailsError };

type DetailsTab = "profile" | "activity" | "history";

type DetailsState<Data> =
  | { status: "loading" }
  | { status: "error"; error: DetailsError }
  | { status: "ready"; data: Data };

const errorKeys: Record<DetailsError, string> = {
  not_found: "notFound",
  forbidden: "forbidden",
  failed: "loadFailed",
};

// "View" button that opens a side sheet with profile / activity / history tabs.
// Details are loaded through a server action every time the sheet opens, so
// nothing is sent to the browser for rows that are never opened.
export default function DetailsSheet<Data>({
  name,
  load,
  labels,
  renderHeader,
  renderProfile,
  renderActivity,
  renderHistory,
}: {
  name: string;
  load: () => Promise<DetailsResult<Data>>;
  labels: {
    view: string;
    profileTab: string;
    activityTab: string;
    historyTab: string;
    sendMessage: string;
    suspend: string;
    viewHistory: string;
  };
  renderHeader: (data: Data) => ReactNode;
  renderProfile: (data: Data) => ReactNode;
  renderActivity: (data: Data) => ReactNode;
  renderHistory: (data: Data) => ReactNode;
}) {
  const t = useTranslations("PeopleDirectory");
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<DetailsTab>("profile");
  const [state, setState] = useState<DetailsState<Data>>({
    status: "loading",
  });
  // Ignores responses from requests that were superseded or closed.
  const requestId = useRef(0);

  async function loadDetails() {
    const current = ++requestId.current;
    setState({ status: "loading" });

    try {
      const result = await load();
      if (current !== requestId.current) return;

      if (result.success) {
        setState({ status: "ready", data: result });
      } else {
        setState({ status: "error", error: result.error });
      }
    } catch {
      if (current === requestId.current) {
        setState({ status: "error", error: "failed" });
      }
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setTab("profile");
      void loadDetails();
    } else {
      requestId.current++;
    }
  }

  const tabs = [
    { value: "profile", Icon: FileText, label: labels.profileTab },
    { value: "activity", Icon: User, label: labels.activityTab },
    { value: "history", Icon: Activity, label: labels.historyTab },
  ] as const;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className=" rounded-sm text-xs"
          aria-label={t("viewDetails", { name })}
        >
          {labels.view}
          <ArrowRight className="size-3 rtl:rotate-180" />
        </Button>
      </SheetTrigger>

      <SheetContent className="data-[side=right]:sm:max-w-3xl gap-0">
        {state.status === "ready" ? (
          <>
            <SheetHeader className="border-b border-border">
              <SheetTitle asChild>
                <div>{renderHeader(state.data)}</div>
              </SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-auto">
              <Tabs
                value={tab}
                onValueChange={(value) =>
                  setTab(tabs.find((item) => item.value === value)?.value ?? "profile")
                }
                className="gap-0"
              >
                <TabsList
                  variant="line"
                  className="sticky z-50 top-0 h-auto! border-b border-border bg-gray-50/50 w-full justify-start"
                >
                  {tabs.map(({ value, Icon, label }) => (
                    <TabsTrigger
                      key={value}
                      value={value}
                      className="h-10 text-xs text-gray-400 data-[state=active]:after:bg-secondary flex-none px-4"
                    >
                      <Icon className="size-3 text-primary" />
                      {label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="profile" className="p-4">
                  {renderProfile(state.data)}
                </TabsContent>

                <TabsContent value="activity" className="p-4">
                  {renderActivity(state.data)}
                </TabsContent>

                <TabsContent value="history" className="p-4">
                  {renderHistory(state.data)}
                </TabsContent>
              </Tabs>
            </div>

            <SheetFooter className="border-t border-gray-100">
              <div className="flex gap-2">
                {/* Messaging and suspension have no API yet. */}
                <Button
                  variant="outline"
                  disabled
                  title={t("comingSoon")}
                  className="bg-transparent text-[13px] h-10 flex-1"
                >
                  <MessageSquare />
                  {labels.sendMessage}
                </Button>

                <Button
                  variant="outline"
                  disabled
                  title={t("comingSoon")}
                  className="bg-transparent text-[13px] h-10 flex-1 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-600"
                >
                  <Ban />
                  {labels.suspend}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setTab("history")}
                  className="bg-transparent text-[13px] h-10 flex-1 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-600"
                >
                  <History />
                  {labels.viewHistory}
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <>
            <SheetHeader className="border-b border-border">
              <SheetTitle className="text-gray-800 font-semibold text-[13px]">
                {name}
              </SheetTitle>
            </SheetHeader>

            {state.status === "loading" ? (
              <div className="p-4" role="status" aria-label={t("loading")}>
                <LoaderPinwheel className="animate-spin text-secondary" />
              </div>
            ) : (
              <div role="alert" className="p-4 space-y-3">
                <p className="text-[13px] text-gray-600">
                  {t(errorKeys[state.error])}
                </p>
                {state.error === "failed" && (
                  <Button variant="outline" onClick={() => void loadDetails()}>
                    {t("retry")}
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
