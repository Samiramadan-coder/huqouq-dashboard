import { createElement } from "react";
import {
  Banknote,
  Briefcase,
  FileSearch,
  LayoutGrid,
  MonitorCheck,
  Settings,
  UserRoundCheck,
  Users,
  Video,
} from "lucide-react";
import type {
  DashboardNavigationItem,
  DashboardNavigationLinkItem,
  SidebarBadges,
} from "@/types/dashboard-layout";

export function isNavHrefActive(href: string, pathname: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export const findActiveNavLink = (pathname: string) =>
  navigation().find(
    (item): item is DashboardNavigationLinkItem =>
      item.type === "link" && isNavHrefActive(item.href, pathname),
  );

export const navigation = (
  sidebarBadges?: SidebarBadges,
): DashboardNavigationItem[] => [
  {
    label: "layout.sidebar.navigation.overview",
    type: "label",
  },
  {
    label: "layout.sidebar.navigation.dashboard",
    href: "/",
    type: "link",
    icon: createElement(LayoutGrid, { className: "size-4" }),
  },
  {
    label: "layout.sidebar.navigation.approvals",
    type: "label",
  },
  {
    label: "layout.sidebar.navigation.lawyerApprovals",
    href: "/lawyer-approvals",
    type: "link",
    icon: createElement(UserRoundCheck, { className: "size-4" }),
    count: sidebarBadges?.lawyer_approvals,
  },
  {
    label: "layout.sidebar.navigation.caseApprovals",
    href: "/case-approvals",
    type: "link",
    icon: createElement(Briefcase, { className: "size-4" }),
    count: sidebarBadges?.case_approvals,
  },
  {
    label: "layout.sidebar.navigation.legalServicesApprovals",
    href: "/legal-services-approvals",
    type: "link",
    icon: createElement(Users, { className: "size-4" }),
    count: sidebarBadges?.legal_service_approvals,
  },
  {
    label: "layout.sidebar.navigation.operations",
    type: "label",
  },
  {
    label: "layout.sidebar.navigation.caseMonitoring",
    href: "/case-monitoring",
    type: "link",
    icon: createElement(MonitorCheck, { className: "size-4" }),
  },
  {
    label: "layout.sidebar.navigation.consultationMonitoring",
    href: "/consultation-monitoring",
    type: "link",
    icon: createElement(Video, { className: "size-4" }),
    count: sidebarBadges?.consultations_monitoring,
  },
  {
    label: "layout.sidebar.navigation.legalServicesMonitoring",
    href: "/legal-services-monitoring",
    type: "link",
    icon: createElement(FileSearch, { className: "size-4" }),
    count: sidebarBadges?.legal_services_monitoring,
  },
  {
    label: "layout.sidebar.navigation.users",
    type: "label",
  },
  {
    label: "layout.sidebar.navigation.lawyers",
    href: "/lawyers",
    type: "link",
    icon: createElement(UserRoundCheck, { className: "size-4" }),
  },
  {
    label: "layout.sidebar.navigation.client",
    href: "/clients",
    type: "link",
    icon: createElement(Users, { className: "size-4" }),
  },
  {
    label: "layout.sidebar.navigation.finance",
    type: "label",
  },
  {
    label: "layout.sidebar.navigation.payouts",
    href: "/payouts",
    type: "link",
    icon: createElement(Banknote, { className: "size-4" }),
  },
  {
    label: "layout.sidebar.navigation.settingsLabel",
    type: "label",
  },
  {
    label: "layout.sidebar.navigation.settings",
    href: "/settings",
    type: "link",
    icon: createElement(Settings, { className: "size-4" }),
  },
];
