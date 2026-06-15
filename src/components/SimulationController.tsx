import { useState } from "react";
import { AffiliateSystemStore } from "../store";
import { UserProfile, Affiliate } from "../types";
import { Users, Shield, ArrowRight, UserCheck, CalendarDays, RefreshCw, Terminal } from "lucide-react";

interface SimulationControllerProps {
  storeState: AffiliateSystemStore;
  activeRole: "admin" | "affiliate" | "join";
  selectedUserId: string;
  onRoleChange: (role: "admin" | "affiliate" | "join") => void;
  onUserChange: (userId: string) => void;
  onSimulateMonth: () => void;
  onReset: () => void;
}

export default function SimulationController({
  storeState,
  activeRole,
  selectedUserId,
  onRoleChange,
  onUserChange,
  onSimulateMonth,
  onReset
}: SimulationControllerProps) {
  // Filter for all active simulation personas (including affiliates)
  const personasList = storeState.users.filter(u => !u.is_admin).map(user => {
    const affiliate = storeState.affiliates.find(a => a.user_id === user.user_id);
    return {
      user_id: user.user_id,
      full_name: user.full_name,
      plan: "affiliate",
      affiliate_id: affiliate?.affiliate_id || null,
      status: affiliate?.status || "active"
    };
  });

  const getStatusColor = (status: string) => {
    if (status === "active") return "bg-emerald-100 text-emerald-800 border-emerald-200/50";
    if (status === "expired") return "bg-amber-100 text-amber-800 border-amber-200/50";
    return "bg-red-100 text-red-800 border-red-200/50";
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-100 py-3.5 px-4 md:px-8 font-mono text-xs flex flex-col xl:flex-row gap-4 items-center justify-between shadow-md" id="simulation-bar">
      {/* Simulation Branding */}
      <div className="flex items-center space-x-2 shrink-0">
        <Terminal className="h-4.5 w-4.5 text-amber-500" />
        <span className="font-bold text-slate-200 tracking-tight text-sm">EMMACOM DIGITAL</span>
        <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest border border-slate-700">Sandbox Deck</span>
      </div>

      {/* Role and User Selection Panel */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Toggle Mode buttons */}
        <div className="flex bg-slate-820 rounded-lg p-1 border border-slate-800">
          <button
            onClick={() => onRoleChange("admin")}
            className={`px-3 py-1.5 rounded-md font-sans font-semibold tracking-wide flex items-center space-x-1 transition-all cursor-pointer ${
              activeRole === "admin"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
            id="role-admin-btn"
          >
            <Shield className="h-3 w-3 shrink-0" />
            <span>Admin</span>
          </button>
          
          <button
            onClick={() => onRoleChange("affiliate")}
            className={`px-3 py-1.5 rounded-md font-sans font-semibold tracking-wide flex items-center space-x-1 transition-all cursor-pointer ${
              activeRole === "affiliate"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
            id="role-affiliate-btn"
          >
            <Users className="h-3 w-3 shrink-0" />
            <span>Affiliates</span>
          </button>

          <button
            onClick={() => onRoleChange("join")}
            className={`px-3 py-1.5 rounded-md font-sans font-semibold tracking-wide flex items-center space-x-1 transition-all cursor-pointer ${
              activeRole === "join"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
            id="role-join-btn"
          >
            <UserCheck className="h-3 w-3 shrink-0" />
            <span>Join/Sales Link</span>
          </button>
        </div>

        {/* Affiliate Swapper Dropdown */}
        {activeRole === "affiliate" && (
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800" id="affiliate-swapper">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest font-sans">Active Persona:</span>
            <select
              value={selectedUserId}
              onChange={(e) => onUserChange(e.target.value)}
              className="bg-slate-800 text-slate-200 text-xs py-1.5 px-3 rounded border border-slate-700 outline-none focus:ring-1 focus:ring-indigo-500 font-sans cursor-pointer"
            >
              {personasList.map(p => (
                <option key={p.user_id} value={p.user_id}>
                  {p.full_name} ({p.affiliate_id} - {p.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Time Passage Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
        <div className="flex items-center space-x-2 bg-slate-800/60 px-3 py-1.5 rounded border border-slate-800" title="Simulated Date">
          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-semibold text-slate-300 font-sans select-all">
            {storeState.formatDate(storeState.systemDate)}
          </span>
        </div>

        <button
          onClick={onSimulateMonth}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-3 py-1.5 rounded font-sans flex items-center space-x-1.5 shadow active:scale-95 cursor-pointer"
          title="Simulates 30 Days passage of time to check expirations"
          id="time-travel-btn"
        >
          <RefreshCw className="h-3.5 w-3.5 animate-spin-slow shrink-0" />
          <span>Simulate +30 Days</span>
        </button>

        <button
          onClick={onReset}
          className="bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 px-3 py-1.5 rounded border border-slate-700 transition-colors flex items-center space-x-1 font-mono cursor-pointer"
          title="Reset database storage settings back to clean state"
          id="reset-simulation-btn"
        >
          <span>Reset DB</span>
        </button>
      </div>
    </div>
  );
}
