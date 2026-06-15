import { useState, useEffect, FormEvent } from "react";
import { appStore, AffiliateSystemStore } from "../store";
import { CreditCard, CheckCircle, ShieldCheck, UserPlus, Info, Terminal, Key } from "lucide-react";

interface JoinPageProps {
  storeState: AffiliateSystemStore;
  onRefresh: () => void;
  onJoinSuccess: (newUserId: string) => void;
  initialSponsorCode?: string | null;
  onNavigateToLogin?: () => void;
  onNavigateToHome?: () => void;
}

export default function JoinPage({ storeState, onRefresh, onJoinSuccess, initialSponsorCode, onNavigateToLogin, onNavigateToHome }: JoinPageProps) {
  // Input fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sponsorCode, setSponsorCode] = useState(initialSponsorCode || "");
  const [errorMsg, setErrorMsg] = useState("");

  // Payment UI flow
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("4000 1234 5678 9010");
  const [cardExpiry, setCardExpiry] = useState("12/29");
  const [cardCvv, setCardCvv] = useState("123");
  const [paymentStep, setPaymentStep] = useState<"form" | "processing" | "success">("form");
  const [paymentRef, setPaymentRef] = useState("");

  // Registered result
  const [registeredResult, setRegisteredResult] = useState<{
    userId: string;
    affiliateId: string;
    fullName: string;
  } | null>(null);

  const [manualAccountSelected, setManualAccountSelected] = useState(false);

  useEffect(() => {
    if (initialSponsorCode) {
      setSponsorCode(initialSponsorCode);
    }
  }, [initialSponsorCode]);

  // Valid sponsor details if any
  const matchedSponsor = sponsorCode
    ? storeState.affiliates.find(
        (a) =>
          a.affiliate_id.toUpperCase() === sponsorCode.toUpperCase() ||
          a.referral_code.toUpperCase() === sponsorCode.toUpperCase()
      )
    : null;

  const matchedUser = matchedSponsor
    ? storeState.users.find((u) => u.user_id === matchedSponsor.user_id)
    : null;

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg("Please fill out all required fields to continue.");
      return;
    }

    // Check if email already registered
    const exists = storeState.users.some(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) {
      setErrorMsg("This email address is already registered on Emmacom Digital.");
      return;
    }

    // Premium Partner: trigger Mock Ref
    setPaymentRef(`FLW-MOCK-${Math.floor(100000 + Math.random() * 900000)}`);
    setPaymentStep("form");
    
    setShowPaymentModal(true);
  };

  const processSimulatedPayment = () => {
    setPaymentStep("processing");
    
    setTimeout(() => {
      // Create affiliate registration in database store with premium instant approval!
      const result = storeState.registerNewAffiliate({
        fullName,
        email: email.trim(),
        phone: phone.trim(),
        sponsorCode: sponsorCode ? sponsorCode.trim() : null,
        simulatedPaymentRef: paymentRef,
      });

      if (result.success && result.user && result.affiliate) {
        setPaymentStep("success");
        setRegisteredResult({
          userId: result.user.user_id,
          affiliateId: result.affiliate.affiliate_id,
          fullName: result.user.full_name,
        });
        onRefresh();
      } else {
        setErrorMsg(result.error || "An unexpected registration error occurred.");
        setShowPaymentModal(false);
      }
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 font-sans" id="join-page-container">
      {/* Visual Header */}
      <div className="text-center mb-8">
        <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Emmacom Digital Onboarding
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mt-3">
          Join Emmacom Affiliate Program
        </h1>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto text-sm md:text-base">
          Sign up to unlock professional digital products, courses, member privileges, and start earning recurring single-level commissions.
        </p>
      </div>

      {/* Autoplaying Video Intro Hero Element */}
      <div className="mb-10 max-w-3xl mx-auto overflow-hidden bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-2.5 relative">
        <div className="absolute top-4 left-4 bg-rose-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1 animate-pulse z-10" id="video-pill">
          <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
          <span>Program Video Intro</span>
        </div>
        <div className="aspect-video w-full rounded-xl overflow-hidden relative shadow-inner">
          <iframe 
            src="https://www.youtube.com/embed/13dXWhffS98?autoplay=1&loop=1&playlist=13dXWhffS98&controls=1&rel=0&showinfo=0"
            title="Emmacom Digital Program Intro Video"
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            id="intro-video-iframe"
          />
        </div>
        <div className="py-2 px-3 bg-slate-950 text-[11px] text-slate-400 font-sans text-center mt-2 rounded-lg border border-slate-900 leading-relaxed font-mono">
          📺 Learn how our program structures affiliate revenue streams automatically in under 5 minutes.
        </div>
      </div>

      {!registeredResult ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Registration Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-indigo-600" />
                <span>Partner Account Sign Up</span>
              </h2>
              <div className="flex items-center space-x-3.5">
                {onNavigateToLogin && (
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold signup-login-toggle cursor-pointer"
                  >
                    Already have an account? Sign In
                  </button>
                )}
                {onNavigateToHome && (
                  <button
                    type="button"
                    onClick={onNavigateToHome}
                    className="text-xs text-slate-500 hover:text-indigo-650 font-bold cursor-pointer"
                    id="back-to-home-from-signup"
                  >
                    | Public Website
                  </button>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-5" id="onboarding-form">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Full Name (Legal Name for Payouts)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mary Alao"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-sm px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. mary@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234 815 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Sponsor Identification */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/50">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Sponsor Referral Code / Sponsor ID</span>
                  {matchedSponsor && (
                    <span className="text-xs text-emerald-600 normal-case flex items-center font-medium">
                      ✓ Sponsor Found
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Enter Sponsor Code e.g. EMM1001 (Optional)"
                  value={sponsorCode}
                  onChange={(e) => setSponsorCode(e.target.value.toUpperCase())}
                  className="w-full text-sm px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-200 font-mono tracking-wider mb-1"
                />

                {matchedSponsor && matchedUser ? (
                  <div className="mt-3 flex items-center space-x-3 text-xs text-gray-600 bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-lg">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-[10px] font-bold">
                      {matchedUser.full_name.charAt(0)}
                    </div>
                    <div>
                      Referral sponsor confirmed: <span className="font-semibold text-gray-800">{matchedUser.full_name}</span> ({matchedSponsor.affiliate_id})
                    </div>
                  </div>
                ) : sponsorCode ? (
                  <div className="mt-2 text-xs text-red-600 flex items-center space-x-1">
                    <span className="font-semibold">⚠️ Code not found</span>
                    <span>. You will be registered directly with the platform.</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 mt-2">
                    Enter your sponsor's code to bind under their tree. Skip if you don't have a sponsor.
                  </p>
                )}


              </div>

              {/* Terms Indicator */}
              <div className="flex items-start space-x-2.5 text-xs text-gray-500 leading-relaxed">
                <input type="checkbox" required defaultChecked className="mt-1 h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span>
                  I agree to Emmacom Digital's terms of service, partner affiliate policies, and authorize the mock signup fee. I understand ongoing compliance requires recurring ₦{storeState.config.monthly_donation_amount.toLocaleString()} payments.
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center justify-center space-x-2 cursor-pointer font-sans"
                id="proceed-payment-btn"
              >
                <CreditCard className="h-4 w-4" />
                <span>Pay Affiliate Fee & Setup (₦{storeState.config.registration_fee.toLocaleString()})</span>
              </button>
            </form>
          </div>

          {/* Side Info & Guidelines */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-6 md:p-8 rounded-2xl text-white shadow-lg space-y-5">
              <h3 className="font-bold text-lg border-b border-indigo-800 pb-3 text-amber-300">
                Membership Privileges
              </h3>
              <ul className="space-y-4 text-xs text-indigo-100 leading-relaxed">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Full Digital Suite:</span> Access high-value template products, programming tutorials, and masterclasses.
                  </div>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">20% Immediate Affiliate Earning:</span> Get direct payout commissions for every affiliate that completes enrollment through your link.
                  </div>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Recurring Monthly Dividends:</span> Enjoy continuous rewards as long as referred participants submit their monthly membership donation.
                  </div>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">100% Secure Processing:</span> Transact through robust, industry-leading Flutterwave secure payment verification portals.
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
              <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider flex items-center space-x-1.5">
                <Info className="h-3.5 w-3.5 text-gray-400" />
                <span>Single-Tier Safety Rules</span>
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Emmacom Digital enforces strict first-level commission rules. You will **never** receive bonuses on third-party downlines referred by your referrals. This keeps the program fully solvent, legal, and easy to understand.
              </p>
            </div>
          </div>
        </div>

        {/* Brand New Product Showcase Section with Cover Images */}
        <div className="mt-12 pt-10 border-t border-gray-200 animate-fade-in" id="frontend-products-catalog">
          <div className="text-center mb-8">
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100">
              Emmacom Assets Vault
            </span>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-2.5">
              📦 Preview Our Premium Products Suite
            </h3>
            <p className="text-xs text-gray-400 mt-1.5 max-w-lg mx-auto">
              Members and affiliates get instant secure download permissions for our entire suite of professional templates, guides, and tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: "p-1",
                name: "Conversion Secrets: Digital Affiliate Handbook",
                image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
                desc: "Proven tactics and copy-paste templates to target social media platforms to refer new users.",
                badge: "E-BOOK HANDBOOK"
              },
              {
                id: "p-2",
                name: "WhatsApp Auto-Responder Templates & Funnel Swipe File",
                image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&q=80&w=600",
                desc: "Boost communication response rates using our exact sequence swipe codes.",
                badge: "MOCK TRANSCRIPT"
              },
              {
                id: "p-3",
                name: "Naira Arbitrage Master Spreadsheets & Audit Pack",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
                desc: "Accurately record metrics, track margins, and evaluate business efficiency.",
                badge: "EXCEL WORKBOOK"
              },
              {
                id: "p-4",
                name: "Advanced Google Search Ads Campaign Guide",
                image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=600",
                desc: "Scale highly targeted conversion pipelines to generate automated referral codes signups.",
                badge: "VIDEO SECRETS"
              },
              {
                id: "p-5",
                name: "Emmacom Automated Multi-Channel Campaign Broadcaster",
                image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
                desc: "Broadcast personalized messages to multiple networks safely without account suspension.",
                badge: "UTILITY PIPELINE"
              },
              {
                id: "p-6",
                name: "Single-Tier Funnel Builder React Starter Kit",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
                desc: "Spin up high-converting landing sheets that perfectly sync sponsorship IDs on redirect.",
                badge: "REACT FRAMEWORK"
              }
            ].map(product => (
              <div 
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-150 shadow-xs hover:shadow-md transition-all flex flex-col hover:border-indigo-200"
              >
                <div className="h-40 w-full relative overflow-hidden bg-slate-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[9px] bg-slate-900/95 text-white font-black font-sans px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                      {product.badge}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-800 text-xs tracking-tight line-clamp-2 md:text-sm leading-tight">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed">
                      {product.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px]">
                    <span className="text-indigo-600 font-bold font-sans">Premium Inclusion</span>
                    <span className="text-gray-400 font-mono font-bold">Verified Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
      ) : (
        /* Success Onboarding Card */
        <div className="bg-white rounded-2xl border border-emerald-100 p-8 shadow-xl max-w-2xl mx-auto text-center space-y-6 transform animate-fade-in" id="onboarding-success-card">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle className="h-10 w-10 animate-scale-up" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">Registration Complete!</h2>
            <p className="text-sm text-gray-500">
              Welcome to the family. Your registration at Emmacom Digital was certified successfully.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/50 rounded-xl p-6 text-left space-y-4">
            <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
              <span className="text-gray-500 font-medium font-sans">REGISTRATION TYPE</span>
              <span className="font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded text-[10px]">
                Paid Partner Affiliate
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
              <span className="text-gray-500 font-medium">AFFILIATE ID</span>
              <span className="font-mono font-bold text-slate-800">{registeredResult.affiliateId}</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-200">
              <span className="text-gray-500 font-medium font-sans">FULL NAME</span>
              <span className="font-bold text-slate-800">{registeredResult.fullName}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Private Referral Link</span>
              <div className="bg-indigo-50 border border-indigo-100/30 rounded-lg p-2.5 font-mono text-xs text-indigo-700 select-all overflow-x-auto text-center">
                {`${window.location.origin}/ref/${registeredResult.affiliateId}`}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <button
              onClick={() => onJoinSuccess(registeredResult.userId)}
              className="flex-1 bg-indigo-600 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer"
              id="goto-dashboard-btn"
            >
              Access Member Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Simulated / Real Flutterwave Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fade-in">
          <div 
            className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-100 scale-100 transition-transform duration-300"
            id="flutterwave-modal"
          >
            {/* Flutterwave Header */}
            <div className="bg-[#1C2434] p-5 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-[#EF4444] text-white h-8 w-8 rounded-lg flex items-center justify-center font-black text-xs tracking-tighter uppercase font-mono">
                  fw
                </div>
                <div>
                  <h3 className="font-semibold text-xs text-slate-300 uppercase tracking-wider font-mono">Secured by Flutterwave</h3>
                  <p className="text-sm font-bold text-white uppercase tracking-tight">EMMACOM DIGITAL INTEGRATOR</p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded bg-white/5 cursor-pointer font-semibold transition"
                id="cancel-payment-btn"
              >
                Cancel
              </button>
            </div>

            {/* Modal Content depending on state */}
            {paymentStep === "form" && (
              <div className="p-6 space-y-4">
                <div className="bg-indigo-50/60 rounded-xl p-4 flex items-center justify-between border border-indigo-100/30">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Due Amount</span>
                    <span className="text-xl font-bold text-slate-800 font-sans">₦{storeState.config.registration_fee.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] bg-indigo-600 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">ONE-TIME FEE</span>
                </div>

                <div className="space-y-3 font-sans">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Fast Card Sandbox Setup</div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-slate-700 text-sm px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 font-mono"
                      placeholder="CARD NUMBER"
                    />
                    <CreditCard className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full text-slate-700 text-sm px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-center"
                      placeholder="MM/YY"
                    />
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full text-slate-700 text-sm px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-center"
                      placeholder="CVV"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={processSimulatedPayment}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm flex items-center justify-center space-x-2 cursor-pointer"
                      id="simulate-authorize-pay-btn"
                    >
                      <ShieldCheck className="h-4.5 w-4.5" />
                      <span>Authorize Pay (₦{storeState.config.registration_fee.toLocaleString()})</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentStep === "processing" && (
              <div className="p-12 text-center space-y-6">
                <div className="mx-auto h-12 w-12 rounded-full border-4 border-rose-500 border-t-transparent animate-spin"></div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Processing Flutterwave Instant Handshake...</h4>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed max-w-xs mx-auto">
                    Verifying authorization payload and crediting available sponsor ledger collections automatically...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
