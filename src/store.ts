import {
  UserProfile,
  Affiliate,
  Referral,
  Donation,
  Commission,
  Withdrawal,
  AdminConfig,
  AppNotification,
  AuditLog,
  AffiliateStatus,
  DonationStatus,
  PremiumProduct
} from "./types";

// Base Seed Data If Storage Is Empty
const SEED_USERS: UserProfile[] = [
  {
    user_id: "USR_ADMIN",
    full_name: "Emmacom Admin",
    email: "admin@emmacomdigital.com",
    phone: "+234 801 234 5678",
    avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=admin",
    is_admin: true,
    registration_fee_paid: true,
    joined_at: "2026-01-01T12:00:00Z"
  },
  {
    user_id: "USR_JOHN",
    full_name: "John Obinna",
    email: "john@emmacomdigital.com",
    phone: "+234 803 111 2222",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    is_admin: false,
    registration_fee_paid: true,
    joined_at: "2026-02-15T09:30:00Z"
  },
  {
    user_id: "USR_MARY",
    full_name: "Mary Alao",
    email: "mary@emmacomdigital.com",
    phone: "+234 815 333 4444",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=mary",
    is_admin: false,
    registration_fee_paid: true,
    joined_at: "2026-03-10T14:15:00Z"
  },
  {
    user_id: "USR_DAVID",
    full_name: "David Kalu",
    email: "david@emmacomdigital.com",
    phone: "+234 802 555 6666",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    is_admin: false,
    registration_fee_paid: true,
    joined_at: "2026-03-22T11:00:00Z"
  },
  {
    user_id: "USR_SARAH",
    full_name: "Sarah Lawson",
    email: "sarah@emmacomdigital.com",
    phone: "+234 901 777 8888",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    is_admin: false,
    registration_fee_paid: true,
    joined_at: "2026-04-05T10:00:00Z"
  },
  {
    user_id: "USR_PAUL",
    full_name: "Paul Nwachukwu",
    email: "paul@emmacomdigital.com",
    phone: "+234 810 999 0000",
    avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=paul",
    is_admin: false,
    registration_fee_paid: true,
    joined_at: "2026-04-20T16:20:00Z"
  }
];

const SEED_AFFILIATES: Affiliate[] = [
  {
    affiliate_id: "EMM1001",
    user_id: "USR_JOHN",
    referral_code: "EMM1001",
    sponsor_id: null,
    status: "active",
    created_at: "2026-02-15T09:30:00Z"
  },
  {
    affiliate_id: "EMM2002",
    user_id: "USR_MARY",
    referral_code: "EMM2002",
    sponsor_id: "EMM1001", // Referred by John
    status: "active",
    created_at: "2026-03-10T14:15:00Z"
  },
  {
    affiliate_id: "EMM3003",
    user_id: "USR_DAVID",
    referral_code: "EMM3003",
    sponsor_id: "EMM1001", // Referred by John
    status: "expired", // This affiliate's due date has lapsed, making David inactive
    created_at: "2026-03-22T11:00:00Z"
  },
  {
    affiliate_id: "EMM4004",
    user_id: "USR_SARAH",
    referral_code: "EMM4004",
    sponsor_id: "EMM2002", // Referred by Mary
    status: "active",
    created_at: "2026-04-05T10:00:00Z"
  },
  {
    affiliate_id: "EMM5005",
    user_id: "USR_PAUL",
    referral_code: "EMM5005",
    sponsor_id: "EMM2002", // Referred by Mary
    status: "suspended", // Suspended manually by Admin
    created_at: "2026-04-20T16:20:00Z"
  }
];

const SEED_REFERRALS: Referral[] = [
  {
    referral_id: "REF_001",
    sponsor_id: "EMM1001",
    referred_user_id: "USR_MARY",
    join_date: "2026-03-10T14:15:00Z"
  },
  {
    referral_id: "REF_002",
    sponsor_id: "EMM1001",
    referred_user_id: "USR_DAVID",
    join_date: "2026-03-22T11:00:00Z"
  },
  {
    referral_id: "REF_003",
    sponsor_id: "EMM2002",
    referred_user_id: "USR_SARAH",
    join_date: "2026-04-05T10:00:00Z"
  },
  {
    referral_id: "REF_004",
    sponsor_id: "EMM2002",
    referred_user_id: "USR_PAUL",
    join_date: "2026-04-20T16:20:00Z"
  }
];

// Seed Donations
const SEED_DONATIONS: Donation[] = [
  {
    donation_id: "DON_JOHN_1",
    user_id: "USR_JOHN",
    amount: 5000,
    payment_date: "2026-06-01T10:00:00Z",
    due_date: "2026-07-01T10:00:00Z",
    status: "paid",
    payment_reference: "FLW-SIMU-JH194"
  },
  {
    donation_id: "DON_MARY_1",
    user_id: "USR_MARY",
    amount: 5000,
    payment_date: "2026-06-02T11:30:00Z",
    due_date: "2026-07-02T11:30:00Z",
    status: "paid",
    payment_reference: "FLW-SIMU-MR024"
  },
  {
    donation_id: "DON_DAVID_1",
    user_id: "USR_DAVID",
    amount: 5000,
    payment_date: "2026-04-15T09:00:00Z",
    due_date: "2026-05-15T09:00:00Z", // Past due -> Status: overdue, Affiliate status: expired
    status: "overdue",
    payment_reference: "FLW-SIMU-DV931"
  },
  {
    donation_id: "DON_SARAH_1",
    user_id: "USR_SARAH",
    amount: 5000,
    payment_date: "2026-06-05T16:00:00Z",
    due_date: "2026-07-05T16:00:00Z",
    status: "paid",
    payment_reference: "FLW-SIMU-SR452"
  },
  {
    donation_id: "DON_PAUL_1",
    user_id: "USR_PAUL",
    amount: 5000,
    payment_date: "2026-04-20T16:20:00Z",
    due_date: "2026-05-20T16:20:00Z", // Due date expired, but also manually suspended
    status: "overdue",
    payment_reference: "FLW-SIMU-PL884"
  }
];

