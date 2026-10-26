"use client";

import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import LiveDateTime from "./live-date-time";
import { SidebarTrigger } from "../ui/sidebar";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { findActiveNavLink } from "@/constants/dashboard-layout";

export default function DashboardHeader() {
  const pathname = usePathname();
  const t = useTranslations();

  const activeSectionLabel = findActiveNavLink(pathname)?.label;

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger
          className="md:hidden"
          aria-label={t("layout.sidebar.toggleExpand")}
          title={t("layout.sidebar.toggleExpand")}
        />
        <h2 className="text-lg font-semibold text-gray-600">
          {t(activeSectionLabel ?? "layout.sidebar.navigation.dashboard")}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <LiveDateTime />
        <LocaleSwitcher />
        <Button
          variant="ghost"
          size="sm"
          className="relative p-0"
          aria-label={t("layout.header.notifications")}
          title={t("layout.header.notifications")}
        >
          <Bell />
          <span className="absolute top-0.5 -inset-e-1.5 flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
          </span>
        </Button>
      </div>
    </header>
  );
}
