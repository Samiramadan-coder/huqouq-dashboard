import { createElement } from "react";
import { Briefcase, LayoutGrid, UserRoundCheck } from "lucide-react";
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
    // count: 7,
  },
  {
    label: "sidebar.navigation.caseApprovals",
    href: "/case-approvals",
    type: "link",
    icon: createElement(Briefcase, { className: "h-4 w-4" }),
    // count: 3,
  },
];
