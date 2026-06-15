import { useState, FormEvent } from "react";
import { AffiliateSystemStore } from "../store";
import { UserProfile, Affiliate, Commission, Withdrawal, AdminConfig } from "../types";
import { 
  Sliders, 
  Check, 
  X, 
  Users, 
  Briefcase, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Ban, 
  Unlock, 
  Wallet, 
  Calculator, 
  ChevronRight, 
  FileText, 
  Activity,
  Cloud,
  Database,
  Copy,
  ExternalLink
} from "lucide-react";
import { CLOUDFLARE_D1_SQL_SCHEMA, CLOUDFLARE_BINDING_GUIDE } from "../lib/cloudflare";

interface AdminDashboardProps {
  storeState: AffiliateSystemStore;
  onRefresh: () => void;
}

export default function AdminDashboard({ storeState, onRefresh }: AdminDashboardProps) {
  // Config form state
  const [commissionMode, setCommissionMode] = useState<"percentage" | "fixed">(storeState.config.commission_mode);
  const [registrationRate, setRegistrationRate] = useState(storeState.config.registration_rate);
  const [recurringRate, setRecurringRate] = useState(storeState.config.recurring_rate);
  const [registrationFee, setRegistrationFee] = useState(storeState.config.registration_fee);
  const [monthlyDonationAmount, setMonthlyDonationAmount] = useState(storeState.config.monthly_donation_amount);
  const [minimumWithdrawal, setMinimumWithdrawal] = useState(storeState.config.minimum_withdrawal);
  const [flutterwaveBankName, setFlutterwaveBankName] = useState(storeState.config.flutterwave_bank_name || "Wema Bank (FW)");
  const [flutterwaveAccountNumber, setFlutterwaveAccountNumber] = useState(storeState.config.flutterwave_account_number || "0048127392");
  const [flutterwaveAccountName, setFlutterwaveAccountName] = useState(storeState.config.flutterwave_account_name || "Emmacom Digital Hub / Flutterwave");
  const [configSuccess, setConfigSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedGuide, setCopiedGuide] = useState(false);

  // Modal / Input values for payout resolution
  const [resolvingWthId, setResolvingWthId] = useState<string | null>(null);
  const [resolutionAction, setResolutionAction] = useState<"approve" | "reject">("approve");
  const [resolutionNote, setResolutionNote] = useState("");

  const handleSaveConfig = (e: FormEvent) => {
    e.preventDefault();
    storeState.updateAdminConfig({
      commission_mode: commissionMode,
      registration_rate: Number(registrationRate),
      recurring_rate: Number(recurringRate),
      registration_fee: Number(registrationFee),
      monthly_donation_amount: Number(monthlyDonationAmount),
      minimum_withdrawal: Number(minimumWithdrawal),
      flutterwave_bank_name: flutterwaveBankName,
      flutterwave_account_number: flutterwaveAccountNumber,
      flutterwave_account_name: flutterwaveAccountName
    });
    setConfigSuccess(true);
    onRefresh();
    setTimeout(() => setConfigSuccess(false), 3000);
  };

  const handleResolveWithdrawal = (e: FormEvent) => {
    e.preventDefault();
    if (!resolvingWthId) return;

    if (resolutionAction === "approve") {
      storeState.approveWithdrawal(resolvingWthId, resolutionNote || "Disbursed via bank transfer clearance.");
    } else {
      storeState.rejectWithdrawal(resolvingWthId, resolutionNote || "Declined due to security assessment.");
    }

    setResolvingWthId(null);
    setResolutionNote("");
    onRefresh();
  };

  const handleToggleSuspend = (affiliateId: string, currentStatus: string) => {
    const isSuspended = currentStatus === "suspended";
    const nextStatus = isSuspended ? "active" : "suspended";
    storeState.updateAffiliateStatus(affiliateId, nextStatus);
    onRefresh();
  };

  // Helper: Find User info
  const viewUser = (userId: string) => {
    return storeState.users.find(u => u.user_id === userId);
  };

  // Stats Counters
  const pendingWithdrawalsCount = storeState.withdrawals.filter(w => w.status === "pending").length;
  const totalCommissionsDistributed = storeState.commissions.reduce((acc, c) => acc + c.amount, 0);
  const totalCompletedPayoutsVal = storeState.withdrawals.filter(w => w.status === "approved").reduce((acc, w) => acc + w.amount, 0);
  const activeUsersCount = storeState.affiliates.filter(a => a.status === "active").length;

  return (
    <div className="space-y-8 font-sans p-4 md:p-8 max-w-7xl mx-auto" id="admin-panel-container">
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Administrative Control Center
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Configure system fees, audit single-tier referral compliance, and approve commission disbursements.
          </p>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-slate-500 bg-slate-100 rounded-lg p-2 font-mono">
          <Activity className="h-4 w-4 text-indigo-600 shrink-0" />
          <span>Operational Registry: {storeState.affiliates.length} Affiliates</span>
        </div>
      </div>

      {/* Grid Stats Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="admin-stats-grid">
        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="h-11 w-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Partners</span>
            <span className="text-xl font-bold font-sans text-slate-800">{activeUsersCount} / {storeState.affiliates.length}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="h-11 w-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Commissions</span>
            <span className="text-xl font-bold text-slate-800">₦{totalCommissionsDistributed.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="h-11 w-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Disbursed Payouts</span>
            <span className="text-xl font-bold text-slate-800">₦{totalCompletedPayoutsVal.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm flex items-center space-x-4">
          <div className="h-11 w-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0 relative">
            <TrendingUp className="h-5 w-5" />
            {pendingWithdrawalsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full text-[9px] font-bold h-4.5 w-4.5 flex items-center justify-center animate-bounce">
                {pendingWithdrawalsCount}
              </span>
            )}
          </div>
          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pending Payouts</span>
            <span className="text-xl font-bold text-slate-800">{pendingWithdrawalsCount} Review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Rules Config & Withdrawal Approval */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-8">
          
          {/* Form: Config rules */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Sliders className="h-4.5 w-4.5 text-indigo-600" />
              <span>Commission Parameters</span>
            </h3>

            {configSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-800 text-xs font-semibold">
                ✓ Parameters updated and recalculated successfully!
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Calculation Model</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-lg p-1 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setCommissionMode("percentage")}
                    className={`py-1.5 text-xs font-semibold rounded ${
                      commissionMode === "percentage" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommissionMode("fixed")}
                    className={`py-1.5 text-xs font-semibold rounded ${
                      commissionMode === "fixed" ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Fixed (₦)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {commissionMode === "percentage" ? "Join Comm (%)" : "Join Comm (₦)"}
                  </label>
                  <input
                    type="number"
                    value={registrationRate}
                    onChange={(e) => setRegistrationRate(Number(e.target.value))}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {commissionMode === "percentage" ? "Monthly Comm (%)" : "Monthly Comm (₦)"}
                  </label>
                  <input
                    type="number"
                    value={recurringRate}
                    onChange={(e) => setRecurringRate(Number(e.target.value))}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Registration Fee (₦)</label>
                  <input
                    type="number"
                    value={registrationFee}
                    onChange={(e) => setRegistrationFee(Number(e.target.value))}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Monthly Donation (₦)</label>
                  <input
                    type="number"
                    value={monthlyDonationAmount}
                    onChange={(e) => setMonthlyDonationAmount(Number(e.target.value))}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Minimum Withdrawal (₦)</label>
                <input
                  type="number"
                  value={minimumWithdrawal}
                  onChange={(e) => setMinimumWithdrawal(Number(e.target.value))}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Flutterwave Payments Settlemets Integration Settings */}
              <div className="border-t border-slate-100 pt-4 mt-4 space-y-3 bg-indigo-50/20 p-3 rounded-xl border border-indigo-500/10">
                <div className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Flutterwave Merchant Account</span>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Settlement Bank Name
                  </label>
                  <input
                    type="text"
                    required
                    value={flutterwaveBankName}
                    onChange={(e) => setFlutterwaveBankName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 bg-white rounded-lg border border-slate-200 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Wema Bank"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      required
                      value={flutterwaveAccountNumber}
                      onChange={(e) => setFlutterwaveAccountNumber(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 bg-white rounded-lg border border-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center"
                      placeholder="10 digit NUBAN"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Account Name
                    </label>
                    <input
                      type="text"
                      required
                      value={flutterwaveAccountName}
                      onChange={(e) => setFlutterwaveAccountName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 bg-white rounded-lg border border-slate-200 font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Receiver Identity"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-slate-900 text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow-md transition-colors uppercase tracking-wider cursor-pointer font-sans"
              >
                Apply Parameters
              </button>
            </form>
          </div>

          {/* Section: Cloudflare Ecosystem & D1 Database Integration Settings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between col-span-12">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Cloud className="h-5 w-5 text-sky-500 animate-pulse" />
                <span>Cloudflare & D1 Integration</span>
              </h3>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center space-x-1.5 bg-sky-50 text-sky-700 border-sky-200">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500"></span>
                <span>D1 ENGINE STANDBY</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Emmacom Digital platform is pre-optimized to run on <strong>Cloudflare Pages (frontend compiles to static)</strong>, 
              <strong> Cloudflare Workers (APIs)</strong>, and a serverless <strong>Cloudflare D1 SQL database</strong> instance.
            </p>

            <div className="bg-slate-50 rounded-xl border border-slate-150 p-4 space-y-2.5">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <Database className="h-3 w-3 text-sky-600" />
                <span>D1 SQLite Table Models Schema</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                To provision tables instantly inside your Cloudflare D1 environment, copy this optimized transaction-compliant SQL schema script:
              </p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(CLOUDFLARE_D1_SQL_SCHEMA);
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2000);
                }}
                className={`w-full py-2.5 px-3 rounded-lg border font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  copiedSql
                    ? "bg-emerald-600 border-emerald-500 text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-55"
                }`}
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copiedSql ? "✓ Copied D1 Script!" : "Copy Cloudflare D1 SQLite Schema"}</span>
              </button>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-150 p-4 space-y-2.5">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                <Cloud className="h-3 w-3 text-amber-600" />
                <span>Wrangler Binding Settings Schema</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Bind your Cloudflare D1 SQLite storage instance securely using your wrangler settings schema block:
              </p>
              <div className="font-mono text-[10px] bg-slate-900 text-slate-100 p-2.5 rounded-lg border border-slate-800 space-y-1">
                <div className="text-yellow-400 font-bold">[[d1_databases]]</div>
                <div>binding = <span className="text-green-400">"DB"</span></div>
                <div>database_name = <span className="text-green-400">"emmacom-affiliate-db"</span></div>
                <div>database_id = <span className="text-slate-400">"your-d1-instance-guid"</span></div>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(CLOUDFLARE_BINDING_GUIDE);
                  setCopiedGuide(true);
                  setTimeout(() => setCopiedGuide(false), 2000);
                }}
                className={`w-full py-2.5 px-3 rounded-lg border font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  copiedGuide
                    ? "bg-emerald-600 border-emerald-550 text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-55"
                }`}
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copiedGuide ? "✓ Copied Bind Settings!" : "Copy Wrangler Setup Settings"}</span>
              </button>
            </div>
            
            <a 
              href="https://dash.cloudflare.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] text-indigo-600 font-bold hover:underline flex items-center space-x-1 justify-center pt-1"
            >
              <span>Go to Cloudflare Console Dashboard</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Table: Payout approvals */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Check className="h-5 w-5 text-indigo-600 border border-slate-200 rounded p-0.5" />
              <span>Disbursement Approval Queue</span>
            </h3>

            {storeState.withdrawals.filter(w => w.status === "pending").length === 0 ? (
              <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-xl text-xs space-y-1">
                <CheckCircle className="h-8 w-8 text-slate-300 mx-auto" />
                <p>No withdraw requests filed in payout queue.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {storeState.withdrawals.filter(w => w.status === "pending").map(w => {
                  const partner = storeState.getUserByAffiliate(w.affiliate_id);
                  return (
                    <div key={w.withdrawal_id} className="border border-slate-100 bg-slate-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{partner?.full_name || "Unknown"}</span>
                          <span className="text-[10px] text-slate-450 font-mono font-bold block bg-slate-200 text-slate-600 rounded px-1.5 py-0.5 mt-0.5 w-max">ID: {w.affiliate_id}</span>
                        </div>
                        <span className="text-sm font-black text-rose-600 font-mono">₦{w.amount.toLocaleString()}</span>
                      </div>

                      <div className="text-[11px] text-slate-550 space-y-1 leading-relaxed border-t border-slate-200/50 pt-2 font-mono">
                        <div>Bank: <span className="font-semibold text-slate-755 font-sans">{w.bank_name}</span></div>
                        <div>Account No: <span className="font-semibold text-slate-755">{w.account_number}</span></div>
                        <div>Requested Due: <span className="text-[10px]">{storeState.formatDate(w.created_at)}</span></div>
                      </div>

                      <div className="flex space-x-2 pt-1.5">
                        <button
                          onClick={() => {
                            setResolvingWthId(w.withdrawal_id);
                            setResolutionAction("approve");
                          }}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded text-xs transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setResolvingWthId(w.withdrawal_id);
                            setResolutionAction("reject");
                          }}
                          className="flex-1 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold py-1.5 px-3 rounded text-xs transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Affiliate Accounts & Referral Hierarchy */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-8">
          
          {/* Section: Affiliates List */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm overflow-hidden">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <span>Affiliates Directory & Donation Compliance</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 uppercase font-bold tracking-wider text-[10px]">
                    <th className="py-3 px-4">Affiliate</th>
                    <th className="py-3 px-4">Referrer</th>
                    <th className="py-3 px-4">Donation Period</th>
                    <th className="py-3 px-4 text-center">Eligibility</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {storeState.affiliates.map(aff => {
                    const u = viewUser(aff.user_id);
                    const stats = storeState.getAffiliateStats(aff.affiliate_id);
                    return (
                      <tr key={aff.affiliate_id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4.5 px-4">
                          <div className="flex items-center space-x-3">
                            <img src={u?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg"} alt="" className="h-8 w-8 rounded-full bg-slate-100 shrink-0" />
                            <div>
                              <span className="font-bold text-slate-800 text-sm block">{u?.full_name}</span>
                              <span className="font-mono text-indigo-600 text-[10px] uppercase font-bold tracking-wide">ID: {aff.affiliate_id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4.5 px-4 font-mono font-bold text-slate-500">
                          {aff.sponsor_id ? (
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px]">{aff.sponsor_id}</span>
                          ) : (
                            <span className="text-slate-350 font-sans italic text-[11px] font-normal">Direct Join</span>
                          )}
                        </td>
                        <td className="py-4.5 px-4">
                          <span className="block text-slate-800 font-semibold font-mono text-[11px]">
                            Next Dynamic Due:
                          </span>
                          <span className="block text-[11px] text-slate-500">
                            {storeState.formatDate(stats.nextDueDate)}
                          </span>
                        </td>
                        <td className="py-4.5 px-4 text-center">
                          <span className={`inline-block border text-[10px] font-bold font-sans rounded px-2.5 py-0.5 uppercase tracking-wider ${
                            aff.status === "active" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" 
                              : aff.status === "expired"
                              ? "bg-amber-50 text-amber-700 border-amber-200/50"
                              : "bg-red-50 text-red-700 border-red-200/50"
                          }`}>
                            {aff.status}
                          </span>
                        </td>
                        <td className="py-4.5 px-4 text-right">
                          <button
                            onClick={() => handleToggleSuspend(aff.affiliate_id, aff.status)}
                            className={`border text-[10.5px] font-bold py-1 px-3 rounded-lg transition-all ${
                              aff.status === "suspended"
                                ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                                : "bg-red-50 border-red-100 text-red-600 hover:bg-red-100"
                            } cursor-pointer`}
                          >
                            {aff.status === "suspended" ? (
                              <span className="flex items-center space-x-1 justify-end">
                                <Unlock className="h-3 w-3 inline shrink-0" />
                                <span>Re-activate</span>
                              </span>
                            ) : (
                              <span className="flex items-center space-x-1 justify-end">
                                <Ban className="h-3 w-3 inline shrink-0" />
                                <span>Suspend</span>
                              </span>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Referral Hierarchy relationships */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span>Hierarchical Referral Network & Volume Report</span>
            </h3>

            <div className="space-y-4 font-sans text-xs">
              {storeState.affiliates.filter(a => a.sponsor_id === null).map(parent => {
                const parentUser = viewUser(parent.user_id);
                // Child referrals under this sponsor
                const childs = storeState.affiliates.filter(a => a.sponsor_id === parent.affiliate_id);
                
                return (
                  <div key={parent.affiliate_id} className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
                    {/* Parent Header */}
                    <div className="bg-slate-50 border-b border-slate-100 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                          {parentUser?.full_name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block text-sm">{parentUser?.full_name}</span>
                          <span className="text-[10px] text-indigo-600 font-mono font-bold block">ID: {parent.affiliate_id} • Status: <span className="uppercase">{parent.status}</span></span>
                        </div>
                      </div>

                      <div className="flex bg-white border border-slate-200 rounded px-2.5 py-1 text-[11px] font-mono justify-between text-slate-550 w-full sm:w-auto">
                        <span className="font-sans mr-2">Personal Referrals:</span>
                        <span className="font-bold text-indigo-600">{childs.length}</span>
                      </div>
                    </div>

                    {/* Children List */}
                    <div className="p-3 bg-white">
                      {childs.length === 0 ? (
                        <p className="text-slate-400 italic text-center py-2 text-[11px]">This affiliate has not referred any partners yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {childs.map(child => {
                            const childUser = viewUser(child.user_id);
                            
                            // Find commissions generated by this child for this parent
                            const comms = storeState.commissions.filter(
                              c => c.affiliate_id === parent.affiliate_id && c.source_user_id === child.user_id
                            );
                            const sumComms = comms.reduce((acc, c) => acc + c.amount, 0);

                            return (
                              <div key={child.affiliate_id} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border border-slate-100/60 hover:bg-slate-50 p-3 rounded-lg text-xs gap-3">
                                <div className="flex items-center space-x-3.5 pl-3 border-l-2 border-indigo-400">
                                  <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-slate-500 text-[11px]">
                                    {childUser?.full_name.charAt(0)}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-slate-700 block">{childUser?.full_name}</span>
                                    <span className="text-[10px] text-slate-450 font-mono font-bold block">
                                      ID: {child.affiliate_id} • Status: {child.status.toUpperCase()}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-6 shrink-0 justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                                  <div>
                                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Registration Date</span>
                                    <span className="text-slate-600 font-mono font-medium text-[11px]">
                                      {storeState.formatDate(child.created_at).split(",")[0]}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Sponsor Commissions</span>
                                    <span className="text-indigo-600 font-bold font-mono text-sm">
                                      ₦{sumComms.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Note Popup Prompt */}
      {resolvingWthId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-150 p-6 w-full max-w-md shadow-2xl space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {resolutionAction === "approve" ? "Configure Disbursement Clearance" : "Configure Request Declinal"}
            </h4>

            <form onSubmit={handleResolveWithdrawal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Resolution Log Note</label>
                <textarea
                  required
                  placeholder={resolutionAction === "approve" ? "Provide processing details e.g. paid via GtBank Transfer TxRef 942" : "Provide rejection reason e.g. inadequate compliance stats"}
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full text-sm p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex space-x-2 pt-1 font-sans">
                <button
                  type="button"
                  onClick={() => setResolvingWthId(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                    resolutionAction === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  Confirm Payout Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