// Seed Commissions
const SEED_COMMISSIONS: Commission[] = [
  // John referred Mary (joined with Registration Fee of ₦10,000, 20% registration commission = ₦2,000)
  {
    commission_id: "COM_001",
    affiliate_id: "EMM1001", // John
    source_user_id: "USR_MARY",
    commission_type: "registration",
    amount: 2000,
    status: "withdrawable",
    created_at: "2026-03-10T14:15:00Z"
  },
  // John referred David (joined, 20% on registration fee)
  {
    commission_id: "COM_002",
    affiliate_id: "EMM1001", // John
    source_user_id: "USR_DAVID",
    commission_type: "registration",
    amount: 2000,
    status: "withdrawn", // already paid out
    created_at: "2026-03-22T11:00:00Z"
  },
  // John gets ₦1,000 recurring commission for Mary's June donation
  {
    commission_id: "COM_003",
    affiliate_id: "EMM1001", // John
    source_user_id: "USR_MARY",
    commission_type: "recurring",
    amount: 1000,
    status: "withdrawable",
    created_at: "2026-06-02T11:30:00Z"
  },
  // David's donation has expired, so no recurring commissions generated for David.
  // Mary referred Sarah (20% of ₦10,000 registration fee = ₦2,000)
  {
    commission_id: "COM_004",
    affiliate_id: "EMM2002", // Mary
    source_user_id: "USR_SARAH",
    commission_type: "registration",
    amount: 2000,
    status: "withdrawable",
    created_at: "2026-04-05T10:00:00Z"
  },
  // Mary gets ₦1,000 recurring commission for Sarah's June donation
  {
    commission_id: "COM_005",
    affiliate_id: "EMM2002", // Mary
    source_user_id: "USR_SARAH",
    commission_type: "recurring",
    amount: 1000,
    status: "withdrawable",
    created_at: "2026-06-05T16:00:00Z"
  },
  // Mary referred Paul (Paul has registration, but Mary got it in April)
  {
    commission_id: "COM_006",
    affiliate_id: "EMM2002", // Mary
    source_user_id: "USR_PAUL",
    commission_type: "registration",
    amount: 2000,
    status: "withdrawn",
    created_at: "2026-04-20T16:20:00Z"
  }
];

const SEED_WITHDRAWALS: Withdrawal[] = [
  {
    withdrawal_id: "WTH_001",
    affiliate_id: "EMM1001", // John
    amount: 4000, // David's withdrawn ₦2,000 + Mary original + other (let's make it ₦2,000 to match)
    status: "approved",
    created_at: "2026-04-01T15:00:00Z",
    resolved_at: "2026-04-02T10:00:00Z",
    notes: "Paid via GTBank Transfer",
    account_number: "0123456789",
    bank_name: "Guaranty Trust Bank"
  },
  {
    withdrawal_id: "WTH_002",
    affiliate_id: "EMM2002", // Mary
    amount: 2000,
    status: "approved",
    created_at: "2026-05-01T17:00:00Z",
    resolved_at: "2026-05-02T12:00:00Z",
    notes: "Paid via Zenith Bank Transfer",
    account_number: "2211004455",
    bank_name: "Zenith Bank"
  },
  {
    withdrawal_id: "WTH_003",
    affiliate_id: "EMM1001", // John
    amount: 2500,
    status: "pending",
    created_at: "2026-06-12T09:00:00Z",
    account_number: "0123456789",
    bank_name: "Guaranty Trust Bank"
  }
];

const DEFAULT_CONFIG: AdminConfig = {
  commission_mode: "percentage",
  registration_rate: 20, // 20%
  recurring_rate: 20, // 20%
  registration_fee: 10000, // ₦10,000
  monthly_donation_amount: 5000, // ₦5,000
  minimum_withdrawal: 2000, // ₦2000
  flutterwave_bank_name: "Wema Bank (FW)",
  flutterwave_account_number: "0048127392",
  flutterwave_account_name: "Emmacom Digital Academy Hub / Flutterwave",
  
  // Custom CMS page content defaults
  homepage_hero_title: "Acquire High-Income Skills. Earn Uncapped Commissions.",
  homepage_hero_subtitle: "Emmacom Digital Academy combines elite masterclasses in full-stack cloud dev, organic growth hacks, and funnels structure with a real-time high-performance single-tier affiliate distribution platform.",
  homepage_badge_text: "Authorized Multi-Tier Skill Acquisition Platform",
  join_page_title: "Join Emmacom Digital Academy Affiliate Program",
  join_page_subtitle: "Sign up to unlock professional digital products, premium marketing assets, member privileges, and start earning recurring single-level commissions.",
  join_badge_text: "Emmacom Digital Academy Onboarding",
  intro_video_url: "https://www.youtube.com/embed/13dXWhffS98",
  
  faqs: [
    {
      id: "faq-1",
      question: "What is Emmacom Digital Academy and how does the affiliate program work?",
      answer: "Emmacom Digital Academy is an elite skill and digital assets hub. Members pay a one-time registration fee to unlock comprehensive premium digital products, high-ticket masterclasses, and pre-formatted marketing assets. Once registered, you obtain an authorized affiliate partner license, allowing you to recruit others using your link and earn both immediate registration commissions (20%) and recurring passive rewards."
    },
    {
      id: "faq-2",
      question: "Is there a monthly commitment required to keep my affiliate status active?",
      answer: "Yes, to ensure high system integrity and support the ongoing development of the community, partners contribute a monthly platform maintenance compliance fee (₦5,000). Active contributions are required to remain eligible to withdraw earnings and generate recurring commissions from your referred partners' actions."
    },
    {
      id: "faq-3",
      question: "How do I request a withdrawal and when do I get paid?",
      answer: "When your wallet reaches the minimum withdrawable balance (₦2,000), you can enter your local bank name and account details directly in your Affiliate Dashboard. Once requested, admin reviews and clears your funds instantly, which are processed with complete audit trails to your bank."
    },
    {
      id: "faq-4",
      question: "Can I join from anywhere in the world?",
      answer: "Absolutely! Although database examples and base fees are displayed in Naira (₦) for local processing convenience, our masterclasses, referral networks, and cloud integrations are accessible worldwide on global serverless nodes."
    }
  ]
};

