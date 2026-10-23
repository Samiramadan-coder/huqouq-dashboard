import z from "zod";
import type { useFormatter } from "next-intl";
import { CaseStatus } from "./case-approvals";
import { Pagination, T } from "./shared";

// Tabs of the monitoring list, in display order.
export const monitoringTabs = [
  "all_active",
  "needs_attention",
  "in_progress",
  "pending_fees",
  "closed",
  "pending_closure",
] as const;

export type MonitoringTab = (typeof monitoringTabs)[number];

export type Counts = Record<MonitoringTab, number>;

type OfferStatus =
  | "pending"
  | "accepted"
  | "cancelled"
  | "declined"
  | "withdrawn";

type Offer = {
  amount: number;
  created_at: string;
  expected_days: number;
  expected_timeline: string;
  id: number;
  message: string;
  status: OfferStatus;
  status_label: string;
  lawyer: {
    id: number;
    name: string;
    photo_url: string | null;
    years_of_experience: number;
    specializations: string[];
  };
};

type Client = {
  cases_count: number;
  contact_visible: boolean;
  email: string;
  first_name: string;
  id: number;
  joined_at: string;
  name: string;
  phone: string;
  photo_url: string | null;
};

type HiredLawyer = {
  id: number;
  name: string;
  photo_url: string | null;
  rating: number | null;
  reviews_count: number;
  specialization: string;
  verified: boolean;
};

type Payment = {
  agreed_amount: number;
  currency: string;
  fee_percentage: number;
  id: number;
  lawyer_amount: number;
  note: string;
  paid_at: string | null;
  platform_fee: number;
  provider: string | null;
  reference: string;
  status: string;
  status_label: string;
};

type Specialization = {
  id: number;
  name: string;
};

type AttentionFlag = {
  label: string;
  value: string;
};

export type TimelineKey =
  | "posted"
  | "approved"
  | "offers"
  | "hired"
  | "pending_fees"
  | "in_progress"
  | "pending_closure"
  | "closed"
  | "reviewed";

export type TimelineState = "done" | "current" | "upcoming";

export type TimeLine = {
  // Upcoming steps have no date yet.
  at: string | null;
  key: TimelineKey;
  label: string;
  note: string | null;
  state: TimelineState;
};

export type CaseMonitoring = {
  budget_disclosed: boolean;
  budget_max: number;
  budget_min: number;
  can_close: boolean;
  can_edit: boolean;
  chat_unlocked: boolean;
  city: string;
  closed_at: string | null;
  closed_by: string | null;
  closing_note: string | null;
  closure_requested_at: string | null;
  created_at: string;
  description: string;
  display_status: CaseStatus;
  display_status_label: string;
  documents_count: number;
  fee_paid_at: string | null;
  has_offers: boolean;
  hired_at: string | null;
  id: number;
  offers_count: number;
  rejection_reason: string | null;
  reviewed_at: string | null;
  status: CaseStatus;
  status_label: string;
  title: string;
  urgency: "urgent" | "standard" | "very_urgent";
  urgency_label: string;
  accepted_offer: Offer;
  client: Client;
  hired_lawyer: HiredLawyer;
  payment: Payment | null;
  specialization: Specialization;
  attention_flags: AttentionFlag[];
  agreed_price: number;
  closure_requested_by: null | string;
  currency: string;
  is_hire_request: boolean;
  last_activity_at: string;
  messages_count: number;
  needs_attention: boolean;
  request_decline_reason: null | string;
  request_declined_at: null | string;
  requested_lawyer: null | HiredLawyer;
  review: null;
  timeline: TimeLine[];
};

// Response of `GET /api/admin/case-monitoring`.
export type CaseMonitoringResponse = {
  counts: Counts;
  data: CaseMonitoring[];
  meta: Pagination;
};

// The only case fields the chat transcript needs on the client.
export type ChatParticipants = {
  caseId: number;
  client: Pick<Client, "id" | "name" | "photo_url">;
  lawyer: Pick<HiredLawyer, "name" | "photo_url">;
};

// Date format shared by every date shown in this feature.
export const DATE_FORMAT = {
  day: "2-digit",
  month: "short",
  year: "numeric",
} as const satisfies Intl.DateTimeFormatOptions;

// Formats an amount in the given ISO currency, falling back to a plain number
// with the code when the API sends an unknown currency.
export function formatMoney(
  format: Pick<ReturnType<typeof useFormatter>, "number">,
  amount: number,
  currency: string,
): string {
  try {
    return format.number(amount, { style: "currency", currency });
  } catch {
    return `${currency} ${format.number(amount)}`.trim();
  }
}

// "Last activity" of a case, as computed by the API (includes chat activity).
// Returns null when the API sends no date or an unparsable one.
export function getLastActivity(caseItem: CaseMonitoring): Date | null {
  if (!caseItem.last_activity_at) return null;

  const date = new Date(caseItem.last_activity_at);
  return Number.isNaN(date.getTime()) ? null : date;
}

export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 400;

// Shared by the check-in message and the dispute flag forms.
export const caseMessageSchema = (t: T) =>
  z.object({
    body: z
      .string()
      .trim()
      .min(MESSAGE_MIN_LENGTH, t("messageMinLength"))
      .max(MESSAGE_MAX_LENGTH, t("messageMaxLength")),
  });

export type CaseMessageFormValues = z.infer<
  ReturnType<typeof caseMessageSchema>
>;

export type CaseMessageResult =
  | { success: true; message: string }
  | {
      success: false;
      error: "forbidden" | "failed";
      errors?: Partial<Record<keyof CaseMessageFormValues, string>>;
    };
