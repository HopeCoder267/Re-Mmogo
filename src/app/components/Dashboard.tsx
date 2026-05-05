import { LogOut, User, UserPlus } from "lucide-react";
import { useNavigate } from "react-router";
import { Toaster } from "sonner";
import {
  APP_CONFIG,
  SUMMARY_DATA,
  MEMBER_DATA,
  ACTION_BUTTONS,
} from "../config/dataConfig";
import { SummaryCard } from "./SummaryCard";
import { MemberTable } from "./MemberTable";
import { ActionSidebar } from "./ActionSidebar";
import { useAuth } from "../context/AuthContext";
 
export default function Dashboard() {
  const navigate   = useNavigate();
  const { user, can } = useAuth();
 
  const userName = user?.name ?? "User";
  const userRole = user?.role ?? "member";
 
  const handleLogout = () => {
    sessionStorage.removeItem("rm_user");
    navigate("/");
  };
 
  // Members only see their own row; signatories see everyone
  const visibleMembers = can("view-all-members")
    ? MEMBER_DATA
    : MEMBER_DATA.filter((m) => m.name === userName);
 
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
 
      {/* SECTION: NAVBAR */}
      <nav className="bg-[#1e1b4b] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wide">{APP_CONFIG.appName}</h1>
          <div className="flex items-center gap-2">
            {/* Role badge */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full
              ${userRole === "signatory"
                ? "bg-purple-500/30 text-purple-200"
                : "bg-indigo-500/30 text-indigo-200"}`}>
              {userRole === "signatory" ? "✦ Signatory" : "Member"}
            </span>
 
            {/* Register — signatory only */}
            {can("register-nav") && (
              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 text-sm hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Register</span>
              </button>
            )}
 
            <button
              onClick={() => {}}
              className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              title={userName}
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>
 
      {/* SECTION: MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 
        {/* Welcome banner */}
        <div className={`mb-6 flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium
          ${userRole === "signatory"
            ? "bg-purple-50 border border-purple-200 text-purple-800"
            : "bg-indigo-50 border border-indigo-200 text-indigo-800"}`}>
          <span>
            Welcome back, <strong>{userName}</strong>.
          </span>
          <span className="opacity-60">
            {userRole === "signatory"
              ? "You have full signatory access — all features are unlocked."
              : "You're signed in as a member. Some actions require signatory access."}
          </span>
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* SECTION: SUMMARY CARDS + TABLE */}
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SUMMARY_DATA.map((card) => (
                <SummaryCard key={card.id} label={card.label} value={card.value} icon={card.icon} />
              ))}
            </div>
            <MemberTable members={visibleMembers} currentUserName={userName} userRole={userRole} />
          </div>
 
          {/* SECTION: ACTION SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <ActionSidebar actions={ACTION_BUTTONS} />
 
              {/* Permission summary legend */}
              <div className="mt-6 p-3 rounded-lg bg-gray-100 text-xs text-gray-500 space-y-1">
                <p className="font-semibold text-gray-600 mb-1">Your access level</p>
                {ACTION_BUTTONS.map((a) => {
                  const ok = can(a.permissionKey);
                  return (
                    <div key={a.id} className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${ok ? "bg-emerald-400" : "bg-gray-300"}`} />
                      <span className={ok ? "text-gray-700" : "text-gray-400"}>{a.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
