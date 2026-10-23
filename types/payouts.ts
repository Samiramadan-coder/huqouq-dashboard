export const payoutTabs = ["by-lawyer", "all-transactions"] as const;

export type TabType = (typeof payoutTabs)[number];

export type Summary = {
  currency: string;
  lawyers_with_balance: number;
  paid_this_month: number;
  ready_for_payout: number;
  total_pending: number;
};

type PayoutLawyer = {
  id: number;
  name: string;
  photo_url: string | null;
};

export type ByLawyerData = {
  account_name: string | null;
  can_process_payout: boolean;
  iban: string | null;
  ls_pending: number;
  ls_ready: number;
  payout_details_missing: boolean;
  pending: number;
  ready: number;
  total_paid: number;
  lawyer: PayoutLawyer;
};

// What the by-lawyer table renders. Bank details are replaced by a masked IBAN;
// the full IBAN is only fetched on demand (see `getPayoutAccount`).
export type ByLawyerRow = Omit<ByLawyerData, "iban" | "account_name"> & {
  masked_iban: string | null;
};

export type TransactionStatus = "pending" | "ready" | "paid";

export type AllTransactionsData = {
  amount: number;
  becomes_ready_on: null | string;
  currency: string;
  date: string;
  earned_at: string | null;
  fee_percentage: number;
  gross: number;
  id: string;
  paid_date: null | string;
  paid_reference: null | string;
  payout_id: null | string;
  pending_note: string | null;
  platform_fee: number;
  service_type: string;
  service_type_label: string;
  source_id: number;
  status: TransactionStatus;
  status_label: string;
  type: string;
  type_label: string;
  client: {
    first_name: string;
  };
  lawyer: PayoutLawyer;
};

// Response of `GET /api/admin/payouts`.
export type PayoutsResponse = {
  summary: Summary;
  payout_details_missing: boolean;
  data: ByLawyerData[];
};

// Response of `GET /api/admin/payouts/transactions`.
export type TransactionsResponse = {
  data: AllTransactionsData[];
};

export type PayoutAccountResult =
  | { success: true; iban: string; accountName: string | null }
  | { success: false; error: "not_found" | "forbidden" | "failed" };
