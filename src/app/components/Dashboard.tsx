import { LogOut, User } from "lucide-react";
import { APP_CONFIG, SUMMARY_DATA, MEMBER_DATA, ACTION_BUTTONS } from "../config/dataConfig";
import { SummaryCard } from "./SummaryCard";
import { MemberTable } from "./MemberTable";
import { ActionSidebar } from "./ActionSidebar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* SECTION: NAVBAR /navigation */}
      <nav className="bg-[#1e1b4b] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wide">{APP_CONFIG.appName}</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => console.log("Feature Pending: Profile")} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button onClick={() => console.log("Feature Pending: Logout")} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* SECTION: MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* SECTION: SUMMARY CARDS + TABLE */}
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SUMMARY_DATA.map((card) => (
                <SummaryCard key={card.id} label={card.label} value={card.value} icon={card.icon} />
              ))}
            </div>
            <MemberTable members={MEMBER_DATA} />
          </div>

          {/* SECTION: ACTION SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <ActionSidebar actions={ACTION_BUTTONS} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
