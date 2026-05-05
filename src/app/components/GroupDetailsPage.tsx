import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Member, Loan, Contribution } from "../../types";
import { useCurrentGroup } from "../../hooks/useCurrentGroup";
import { MemberTable } from "./MemberTable";

export default function GroupDetailsPage() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const { userGroups, switchGroup } = useCurrentGroup();
  
  // Find selected group
  const selectedGroup = userGroups.find(g => g.id === Number(groupId));
  
  if (!selectedGroup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Group Not Found</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-[#1e1b4b] hover:bg-[#2d2755] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Mock member data for this group
  const groupMembers: Member[] = [
    {
      id: 1,
      fullName: "Hope Kenosi",
      email: "hope@example.com",
      phone: "+26771234567",
      idNumber: "123456789",
      occupation: "Teacher",
      monthlyIncome: 15000,
      contributionDay: "1st",
      role: "Member",
      emergencyContactName: "Emergency Contact",
      emergencyContactPhone: "+26771111111",
      monthlyPaid: true,
      progressPercent: 75,
      signatoryStatus: "approved",
      balance: 25000,
      totalContributed: 15000,
      interestEarned: 750,
      dateJoined: "2024-01-01",
      isActive: true
    },
    {
      id: 2,
      fullName: "Victor Coder",
      email: "victor@example.com",
      phone: "+26772234567",
      idNumber: "987654321",
      occupation: "Software Developer",
      monthlyIncome: 20000,
      contributionDay: "5th",
      role: "Member",
      emergencyContactName: "Emergency Contact",
      emergencyContactPhone: "+26772222222",
      monthlyPaid: false,
      progressPercent: 50,
      signatoryStatus: "pending",
      balance: 15000,
      totalContributed: 10000,
      interestEarned: 500,
      dateJoined: "2024-02-01",
      isActive: true
    },
    {
      id: 3,
      fullName: "Anna Kgosing",
      email: "anna@example.com",
      phone: "+26773334567",
      idNumber: "456789123",
      occupation: "Business Owner",
      monthlyIncome: 25000,
      contributionDay: "10th",
      role: "Signatory",
      emergencyContactName: "Emergency Contact",
      emergencyContactPhone: "+26773333333",
      monthlyPaid: true,
      progressPercent: 90,
      signatoryStatus: "approved",
      balance: 30000,
      totalContributed: 20000,
      interestEarned: 1000,
      dateJoined: "2024-01-01",
      isActive: true
    }
  ];

  const groupStats = {
    totalMembers: groupMembers.length,
    paidThisMonth: groupMembers.filter(m => m.monthlyPaid).length,
    averageProgress: Math.round(groupMembers.reduce((sum, m) => sum + m.progressPercent, 0) / groupMembers.length),
    totalPool: 25000,
    activeLoans: 3,
    pendingApprovals: 2
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SECTION: NAVBAR */}
      <nav className="bg-[#1e1b4b] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
              aria-label="Back to groups"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Groups</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
              {selectedGroup.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/signatory-approvals")}
              className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg transition-colors"
              aria-label="Signatory approvals"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Approvals</span>
            </button>
          </div>
        </div>
      </nav>

      {/* SECTION: GROUP HEADER */}
      <div className="bg-[#1e1b4b] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Total Members</span>
              </div>
              <p className="text-2xl font-bold text-white">{groupStats.totalMembers}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">Paid This Month</span>
              </div>
              <p className="text-2xl font-bold text-white">{groupStats.paidThisMonth}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Avg Progress</span>
              </div>
              <p className="text-2xl font-bold text-white">{groupStats.averageProgress}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-white font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold text-white">{groupStats.pendingApprovals}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8" role="main">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* SECTION: MEMBERS TABLE */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-[#1e1b4b] mb-6">Group Members & Progress</h2>
              <MemberTable members={groupMembers} />
            </div>
          </div>

          {/* SECTION: GROUP STATS */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-[#1e1b4b] mb-4">Group Statistics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Total Pool</p>
                  <p className="text-xl font-bold text-gray-900">P{groupStats.totalPool.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Loans</p>
                  <p className="text-xl font-bold text-gray-900">{groupStats.activeLoans}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Contribution</p>
                  <p className="text-xl font-bold text-gray-900">P{selectedGroup.monthlyContribution}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Interest Rate</p>
                  <p className="text-xl font-bold text-gray-900">{(selectedGroup.interestRate * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-[#1e1b4b] mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/enroll")}
                  className="w-full bg-[#1e1b4b] hover:bg-[#2d2755] text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  Add New Member
                </button>
                <button
                  onClick={() => navigate("/loan-request")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  Record Loan
                </button>
                <button
                  onClick={() => navigate("/record-contribution")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  Record Contribution
                </button>
                <button
                  onClick={() => navigate("/year-end-report")}
                  className="w-full border border-[#1e1b4b] text-[#1e1b4b] hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
