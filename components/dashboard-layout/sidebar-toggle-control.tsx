"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useLocale, useTranslations } from "next-intl";
import { useSidebar } from "../ui/sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SidebarToggleControl() {
  const { toggleSidebar, state } = useSidebar();
  const locale = useLocale();
  const isOpen = state === "expanded";
  const t = useTranslations("layout");

  return (
    <Button
      type="button"
      aria-label={
        isOpen ? t("sidebar.toggleCollapse") : t("sidebar.toggleExpand")
      }
      className={cn(
        "absolute inset-e-0 top-20 h-6 w-6 rounded-full bg-white shadow-sm hover:bg-white",
        locale === "en" ? "translate-x-1/2" : "-translate-x-1/2",
      )}
      onClick={toggleSidebar}
    >
      <DisplayedIcon isOpen={isOpen} locale={locale} />
    </Button>
  );
}

const DisplayedIcon = ({
  isOpen,
  locale,
}: {
  isOpen: boolean;
  locale: string;
}) => {
  if (isOpen && locale === "en") {
    return <ChevronLeft className="h-4 w-4 text-foreground" />;
  }

  if (isOpen && locale === "ar") {
    return <ChevronRight className="h-4 w-4 text-foreground" />;
  }

  if (!isOpen && locale === "en") {
    return <ChevronRight className="h-4 w-4 text-foreground" />;
  }

  if (!isOpen && locale === "ar") {
    return <ChevronLeft className="h-4 w-4 text-foreground" />;
  }
};
