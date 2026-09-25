import { createElement } from "react";
import {
  Briefcase,
  LayoutGrid,
  MonitorCheck,
  UserRoundCheck,
  Users,
} from "lucide-react";
import type { DashboardNavigationItem } from "@/types/dashboard-layout";

export const navigation = (): DashboardNavigationItem[] => [
  {
    label: "sidebar.navigation.overview",
    type: "label",
  },
  {
    label: "sidebar.navigation.dashboard",
    href: "/",
    type: "link",
    icon: createElement(LayoutGrid, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.approvals",
    type: "label",
  },
  {
    label: "sidebar.navigation.lawyerApprovals",
    href: "/lawyer-approvals",
    type: "link",
    icon: createElement(UserRoundCheck, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.caseApprovals",
    href: "/case-approvals",
    type: "link",
    icon: createElement(Briefcase, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.legalServicesApprovals",
    href: "/legal-services-approvals",
    type: "link",
    icon: createElement(Users, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.operations",
    type: "label",
  },
  {
    label: "sidebar.navigation.caseMonitoring",
    href: "/case-monitoring",
    type: "link",
    icon: createElement(MonitorCheck, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.users",
    type: "label",
  },
  {
    label: "sidebar.navigation.lawyers",
    href: "/lawyers",
    type: "link",
    icon: createElement(UserRoundCheck, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.client",
    href: "/clients",
    type: "link",
    icon: createElement(Users, { className: "h-4 w-4" }),
  },
];
