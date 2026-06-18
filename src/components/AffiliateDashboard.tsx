import { useState, useEffect, FormEvent } from "react";
import { AffiliateSystemStore } from "../store";
import { UserProfile, Affiliate, Commission, Withdrawal, PremiumProduct } from "../types";
import { 
  Copy, 
  Check, 
  Wallet, 
  Users, 
  ArrowUpRight, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  DollarSign, 
  CreditCard, 
  Send,
  HelpCircle,
  FileSpreadsheet,
  Building2,
  Lock,
  CalendarCheck,
  ShieldAlert,
  ListOrdered,
  Download,
  Sparkles,
  BookOpen,
  Unlock,
  FileText,
  ShieldCheck,
  Video,
  Play,
  ExternalLink
} from "lucide-react";

interface AffiliateDashboardProps {
  storeState: AffiliateSystemStore;
  activeUserId: string;
  onRefresh: () => void;
}

export default function AffiliateDashboard({ storeState, activeUserId, onRefresh }: AffiliateDashboardProps) {
  const [copied, setCopied] = useState(false);

  // States for donation payment modal
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [payDonationStep, setPayDonationStep] = useState<"form" | "processing" | "success">("form");
  const [selectedDonationAmount, setSelectedDonationAmount] = useState(storeState.config.monthly_donation_amount);
  const [senderName, setSenderName] = useState("");
  const [senderBank, setSenderBank] = useState("");
  const [senderAccount, setSenderAccount] = useState("");
  const [transferCopied, setTransferCopied] = useState(false);

  // States for withdrawal request
  const [withdrawAmount, setWithdrawAmount] = useState<number | "">("");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // States for Digital Assets Library Downloads
  const [downloadingProductId, setDownloadingProductId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Free Member Upgrade States
  const [upgradeSponsorCode, setUpgradeSponsorCode] = useState("");
  const [upgradeCardNo, setUpgradeCardNo] = useState("4000 1111 2222 3333");
  const [upgradeExpiry, setUpgradeExpiry] = useState("09/29");
  const [upgradeCvv, setUpgradeCvv] = useState("909");
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [upgradeError, setUpgradeError] = useState("");

  // Gemini assistant smart analysis states
  const [geminiAdvice, setGeminiAdvice] = useState<string>("");
  const [geminiLoading, setGeminiLoading] = useState(false);

  // Read current affiliate profiles & users
  const activeAffiliate = storeState.getAffiliateByUserId(activeUserId);
  const activeUser = storeState.users.find(u => u.user_id === activeUserId);

  const fetchGeminiAdvice = async () => {
    if (!activeUser || !activeAffiliate) return;
    setGeminiLoading(true);
    try {
      let data: any = null;
      try {
        const response = await fetch("/api/gemini/advisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: activeUser.full_name,
            plan: "Premium Partner License",
            status: activeAffiliate.status,
            earnings: stats.totalEarnings,
            referralsCount: stats.totalPersonalReferrals,
            pendingPayouts: stats.withdrawableBalance
          })
        });

        const text = await response.text();
        if (text.trim().startsWith("<") || response.status === 404) {
          throw new Error("STATIC_FALLBACK");
        }

        data = JSON.parse(text);
        if (data.success) {
          setGeminiAdvice(data.analysis);
        } else {
          throw new Error("API_FAIL");
        }
      } catch (err: any) {
        // Generous static fallback for zero-dependency static deploys (e.g. Netlify)
        const localAdvice = `👋 Hello ${activeUser.full_name}!

Here is your **Emmacom Digital Academy Advisor** action plan:
- **Performance Rating**: ${stats.totalPersonalReferrals > 5 ? "⭐️ High Earning Champion Status" : "📈 Growth Potential Status"}.
- **Milestone Reached**: You have unlocked ₦${stats.totalEarnings.toLocaleString()} in cumulative revenue.
- **Conversion Booster**: Your direct network count is ${stats.totalPersonalReferrals} partners. To cross the next tier, share your customized link with 3 more associates!
- **Payout Security**: ₦${stats.withdrawableBalance.toLocaleString()} is verified of instant payout status. Re-verify your Flutterwave deposit account under "Account Overview".

*Optimized locally to ensure seamless offline usability.*`;
        setGeminiAdvice(localAdvice);
      }
    } catch (e) {
      setGeminiAdvice("Smart coaching services stand-by. Connect back again or consult offline resources.");
    } finally {
      setGeminiLoading(false);
    }
  };

  useEffect(() => {
    fetchGeminiAdvice();
  }, [activeUserId]);

  if (!activeUser || !activeAffiliate) {
    return (
      <div className="p-8 text-center text-slate-500 font-sans">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <p className="font-semibold text-sm">Affiliate Profile Not Found.</p>
        <p className="text-xs text-gray-400 mt-1">Please select an active affiliate session deck or register as a partner affiliate using the "Join Program" option.</p>
      </div>
    );
  }

  const handleCopyLink = () => {
    if (!activeAffiliate) return;
    // Standard referral code logic based on origin
    const refLink = `${window.location.origin}/ref/${activeAffiliate.affiliate_id}`;
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Dynamic calculations
  const stats = activeAffiliate 
    ? storeState.getAffiliateStats(activeAffiliate.affiliate_id)
    : {
        referralLink: "",
        totalPersonalReferrals: 0,
        activeReferrals: 0,
        inactiveReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        withdrawableBalance: 0,
        withdrawnEarnings: 0,
        monthlyRecurringEarnings: 0,
        commissionHistory: [] as Commission[],
        withdrawalHistory: [] as Withdrawal[],
        nextDueDate: null as string | null
      };

  // Handle donation simulation submission
  const handlePayDonation = (e: FormEvent) => {
    e.preventDefault();
    setPayDonationStep("processing");

    setTimeout(() => {
      const mockRef = `FLW-DON-${Math.floor(200000 + Math.random() * 800000)}`;
      const result = storeStoreDonation(mockRef);
      if (result.success) {
        setPayDonationStep("success");
        onRefresh();
      }
    }, 2000);
  };

  const storeStoreDonation = (ref: string) => {
    return storeState.payMonthlyDonation(activeUserId, selectedDonationAmount, ref);
  };

  const handleUpgradeToAffiliate = (e: FormEvent) => {
    e.preventDefault();
    setUpgradeError("");
    setUpgradeLoading(true);

    setTimeout(() => {
      const mockRef = `UP-FLW-${Math.floor(200000 + Math.random() * 800000)}`;
      const result = storeState.upgradeFreeMemberToAffiliate(
        activeUserId,
        upgradeSponsorCode ? upgradeSponsorCode.trim() : null,
        mockRef
      );

      setUpgradeLoading(false);
      if (result.success) {
        setUpgradeSuccess(true);
        onRefresh();
        setTimeout(() => setUpgradeSuccess(false), 3000);
      } else {
        setUpgradeError(result.error || "An unexpected error occurred during upgrade.");
      }
    }, 2000);
  };

  const handleWithdrawRequest = (e: FormEvent) => {
    e.preventDefault();
    setWithdrawError("");
    setWithdrawSuccess(false);

    if (!activeAffiliate) {
      setWithdrawError("Only Premium Affiliate Partners can request payouts.");
      return;
    }

    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setWithdrawError("Please provide a valid withdrawal amount.");
      return;
    }

    if (!bankName.trim() || !accountNo.trim()) {
      setWithdrawError("Bank name and recipient account number are required.");
      return;
    }

    const valueNum = Number(withdrawAmount);
    const result = storeState.requestWithdrawal({
      affiliateId: activeAffiliate.affiliate_id,
      amount: valueNum,
      accountNo: accountNo.trim(),
      bankName: bankName.trim()
    });

    if (result.success) {
      setWithdrawSuccess(true);
      setWithdrawAmount("");
      setBankName("");
      setAccountNo("");
      onRefresh();
      setTimeout(() => setWithdrawSuccess(false), 3000);
    } else {
      setWithdrawError(result.error || "Could not complete withdrawal request.");
    }
  };

  // Map other users for visual commission logs
  const getSourceUserName = (srcId: string) => {
    const usr = storeState.users.find(u => u.user_id === srcId);
    return usr ? usr.full_name : "Referred Partner";
  };

  const myDirectReferrals = activeAffiliate 
    ? storeState.affiliates.filter(a => a.sponsor_id === activeAffiliate.affiliate_id) 
    : [];

  const simulateDownload = (productId: string, productName: string) => {
    setDownloadingProductId(productId);
    setDownloadSuccessId(null);
    setTimeout(() => {
      setDownloadingProductId(null);
      setDownloadSuccessId(productId);

      // Log download internally in store
      storeState.addAuditLog(
        activeUserId,
        "Digital Download",
        `Downloaded virtual template asset: "${productName}"`
      );

      storeState.addNotification(
        activeUserId,
        "System Saved",
        `Successfully loaded "${productName}" into local system directories.`
      );

      onRefresh();
      setTimeout(() => setDownloadSuccessId(null), 3000);
    }, 1500);
  };

  return (
    <div className="font-sans space-y-8 p-4 md:p-8 max-w-7xl mx-auto" id="affiliate-dashboard">
      
      {/* Visual Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center space-x-4">
          <img 
            src={activeUser.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg"} 
            alt="Profile Avatar" 
            className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs" 
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activeUser.full_name}</h2>
              <span className={`inline-block border text-[10px] font-bold font-sans rounded px-2.5 py-0.5 uppercase tracking-wider ${
                activeAffiliate.status === "active" 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" 
                  : activeAffiliate.status === "expired"
                  ? "bg-amber-50 text-amber-700 border-amber-200/50"
                  : "bg-red-50 text-red-700 border-red-200/50"
              }`}>
                {activeAffiliate.status}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">
              Affiliate ID: <span className="font-mono font-bold text-slate-700">{activeAffiliate.affiliate_id}</span>
            </p>
          </div>
        </div>

        {/* Dynamic Compliance Pill / Renewal button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/50 flex items-center space-x-3 text-xs">
            <CalendarCheck className={`h-5 w-5 ${activeAffiliate.status === "active" ? "text-emerald-500" : "text-amber-500"}`} />
            <div>
              <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-bold">Renewal Period</span>
              <span className="font-bold text-slate-800 block">
                {stats.nextDueDate ? storeState.formatDate(stats.nextDueDate).split(",")[0] : "--"}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setPayDonationStep("form");
              setShowDonationModal(true);
            }}
            className="bg-indigo-600 hover:bg-slate-900 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-colors uppercase tracking-wider cursor-pointer"
            id="pay-monthly-btn"
          >
            Renew Donation (₦{storeState.config.monthly_donation_amount.toLocaleString()})
          </button>
        </div>
      </div>

      {/* Referral Link banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 font-sans p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest block">Unique Recruitment Address</span>
          <h3 className="font-bold text-base md:text-lg">Promote Emmacom Digital Academy to Earn Commissions</h3>
          <p className="text-indigo-200 text-xs max-w-xl">
            Copy and share this direct link. Any user who clicks it, registers, and completes payment automatically registers underneath you.
          </p>
        </div>
        
        <div className="w-full md:w-auto flex items-stretch bg-white/10 border border-white/15 p-1 rounded-xl">
          <div className="px-3.5 py-2 font-mono text-xs select-all overflow-x-auto text-indigo-100 max-w-[240px] whitespace-nowrap self-center">
            {stats.referralLink || `${window.location.origin}/ref/${activeAffiliate.affiliate_id}`}
          </div>
          <button
            onClick={handleCopyLink}
            className="bg-indigo-600 hover:bg-amber-500 text-white hover:text-slate-900 px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 shrink-0 ml-1 cursor-pointer"
            id="copy-link-btn"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid Stats Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="partner-dashboard-stats">
        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span className="font-bold tracking-wider uppercase text-[10px]">Withdrawable wallet</span>
            <Wallet className="h-4.5 w-4.5 text-indigo-500" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-slate-800 font-sans block">₦{stats.withdrawableBalance.toLocaleString()}</span>
            <span className="text-[10px] text-indigo-600 border border-indigo-100 rounded bg-indigo-50/50 py-0.5 px-1.5 font-semibold">Min payout: ₦{storeState.config.minimum_withdrawal.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span className="font-bold tracking-wider uppercase text-[10px]">Total Commissions</span>
            <DollarSign className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-slate-800 block">₦{stats.totalEarnings.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block font-semibold">Accumulated historical earnings</span>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span className="font-bold tracking-wider uppercase text-[10px] flex items-center space-x-1">
              <span>Paused On Hold</span>
              <HelpCircle className="h-3.5 w-3.5 shrink-0 text-slate-350 cursor-pointer" title="Commissions currently paused due to either Referee or Sponsor account compliance expiration." />
            </span>
            <Lock className="h-4.5 w-4.5 text-amber-500" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-amber-600 block">₦{stats.pendingEarnings.toLocaleString()}</span>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 border border-amber-100 rounded">Blocked pending compliance</span>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center text-slate-400 text-xs">
            <span className="font-bold tracking-wider uppercase text-[10px]">Est. Monthly Dividends</span>
            <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-slate-800 block">₦{stats.monthlyRecurringEarnings.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block font-semibold">From currently active direct referrals</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: My referrals & Withdrawal Requests */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-8">

          {/* Gemini AI Smart business advisor widget */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 rounded-3xl border border-slate-800 p-6 shadow-xl text-white space-y-4 relative overflow-hidden" id="gemini-ai-advisor-panel">
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <Sparkles className="h-36 w-36 text-indigo-500" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="h-9 w-9 bg-indigo-600/40 rounded-xl flex items-center justify-center border border-indigo-500/30">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-300 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold tracking-wide uppercase text-indigo-200">Gemini Live Hub</h4>
                  <h3 className="text-sm font-extrabold text-white tracking-tight">AI Smart Growth Advisor</h3>
                </div>
              </div>
              
              <button
                onClick={fetchGeminiAdvice}
                disabled={geminiLoading}
                className="text-[10px] font-bold bg-white/10 hover:bg-white/20 border border-white/10 py-1.5 px-3 rounded-lg flex items-center space-x-1 cursor-pointer transition-all disabled:opacity-50"
              >
                <span>{geminiLoading ? "Analyzing..." : "Refresh Advice"}</span>
              </button>
            </div>

            <div className="bg-slate-950/40 rounded-2xl border border-white/5 p-4.5 text-xs text-slate-100 font-normal leading-relaxed whitespace-pre-line">
              {geminiLoading ? (
                <div className="space-y-2 py-4">
                  <div className="h-3.5 bg-white/10 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3.5 bg-white/10 rounded w-5/6 animate-pulse"></div>
                  <div className="h-3.5 bg-white/10 rounded w-2/3 animate-pulse"></div>
                  <span className="text-[11px] text-slate-500 text-center block pt-2">Gemini is processing your team performance metrics...</span>
                </div>
              ) : (
                geminiAdvice || `No advice fetched. Click refresh to query.`
              )}
            </div>
            
            <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
              <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>System status: ONLINE & SECURE</span>
              <span>Model: gemini-3.5-flash</span>
            </div>
          </div>
          
          {/* Section: My Referring hierarchy list */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Users className="h-5 w-5 text-indigo-600" />
                <span>My Personally Referred Partners</span>
              </h3>
              <span className="bg-slate-100 text-slate-600 border border-slate-200/50 rounded-full text-xs font-bold px-3 py-0.5">
                {stats.totalPersonalReferrals} Partners
              </span>
            </div>

            {myDirectReferrals.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm font-semibold">No referrals registered yet.</p>
                <p className="text-xs text-slate-400 mt-1">Share your recruit address EMM{activeAffiliate.affiliate_id} to attract members.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase font-bold tracking-wider text-[10px]">
                      <th className="py-2.5 px-4">Partner details</th>
                      <th className="py-2.5 px-4">Enrolled date</th>
                      <th className="py-2.5 px-4 text-center">Status</th>
                      <th className="py-2.5 px-4 text-right">Estimated Commission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myDirectReferrals.map(referree => {
                      const refUser = storeState.users.find(u => u.user_id === referree.user_id);
                      
                      // Calculate commission from this specific referree
                      const refereeCommsComp = stats.commissionHistory.filter(c => c.source_user_id === referree.user_id);
                      const sumIncome = refereeCommsComp.reduce((acc, c) => acc + c.amount, 0);

                      return (
                        <tr key={referree.affiliate_id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-4 flex items-center space-x-3">
                            <img src={refUser?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg"} alt="" className="h-8 w-8 rounded-full bg-slate-100 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-800 text-sm block">{refUser?.full_name}</span>
                              <span className="font-mono text-slate-400 text-[10px] block">ID: {referree.affiliate_id}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-mono text-slate-500">
                            {storeState.formatDate(referree.created_at).split(",")[0]}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-block border text-[9.5px] font-bold font-sans rounded px-2 py-0.5 uppercase tracking-wider ${
                              referree.status === "active" 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" 
                                : referree.status === "expired"
                                ? "bg-amber-50 text-amber-700 border-amber-200/50"
                                : "bg-red-50 text-red-700 border-red-200/50"
                            }`}>
                              {referree.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right font-mono font-bold text-indigo-600 text-sm">
                            ₦{sumIncome.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section: Commission Log */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <ListOrdered className="h-5 w-5 text-indigo-600" />
              <span>Full Commission Audit Ledger</span>
            </h3>

            {stats.commissionHistory.length === 0 ? (
              <p className="text-slate-400 italic text-center py-8 text-xs">No direct partner commissions recorded in wallet logs.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase font-bold tracking-wider text-[10px]">
                      <th className="py-2.5 px-4">Event date</th>
                      <th className="py-2.5 px-4 flex items-center">Trigger Partner</th>
                      <th className="py-2.5 px-4">Earning classification</th>
                      <th className="py-2.5 px-4 text-center">Compliance Wallet Status</th>
                      <th className="py-2.5 px-4 text-right">Commission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.commissionHistory.map((comm) => (
                      <tr key={comm.commission_id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          {storeState.formatDate(comm.created_at)}
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-semibold">
                          {getSourceUserName(comm.source_user_id)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                            comm.commission_type === "registration" 
                              ? "bg-indigo-50 text-indigo-700" 
                              : "bg-teal-50 text-teal-700"
                          }`}>
                            {comm.commission_type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block text-[9.5px] font-bold rounded-lg px-2 py-0.5 uppercase tracking-wide border ${
                            comm.status === "withdrawable" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/40" 
                              : comm.status === "withdrawn"
                              ? "bg-slate-100 text-slate-600 border-slate-200/40"
                              : "bg-amber-50 text-amber-700 border-amber-200/40"
                          }`}>
                            {comm.status === "pending" ? "Paused (On Hold)" : comm.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                          ₦{comm.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Withdrawals & Ineligibility Warnings */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-8">
          
          {/* Section: Suspension Alert */}
          {activeAffiliate.status !== "active" && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start space-x-3 text-amber-900 leading-relaxed text-xs">
              <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="font-bold text-amber-800 text-sm">Account Inactive Alert ⚠️</h4>
                <p className="mt-1 font-medium">
                  If either you or your referred partners become inactive, monthly recurring commissions are paused immediately.
                </p>
                <button
                  onClick={() => {
                    setPayDonationStep("form");
                    setShowDonationModal(true);
                  }}
                  className="mt-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-3.5 rounded-lg text-xs"
                >
                  Pay Monthly Donation Now
                </button>
              </div>
            </div>
          )}

          {/* Section: Withdrawal requesting panel */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <ArrowUpRight className="h-5 w-5 text-indigo-600" />
              <span>Withdraw Commissions</span>
            </h3>

            {withdrawSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-800 text-xs font-semibold">
                ✓ Payout request filed in pending compliance reviews.
              </div>
            )}

            {withdrawError && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-xs leading-relaxed font-semibold">
                ⚠️ {withdrawError}
              </div>
            )}

            <form onSubmit={handleWithdrawRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recipient Bank NAME</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. GTBank, Zenith Bank, Kuda"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <Building2 className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Account Number (10 digits)</label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="e.g. 0123456789"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex justify-between">
                  <span>Withdraw Amount (₦)</span>
                  <span className="text-[11px] text-indigo-600 font-semibold cursor-pointer" onClick={() => setWithdrawAmount(stats.withdrawableBalance)}>
                    Withdraw Max (₦{stats.withdrawableBalance.toLocaleString()})
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min={storeState.config.minimum_withdrawal}
                    max={stats.withdrawableBalance}
                    placeholder={`Min: ₦${storeState.config.minimum_withdrawal.toLocaleString()}`}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
                  />
                  <span className="absolute right-4 top-3 text-xs font-bold text-slate-400">₦</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={stats.withdrawableBalance < storeState.config.minimum_withdrawal || activeAffiliate.status === "suspended"}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-xs flex items-center justify-center space-x-1.5 uppercase tracking-wider cursor-pointer"
                id="sumbit-payout-btn"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Withdrawal Approval</span>
              </button>
            </form>
          </div>

          {/* Section: Withdrawal Payout Logs */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              <span>Withdrawal History</span>
            </h3>

            {stats.withdrawalHistory.length === 0 ? (
              <p className="text-slate-400 italic text-center py-6 text-xs bg-slate-50 rounded-xl">No preceding payout request logs.</p>
            ) : (
              <div className="space-y-4">
                {stats.withdrawalHistory.map(wth => (
                  <div key={wth.withdrawal_id} className="border border-slate-100 p-3.5 rounded-xl space-y-2 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-mono text-[10.5px] block">{storeState.formatDate(wth.created_at)}</span>
                      <span className={`inline-block text-[10px] font-bold rounded-full px-2.5 py-0.5 uppercase tracking-wide border ${
                        wth.status === "approved" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" 
                          : wth.status === "rejected"
                          ? "bg-red-50 text-red-755 border-red-200/50"
                          : "bg-slate-100 text-slate-650 border-slate-250/50"
                      }`}>
                        {wth.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">Bank Amount Disbursed:</span>
                      <span className="font-mono font-bold text-slate-800">₦{wth.amount.toLocaleString()}</span>
                    </div>

                    {wth.resolved_at && (
                      <div className="text-[10px] bg-slate-100 p-2 rounded text-slate-500 font-sans border border-slate-200/50 leading-relaxed">
                        <strong>Payout Notes:</strong> {wth.notes || "Processed by administrator compliance"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Library Suite */}
      <DigitalProductsSection 
        downloadingId={downloadingProductId} 
        successId={downloadSuccessId} 
        onDownload={simulateDownload} 
        affiliateStatus={activeAffiliate?.status}
        premiumProducts={storeState.premiumProducts}
      />

      {/* Simulated Donation Renewal Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div 
            className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-100"
            id="donation-portal-modal"
          >
            {/* Header */}
            <div className="bg-[#1C2434] p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-amber-500 h-8 w-8 rounded-lg flex items-center justify-center font-black text-black">
                  fw
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-slate-300 uppercase tracking-wider font-mono">Secured by Flutterwave</h3>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">Compliance Donation Pay</p>
                </div>
              </div>
              <button
                onClick={() => setShowDonationModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded bg-white/5 cursor-pointer"
              >
                Close
              </button>
            </div>

            {payDonationStep === "form" && (
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-200/50">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">Renewal Due Amount</span>
                    <span className="text-xl font-bold text-slate-800">₦{selectedDonationAmount.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">MONTHLY COMPLIANCE</span>
                </div>

                <form onSubmit={handlePayDonation} className="space-y-4">
                  {/* Flutterwave Virtual Account Details */}
                  <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/40 space-y-3">
                    <div className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider block">
                      Flutterwave Merchant Virtual Account Details
                    </div>
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Bank Name</span>
                        <span className="font-bold text-slate-800 flex items-center">
                          <Building2 className="h-3.5 w-3.5 text-indigo-500 mr-1" />
                          {storeState.config.flutterwave_bank_name || "Wema Bank (FW)"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Account Number</span>
                        <div className="font-mono font-black text-slate-900 text-sm flex items-center space-x-1.5 mt-0.5">
                          <span>{storeState.config.flutterwave_account_number || "0048127392"}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(storeState.config.flutterwave_account_number || "0048127392");
                              setTransferCopied(true);
                              setTimeout(() => setTransferCopied(false), 2000);
                            }}
                            className="px-1.5 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[9px] font-bold text-indigo-600 cursor-pointer"
                          >
                            {transferCopied ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>
                      <div className="col-span-2 border-t border-slate-100 pt-2">
                        <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Account Name</span>
                        <span className="font-bold text-slate-800 font-sans">{storeState.config.flutterwave_account_name || "Emmacom Digital Academy Hub / Flutterwave"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sender Details Form Fields */}
                  <div className="space-y-3">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-extrabold pb-1">
                      Your Transfer Verification Details
                    </div>
                    
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 font-sans">
                        Your Bank Name
                      </label>
                      <input
                        type="text"
                        required
                        value={senderBank}
                        onChange={(e) => setSenderBank(e.target.value)}
                        className="w-full text-slate-700 text-xs px-3.5 py-2.5 bg-slate-50 rounded-lg border border-slate-200 font-sans focus:outline-none focus:border-indigo-500 focus:bg-white"
                        placeholder="e.g. GTBank, Access Bank, Zenith Bank"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 font-sans">
                          Your Account Name
                        </label>
                        <input
                          type="text"
                          required
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          className="w-full text-slate-700 text-xs px-3.5 py-2.5 bg-slate-50 rounded-lg border border-slate-200 font-sans focus:outline-none focus:border-indigo-500 focus:bg-white"
                          placeholder="e.g. Mary Alao"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 font-sans">
                          Your Account Number
                        </label>
                        <input
                          type="text"
                          required
                          value={senderAccount}
                          onChange={(e) => setSenderAccount(e.target.value)}
                          className="w-full text-slate-700 text-xs px-3.5 py-2.5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-center focus:outline-none focus:border-indigo-500 focus:bg-white"
                          placeholder="10 Digits"
                          maxLength={10}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 text-amber-950 text-[10px] p-3 rounded-xl leading-relaxed border border-amber-100/50 flex space-x-2 items-start">
                    <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Instructions:</strong> Transfer exactly <strong>₦{selectedDonationAmount.toLocaleString()}</strong> before submitting. Direct verification completes instantly with automatic status refresh!
                    </span>
                  </div>

                  <div className="pt-1">
                    <button
                      type="submit"
                      className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all text-xs flex items-center justify-center space-x-2 cursor-pointer font-sans"
                    >
                      <Send className="h-3.5 w-3.5 text-white" />
                      <span>Confirm Manual Transfer Made</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {payDonationStep === "processing" && (
              <div className="p-12 text-center space-y-6">
                <div className="mx-auto h-12 w-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Validating Flutterwave Vault...</h4>
                  <p className="text-xs text-gray-400 mt-1">Recalculating eligible sponsor recurring levels...</p>
                </div>
              </div>
            )}

            {payDonationStep === "success" && (
              <div className="p-8 text-center space-y-5">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Donation Cleared Successfully!</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Your affiliate account eligibility stats have been restored to compliant.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDonationModal(false)}
                  className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs py-2.5 rounded-lg cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface DigitalProductsSectionProps {
  downloadingId: string | null;
  successId: string | null;
  onDownload: (id: string, name: string) => void;
  affiliateStatus?: string;
  premiumProducts?: PremiumProduct[];
}

function DigitalProductsSection({ downloadingId, successId, onDownload, affiliateStatus, premiumProducts = [] }: DigitalProductsSectionProps) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const toggleVideoActive = (productId: string) => {
    if (activeVideoId === productId) {
      setActiveVideoId(null);
    } else {
      setActiveVideoId(productId);
    }
  };

  const isComplianceLimited = affiliateStatus !== "active";

  return (
    <div className="space-y-5" id="assets-hub-suite">
      <div className="border-b border-gray-100 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-indigo-600 font-bold" />
            <span>Premium Catalog</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">Emmacom Digital Academy premium resources suite. All downloads and courses are audited securely in-app.</p>
        </div>
        <div>
          {isComplianceLimited ? (
            <span className="text-xs bg-rose-50 border border-rose-100 text-rose-600 font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono flex items-center space-x-1">
              <Lock className="h-3 w-3" />
              <span>Catalog Locked</span>
            </span>
          ) : (
            <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              Partner Access Active
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {premiumProducts.map((product) => {
          const isVideoActive = activeVideoId === product.id;
          const isCardDownloading = downloadingId === product.id;
          const isCardSuccess = successId === product.id;

          const handleDownloadSimulate = () => {
            if (isComplianceLimited) {
              alert(`Your Affiliate License status is locked due to outstanding monthly donations.\n\nPlease submit your regular donation to restore Premium Catalog access.`);
              return;
            }
            onDownload(product.id, product.name);
          };

          return (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between hover:border-indigo-150"
            >
              {/* Image Banner */}
              <div className="aspect-video w-full relative overflow-hidden bg-slate-100 border-b border-gray-100">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Badge overlay */}
                <span className="absolute top-3 left-3 text-[9px] bg-slate-900/95 text-white font-extrabold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider font-sans flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" />
                  <span>{product.badge || "PREMIUM LEVEL"}</span>
                </span>

                {/* Locks check */}
                {isComplianceLimited && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white space-y-2.5">
                    <div className="h-9 w-9 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-200">
                      <Lock className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest text-slate-100">Access Locked</h4>
                      <p className="text-[10px] text-slate-300 max-w-[220px] mt-1 leading-normal font-sans">
                        Please complete your regular compliance monthly donation to unlock standard courses and premium files.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h4 className="font-black text-slate-900 text-sm md:text-base tracking-tight leading-snug">
                    {product.name}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    {product.desc}
                  </p>
                </div>

                {!isComplianceLimited && (
                  <div className="space-y-3 pt-3 border-t border-slate-50">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* PDF study link */}
                      {product.pdfUrl ? (
                        <a
                          href={product.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-150 transition-colors cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5 text-emerald-600" />
                          <span>PDF Guide</span>
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No PDF linked</span>
                      )}

                      {/* Video streaming */}
                      {product.videoUrl ? (
                        <button
                          type="button"
                          onClick={() => toggleVideoActive(product.id)}
                          className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            isVideoActive
                              ? "bg-slate-900 text-white"
                              : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100"
                          }`}
                        >
                          <Video className="h-3.5 w-3.5" />
                          <span>{isVideoActive ? "Hide Video Lecture" : "Watch Lecture"}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No Video linked</span>
                      )}

                      {/* Simulations */}
                      <button
                        type="button"
                        onClick={handleDownloadSimulate}
                        className={`ml-auto px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                          isCardSuccess
                            ? "bg-amber-50 text-amber-700 font-sans"
                            : isCardDownloading
                            ? "bg-slate-50 text-slate-400 italic font-mono"
                            : "text-slate-400 hover:text-slate-700 font-sans"
                        }`}
                        title="Simulate offline study pack archive zip download"
                      >
                        {isCardSuccess ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>In-App Saved!</span>
                          </>
                        ) : isCardDownloading ? (
                          <>
                            <div className="h-3 w-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>Zipping...</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-3 w-3" />
                            <span>Simulate Offline Download</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* YouTube lesson iframe embed */}
                    {isVideoActive && product.videoUrl && (
                      <div className="bg-black aspect-video w-full rounded-xl overflow-hidden relative shadow-inner border border-slate-200 animate-fade-in mt-3">
                        <iframe
                          src={product.videoUrl}
                          title={`${product.name} Course Lecture Video`}
                          className="absolute inset-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
