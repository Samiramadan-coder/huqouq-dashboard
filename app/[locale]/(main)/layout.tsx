import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { navigation } from "@/constants/dashboard-layout";
import SidebarLogo from "@/components/dashboard-layout/sidebar-logo";
import SidebarNavLink from "@/components/dashboard-layout/sidebar-nav-link";
import DashboardHeader from "@/components/dashboard-layout/dashboard-header";
import SidebarNavSection from "@/components/dashboard-layout/sidebar-nav-section";
import SidebarToggleControl from "@/components/dashboard-layout/sidebar-toggle-control";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        side={locale === "ar" ? "right" : "left"}
        collapsible="icon"
        className="border-e border-gray-200 z-50"
      >
        <SidebarContent className="bg-white">
          <SidebarGroup className="p-0">
            <SidebarLogo />
            <SidebarMenu className="p-2">
              {navigation().map((item) => (
                <SidebarMenuItem key={item.label}>
                  {item.type === "link" ? (
                    <SidebarNavLink item={item} />
                  ) : (
                    <SidebarNavSection label={item.label} />
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarToggleControl />
      </Sidebar>

      <SidebarInset className="min-h-screen min-w-0 flex-1 flex flex-col bg-background">
        <DashboardHeader />
        <main className="min-w-0 w-full overflow-x-hidden flex-1">
          <div className="min-w-0 w-full">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