const SEED_PREMIUM_PRODUCTS: PremiumProduct[] = [
  {
    id: "p-1",
    name: "Conversion Secrets: Digital Affiliate Handbook",
    image: "/images/p1_affiliate_handbook.jpg",
    desc: "Proven tactics and copy-paste templates to target social media platforms to refer new users.",
    badge: "E-BOOK HANDBOOK",
    pdfUrl: "https://drive.google.com/file/d/1BfS10Xp70X8O3fVq7D_7Z_S07Z4H9n_K/view?usp=sharing",
    videoUrl: "https://www.youtube.com/embed/g6BtbFwA880"
  },
  {
    id: "p-2",
    name: "WhatsApp Auto-Responder Templates & Funnel Swipe File",
    image: "/images/p2_whatsapp_templates.jpg",
    desc: "Boost communication response rates using our exact sequence swipe codes.",
    badge: "MOCK TRANSCRIPT",
    pdfUrl: "https://drive.google.com/file/d/1D9r8N6p-m8oW2MhQ0p3_N9Z9mG6t7H9n/view?usp=sharing",
    videoUrl: "https://www.youtube.com/embed/13dXWhffS98"
  },
  {
    id: "p-3",
    name: "Naira Arbitrage Master Spreadsheets & Audit Pack",
    image: "/images/p3_arbitrage_excel.jpg",
    desc: "Accurately record metrics, track margins, and evaluate business efficiency.",
    badge: "EXCEL WORKBOOK",
    pdfUrl: "https://drive.google.com/file/d/1H1p2S4r_nKoX4M9T9v7-X_Z7QG6H9n_K/view?usp=sharing",
    videoUrl: "https://www.youtube.com/embed/d_6kY5G_6pI"
  },
  {
    id: "p-4",
    name: "Advanced Google Search Ads Campaign Guide",
    image: "/images/p4_google_ads_guide.jpg",
    desc: "Scale highly targeted conversion pipelines to generate automated referral codes signups.",
    badge: "VIDEO SECRETS",
    pdfUrl: "https://drive.google.com/file/d/1J2q3S5r_m8oX2MhQ9p6_X_Z9mG6t7H9n/view?usp=sharing",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "p-5",
    name: "Emmacom Automated Multi-Channel Campaign Broadcaster",
    image: "/images/p5_campaign_broadcaster.jpg",
    desc: "Broadcast personalized messages to multiple networks safely without account suspension.",
    badge: "UTILITY PIPELINE",
    pdfUrl: "https://drive.google.com/file/d/1L3r4S6p-m9oW3MhQ2p4_X_Z9mG6t7H9n/view?usp=sharing",
    videoUrl: "https://www.youtube.com/embed/V-_O7nl0Ii0"
  },
  {
    id: "p-6",
    name: "Single-Tier Funnel Builder React Starter Kit",
    image: "/images/p6_funnel_builder.jpg",
    desc: "Spin up high-converting landing sheets that perfectly sync sponsorship IDs on redirect.",
    badge: "REACT FRAMEWORK",
    pdfUrl: "https://drive.google.com/file/d/1N4r5S7p-m0oW4MhQ3p5_X_Z9mG6t7H9n/view?usp=sharing",
    videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0"
  }
];

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    notification_id: "NTF_001",
    user_id: "USR_JOHN",
    title: "New Affiliate Sign-up",
    message: "Mary Alao registered under your referral link EMM1001. You earned a ₦2,000 Registration Commission!",
    created_at: "2026-03-10T14:15:00Z",
    read: false
  },
  {
    notification_id: "NTF_002",
    user_id: "USR_JOHN",
    title: "Commission Earned",
    message: "You earned a recurring commission of ₦1,000 from Mary Alao's monthly donation.",
    created_at: "2026-06-02T11:30:00Z",
    read: false
  },
  {
    notification_id: "NTF_003",
    user_id: "USR_DAVID",
    title: "Monthly Donation Due",
    message: "Your monthly donation to Emmacom Digital Academy is overdue. Access is currently restricted and sponsor eligibility is paused.",
    created_at: "2026-05-15T09:00:00Z",
    read: true
  },
  {
    notification_id: "NTF_004",
    user_id: "all_admins",
    title: "New Withdrawal Request",
    message: "John Obinna requested a withdrawal of ₦2,500 to Guaranty Trust Bank.",
    created_at: "2026-06-12T09:00:00Z",
    read: false
  }
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    log_id: "LOG_001",
    user_id: "USR_ADMIN",
    action: "System Initialization",
    details: "Affiliate marketing schemas and configuration parameters successfully initialized.",
    created_at: "2026-06-01T00:00:00Z"
  }
];

// LocalStorage helpers
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) return defaultValue;
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Global Store State Manager Class or Functions
export class AffiliateSystemStore {
  public users: UserProfile[];
  public affiliates: Affiliate[];
  public referrals: Referral[];
  public donations: Donation[];
  public commissions: Commission[];
  public withdrawals: Withdrawal[];
  public config: AdminConfig;
  public notifications: AppNotification[];
  public auditLogs: AuditLog[];
  public systemDate: string; // ISO string to simulate passage of time
  public premiumProducts: PremiumProduct[];

  constructor() {
    this.users = loadFromStorage<UserProfile[]>("emmacom_users", SEED_USERS);
    this.affiliates = loadFromStorage<Affiliate[]>("emmacom_affiliates", SEED_AFFILIATES);
    this.referrals = loadFromStorage<Referral[]>("emmacom_referrals", SEED_REFERRALS);
    this.donations = loadFromStorage<Donation[]>("emmacom_donations", SEED_DONATIONS);
    this.commissions = loadFromStorage<Commission[]>("emmacom_commissions", SEED_COMMISSIONS);
    this.withdrawals = loadFromStorage<Withdrawal[]>("emmacom_withdrawals", SEED_WITHDRAWALS);
    this.config = { ...DEFAULT_CONFIG, ...loadFromStorage<AdminConfig>("emmacom_config", DEFAULT_CONFIG) };
    this.notifications = loadFromStorage<AppNotification[]>("emmacom_notifications", SEED_NOTIFICATIONS);
    this.auditLogs = loadFromStorage<AuditLog[]>("emmacom_logs", SEED_AUDIT_LOGS);
    this.systemDate = loadFromStorage<string>("emmacom_system_date", "2026-06-13T10:00:00Z");
    this.premiumProducts = loadFromStorage<PremiumProduct[]>("emmacom_premium_products", SEED_PREMIUM_PRODUCTS);

    // Migrate any Unsplash image URLs to the new local public image paths automatically
    this.premiumProducts = this.premiumProducts.map(p => {
      if (p.image && p.image.includes("unsplash.com")) {
        const seedMatch = SEED_PREMIUM_PRODUCTS.find(sp => sp.id === p.id);
        if (seedMatch) {
          return { ...p, image: seedMatch.image };
        }
      }
      return p;
    });

    // Persist if not already there
    this.saveAll();
  }

  public saveAll(): void {
    saveToStorage("emmacom_users", this.users);
    saveToStorage("emmacom_affiliates", this.affiliates);
    saveToStorage("emmacom_referrals", this.referrals);
    saveToStorage("emmacom_donations", this.donations);
    saveToStorage("emmacom_commissions", this.commissions);
    saveToStorage("emmacom_withdrawals", this.withdrawals);
    saveToStorage("emmacom_config", this.config);
    saveToStorage("emmacom_notifications", this.notifications);
    saveToStorage("emmacom_logs", this.auditLogs);
    saveToStorage("emmacom_system_date", this.systemDate);
    saveToStorage("emmacom_premium_products", this.premiumProducts);
  }

