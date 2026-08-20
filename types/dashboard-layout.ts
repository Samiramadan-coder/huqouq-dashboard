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
