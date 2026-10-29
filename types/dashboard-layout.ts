import type { ReactNode } from "react";

export type DashboardNavigationItem =
  | {
      label: string;
      href: string;
      type: "link";
      icon: ReactNode;
      count?: number;
    }
  | {
      label: string;
      type: "label";
    };

export type DashboardNavigationLinkItem = Extract<
  DashboardNavigationItem,
  { type: "link" }
>;

export type SidebarBadges = {
  case_approvals: number;
  disputes: number;
  lawyer_approvals: number;
  legal_service_approvals: number;
  legal_services_monitoring: number;
  consultations_monitoring: number;
};