  // Calculate commission amounts according to parameters
  private calculateEarnedAmount(type: "registration" | "recurring"): number {
    const isFixed = this.config.commission_mode === "fixed";
    if (type === "registration") {
      return isFixed 
        ? this.config.registration_rate 
        : (this.config.registration_fee * this.config.registration_rate) / 100;
    } else {
      return isFixed 
        ? this.config.recurring_rate 
        : (this.config.monthly_donation_amount * this.config.recurring_rate) / 100;
    }
  }

  // Create an Audit Log
  public addAuditLog(userId: string, action: string, details: string): void {
    const log: AuditLog = {
      log_id: `LOG_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      user_id: userId,
      action,
      details,
      created_at: this.systemDate
    };
    this.auditLogs.unshift(log);
    this.saveAll();
  }

  // Create a Notification
  public addNotification(userId: string, title: string, message: string): void {
    const notif: AppNotification = {
      notification_id: `NTF_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      user_id: userId,
      title,
      message,
      created_at: this.systemDate,
      read: false
    };
    this.notifications.unshift(notif);
    this.saveAll();
  }

  // Check Sponsor Eligibility
  // Rules:
  // - Sponsor account is active (status === 'active')
  // - Sponsor has paid their own monthly donation (most recent donation's due_date > systemDate, and donation isn't overdue)
  public isSponsorEligible(sponsorAffId: string): { eligible: boolean; reason: string } {
    const sponsor = this.affiliates.find(a => a.affiliate_id === sponsorAffId);
    if (!sponsor) {
      return { eligible: false, reason: "Sponsor not found in affiliate directory" };
    }

    if (sponsor.status === "suspended") {
      return { eligible: false, reason: "Sponsor account is manually suspended by administrator." };
    }

    if (sponsor.status === "expired") {
      return { eligible: false, reason: "Sponsor account has expired due to unpaid monthly donation compliance." };
    }

    // Secondary verification: Check sponsor's donation dates
    const sponsorDonations = this.donations.filter(d => d.user_id === sponsor.user_id && d.status === "paid");
    if (sponsorDonations.length === 0) {
      return { eligible: false, reason: "Sponsor has no active monthly donations recorded." };
    }

    // Find if current system date is past the latest donation's due date
    const latestDonation = sponsorDonations.sort((a,b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime())[0];
    if (new Date(this.systemDate).getTime() > new Date(latestDonation.due_date).getTime()) {
      return { eligible: false, reason: "Sponsor monthly donation eligibility window has expired." };
    }

    return { eligible: true, reason: "Sponsor is active and compliant" };
  }

  // Join process (includes registration fee simulation)
  public registerNewAffiliate(params: {
    fullName: string;
    email: string;
    phone: string;
    sponsorCode: string | null;  // affiliate_id
    simulatedPaymentRef: string;
  }): { success: boolean; error?: string; user?: UserProfile; affiliate?: Affiliate } {
    // Check if email already registered
    if (this.users.some(u => u.email.toLowerCase() === params.email.toLowerCase())) {
      return { success: false, error: "This email address is already registered on Emmacom Digital Academy." };
    }

    const userId = `USR_${Date.now()}`;
    const affiliateId = `EMM${Math.floor(1000 + Math.random() * 9000)}`;

    // Create User Profile
    const newUser: UserProfile = {
      user_id: userId,
      full_name: params.fullName,
      email: params.email,
      phone: params.phone,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(params.fullName)}`,
      registration_fee_paid: true,
      joined_at: this.systemDate,
      is_admin: false
    };

    // Determine sponsor status
    let validSponsorId: string | null = null;
    if (params.sponsorCode) {
      const parentAff = this.affiliates.find(
        a => a.affiliate_id.toUpperCase() === params.sponsorCode?.toUpperCase() ||
             a.referral_code.toUpperCase() === params.sponsorCode?.toUpperCase()
      );
      if (parentAff) {
        validSponsorId = parentAff.affiliate_id;
      }
    }

    // Create Affiliate Profile (automatically starts active since registration pays the immediate donation or sets registration status)
    const newAffiliate: Affiliate = {
      affiliate_id: affiliateId,
      user_id: userId,
      referral_code: affiliateId,
      sponsor_id: validSponsorId,
      status: "active",
      created_at: this.systemDate
    };

    // Calculate next donation date (30 days from now)
    const seedDate = new Date(this.systemDate);
    seedDate.setDate(seedDate.getDate() + 30);
    const dueDateISO = seedDate.toISOString();

    // Create immediate active donation object (since registration includes entry and active benefits)
    const signupDonation: Donation = {
      donation_id: `DON_${Date.now()}`,
      user_id: userId,
      amount: this.config.monthly_donation_amount,
      payment_date: this.systemDate,
      due_date: dueDateISO,
      status: "paid",
      payment_reference: params.simulatedPaymentRef
    };

    // Update state lists
    this.users.push(newUser);
    this.affiliates.push(newAffiliate);
    this.donations.push(signupDonation);

    if (validSponsorId) {
      // Create Referral Relationship Log
      const referral: Referral = {
        referral_id: `REF_${Date.now()}`,
        sponsor_id: validSponsorId,
        referred_user_id: userId,
        join_date: this.systemDate
      };
      this.referrals.push(referral);

      // Handle commission trigger (One-time Registration Commission)
      const isEligible = this.isSponsorEligible(validSponsorId);
      const commissionAmount = this.calculateEarnedAmount("registration");

      const earningSponsor = this.affiliates.find(a => a.affiliate_id === validSponsorId);

      const commission: Commission = {
        commission_id: `COM_${Date.now()}`,
        affiliate_id: validSponsorId,
        source_user_id: userId,
        commission_type: "registration",
        amount: commissionAmount,
        status: isEligible.eligible ? "withdrawable" : "pending", // Paused / Pending if sponsor inactive
        created_at: this.systemDate
      };
      this.commissions.push(commission);

      // Audits & Notifications
      this.addAuditLog(
        userId,
        "Affiliate Referral Registration",
        `Registered under sponsor affiliate ${validSponsorId}. Payment reference: ${params.simulatedPaymentRef}`
      );

      // Notify sponsor
      const sponsorUser = this.users.find(u => u.user_id === earningSponsor?.user_id);
      if (sponsorUser) {
        if (isEligible.eligible) {
          this.addNotification(
            sponsorUser.user_id,
            "New Referral Commission!",
            `Your referral ${params.fullName} has joined Emmacom Digital Academy. You have earned a one-time commission of ₦${commissionAmount.toLocaleString()}!`
          );
        } else {
          this.addNotification(
            sponsorUser.user_id,
            "Referral Commission Paused (Action Required)",
            `Your referral ${params.fullName} has joined, but your registration commission of ₦${commissionAmount.toLocaleString()} is PAUSED because your account compliance is inactive. Complete your outstanding monthly donation to unpause pending commissions.`
          );
        }
      }
    } else {
      this.addAuditLog(userId, "Direct Registration", `Direct system registration. Payment reference: ${params.simulatedPaymentRef}`);
    }

    // Notify admins
    this.addNotification(
      "all_admins",
      "New Affiliate Registree",
      `${params.fullName} has successfully registered as affiliate ID ${affiliateId}.`
    );

    this.saveAll();
    return { success: true, user: newUser, affiliate: newAffiliate };
  }

  // Handle free member registration
  public registerFreeMember(params: {
    fullName: string;
    email: string;
    phone: string;
    sponsorCode: string | null;
  }): { success: boolean; error?: string; user?: UserProfile } {
    if (this.users.some(u => u.email.toLowerCase() === params.email.toLowerCase())) {
      return { success: false, error: "This email address is already registered on Emmacom Digital Academy." };
    }

    const userId = `USR_${Date.now()}`;

    const newUser: UserProfile = {
      user_id: userId,
      full_name: params.fullName,
      email: params.email,
      phone: params.phone,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(params.fullName)}`,
      registration_fee_paid: false,
      joined_at: this.systemDate,
      is_admin: false,
      plan: "free"
    };

    this.users.push(newUser);

    let validSponsorId: string | null = null;
    if (params.sponsorCode) {
      const parentAff = this.affiliates.find(
        a => a.affiliate_id.toUpperCase() === params.sponsorCode?.toUpperCase() ||
             a.referral_code.toUpperCase() === params.sponsorCode?.toUpperCase()
      );
      if (parentAff) {
        validSponsorId = parentAff.affiliate_id;
      }
    }

    this.addAuditLog(
      userId,
      "Member Free Signup",
      `Registered as a free member.${validSponsorId ? ` Referred under sponsor affiliate ${validSponsorId}.` : " Direct registration."}`
    );

    this.addNotification(
      "all_admins",
      "New Free Member Registered",
      `${params.fullName} has joined as a Free Member.`
    );

    this.saveAll();
    return { success: true, user: newUser };
  }

