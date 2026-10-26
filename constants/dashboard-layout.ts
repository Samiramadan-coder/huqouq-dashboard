import { createElement } from "react";
import {
  Banknote,
  Briefcase,
  LayoutGrid,
  MonitorCheck,
  Settings,
  UserRoundCheck,
  Users,
} from "lucide-react";
import type {
  DashboardNavigationItem,
  DashboardNavigationLinkItem,
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

export const navigation = (): DashboardNavigationItem[] => [
  {
    label: "layout.sidebar.navigation.overview",
    type: "label",
  },
  {
    label: "layout.sidebar.navigation.dashboard",
    href: "/",
    type: "link",
    icon: createElement(LayoutGrid, { className: "h-4 w-4" }),
  },
  {
    label: "layout.sidebar.navigation.approvals",
    type: "label",
  },
  {
    label: "layout.sidebar.navigation.lawyerApprovals",
    href: "/lawyer-approvals",
    type: "link",
    icon: createElement(UserRoundCheck, { className: "h-4 w-4" }),
  },
  {
    label: "layout.sidebar.navigation.caseApprovals",
    href: "/case-approvals",
    type: "link",
    icon: createElement(Briefcase, { className: "h-4 w-4" }),
  },
  {
    label: "layout.sidebar.navigation.legalServicesApprovals",
    href: "/legal-services-approvals",
    type: "link",
    icon: createElement(Users, { className: "h-4 w-4" }),
  },
  {
    label: "layout.sidebar.navigation.operations",
    type: "label",
  },
  {
    label: "layout.sidebar.navigation.caseMonitoring",
    href: "/case-monitoring",
    type: "link",
    icon: createElement(MonitorCheck, { className: "h-4 w-4" }),
  },
  {
    label: "layout.sidebar.navigation.users",
    type: "label",
  },
  {
    label: "layout.sidebar.navigation.lawyers",
    href: "/lawyers",
    type: "link",
    icon: createElement(UserRoundCheck, { className: "h-4 w-4" }),
  },
  {
    label: "layout.sidebar.navigation.client",
    href: "/clients",
    type: "link",
    icon: createElement(Users, { className: "h-4 w-4" }),
  },
  {
    label: "layout.sidebar.navigation.finance",
    type: "label",
  },
  {
    label: "layout.sidebar.navigation.payouts",
    href: "/payouts",
    type: "link",
    icon: createElement(Banknote, { className: "h-4 w-4" }),
  },
  {
    label: "layout.sidebar.navigation.settingsLabel",
    type: "label",
  },
  {
    label: "layout.sidebar.navigation.settings",
    href: "/settings",
    type: "link",
    icon: createElement(Settings, { className: "h-4 w-4" }),
  },
];
