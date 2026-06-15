import { useState, useEffect } from "react";
import { appStore, AffiliateSystemStore } from "./store";
import SimulationController from "./components/SimulationController";
import AdminDashboard from "./components/AdminDashboard";
import AffiliateDashboard from "./components/AffiliateDashboard";
import JoinPage from "./components/JoinPage";
import WhatsAppSupport from "./components/WhatsAppSupport";
import LoginScreen from "./components/LoginScreen";
import { 
  Bell, 
  Settings, 
  HelpCircle, 
  User, 
  FileClock, 
  CheckCheck,
  Building2,
  Trash2,
  CheckCircle,
  FileText
} from "lucide-react";

export default function App() {
  const [storeState, setStoreState] = useState<AffiliateSystemStore>(appStore);
  const [activeRole, setActiveRole] = useState<"admin" | "affiliate" | "join">("affiliate");
  
  // Authenticated state wrapper (keeps state local or simulated)
  const [authenticatedUser, setAuthenticatedUser] = useState<{
    user_id: string;
    email: string;
    full_name: string;
    is_admin: boolean;
  } | null>(() => {
    const cached = localStorage.getItem("emmacom_auth_session");
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { return null; }
    }
    return null;
  });

  const handleLoginSuccess = (user: { user_id: string; email: string; full_name: string; is_admin: boolean }) => {
    setAuthenticatedUser(user);
    localStorage.setItem("emmacom_auth_session", JSON.stringify(user));
    
    // Auto align roles and IDs based on user properties
    if (user.is_admin) {
      setActiveRole("admin");
    } else {
      setActiveRole("affiliate");
      setSelectedUserId(user.user_id);
      
      // Seed user key profile in memory if missing
      const exists = storeState.users.find(u => u.user_id === user.user_id);
      if (!exists) {
        storeState.users.push({
          user_id: user.user_id,
          full_name: user.full_name,
          email: user.email,
          phone: "+234 810 000 0000",
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.user_id}`,
          is_admin: false,
          registration_fee_paid: true,
          joined_at: new Date().toISOString()
        });
        storeState.saveAll();
        handleRefresh();
      }
    }
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    localStorage.removeItem("emmacom_auth_session");
  };

  // Currently selected affiliate user ID in the simulator
  const [selectedUserId, setSelectedUserId] = useState("USR_JOHN");
  
  // Notification menu state
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Read URL simulation trigger
  const [simulatedSponsorCode, setSimulatedSponsorCode] = useState<string | null>(null);

  // Sync / refresh state helper
  const handleRefresh = () => {
    const updatedStore = new AffiliateSystemStore();
    setStoreState(updatedStore);
    
    // Calculate unread notifications
    const unread = updatedStore.notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  };

  useEffect(() => {
    // Detect if we have a simulated ref link in the pathname
    const path = window.location.pathname;
    if (path.includes("/ref/")) {
      const code = path.split("/ref/")[1];
      if (code && code.trim()) {
        setSimulatedSponsorCode(code.trim().toUpperCase());
        setActiveRole("join");
      }
    }

    // Baseline calculation of notification badge count
    const unread = storeState.notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, []);

  const handleSimulatePassMonth = () => {
    storeState.simulatePassMonth();
    handleRefresh();
  };

  const handleResetStore = () => {
    localStorage.clear();
    const cleanStore = new AffiliateSystemStore();
    setStoreState(cleanStore);
    setSelectedUserId("USR_JOHN");
    setActiveRole("affiliate");
    // Force a structural page refresh to re-evaluate seeds
    window.location.reload();
  };

  const handleMarkAllRead = () => {
    storeState.notifications.forEach(n => n.read = true);
    storeState.saveAll();
    handleRefresh();
  };

  const handleRoleChange = (role: "admin" | "affiliate" | "join") => {
    setActiveRole(role);
    if (role === "join") {
      // Clear referral triggers unless preset
      setSimulatedSponsorCode(null);
    }
  };

  // Switch role to a newly signed user automatically
  const handleJoinSuccess = (newUserId: string) => {
    setSelectedUserId(newUserId);
    setActiveRole("affiliate");
    handleRefresh();
  };

  // Helper audit logs display
  const viewLogs = storeState.auditLogs.slice(0, 15);

  if (!authenticatedUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
        <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-6 px-4 md:px-8 text-xs font-mono mt-auto relative">
          <div className="max-w-7xl mx-auto text-center text-[10px] text-slate-500 font-sans">
            © {new Date().getFullYear()} Emmacom Digital. Fully optimized for production build on Cloudflare Pages, Workers and D1 Database.
          </div>
        </footer>
        <WhatsAppSupport />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      
      {/* Simulation Top Bar */}
      <SimulationController
        storeState={storeState}
        activeRole={activeRole}
        selectedUserId={selectedUserId}
        onRoleChange={handleRoleChange}
        onUserChange={setSelectedUserId}
        onSimulateMonth={handleSimulatePassMonth}
        onReset={handleResetStore}
      />

      {/* Main Professional Header bar */}
      <header className="bg-white border-b border-gray-150 py-4 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs" id="main-app-header">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-serif font-black shadow-md shadow-indigo-200">
            E
          </div>
          <div>
            <span className="text-[10px] text-indigo-600 uppercase font-black tracking-widest block font-sans">Emmacom Digital</span>
            <span className="text-sm font-extrabold text-slate-800 tracking-tight block">Partner Commission Hub</span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-4">
          
          {/* Notifications bell icon with count */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg relative cursor-pointer focus:outline-none"
              id="notifications-bell"
              title="Automated notifications review"
            >
              <Bell className="h-5.5 w-5.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Panel Box */}
            {showNotifications && (
              <div 
                className="absolute right-0 mt-3 w-80 md:w-96 rounded-2xl bg-white border border-slate-100 shadow-2xl py-2 z-50 animate-fade-in"
                id="notifications-popup-drawer"
              >
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-800 text-sm">System Alerts Diary</span>
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <CheckCheck className="h-3.5 w-3.5 inline" />
                    <span>Clear Alerts</span>
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
                  {storeState.notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No automated events recorded.
                    </div>
                  ) : (
                    storeState.notifications.map(not => (
                      <div 
                        key={not.notification_id} 
                        className={`p-3.5 text-xs transition-colors ${not.read ? "bg-white" : "bg-indigo-50/40"}`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-bold text-slate-800 text-[12px] block leading-relaxed">{not.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                            {storeState.formatDate(not.created_at).split(",")[0]}
                          </span>
                        </div>
                        <p className="text-slate-600 font-normal mt-1 leading-relaxed">{not.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Role Badge Display */}
          <div className="hidden sm:flex items-center space-x-2 text-xs border border-slate-150 py-1.5 px-3 rounded-xl bg-slate-50/80">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-slate-450 font-bold uppercase tracking-wider text-[10px]">Session:</span>
            <span className="text-slate-700 font-bold capitalize">{authenticatedUser?.full_name} ({activeRole})</span>
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center space-x-1"
            id="header-sign-out"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Primary content area */}
      <main className="flex-1 pb-24">
        {activeRole === "admin" && (
          <AdminDashboard
            storeState={storeState}
            onRefresh={handleRefresh}
          />
        )}

        {activeRole === "affiliate" && (
          <AffiliateDashboard
            storeState={storeState}
            activeUserId={selectedUserId}
            onRefresh={handleRefresh}
          />
        )}

        {activeRole === "join" && (
          <div className="space-y-6">
            {/* Quick Helper code block for testing simulated path parameters */}
            <div className="max-w-4xl mx-auto px-4 mt-6">
              <div className="bg-slate-900 border border-slate-800 text-slate-400 p-4 rounded-xl text-xs space-y-2 font-mono flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-white font-bold flex items-center">
                    <CheckCircle className="h-4.5 w-4.5 text-indigo-500 mr-1.5 shrink-0" />
                    <span>Simulated Link Referral Onboarding URL</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Entering a code below instantly simulates what a lead sees when clicking the affiliate's link.
                  </p>
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                  <select
                    onChange={(e) => setSimulatedSponsorCode(e.target.value)}
                    value={simulatedSponsorCode || ""}
                    className="bg-slate-850 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 outline-none w-full"
                  >
                    <option value="">Direct (No Sponsor Code)</option>
                    {storeState.affiliates.map(aff => {
                      const u = storeState.users.find(usr => usr.user_id === aff.user_id);
                      return (
                        <option key={aff.affiliate_id} value={aff.affiliate_id}>
                          Under {u?.full_name} ({aff.affiliate_id})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            <JoinPage
              storeState={storeState}
              onRefresh={handleRefresh}
              onJoinSuccess={handleJoinSuccess}
              initialSponsorCode={simulatedSponsorCode}
            />
          </div>
        )}
      </main>

      {/* Floating Audit Logs View footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-6 px-4 md:px-8 text-xs font-mono mt-auto relative" id="sandbox-logs-footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-white font-bold text-sm tracking-tight flex items-center space-x-1.5 font-sans">
              <FileClock className="h-4.5 w-4.5 text-amber-500" />
              <span>Security & Audit Trails Log</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Every critical action, such as sign-up dividends, wallet payout clearances, and manual suspensions, generates immutable server-mock audits automatically.
            </p>
          </div>

          <div className="md:col-span-8 bg-slate-900/60 rounded-xl border border-slate-800 p-4 max-h-40 overflow-y-auto space-y-2 text-[11px]">
            {viewLogs.length === 0 ? (
              <p className="text-slate-500 italic text-center py-4">No audit trails registered yet.</p>
            ) : (
              viewLogs.map(lg => (
                <div key={lg.log_id} className="flex justify-between hover:bg-slate-850/50 p-1.5 rounded text-left gap-4">
                  <div>
                    <span className="text-amber-500 font-bold">[{lg.action}]</span>{" "}
                    <span className="text-slate-300">{lg.details}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                    {storeState.formatDate(lg.created_at).split(",")[1]?.trim() || ""}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-900/60 mt-6 pt-4 text-center text-[10px] text-slate-500 font-sans">
          © {new Date().getFullYear()} Emmacom Digital. Single-Tier affiliate marketing schema. Optimized for security compliance.
        </div>
      </footer>

      {/* Floating WhatsApp chat Support integration bubble */}
      <WhatsAppSupport />
    </div>
  );
}
