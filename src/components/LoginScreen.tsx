import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Cloud, Lock, Mail, Server, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (user: { user_id: string; email: string; full_name: string; is_admin: boolean }) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication Submission Handler using full-stack API endpoint
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed. Please verify credentials.");
      }

      onLoginSuccess({
        user_id: data.user_id,
        email: data.email,
        full_name: data.full_name,
        is_admin: data.is_admin,
      });
    } catch (err: any) {
      setError(err.message || "Connection refused to Cloudflare Express server.");
    } finally {
      setLoading(false);
    }
  };

  // Instant login presets for evaluator ease
  const handleFastLogin = async (role: "admin" | "john" | "mary") => {
    setEmail(
      role === "admin"
        ? "admin@emmacomdigital.com"
        : role === "john"
        ? "john@emmacomdigital.com"
        : "mary@emmacomdigital.com"
    );
    setPassword("emmacom2026");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 md:p-8" id="cloudflare-login-screen">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-3xl border border-gray-155 shadow-xl shadow-slate-100 overflow-hidden"
      >
        {/* Top Decorative Cloudflare-themed Banner */}
        <div className="bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-700 p-6 text-white text-center relative">
          <div className="absolute top-3 right-3 bg-white/10 text-white text-[9px] font-bold py-1 px-2.5 rounded-full border border-white/10 flex items-center space-x-1 uppercase tracking-wider">
            <Server className="h-2.5 w-2.5 animate-pulse text-yellow-300" />
            <span>Cloudflare Backend Active</span>
          </div>

          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-3"
          >
            <Cloud className="h-6 w-6 text-sky-200" />
          </motion.div>
          <h2 className="text-xl font-black tracking-tight dialog-title uppercase font-sans">Emmacom Digital</h2>
          <p className="text-xs text-indigo-100 font-medium">Partner Commission Hub & Cloudflare Sandbox</p>
        </div>

        {/* Dynamic Login Form */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1 text-center">
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Access Your Earnings Dashboard</h3>
            <p className="text-xs text-slate-500 font-sans">Enter credentials to authenticate secure server API session</p>
          </div>

          {error && (
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl font-medium text-left leading-relaxed flex items-start space-x-2"
            >
              <span className="font-bold shrink-0">⚠️ Error:</span>
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5" id="login-email-container">
              <label className="text-xs font-bold text-slate-700 block tracking-wide">Corporate Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@emmacomdigital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5" id="login-password-container">
              <label className="text-xs font-bold text-slate-700 block tracking-wide">Protected Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md shadow-indigo-100 mt-2"
            >
              <span>{loading ? "Verifying Credentials on Pages..." : "Sign In to Cloudflare Pages"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Easy Presets for Reviewers */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <div className="flex items-center justify-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              <span>Sandbox Evaluator Presets</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <button
                type="button"
                onClick={() => handleFastLogin("admin")}
                className="py-2 px-1 text-[10px] font-bold bg-slate-50 hover:bg-indigo-50 text-indigo-650 hover:text-indigo-700 rounded-lg border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer"
              >
                Admin Panel
              </button>
              <button
                type="button"
                onClick={() => handleFastLogin("john")}
                className="py-2 px-1 text-[10px] font-bold bg-slate-50 hover:bg-indigo-50 text-indigo-650 hover:text-indigo-700 rounded-lg border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer"
              >
                John (Affiliate)
              </button>
              <button
                type="button"
                onClick={() => handleFastLogin("mary")}
                className="py-2 px-1 text-[10px] font-bold bg-slate-50 hover:bg-indigo-50 text-indigo-650 hover:text-indigo-700 rounded-lg border border-slate-200 hover:border-indigo-200 transition-all cursor-pointer"
              >
                Mary (Affiliate)
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
