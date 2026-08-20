"use client";

import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import LiveDateTime from "./live-date-time";
import { SidebarTrigger } from "../ui/sidebar";
import { LocaleSwitcher } from "./locale-switcher";
import { useLocale, useTranslations } from "next-intl";

export default function DashboardHeader() {
  const locale = useLocale();
  const t = useTranslations("layout");

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger
          className="md:hidden"
          aria-label={t("sidebar.toggleExpand")}
          title={t("sidebar.toggleExpand")}
        />
        <p className="text-lg font-semibold text-gray-600">
          {t("header.dashboard")}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <LiveDateTime />
        <LocaleSwitcher />
        <Button variant="ghost" size="sm" className="relative p-0">
          <Bell />
          <span
            className={cn(
              `absolute top-0.5 flex h-1.5 w-1.5`,
              locale === "en" ? "-right-1.5" : "-left-1.5",
            )}
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
          </span>
        </Button>
      </div>
    </header>
  );
}
