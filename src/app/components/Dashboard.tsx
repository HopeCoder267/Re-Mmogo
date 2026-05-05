import { LogOut, User, UserPlus } from "lucide-react";
import { useNavigate } from "react-router";
import { Toaster } from "sonner";
import {
  APP_CONFIG,
  ACTION_BUTTONS,
} from "../config/dataConfig";
import { SummaryCard } from "./SummaryCard";
import { MemberTable } from "./MemberTable";
import { ActionSidebar } from "./ActionSidebar";
import { GroupSelector } from "./GroupSelector";
import { useCurrentGroup } from "../../hooks/useCurrentGroup";
import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    currentGroup, 
    userGroups, 
    switchGroup, 
    getGroupSummary 
  } = useCurrentGroup();
  
  const { user, isAuthenticated, isMember, isSignatory, isTreasurer } = useAuth();

  // Helper function to get summary for a specific group
  const getGroupSummaryForGroup = (group: any) => {
    // In real app, this would filter data by group ID
    return {
      memberCount: 5, // Mock data
      totalPool: 25000,
      activeLoans: 3,
      pendingApprovals: 2,
    };
  };

  const groupSummary = getGroupSummary();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      {/* SECTION: NAVBAR /navigation */}
      <nav className="bg-[#1e1b4b] text-white shadow-lg" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
              {APP_CONFIG.appName}
            </h1>
            {userGroups.length > 1 && (
              <GroupSelector 
                groups={userGroups} 
                currentGroup={currentGroup}
                onGroupChange={switchGroup}
                className="w-48"
              />
            )}
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {isSignatory() && (
              <button
                onClick={() => navigate("/signatory-approvals")}
                className="flex items-center gap-2 text-xs sm:text-sm hover:bg-white/10 px-2 sm:px-3 py-2 rounded-lg transition-colors"
                aria-label="View signatory approvals"
                role="button"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Approvals</span>
              </button>
            )}
            {isTreasurer() && (
              <button
                onClick={() => navigate("/record-contribution")}
                className="flex items-center gap-2 text-xs sm:text-sm hover:bg-white/10 px-2 sm:px-3 py-2 rounded-lg transition-colors"
                aria-label="Record contribution"
                role="button"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Record</span>
              </button>
            )}
            {isMember() && (
              <button
                onClick={() => navigate("/loan-request")}
                className="flex items-center gap-2 text-xs sm:text-sm hover:bg-white/10 px-2 sm:px-3 py-2 rounded-lg transition-colors"
                aria-label="Request loan"
                role="button"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Request Loan</span>
              </button>
            )}
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

      {/* SECTION: MAIN CONTENT - GROUPS OVERVIEW */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8" role="main">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* LEFT SIDEBAR - QUICK ACTIONS MENU */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 sm:top-8">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                Quick Actions
              </h2>
              <ActionSidebar actions={ACTION_BUTTONS} />
            </div>
          </div>

          {/* GROUPS CARDS */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {userGroups.map((group) => {
                const groupData = getGroupSummaryForGroup(group);
                return (
                  <div 
                    key={group.id}
                    onClick={() => navigate(`/group/${group.id}`)}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md hover:border-[#1e1b4b] transition-all duration-200"
                    role="button"
                    aria-label={`View ${group.name} details`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-[#1e1b4b]">
                        {group.name}
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        group.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {group.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {group.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Members</p>
                        <p className="text-lg font-bold text-gray-900">{groupData.memberCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Pool</p>
                        <p className="text-lg font-bold text-gray-900">P{groupData.totalPool.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Active Loans</p>
                        <p className="text-lg font-bold text-gray-900">{groupData.activeLoans}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Monthly</p>
                        <p className="text-lg font-bold text-gray-900">P{group.monthlyContribution}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">
                          {group.signatories?.length || 0} signatories
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/group/${group.id}`);
                        }}
                        className="text-sm text-[#1e1b4b] hover:text-[#2d2755] font-medium transition-colors"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}