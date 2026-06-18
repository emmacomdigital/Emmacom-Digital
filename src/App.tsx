import { useState, useEffect } from "react";
import { appStore, AffiliateSystemStore } from "./store";
import AdminDashboard from "./components/AdminDashboard";
import AffiliateDashboard from "./components/AffiliateDashboard";
import JoinPage from "./components/JoinPage";
import WhatsAppSupport from "./components/WhatsAppSupport";
import LoginScreen from "./components/LoginScreen";
import FrontendLanding from "./components/FrontendLanding";
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
  FileText,
  Home,
  LayoutDashboard,
  UserPlus,
  ShieldAlert
} from "lucide-react";

export default function App() {
  const [storeState, setStoreState] = useState<AffiliateSystemStore>(appStore);
  const [activeRole, setActiveRole] = useState<"home" | "admin" | "affiliate" | "join">("affiliate");
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
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
        const uppercaseCode = code.trim().toUpperCase();
        setSimulatedSponsorCode(uppercaseCode);
        if (!authenticatedUser) {
          setShowRegister(true);
        } else {
          setActiveRole("join");
        }
      }
    }

    // Baseline calculation of notification badge count
    const unread = storeState.notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [authenticatedUser, storeState]);

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

  const handleRoleChange = (role: "home" | "admin" | "affiliate" | "join") => {
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
        {showRegister ? (
          <JoinPage
            storeState={storeState}
            onRefresh={handleRefresh}
            onJoinSuccess={(newUserId) => {
              setShowRegister(false);
              setShowLogin(false);
              setActiveRole("affiliate");
              setSelectedUserId(newUserId);
              
              // Seed session data context
              const u = storeState.users.find(usr => usr.user_id === newUserId);
              if (u) {
                handleLoginSuccess({
                  user_id: u.user_id,
                  email: u.email,
                  full_name: u.full_name,
                  is_admin: u.is_admin
                });
              }
            }}
            initialSponsorCode={simulatedSponsorCode}
            onNavigateToLogin={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
            onNavigateToHome={() => {
              setShowRegister(false);
              setShowLogin(false);
            }}
          />
        ) : showLogin ? (
          <LoginScreen 
            storeState={storeState}
            onLoginSuccess={handleLoginSuccess} 
            onNavigateToRegister={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
            onNavigateToHome={() => {
              setShowLogin(false);
              setShowRegister(false);
            }}
          />
        ) : (
          <FrontendLanding
            storeState={storeState}
            onLoginClick={() => {
              setShowLogin(true);
              setShowRegister(false);
            }}
            onRegisterClick={() => {
              setShowRegister(true);
              setShowLogin(false);
            }}
          />
        )}
        <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-6 px-4 md:px-8 text-xs font-mono mt-auto relative">
          <div className="max-w-7xl mx-auto text-center text-[10px] text-slate-500 font-sans">
            © {new Date().getFullYear()} Emmacom Digital Academy. Fully optimized for robust production cloud hosting and secure databases.
          </div>
        </footer>
        <WhatsAppSupport />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">

      {/* Main Professional Header bar */}
      <header className="bg-white border-b border-gray-150 py-4 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs" id="main-app-header">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-serif font-black shadow-md shadow-indigo-200">
            E
          </div>
          <div>
            <span className="text-[10px] text-indigo-600 uppercase font-black tracking-widest block font-sans">Emmacom Digital Academy</span>
            <span className="text-sm font-extrabold text-slate-800 tracking-tight block">Partner Commission Hub</span>
          </div>
        </div>

        {/* Dynamic Navigation Menu / Home Menu */}
        <div className="hidden lg:flex items-center space-x-1 border border-slate-100 bg-slate-50/60 p-1 rounded-2xl" id="global-navigation-bar">
          <button
            onClick={() => handleRoleChange("home")}
            className={`flex items-center space-x-1.5 py-1.5 px-3.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeRole === "home" 
                ? "bg-white text-indigo-600 shadow-xs" 
                : "text-slate-600 hover:text-indigo-600 hover:bg-white/50"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Public Home</span>
          </button>

          <button
            onClick={() => handleRoleChange("affiliate")}
            className={`flex items-center space-x-1.5 py-1.5 px-3.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeRole === "affiliate" 
                ? "bg-white text-indigo-600 shadow-xs" 
                : "text-slate-600 hover:text-indigo-600 hover:bg-white/50"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>My Workspace</span>
          </button>

          <button
            onClick={() => handleRoleChange("join")}
            className={`flex items-center space-x-1.5 py-1.5 px-3.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeRole === "join" 
                ? "bg-white text-indigo-600 shadow-xs" 
                : "text-slate-600 hover:text-indigo-600 hover:bg-white/50"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Join Form Hub</span>
          </button>

          {authenticatedUser?.is_admin && (
            <button
              onClick={() => handleRoleChange("admin")}
              className={`flex items-center space-x-1.5 py-1.5 px-3.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeRole === "admin" 
                  ? "bg-white text-rose-600 shadow-xs border border-rose-100/50" 
                  : "text-slate-600 hover:text-rose-600 hover:bg-white/50"
              }`}
            >
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              <span>Admin HQ</span>
            </button>
          )}
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

      {/* Mobile & Tablet Bottom / Sub Navigation Bar */}
      <div className="lg:hidden bg-white border-b border-gray-150 py-2.5 px-4 flex items-center justify-center gap-1.5 sticky top-[73px] z-20 shadow-xs overflow-x-auto" id="mobile-sub-navbar">
        <button
          onClick={() => handleRoleChange("home")}
          className={`flex items-center space-x-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
            activeRole === "home" 
              ? "bg-indigo-50 text-indigo-600" 
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Home className="h-3.5 w-3.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleRoleChange("affiliate")}
          className={`flex items-center space-x-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
            activeRole === "affiliate" 
              ? "bg-indigo-50 text-indigo-600" 
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span>Workspace</span>
        </button>

        <button
          onClick={() => handleRoleChange("join")}
          className={`flex items-center space-x-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
            activeRole === "join" 
              ? "bg-indigo-50 text-indigo-600" 
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Join Form</span>
        </button>

        {authenticatedUser?.is_admin && (
          <button
            onClick={() => handleRoleChange("admin")}
            className={`flex items-center space-x-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
              activeRole === "admin" 
                ? "bg-rose-50 text-rose-600" 
                : "text-slate-600 hover:bg-rose-50"
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
            <span>Admin HQ</span>
          </button>
        )}
      </div>

      {/* Primary content area */}
      <main className="flex-1 pb-24">
        {activeRole === "home" && (
          <FrontendLanding
            storeState={storeState}
            onLoginClick={() => {
              handleRoleChange("affiliate");
            }}
            onRegisterClick={() => {
              handleRoleChange("join");
            }}
            isLoggedIn={true}
            onGoToDashboard={() => {
              handleRoleChange(authenticatedUser?.is_admin ? "admin" : "affiliate");
            }}
          />
        )}

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
            <JoinPage
              storeState={storeState}
              onRefresh={handleRefresh}
              onJoinSuccess={handleJoinSuccess}
              initialSponsorCode={simulatedSponsorCode}
            />
          </div>
        )}
      </main>

      <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-6 px-4 md:px-8 text-xs font-mono mt-auto relative">
        <div className="max-w-7xl mx-auto text-center text-[10px] text-slate-500 font-sans">
          © {new Date().getFullYear()} Emmacom Digital Academy. Single-Tier partner marketing network. Optimized for secure cloud transaction processing.
        </div>
      </footer>

      {/* Floating WhatsApp chat Support integration bubble */}
      <WhatsAppSupport />
    </div>
  );
}