  // Handle free member upgrade to affiliate
  public upgradeFreeMemberToAffiliate(userId: string, sponsorCode: string | null, paymentRef: string): { success: boolean; error?: string; affiliate?: Affiliate } {
    const user = this.users.find(u => u.user_id === userId);
    if (!user) {
      return { success: false, error: "User profile not found." };
    }

    const alreadyAffiliate = this.affiliates.find(a => a.user_id === userId);
    if (alreadyAffiliate) {
      return { success: false, error: "User is already an active affiliate." };
    }

    const affiliateId = `EMM${Math.floor(1000 + Math.random() * 9000)}`;

    // Update user info
    user.plan = "affiliate";
    user.registration_fee_paid = true;

    // Determine sponsor
    let validSponsorId: string | null = null;
    if (sponsorCode) {
      const parentAff = this.affiliates.find(
        a => a.affiliate_id.toUpperCase() === sponsorCode.toUpperCase() ||
             a.referral_code.toUpperCase() === sponsorCode.toUpperCase()
      );
      if (parentAff) {
        validSponsorId = parentAff.affiliate_id;
      }
    }

    // Create Affiliate Profile
    const newAffiliate: Affiliate = {
      affiliate_id: affiliateId,
      user_id: userId,
      referral_code: affiliateId,
      sponsor_id: validSponsorId,
      status: "active",
      created_at: this.systemDate
    };
    this.affiliates.push(newAffiliate);

    // Create immediate active donation object
    const seedDate = new Date(this.systemDate);
    seedDate.setDate(seedDate.getDate() + 30);
    const dueDateISO = seedDate.toISOString();

    const signupDonation: Donation = {
      donation_id: `DON_${Date.now()}`,
      user_id: userId,
      amount: this.config.monthly_donation_amount,
      payment_date: this.systemDate,
      due_date: dueDateISO,
      status: "paid",
      payment_reference: paymentRef
    };
    this.donations.push(signupDonation);

    if (validSponsorId) {
      // Create Referral Log
      const referral: Referral = {
        referral_id: `REF_${Date.now()}`,
        sponsor_id: validSponsorId,
        referred_user_id: userId,
        join_date: this.systemDate
      };
      this.referrals.push(referral);

      // Handle commission trigger (One-time Registration Commission)
      const isEligible = this.isSponsorEligible(validSponsorId);
      const commissionAmount = this.calculateEarnedAmount("registration");

      const commission: Commission = {
        commission_id: `COM_${Date.now()}`,
        affiliate_id: validSponsorId,
        source_user_id: userId,
        commission_type: "registration",
        amount: commissionAmount,
        status: isEligible.eligible ? "withdrawable" : "pending",
        created_at: this.systemDate
      };
      this.commissions.push(commission);

      // Audits & Notifications
      this.addAuditLog(
        userId,
        "Affiliate Partner Upgrade",
        `Upgraded to partner under sponsor affiliate ${validSponsorId}. Payment reference: ${paymentRef}`
      );

      // Notify sponsor
      const sponsorUser = this.users.find(u => u.user_id === this.affiliates.find(a => a.affiliate_id === validSponsorId)?.user_id);
      if (sponsorUser) {
        if (isEligible.eligible) {
          this.addNotification(
            sponsorUser.user_id,
            "New Referral Commission via Upgrade!",
            `Your referral ${user.full_name} has upgraded to Premium Affiliate. You have earned a commission of ₦${commissionAmount.toLocaleString()}!`
          );
        } else {
          this.addNotification(
            sponsorUser.user_id,
            "Referral Commission Paused (Action Required)",
            `Your referral ${user.full_name} has upgraded, but your registration commission of ₦${commissionAmount.toLocaleString()} is PAUSED because your account compliance is inactive.`
          );
        }
      }
    } else {
      this.addAuditLog(userId, "Direct Affiliate Partner Upgrade", `Upgraded to affiliate partner without sponsor. Payment reference: ${paymentRef}`);
    }

    // Notify admins
    this.addNotification(
      "all_admins",
      "Member Upgraded to Partner",
      `${user.full_name} has upgraded to affiliate partner as ID ${affiliateId}.`
    );

    this.saveAll();
    return { success: true, affiliate: newAffiliate };
  }

