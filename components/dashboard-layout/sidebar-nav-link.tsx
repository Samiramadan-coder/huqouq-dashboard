"use client";

import { SidebarMenuButton, useSidebar } from "../ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { DashboardNavigationLinkItem } from "@/types/dashboard-layout";
import { Badge } from "../ui/badge";

export default function SidebarNavLink({
  item,
}: {
  item: DashboardNavigationLinkItem;
}) {
  const pathname = usePathname();
  const t = useTranslations("layout");
  const { isMobile, setOpenMobile } = useSidebar();
  const normalizedPathname = pathname.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";
  const isActive =
    item.href === "/"
      ? normalizedPathname === "/"
      : normalizedPathname === item.href ||
        normalizedPathname.startsWith(`${item.href}/`);

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className="relative rounded-lg h-10 px-3 py-2.5 text-[13px] font-medium text-gray-600 transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-secondary/12 data-[active=true]:text-primary"
    >
      <Link
        href={item.href}
        className="flex items-center gap-3"
        onClick={handleClick}
      >
        <div className="flex items-center gap-3">
          {item.icon}
          <span>{t(item.label)}</span>
        </div>

        {item.count && (
          <Badge className="ms-auto bg-amber-100! text-amber-700! text-[10px] w-5 h-5">
            {item.count}
          </Badge>
        )}
      </Link>
    </SidebarMenuButton>
  );
}
