export interface UserProfile {
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  is_admin?: boolean;
  registration_fee_paid: boolean;
  joined_at: string;
  plan?: "free" | "affiliate";
}

export type AffiliateStatus = "active" | "suspended" | "expired";

export interface Affiliate {
  affiliate_id: string; // e.g. "EMM1001"
  user_id: string;
  referral_code: string; // e.g. "EMM1001"
  sponsor_id: string | null; // referred by affiliate_id
  status: AffiliateStatus;
  created_at: string;
}

export interface Referral {
  referral_id: string;
  sponsor_id: string; // affiliate_id of the sponsor
  referred_user_id: string; // user_id of the referred affiliate
  join_date: string;
}

export type DonationStatus = "paid" | "overdue" | "pending";

export interface Donation {
  donation_id: string;
  user_id: string;
  amount: number;
  payment_date: string | null;
  due_date: string;
  status: DonationStatus;
  payment_reference?: string;
}

export type CommissionType = "registration" | "recurring";
export type CommissionStatus = "withdrawable" | "pending" | "withdrawn";

export interface Commission {
  commission_id: string;
  affiliate_id: string; // who earns this
  source_user_id: string; // who triggered this
  commission_type: CommissionType;
  amount: number;
  status: CommissionStatus;
  created_at: string;
}

export type WithdrawalStatus = "pending" | "approved" | "rejected";

export interface Withdrawal {
  withdrawal_id: string;
  affiliate_id: string;
  amount: number;
  status: WithdrawalStatus;
  created_at: string;
  resolved_at?: string;
  notes?: string;
  account_number?: string;
  bank_name?: string;
}

export interface AdminConfig {
  commission_mode: "percentage" | "fixed";
  registration_rate: number; // e.g. 20 (for 20%) or 2000 (for ₦2000 fixed)
  recurring_rate: number;    // e.g. 20 (for 20%) or 1000 (for ₦1000 fixed)
  registration_fee: number;  // e.g. 10000 (for ₦10000 registration)
  monthly_donation_amount: number; // e.g. 5000 (for ₦5000 monthly due)
  minimum_withdrawal: number; // e.g. 2000 (for ₦2000 min)
  flutterwave_bank_name?: string;
  flutterwave_account_number?: string;
  flutterwave_account_name?: string;
}

export interface AppNotification {
  notification_id: string;
  user_id: string; // target user_id or "all_admins" or "broadcast"
  title: string;
  message: string;
  created_at: string;
  read: boolean;
}

export interface AuditLog {
  log_id: string;
  user_id: string;
  action: string;
  details: string;
  created_at: string;
}
