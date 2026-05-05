import { useState } from "react";
import { useNavigate } from "react-router";
import { FileText, ArrowLeft, Download, TrendingUp, TrendingDown, Users, DollarSign, Calendar } from "lucide-react";
import { YearEndReport, MemberReport, Member, Loan, Contribution } from "../../types";
import { MEMBERS, LOANS, CONTRIBUTIONS, GROUP_CONFIG, YEAR_END_REPORT } from "../config/dataConfig";

export default function YearEndReportPage() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState<YearEndReport | null>(YEAR_END_REPORT);

  // Calculate report data based on selected year (in real app, this would come from API)
  const generateReport = (year: number): YearEndReport => {
    const yearLoans = LOANS.filter(loan => loan.applicationDate.startsWith(year.toString()));
    const yearContributions = CONTRIBUTIONS.filter(contribution => contribution.contributionDate.startsWith(year.toString()));
    
    const totalLoansDisbursed = yearLoans.reduce((sum, loan) => sum + loan.amount, 0);
    const totalContributions = yearContributions.reduce((sum, contribution) => sum + contribution.amount, 0);
    
    // Calculate total interest earned (20% monthly on outstanding loans)
    const totalInterestEarned = yearLoans.reduce((sum, loan) => {
      const monthlyInterest = loan.amount * GROUP_CONFIG.interestRate;
      const monthsActive = Math.min(12, loan.repaymentMonths);
      return sum + (monthlyInterest * monthsActive);
    }, 0);

    const memberReports: MemberReport[] = MEMBERS.map(member => {
      const memberLoans = yearLoans.filter(loan => loan.memberId === member.id);
      const memberContributions = yearContributions.filter(contribution => contribution.memberId === member.id);
      
      const totalContributed = memberContributions.reduce((sum, contribution) => sum + contribution.amount, 0);
      const totalBorrowed = memberLoans.reduce((sum, loan) => sum + loan.amount, 0);
      const totalRepaid = memberLoans.reduce((sum, loan) => sum + (loan.totalRepayment - loan.remainingBalance), 0);
      const outstandingBalance = memberLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
      
      // Calculate interest earned by this member (simplified)
      const memberInterestEarned = totalContributed * GROUP_CONFIG.interestRate * 12;
      
      return {
        memberId: member.id,
        memberName: member.fullName,
        totalContributed,
        totalInterestEarned: memberInterestEarned,
        totalBorrowed,
        totalRepaid,
        outstandingBalance,
        netReturn: totalContributed + memberInterestEarned - totalBorrowed + totalRepaid,
      };
    });

    const totalPool = memberReports.reduce((sum, report) => sum + report.totalContributed, 0);

    return {
      year,
      groupId: GROUP_CONFIG.id,
      totalPool,
      totalContributions,
      totalLoansDisbursed,
      totalInterestEarned,
      memberReports,
    };
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setReportData(generateReport(year));
  };

  const handleDownloadReport = () => {
    if (!reportData) return;
    
    // Create CSV content
    const csvContent = [
      ['Year End Report - RE-MMOGO', `Year: ${reportData.year}`],
      [],
      ['Group Summary'],
      ['Total Pool', `P ${reportData.totalPool.toLocaleString()}`],
      ['Total Contributions', `P ${reportData.totalContributions.toLocaleString()}`],
      ['Total Loans Disbursed', `P ${reportData.totalLoansDisbursed.toLocaleString()}`],
      ['Total Interest Earned', `P ${reportData.totalInterestEarned.toLocaleString()}`],
      [],
      ['Member Details'],
      ['Member Name', 'Total Contributed', 'Interest Earned', 'Total Borrowed', 'Total Repaid', 'Outstanding Balance', 'Net Return'],
      ...reportData.memberReports.map(report => [
        report.memberName,
        `P ${report.totalContributed.toLocaleString()}`,
        `P ${report.totalInterestEarned.toLocaleString()}`,
        `P ${report.totalBorrowed.toLocaleString()}`,
        `P ${report.totalRepaid.toLocaleString()}`,
        `P ${report.outstandingBalance.toLocaleString()}`,
        `P ${report.netReturn.toLocaleString()}`
      ])
    ].map(row => row.join(',')).join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `remmogo-report-${reportData.year}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTopPerformers = () => {
    if (!reportData) return [];
    return [...reportData.memberReports]
      .sort((a, b) => b.totalInterestEarned - a.totalInterestEarned)
      .slice(0, 3);
  };

  const getLowPerformers = () => {
    if (!reportData) return [];
    return [...reportData.memberReports]
      .sort((a, b) => a.totalInterestEarned - b.totalInterestEarned)
      .slice(0, 3);
  };

  const getHighestBorrowers = () => {
    if (!reportData) return [];
    return [...reportData.memberReports]
      .sort((a, b) => b.totalBorrowed - a.totalBorrowed)
      .slice(0, 3);
  };

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading report data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SECTION: NAVBAR */}
      <nav className="bg-[#1e1b4b] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-wide">RE-MMOGO</h1>
            <span className="bg-[#10b981] px-2 py-1 rounded text-xs font-semibold">
              Year End Report
            </span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </nav>

      {/* SECTION: MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* SECTION: HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-[#1e1b4b] mb-2">Year End Report</h2>
              <p className="text-gray-600">Comprehensive financial analysis for {selectedYear}</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b]"
              >
                {[2024, 2023, 2022].map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <button
                onClick={handleDownloadReport}
                className="bg-[#10b981] hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
            </div>
          </div>
        </div>

        {/* SECTION: SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-blue-500" />
              <span className="text-xs text-gray-500 font-semibold">TOTAL POOL</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">P {reportData.totalPool.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Total group savings</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-green-500" />
              <span className="text-xs text-gray-500 font-semibold">CONTRIBUTIONS</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">P {reportData.totalContributions.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Total contributions</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-purple-500" />
              <span className="text-xs text-gray-500 font-semibold">LOANS</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">P {reportData.totalLoansDisbursed.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Total loans disbursed</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <span className="text-xs text-gray-500 font-semibold">INTEREST</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">P {reportData.totalInterestEarned.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">Total interest earned</p>
          </div>
        </div>

        {/* SECTION: PERFORMANCE ANALYSIS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Interest Earners */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Top Interest Earners</h3>
            </div>
            <div className="space-y-3">
              {getTopPerformers().map((member, index) => (
                <div key={member.memberId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-semibold text-green-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.memberName}</p>
                      <p className="text-xs text-gray-500">P {member.totalContributed.toLocaleString()} contributed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">P {member.totalInterestEarned.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">interest earned</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lowest Interest Earners */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Lowest Interest Earners</h3>
            </div>
            <div className="space-y-3">
              {getLowPerformers().map((member, index) => (
                <div key={member.memberId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm font-semibold text-red-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.memberName}</p>
                      <p className="text-xs text-gray-500">P {member.totalContributed.toLocaleString()} contributed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">P {member.totalInterestEarned.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">interest earned</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Highest Borrowers */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">Highest Borrowers</h3>
            </div>
            <div className="space-y-3">
              {getHighestBorrowers().map((member, index) => (
                <div key={member.memberId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-semibold text-purple-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.memberName}</p>
                      <p className="text-xs text-gray-500">P {member.totalRepaid.toLocaleString()} repaid</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-purple-600">P {member.totalBorrowed.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">total borrowed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION: DETAILED MEMBER REPORTS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Member Reports</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Member</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Contributed</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Interest Earned</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Borrowed</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Repaid</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Outstanding</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Net Return</th>
                </tr>
              </thead>
              <tbody>
                {reportData.memberReports.map((member) => (
                  <tr key={member.memberId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{member.memberName}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-600">P {member.totalContributed.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right text-green-600 font-semibold">P {member.totalInterestEarned.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-600">P {member.totalBorrowed.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-600">P {member.totalRepaid.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right text-red-600 font-semibold">P {member.outstandingBalance.toLocaleString()}</td>
                    <td className={`py-3 px-4 text-sm text-right font-semibold ${
                      member.netReturn >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      P {member.netReturn.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
