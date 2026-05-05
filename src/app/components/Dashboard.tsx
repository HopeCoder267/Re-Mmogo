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

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      {/* SECTION: NAVBAR /navigation */}
      <nav className="bg-[#1e1b4b] text-white shadow-lg" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
            {APP_CONFIG.appName}
          </h1>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-2 text-xs sm:text-sm hover:bg-white/10 px-2 sm:px-3 py-2 rounded-lg transition-colors"
              aria-label="Register new member"
              role="button"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Register</span>
            </button>
            <button
              onClick={() => console.log("Feature Pending: Profile")}
              className="hover:bg-white/10 p-1.5 sm:p-2 rounded-lg transition-colors"
              aria-label="View profile"
              role="button"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => console.log("Feature Pending: Logout")}
              className="hover:bg-white/10 p-1.5 sm:p-2 rounded-lg transition-colors"
              aria-label="Logout from application"
              role="button"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* SECTION: MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8" role="main">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* SECTION: SUMMARY CARDS + TABLE */}
          <div className="xl:col-span-3 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {SUMMARY_DATA.map((card) => (
                <SummaryCard
                  key={card.id}
                  label={card.label}
                  value={card.value}
                  icon={card.icon}
                />
              ))}
            </div>
            <MemberTable members={MEMBER_DATA} />
          </div>

          {/* SECTION: ACTION SIDEBAR */}
          <div className="xl:col-span-1">
            <div className="sticky top-6 sm:top-8">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                Quick Actions
              </h2>
              <ActionSidebar actions={ACTION_BUTTONS} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
