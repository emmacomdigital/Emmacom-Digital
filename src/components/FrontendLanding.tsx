import { useState } from "react";
import { motion } from "motion/react";
import { 
  BookOpen, 
  Sparkles, 
  Users, 
  Award, 
  BadgeCheck, 
  DollarSign, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  BrainCircuit, 
  PlayCircle,
  Clock,
  Layers,
  ChevronRight,
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import { appStore, AffiliateSystemStore } from "../store";

interface FrontendLandingProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  isLoggedIn?: boolean;
  onGoToDashboard?: () => void;
  storeState?: AffiliateSystemStore;
}

export default function FrontendLanding({ 
  onLoginClick, 
  onRegisterClick, 
  isLoggedIn, 
  onGoToDashboard,
  storeState = appStore 
}: FrontendLandingProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const benefits = [
    {
      id: "benefit-1",
      title: "Uncompromising Double Rewards",
      description: "Earn a massive flat 20% on all upfront signups, plus recurring passive monthly commission multipliers from active referrals' contributions.",
      icon: DollarSign,
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      id: "benefit-2",
      title: "Premium Products Vault Access",
      description: "Instantly unlock the entire library of live digital products, marketing files, masterclasses, and pre-formatted marketing assets.",
      icon: Award,
      color: "text-sky-600 bg-sky-50"
    },
    {
      id: "benefit-3",
      title: "Automated Edge Commissions Ledger",
      description: "Track conversion performance in real-time, view live payouts, submit bank details, and withdraw funds with clear status auditing.",
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      id: "benefit-4",
      title: "Direct WhatsApp Mentors Community",
      description: "Connect instantly with top affiliate mentors, join group masterminds, and access premium training support directly in real-time.",
      icon: Users,
      color: "text-purple-600 bg-purple-50"
    }
  ];

  const faqs = [
    {
      question: "What is Emmacomdigital Courses and how does the affiliate program work?",
      answer: "Emmacomdigital Courses is an elite skill and digital assets hub. Members pay a one-time registration fee to unlock comprehensive premium digital products, high-ticket masterclasses, and pre-formatted marketing assets. Once registered, you obtain an authorized affiliate partner license, allowing you to recruit others using your link and earn both immediate registration commissions (20%) and recurring passive rewards."
    },
    {
      question: "Is there a monthly commitment required to keep my affiliate status active?",
      answer: "Yes, to ensure high system integrity and support the ongoing development of the community, partners contribute a monthly platform maintenance compliance fee (₦5,000). Active contributions are required to remain eligible to withdraw earnings and generate recurring commissions from your referred partners' actions."
    },
    {
      question: "How do I request a withdrawal and when do I get paid?",
      answer: "When your wallet reaches the minimum withdrawable balance (₦2,000), you can enter your local bank name and account details directly in your Affiliate Dashboard. Once requested, admin reviews and clears your funds instantly, which are processed with complete audit trails to your bank."
    },
    {
      question: "Can I join from anywhere in the world?",
      answer: "Absolutely! Although database examples and base fees are displayed in Naira (₦) for local processing convenience, our masterclasses, referral networks, and cloud integrations are accessible worldwide on global serverless nodes."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased" id="emmacom-public-landing">
      {/* Top Professional Header Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm" id="landing-main-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-11 w-11 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-serif font-black shadow-lg shadow-indigo-200">
                E
              </div>
              <div>
                <span className="text-[10px] text-indigo-600 uppercase font-black tracking-widest block font-sans">Emmacomdigital Courses</span>
                <span className="text-sm font-extrabold text-slate-900 tracking-tight block">Skill Academy & Partner Hub</span>
              </div>
            </div>

            {/* Desktop Menu links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#premium-showcase" className="text-sm text-slate-600 hover:text-indigo-600 font-semibold transition-all">
                Premium Catalog
              </a>
              <a href="#program-benefits" className="text-sm text-slate-600 hover:text-indigo-600 font-semibold transition-all">
                Partner Benefits
              </a>
              <a href="#how-it-works" className="text-sm text-slate-600 hover:text-indigo-600 font-semibold transition-all">
                How It Works
              </a>
              <a href="#faq-section" className="text-sm text-slate-600 hover:text-indigo-600 font-semibold transition-all">
                FAQs
              </a>
            </div>

            {/* CTA action buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {isLoggedIn ? (
                <button
                  onClick={onGoToDashboard}
                  className="py-2.5 px-6 text-xs text-white bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl transition-all cursor-pointer shadow-md flex items-center space-x-1.5"
                  id="landing-navbar-dashboard-btn"
                >
                  <span>Go to My Dashboard 🚀</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={onLoginClick}
                    className="py-2.5 px-5 text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                    id="landing-navbar-login-btn"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={onRegisterClick}
                    className="py-2.5 px-5 text-xs text-white bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-150 flex items-center space-x-1.5"
                    id="landing-navbar-register-btn"
                  >
                    <span>Join & Earn 💰</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
                id="landing-mobile-menu-btn"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-gray-150 py-4 px-4 space-y-3"
            id="landing-mobile-dropdown-menu"
          >
            <a 
              href="#premium-showcase" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-slate-700 hover:text-indigo-600 font-medium rounded-lg"
            >
              Premium Catalog
            </a>
            <a 
              href="#program-benefits" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-slate-700 hover:text-indigo-600 font-medium rounded-lg"
            >
              Partner Benefits
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-slate-700 hover:text-indigo-600 font-medium rounded-lg"
            >
              How It Works
            </a>
            <a 
              href="#faq-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-slate-700 hover:text-indigo-600 font-medium rounded-lg"
            >
              FAQs
            </a>
            <hr className="border-slate-100" />
            <div className="pt-1">
              {isLoggedIn ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); onGoToDashboard && onGoToDashboard(); }}
                  className="w-full py-2.5 text-center text-xs text-white bg-indigo-600 font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Go to My Dashboard 🚀
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
                    className="w-full py-2.5 text-center text-xs text-slate-700 bg-slate-50 border border-slate-200 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onRegisterClick(); }}
                    className="w-full py-2.5 text-center text-xs text-white bg-indigo-600 font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Join Now (₦10,000)
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pb-24 lg:pt-20 lg:pb-28" id="landing-hero-section">
        {/* Background Gradients */}
        <div className="absolute top-0 right-1/4 w-[40rem] h-[30rem] bg-indigo-200/40 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-12 left-10 w-[20rem] h-[20rem] bg-sky-200/30 rounded-full blur-2xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 py-1.5 px-3 rounded-full text-indigo-700 text-xs font-bold"
              >
                <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
                <span>Authorized Multi-Tier Skill Acquisition Platform</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none font-sans uppercase">
                Acquire High-Income Skills. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
                  Earn Uncapped Commissions.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed">
                Emmacomdigital Courses combines elite masterclasses in full-stack cloud dev, organic growth hacks, and funnels structure with a real-time high-performance single-tier 
                affiliate distribution platform.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <button
                  onClick={onRegisterClick}
                  className="w-full sm:w-auto py-3.5 px-8 text-sm text-white bg-indigo-600 hover:bg-indigo-700 font-extrabold rounded-2xl transition-all cursor-pointer shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2"
                  id="hero-register-cta-btn"
                >
                  <span>Apply to Join Academy (₦10,000)</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
                <a
                  href="#premium-showcase"
                  className="w-full sm:w-auto py-3.5 px-8 text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 font-bold rounded-2xl transition-all cursor-pointer shadow-xs flex items-center justify-center space-x-2"
                >
                  <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
                  <span>Browse Premium Catalog</span>
                </a>
              </div>

              {/* Stat badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200 max-w-md mx-auto lg:mx-0">
                <div id="hero-stat-1">
                  <span className="block text-2xl font-black text-indigo-600">6+</span>
                  <span className="block text-slate-500 text-[11px] font-bold uppercase tracking-wider">Premium Assets</span>
                </div>
                <div id="hero-stat-2">
                  <span className="block text-2xl font-black text-indigo-600">20%</span>
                  <span className="block text-slate-500 text-[11px] font-bold uppercase tracking-wider">Direct Rewards</span>
                </div>
                <div id="hero-stat-3">
                  <span className="block text-2xl font-black text-indigo-600">100%</span>
                  <span className="block text-slate-500 text-[11px] font-bold uppercase tracking-wider">Audit Verified</span>
                </div>
              </div>
            </div>

            {/* Visual Hero Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="w-full mx-auto max-w-sm rounded-[2.5rem] bg-indigo-950/5 border border-slate-200 p-3 sm:p-4 shadow-2xl relative overflow-hidden bg-white">
                <div className="rounded-[2rem] border border-slate-100 overflow-hidden bg-slate-900 text-white min-h-[360px] p-6 shadow-inner flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="space-y-1">
                        <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest block">EMMACOMDIGITAL COURSES</span>
                        <h4 className="text-sm font-bold tracking-tight">Active Partner Wallet</h4>
                      </div>
                      <span className="bg-emerald-500 text-white text-[9px] font-bold py-1 px-2.5 rounded-full block">Live Sync</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Withdrawable Balance</span>
                      <h3 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-300">₦45,000.00</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-[9px] text-slate-400 font-semibold block">Total Earnings</span>
                        <span className="text-xs font-bold block mt-1">₦112,000</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <span className="text-[9px] text-slate-400 font-semibold block">My Direct Team</span>
                        <span className="text-xs font-bold block mt-1">14 Qualified</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Ref Code:</span>
                      <span className="font-mono text-white text-xs font-bold tracking-wider">EMM1001</span>
                    </div>
                    <button
                      onClick={isLoggedIn ? onGoToDashboard : onLoginClick}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer text-center block"
                    >
                      {isLoggedIn ? "Resume Active Hub 🚀" : "Enter Affiliate Hub"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Featured Premium Product Suite & Flyers Section */}
      <section className="bg-slate-50 py-16 sm:py-24 border-b border-gray-155" id="premium-showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4" id="premium-header-block">
            <span className="text-xs text-indigo-600 font-extrabold tracking-widest uppercase block">EXCLUSIVE ACADEMY ASSETS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Our Premium Catalog & Flyer Showcase
            </h2>
            <p className="text-base text-slate-600 font-sans">
              Instantly unlock these high-converting, licensed marketing flyers and masterclass handbooks formatted in high-resolution Instagram sizes (1:1 square). Distribute these assets to supercharge your referral campaigns as an official partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="premium-suite-grid">
            {(storeState.premiumProducts && storeState.premiumProducts.length > 0
              ? storeState.premiumProducts
              : []
            ).map(product => (
              <div 
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:border-indigo-300 group"
              >
                {/* 1:1 Dynamic Instagram Size Flyer Container */}
                <div className="aspect-square w-full relative overflow-hidden bg-slate-100 border-b border-slate-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] bg-slate-900/90 backdrop-blur-xs text-white font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                      {product.badge}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">{product.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-sans">{product.desc}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
                      <span>Ready to Broadcast</span>
                    </span>
                    <button
                      onClick={onRegisterClick}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-extrabold flex items-center space-x-1 cursor-pointer transition-colors uppercase tracking-wider"
                    >
                      <span>Join Now</span>
                      <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-bounce">
            <button
              onClick={onRegisterClick}
              className="inline-flex items-center space-x-2 py-3.5 px-8 text-xs text-white bg-indigo-600 hover:bg-slate-900 font-extrabold rounded-2xl shadow-xl transition-all uppercase tracking-wider cursor-pointer transform hover:scale-105"
            >
              <span>Unlock Entire Premium Catalog Suite</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Program Benefits Section */}
      <section className="bg-slate-50/20 py-16 sm:py-24" id="program-benefits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4" id="benefits-header-block">
            <span className="text-xs text-indigo-600 font-extrabold tracking-widest uppercase">THE COOPERATIVE ADVANTAGE</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Why Affiliates Choose Emmacomdigital Courses
            </h2>
            <p className="text-base text-slate-600 font-sans">
              Our unique reward mechanism incentivizes genuine peer acquisition growth on secure serverless databases, maximizing cashouts with full visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" id="benefits-grid">
            {benefits.map(benefit => {
              const IconComponent = benefit.icon;
              return (
                <div 
                  key={benefit.id}
                  className="bg-white rounded-3xl border border-gray-155 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  id={`benefit-card-${benefit.id}`}
                >
                  <div className="space-y-4">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold ${benefit.color}`}>
                      <IconComponent className="h-5.5 w-5.5" />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">{benefit.title}</h3>
                    <p className="text-xs text-slate-500 font-sans leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Course Benefit / How It Works Grid */}
      <section className="bg-slate-900 text-white py-16 sm:py-20" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Promo text */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs text-indigo-400 font-black tracking-widest uppercase block">SIMPLE 3-STEP MATRIX</span>
              <h2 className="text-3xl font-extrabold tracking-tight font-sans leading-none uppercase">
                Begin Earning in Under 10 Minutes
              </h2>
              <p className="text-slate-300 text-sm font-sans leading-relaxed">
                Our automated ledger system triggers the commission engine instantly. Follow our blueprint, secure your referrals, and cash out straight into your bank.
              </p>

              <div className="pt-4">
                <button
                  onClick={onRegisterClick}
                  className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-md inline-flex items-center space-x-2"
                >
                  <span>Register Premium Account</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* List sequence */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl flex items-start space-x-4">
                <span className="h-10 w-10 shrink-0 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-black flex items-center justify-center font-mono">
                  01
                </span>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold tracking-tight">Purchase Platform License</h4>
                  <p className="text-slate-400 text-xs font-sans leading-relaxed">
                    Complete registration (₦10,000) using our Flutterwave interface simulation to unlock the entire digital product vault and your specialized partner tracking links.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl flex items-start space-x-4">
                <span className="h-10 w-10 shrink-0 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-black flex items-center justify-center font-mono">
                  02
                </span>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold tracking-tight">Share Your Referrals Tracking Link</h4>
                  <p className="text-slate-400 text-xs font-sans leading-relaxed">
                    Recommend premium digital products and assets to prospective creators and affiliates using your customized tracking link to claim automatic attribution.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl flex items-start space-x-4">
                <span className="h-10 w-10 shrink-0 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-black flex items-center justify-center font-mono">
                  03
                </span>
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold tracking-tight">Claim double-tiered dividend commissions</h4>
                  <p className="text-slate-400 text-xs font-sans leading-relaxed">
                    Receive 20% on registration fees, plus recurring monthly earnings from their contributions. Withdraw your accumulated balance cleanly when you hit ₦2,000 threshold.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-white py-16 sm:py-24 border-b border-gray-155" id="faq-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4" id="faq-header-block">
            <span className="text-xs text-indigo-600 font-extrabold tracking-widest uppercase">HELP CENTER FAQs</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Frequently Answered Questions
            </h2>
            <p className="text-sm text-slate-500 font-sans">
              Got matching questions about our platform eligibility and payout parameters? Review the common answers here.
            </p>
          </div>

          <div className="space-y-4" id="faq-accordion-list">
            {faqs.map((faq, idx) => {
              const isActive = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-slate-55 border border-slate-200/60 rounded-2xl overflow-hidden transition-all"
                  id={`faq-item-${idx}`}
                >
                  <button
                    onClick={() => setActiveFaq(isActive ? null : idx)}
                    className="w-full py-4.5 px-5 text-left font-bold text-slate-800 text-sm flex items-center justify-between hover:bg-slate-100/50 transition-colors focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <HelpCircle className={`h-4.5 w-4.5 text-indigo-500 shrink-0 transform transition-transform ${isActive ? "rotate-180 text-indigo-700" : ""}`} />
                  </button>

                  {isActive && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-200/40 text-xs text-slate-600 font-sans leading-relaxed animate-fade-in bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="bg-slate-50 py-16 text-center" id="landing-payout-callout">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <span className="inline-flex h-3 w-3 bg-indigo-600 animate-ping rounded-full border border-white" />
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans uppercase">
            Start Your High-Income Journey Today
          </h2>
          <p className="text-slate-600 text-sm font-sans max-w-xl mx-auto">
            Take premium digital masterclasses, acquire the elite license, and build a passive earning pipeline synchronized cleanly on secure cloud databases.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {isLoggedIn ? (
              <button
                onClick={onGoToDashboard}
                className="w-full sm:w-auto py-3.5 px-8 text-xs text-white bg-indigo-650 hover:bg-indigo-700 font-black rounded-xl transition-all cursor-pointer shadow-md inline-flex items-center justify-center space-x-2"
              >
                <span>Launch My Affiliate Workspace 🚀</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={onRegisterClick}
                  className="w-full sm:w-auto py-3.5 px-8 text-xs text-white bg-indigo-600 hover:bg-indigo-700 font-black rounded-xl transition-all cursor-pointer shadow-md inline-flex items-center justify-center space-x-1.5"
                >
                  <span>Apply for License Today</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={onLoginClick}
                  className="w-full sm:w-auto py-3.5 px-8 text-xs text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 font-bold rounded-xl transition-all cursor-pointer shadow-cs inline-flex items-center justify-center"
                >
                  Partner Sign-In Area
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