  // Handle donation compliance payments
  public payMonthlyDonation(userId: string, amount: number, paymentRef: string): { success: boolean; error?: string } {
    const user = this.users.find(u => u.user_id === userId);
    const affiliate = this.affiliates.find(a => a.user_id === userId);
    if (!user || !affiliate) {
      return { success: false, error: "Account could not be found to apply payment." };
    }

    // Determine target start date. If already expired and system is behind, start from systemDate.
    // If they were active or just paying in advance, stack it onto their current due date.
    const activeDonations = this.donations.filter(d => d.user_id === userId && d.status === "paid");
    let baseDate = new Date(this.systemDate);

    if (activeDonations.length > 0) {
      const latestDonation = activeDonations.sort(
        (a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
      )[0];
      const expiry = new Date(latestDonation.due_date);
      // If payment is made early, stack from previous due date
      if (expiry.getTime() > baseDate.getTime()) {
        baseDate = expiry;
      }
    }

    const nextDueDate = new Date(baseDate);
    nextDueDate.setDate(nextDueDate.getDate() + 30);

    const donation: Donation = {
      donation_id: `DON_${Date.now()}`,
      user_id: userId,
      amount,
      payment_date: this.systemDate,
      due_date: nextDueDate.toISOString(),
      status: "paid",
      payment_reference: paymentRef
    };

    this.donations.push(donation);

    // Re-verify the overdue donation records of this user and mark as resolved
    this.donations.forEach(d => {
      if (d.user_id === userId && d.status === "overdue") {
        d.status = "paid";
      }
    });

    // Reactivate affiliate account status
    const previousStatus = affiliate.status;
    affiliate.status = "active";

    this.addAuditLog(userId, "Monthly Donation Completed", `Paid ₦${amount.toLocaleString()} with reference ${paymentRef}.`);
    this.addNotification(userId, "Monthly Donation Received", `Thank you! Your donation has been recorded. Your next renewal is due on ${this.formatDate(nextDueDate.toISOString())}.`);

    // Handle recurring commission if this user was referred by someone
    if (affiliate.sponsor_id) {
      const sponsor = this.affiliates.find(a => a.affiliate_id === affiliate.sponsor_id);
      if (sponsor) {
        const isSponsorActive = this.isSponsorEligible(sponsor.affiliate_id);
        const recurringCommAmount = this.calculateEarnedAmount("recurring");

        const commission: Commission = {
          commission_id: `COM_${Date.now()}`,
          affiliate_id: sponsor.affiliate_id,
          source_user_id: userId,
          commission_type: "recurring",
          amount: recurringCommAmount,
          status: isSponsorActive.eligible ? "withdrawable" : "pending",
          created_at: this.systemDate
        };
        this.commissions.push(commission);

        // Notify sponsor
        if (isSponsorActive.eligible) {
          this.addNotification(
            sponsor.user_id,
            "Recurring Commission Earned!",
            `Your personal referral ${user.full_name} made their monthly donation. You earned a recurring commission of ₦${recurringCommAmount.toLocaleString()}!`
          );
        } else {
          this.addNotification(
            sponsor.user_id,
            "Recurring Commission Paused",
            `Your personal referral ${user.full_name} made their monthly donation, but safety eligibility paused your ₦${recurringCommAmount.toLocaleString()} commission as your account compliance is inactive.`
          );
        }
      }
    }

    // Unpause any of this User's own pending commissions if they just became active from expired
    if (previousStatus === "expired") {
      let unpausedCount = 0;
      let totalUnpaused = 0;
      this.commissions.forEach(c => {
        if (c.affiliate_id === affiliate.affiliate_id && c.status === "pending") {
          // Double check if referee was active too
          const refereeAffiliate = this.affiliates.find(a => a.user_id === c.source_user_id);
          if (refereeAffiliate && refereeAffiliate.status === "active") {
            c.status = "withdrawable";
            unpausedCount++;
            totalUnpaused += c.amount;
          }
        }
      });

      if (unpausedCount > 0) {
        this.addNotification(
          userId,
          "Commissions Re-activated!",
          `Since your account is now active, we have unlocked ${unpausedCount} pending commission(s) totaling ₦${totalUnpaused.toLocaleString()} in your wallet!`
        );
      }
    }

    this.saveAll();
    return { success: true };
  }

  // Create Withdrawal Request
  public requestWithdrawal(params: {
    affiliateId: string;
    amount: number;
    accountNo: string;
    bankName: string;
  }): { success: boolean; error?: string } {
    const affiliate = this.affiliates.find(a => a.affiliate_id === params.affiliateId);
    if (!affiliate) {
      return { success: false, error: "Selected affiliate profile does not exist." };
    }

    if (affiliate.status === "suspended") {
      return { success: false, error: "This affiliate account is manual-suspended. Withdrawal is disabled." };
    }

    // Safety checks: calculate current withdrawable balance
    const stats = this.getAffiliateStats(params.affiliateId);
    if (params.amount < this.config.minimum_withdrawal) {
      return { success: false, error: `The minimum withdrawal amount configured is ₦${this.config.minimum_withdrawal.toLocaleString()}` };
    }

    if (params.amount > stats.withdrawableBalance) {
      return { success: false, error: `Inadequate wallet balance. Combined withdrawable balance is ₦${stats.withdrawableBalance.toLocaleString()}` };
    }

    // Deduct dynamically (when withdrawal is approved, it converts to 'withdrawn'.
    // To cleanly account for pending withdrawals, we record them, and count them in pending calculations).
    const withdrawal: Withdrawal = {
      withdrawal_id: `WTH_${Date.now()}`,
      affiliate_id: params.affiliateId,
      amount: params.amount,
      status: "pending",
      created_at: this.systemDate,
      account_number: params.accountNo,
      bank_name: params.bankName
    };

    this.withdrawals.push(withdrawal);

    // Notify user
    this.addNotification(
      affiliate.user_id,
      "Withdrawal Requested",
      `Your request to withdraw ₦${params.amount.toLocaleString()} is pending administrator clearance details.`
    );

    // Notify admins
    this.addNotification(
      "all_admins",
      "New Payout Review",
      `Affiliate ${params.affiliateId} (${this.getUserByAffiliate(params.affiliateId)?.full_name}) requested ₦${params.amount.toLocaleString()}.`
    );

    this.addAuditLog(affiliate.user_id, "Payout Request Registered", `Filed standard withdrawal for ₦${params.amount.toLocaleString()}.`);

    this.saveAll();
    return { success: true };
  }

  // Admin approves withdrawal
  public approveWithdrawal(withdrawalId: string, notes: string): void {
    const wth = this.withdrawals.find(w => w.withdrawal_id === withdrawalId);
    if (!wth) return;

    wth.status = "approved";
    wth.notes = notes;
    wth.resolved_at = this.systemDate;

    // Deduct commission from 'withdrawable' status to 'withdrawn' status
    // To do this simply, we take pending withdrawable commissions of this affiliate and mark as 'withdrawn' up to the approved amount.
    let remainingToDeduct = wth.amount;
    const affiliateComms = this.commissions
      .filter(c => c.affiliate_id === wth.affiliate_id && c.status === "withdrawable")
      .sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    for (const comm of affiliateComms) {
      if (remainingToDeduct <= 0) break;
      if (comm.amount <= remainingToDeduct) {
        comm.status = "withdrawn";
        remainingToDeduct -= comm.amount;
      } else {
        // split commission if needed
        const previousAmount = comm.amount;
        comm.amount = previousAmount - remainingToDeduct; // remaining stays withdrawable
        
        // create a duplicate for the withdrawn portion
        const withdrawnSplit: Commission = {
          commission_id: `COM_SPLIT_${Date.now()}_${Math.random().toString(36).substr(2,3)}`,
          affiliate_id: comm.affiliate_id,
          source_user_id: comm.source_user_id,
          commission_type: comm.commission_type,
          amount: remainingToDeduct,
          status: "withdrawn",
          created_at: comm.created_at
        };
        this.commissions.push(withdrawnSplit);
        remainingToDeduct = 0;
      }
    }

    const affiliate = this.affiliates.find(a => a.affiliate_id === wth.affiliate_id);
    if (affiliate) {
      this.addNotification(
        affiliate.user_id,
        "Withdrawal Approved ✓",
        `Your payout request for ₦${wth.amount.toLocaleString()} has been cleared: ${notes}`
      );
      this.addAuditLog(affiliate.user_id, "Payout Disbursed ✓", `Payout of ₦${wth.amount.toLocaleString()} was approved manually. ${notes}`);
    }

    this.saveAll();
  }

  // Admin rejects withdrawal
  public rejectWithdrawal(withdrawalId: string, notes: string): void {
    const wth = this.withdrawals.find(w => w.withdrawal_id === withdrawalId);
    if (!wth) return;

    wth.status = "rejected";
    wth.notes = notes;
    wth.resolved_at = this.systemDate;

    const affiliate = this.affiliates.find(a => a.affiliate_id === wth.affiliate_id);
    if (affiliate) {
      this.addNotification(
        affiliate.user_id,
        "Withdrawal Declined ✗",
        `Your payout request for ₦${wth.amount.toLocaleString()} was declined: ${notes}`
      );
      this.addAuditLog(affiliate.user_id, "Payout Refused ✗", `Payout request was rejected. Details: ${notes}`);
    }

    this.saveAll();
  }

  // Admin toggles affiliate status
  public updateAffiliateStatus(affiliateId: string, newStatus: AffiliateStatus): void {
    const aff = this.affiliates.find(a => a.affiliate_id === affiliateId);
    if (!aff) return;

    const oldStatus = aff.status;
    aff.status = newStatus;

    this.addAuditLog(
      aff.user_id,
      "Affiliate Status Changed",
      `Changed affiliate status from ${oldStatus} to ${newStatus}.`
    );

    this.addNotification(
      aff.user_id,
      `Account Status Changed to ${newStatus.toUpperCase()}`,
      `An administrator has updated your status index. Reason: Regulatory audit.`
    );

    // If change is back to active, evaluate or unpause eligible commissions
    if (newStatus === "active" && oldStatus !== "active") {
      this.commissions.forEach(c => {
        if (c.affiliate_id === aff.affiliate_id && c.status === "pending") {
          const sourceAff = this.affiliates.find(a => a.user_id === c.source_user_id);
          if (sourceAff && sourceAff.status === "active") {
            c.status = "withdrawable";
          }
        }
      });
    }

    this.saveAll();
  }

  // Unpause all eligible commissions (when both Sponsor and Referee are Active)
  public evaluateCommissionCompliance(): void {
    this.commissions.forEach(comm => {
      if (comm.status === "pending") {
        const isSponElig = this.isSponsorEligible(comm.affiliate_id);
        const sourceAff = this.affiliates.find(a => a.user_id === comm.source_user_id);
        
        if (isSponElig.eligible && sourceAff && sourceAff.status === "active") {
          comm.status = "withdrawable";
          
          // Notify sponsor
          const sponsor = this.affiliates.find(a => a.affiliate_id === comm.affiliate_id);
          if (sponsor) {
            this.addNotification(
              sponsor.user_id,
              "Commission Released!",
              `A paused commission of ₦${comm.amount.toLocaleString()} has been unlocked and added to your Withdrawable balance now that both accounts are fully compliant!`
            );
          }
        }
      } else if (comm.status === "withdrawable") {
        // If sponsor or source has expired, pause it (convert back to pending) as per terms:
        // "If either party becomes inactive, recurring commissions are paused."
        const isSponElig = this.isSponsorEligible(comm.affiliate_id);
        const sourceAff = this.affiliates.find(a => a.user_id === comm.source_user_id);

        if (!isSponElig.eligible || !sourceAff || sourceAff.status !== "active") {
          comm.status = "pending";
        }
      }
    });
    this.saveAll();
  }

  // Simulate passage of 30 days time to inspect compliance expirations and paused payouts
  public simulatePassMonth(): void {
    const originalDate = new Date(this.systemDate);
    originalDate.setDate(originalDate.getDate() + 30);
    this.systemDate = originalDate.toISOString();

    // Check all active donations
    // Find who has failed to make a payment before their due_date
    const affiliatesWithDonations = this.affiliates;
    affiliatesWithDonations.forEach(aff => {
      if (aff.status === "suspended") return; // Keep suspended as suspended

      // Find if they have paid any donation that expires in the future relative to the new system time
      const activeDonationsOfUser = this.donations.filter(
        d => d.user_id === aff.user_id && d.status === "paid" && new Date(d.due_date).getTime() > originalDate.getTime()
      );

      if (activeDonationsOfUser.length === 0) {
        // No active compliant donation remains!
        aff.status = "expired";

        // Find the past due donations and mark as overdue
        this.donations.forEach(d => {
          if (d.user_id === aff.user_id && d.status === "paid" && new Date(d.due_date).getTime() <= originalDate.getTime()) {
            d.status = "overdue";
          }
        });

        this.addNotification(
          aff.user_id,
          "Affiliate Status Expired ⚠",
          "Your monthly donation due date has elapsed. To keep earning commissions and maintaining active status, please submit your outstanding monthly donation."
        );
      }
    });

    // Evaluate how existing commissions comply with updated expiration rules
    this.evaluateCommissionCompliance();

    this.addAuditLog(
      "USR_ADMIN",
      "Passed Time Simulator (+30 Days)",
      `Shifted administrative timezone to simulated date: ${this.formatDate(this.systemDate)}`
    );

    this.saveAll();
  }

  // Update administrative configurations
  public updateAdminConfig(newConfig: AdminConfig): void {
    this.config = { ...newConfig };
    this.addAuditLog("USR_ADMIN", "Modified Commission Settings", "Updated percentages, recurring multipliers, or registration triggers.");
    this.saveAll();
  }

  // Update Admin Profile (Email & Password)
  public updateAdminProfile(email: string, password?: string): void {
    const admin = this.users.find(u => u.is_admin === true);
    if (admin) {
      admin.email = email.trim().toLowerCase();
      if (password) {
        admin.password = password;
      }
      this.addAuditLog("USR_ADMIN", "Admin profile updated", `Admin credentials updated email to ${email} and set a unique password.`);
      this.saveAll();
    }
  }

  // Edit / update a premium suite product catalog item
  public updatePremiumProduct(id: string, name: string, desc: string, badge: string, image: string, pdfUrl?: string, videoUrl?: string): void {
    const product = this.premiumProducts.find(p => p.id === id);
    if (product) {
      product.name = name.trim();
      product.desc = desc.trim();
      product.badge = badge.trim();
      product.image = image.trim();
      product.pdfUrl = pdfUrl ? pdfUrl.trim() : "";
      product.videoUrl = videoUrl ? videoUrl.trim() : "";
      this.addAuditLog("USR_ADMIN", "Premium product updated", `Updated product layout for "${product.name}"`);
      this.saveAll();
    }
  }

  // Add a new premium suite product catalog item
  public addPremiumProduct(name: string, desc: string, badge: string, image: string, pdfUrl?: string, videoUrl?: string): string {
    const newId = `p-${Date.now()}`;
    const newProduct: PremiumProduct = {
      id: newId,
      name: name.trim(),
      desc: desc.trim(),
      badge: badge.trim(),
      image: image.trim() || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
      pdfUrl: pdfUrl ? pdfUrl.trim() : "",
      videoUrl: videoUrl ? videoUrl.trim() : ""
    };
    this.premiumProducts.push(newProduct);
    this.addAuditLog("USR_ADMIN", "Premium product added", `Created new catalog asset "${newProduct.name}"`);
    this.saveAll();
    return newId;
  }

  // Delete a premium suite product catalog item
  public deletePremiumProduct(id: string): void {
    const index = this.premiumProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      const deletedName = this.premiumProducts[index].name;
      this.premiumProducts.splice(index, 1);
      this.addAuditLog("USR_ADMIN", "Premium product deleted", `Removed catalog asset "${deletedName}"`);
      this.saveAll();
    }
  }

