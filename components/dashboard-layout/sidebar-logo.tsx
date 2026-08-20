"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";
import { useTranslations } from "next-intl";
import { Separator } from "../ui/separator";

export default function SidebarLogo() {
  const { state } = useSidebar();
  const isSidebarOpen = state === "expanded";
  const t = useTranslations("layout");

  return (
    <>
      <div className="py-3 px-1 flex items-center gap-4">
        <div>
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 36"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M16 1L2 7v10c0 9.5 6 18 14 19 8-1 14-9.5 14-19V7L16 1z"
              fill="none"
              stroke="#C9A961"
              strokeWidth="1.5"
              strokeLinejoin="round"
            ></path>
            <path
              d="M11 18l3.5 3.5L21 14"
              stroke="#C9A961"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </div>
        <div className={cn("flex flex-col", { hidden: !isSidebarOpen })}>
          <p className="text-sm font-bold text-primary leading-tight truncate mb-1 uppercase">
            {t("sidebar.brandName")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("sidebar.brandSubtitle")}
          </p>
        </div>
      </div>

      <Separator className="bg-gray-200" />
    </>
  );
}