  // Restore defaults
  public restoreDefaultPremiumProducts(): void {
    this.premiumProducts = JSON.parse(JSON.stringify(SEED_PREMIUM_PRODUCTS));
    this.addAuditLog("USR_ADMIN", "Premium products restored", "Restored premium products to Unsplash defaults.");
    this.saveAll();
  }

  // Read utilities
  public getUserByAffiliate(affid: string): UserProfile | undefined {
    const affiliate = this.affiliates.find(a => a.affiliate_id === affid);
    if (!affiliate) return undefined;
    return this.users.find(u => u.user_id === affiliate.user_id);
  }

  public getAffiliateByUserId(userId: string): Affiliate | undefined {
    return this.affiliates.find(a => a.user_id === userId);
  }

  public getAffiliateStats(affiliateId: string) {
    const affiliate = this.affiliates.find(a => a.affiliate_id === affiliateId);
    if (!affiliate) {
      return {
        referralLink: "",
        totalPersonalReferrals: 0,
        activeReferrals: 0,
        inactiveReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        withdrawableBalance: 0,
        monthlyRecurringEarnings: 0,
        donationStatus: "pending" as DonationStatus,
        nextDueDate: "",
        commissionHistory: [] as Commission[],
        withdrawalHistory: [] as Withdrawal[]
      };
    }

    const referralLink = `${window.location.origin}/ref/${affiliate.affiliate_id}`;

    // Get personal referrals (sponsor_id === affiliateId)
    const directReferrals = this.affiliates.filter(a => a.sponsor_id === affiliateId);
    const totalPersonalReferrals = directReferrals.length;
    const activeReferrals = directReferrals.filter(a => a.status === "active").length;
    const inactiveReferrals = totalPersonalReferrals - activeReferrals;

    // Commission histories
    const myComms = this.commissions.filter(c => c.affiliate_id === affiliateId);
    
    // Total Earnings = all successfully generated commissions
    const totalEarnings = myComms.reduce((acc, c) => acc + c.amount, 0);

    // Withdrawable Balance = commissions marked as withdrawable, subtract any PENDING withdrawals (hold) or APPROVED withdrawals
    const totalWithdrawableComms = myComms.filter(c => c.status === "withdrawable").reduce((acc, c) => acc + c.amount, 0);
    const activeWithdrawals = this.withdrawals.filter(w => w.affiliate_id === affiliateId);
    
    // Deduct pending and approved withdrawals from total withdrawable commissions
    const pendingWithdrawalsTotal = activeWithdrawals.filter(w => w.status === "pending").reduce((acc, w) => acc + w.amount, 0);
    
    const withdrawableBalance = Math.max(0, totalWithdrawableComms - pendingWithdrawalsTotal);
    
    // Pending Earnings = commissions that are in "pending" status (paused due to non-eligibility / inactivity)
    const pendingEarnings = myComms.filter(c => c.status === "pending").reduce((acc, c) => acc + c.amount, 0);

    // Monthly recurring earnings (expected from currently active direct referrals)
    const activeDirectReferrals = directReferrals.filter(a => a.status === "active");
    const recurringRateValue = this.calculateEarnedAmount("recurring");
    const monthlyRecurringEarnings = activeDirectReferrals.length * recurringRateValue;

    // Donation Status of this affiliate
    const donations = this.donations.filter(d => d.user_id === affiliate.user_id);
    const latestDon = donations.sort((a,b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime())[0];
    
    const donationStatus = latestDon ? latestDon.status : "pending";
    const nextDueDate = latestDon ? latestDon.due_date : "";

    const withdrawals = this.withdrawals.filter(w => w.affiliate_id === affiliateId);

    return {
      referralLink,
      totalPersonalReferrals,
      activeReferrals,
      inactiveReferrals,
      totalEarnings,
      pendingEarnings,
      withdrawableBalance,
      monthlyRecurringEarnings,
      donationStatus,
      nextDueDate,
      commissionHistory: myComms,
      withdrawalHistory: withdrawals
    };
  }

  public formatDate(isoString: string): string {
    if (!isoString) return "--";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
}

export const appStore = new AffiliateSystemStore();
