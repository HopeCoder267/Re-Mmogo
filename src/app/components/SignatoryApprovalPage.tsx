import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, XCircle, ArrowLeft, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Loan, Contribution, LoanRepayment, Member } from "../../types";
import { LOANS, CONTRIBUTIONS, LOAN_REPAYMENTS, MEMBERS, GROUP_CONFIG } from "../config/dataConfig";
import { useAuth } from "../../hooks/useAuth";

type ApprovalType = "loan" | "contribution" | "repayment";

interface ApprovalItem {
  id: number;
  type: ApprovalType;
  title: string;
  memberName: string;
  amount: number;
  description: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  signatoryApprovals: {
    signatoryId: number;
    signatoryName: string;
    approved: boolean;
    approvalDate?: string;
  }[];
  requiresDualApproval: boolean;
}

export default function SignatoryApprovalPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ApprovalType>("loan");
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Use auth hook for role-based access control
  const { user: currentUser, isAuthenticated, isSignatory, hasPermission } = useAuth();
  const currentSignatoryId = currentUser?.id || null;

  // Combine all pending items that need approval
  const getPendingItems = (type: ApprovalType): ApprovalItem[] => {
    switch (type) {
      case "loan":
        return LOANS.filter(loan => loan.status === "pending").map(loan => ({
          id: loan.id,
          type: "loan" as ApprovalType,
          title: "Loan Request",
          memberName: MEMBERS.find((m: Member) => m.id === loan.memberId)?.fullName || "Unknown",
          amount: loan.amount,
          description: loan.purpose,
          date: loan.applicationDate,
          status: loan.status as "pending" | "approved" | "rejected",
          signatoryApprovals: loan.signatoryApprovals.map(approval => ({
            ...approval,
            signatoryName: MEMBERS.find((m: Member) => m.id === approval.signatoryId)?.fullName || "Unknown"
          })),
          requiresDualApproval: true
        }));

      case "contribution":
        return CONTRIBUTIONS.filter(contribution => contribution.status === "pending").map(contribution => ({
          id: contribution.id,
          type: "contribution" as ApprovalType,
          title: "Monthly Contribution",
          memberName: MEMBERS.find((m: Member) => m.id === contribution.memberId)?.fullName || "Unknown",
          amount: contribution.amount,
          description: `Monthly contribution for ${contribution.contributionDate}`,
          date: contribution.paymentDate,
          status: contribution.status,
          signatoryApprovals: contribution.signatoryApprovals.map(approval => ({
            ...approval,
            signatoryName: MEMBERS.find((m: Member) => m.id === approval.signatoryId)?.fullName || "Unknown"
          })),
          requiresDualApproval: true
        }));

      case "repayment":
        return LOAN_REPAYMENTS.filter(repayment => repayment.status === "pending").map(repayment => ({
          id: repayment.id,
          type: "repayment" as ApprovalType,
          title: "Loan Repayment",
          memberName: MEMBERS.find((m: Member) => m.id === repayment.memberId)?.fullName || "Unknown",
          amount: repayment.amount,
          description: `Payment for loan #${repayment.loanId}`,
          date: repayment.paymentDate,
          status: repayment.status,
          signatoryApprovals: repayment.signatoryApprovals.map(approval => ({
            ...approval,
            signatoryName: MEMBERS.find((m: Member) => m.id === approval.signatoryId)?.fullName || "Unknown"
          })),
          requiresDualApproval: true
        }));

      default:
        return [];
    }
  };

  const pendingItems = getPendingItems(activeTab);

  const handleApproval = async (itemId: number, approved: boolean) => {
    setProcessingId(itemId);
    
    try {
      // FEATURE PENDING: Replace with real API call
      console.log(`Signatory ${currentSignatoryId} ${approved ? 'approving' : 'rejecting'} item ${itemId}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Item ${approved ? 'approved' : 'rejected'} successfully`);
      
      // In a real app, this would update the backend and refresh the data
      // For now, we'll just show the success message
      
    } catch (error) {
      toast.error("Failed to process approval. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const getApprovalStatus = (approvals: ApprovalItem["signatoryApprovals"]) => {
    const currentSignatory = currentSignatoryId ? MEMBERS.find(m => m.id === currentSignatoryId && m.role === "Signatory") : null;
    const currentApproval = approvals.find(a => a.signatoryId === currentSignatoryId);
    const otherSignatoryApproval = approvals.find(a => a.signatoryId !== currentSignatoryId);
    
    return {
      current: currentApproval?.approved,
      other: otherSignatoryApproval?.approved,
      bothApproved: approvals.filter(a => a.approved).length >= 2,
      currentVoted: currentApproval !== undefined
    };
  };

  const getStatusIcon = (status: ApprovalItem["status"], approvalStatus: ReturnType<typeof getApprovalStatus>) => {
    if (status === "approved") return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === "rejected") return <XCircle className="w-5 h-5 text-red-500" />;
    
    if (approvalStatus.bothApproved) return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (approvalStatus.currentVoted) return <Clock className="w-5 h-5 text-yellow-500" />;
    return <AlertCircle className="w-5 h-5 text-blue-500" />;
  };

  const getStatusText = (status: ApprovalItem["status"], approvalStatus: ReturnType<typeof getApprovalStatus>) => {
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    
    if (approvalStatus.bothApproved) return "Ready to Approve";
    if (approvalStatus.currentVoted) return "Awaiting Other Signatory";
    return "Pending Your Approval";
  };

  if (!currentSignatoryId || !isSignatory) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="bg-[#1e1b4b] text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
            <h1 className="text-2xl font-bold tracking-wide">RE-MMOGO</h1>
          </div>
        </nav>
        
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#1e1b4b] mb-2">Access Restricted</h2>
            <p className="text-gray-500 mb-6">
              Only signatories can access the approval dashboard. Please contact your group administrator if you believe this is an error.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-[#1e1b4b] hover:bg-[#2d2755] text-white py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
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
              Signatory Dashboard
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
          <h2 className="text-3xl font-bold text-[#1e1b4b] mb-2">Signatory Approvals</h2>
          <p className="text-gray-600">
            Review and approve loan requests, contributions, and repayments. Dual approval required for all transactions.
          </p>
        </div>

        {/* SECTION: TABS */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "loan" as ApprovalType, label: "Loan Requests", count: getPendingItems("loan").length },
              { id: "contribution" as ApprovalType, label: "Contributions", count: getPendingItems("contribution").length },
              { id: "repayment" as ApprovalType, label: "Loan Repayments", count: getPendingItems("repayment").length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-[#1e1b4b] text-[#1e1b4b]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* SECTION: ITEMS LIST */}
        <div className="space-y-4">
          {pendingItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1e1b4b] mb-2">All Caught Up!</h3>
              <p className="text-gray-500">
                No pending {activeTab === "loan" ? "loan requests" : activeTab === "contribution" ? "contributions" : "loan repayments"} to review.
              </p>
            </div>
          ) : (
            pendingItems.map((item) => {
              const approvalStatus = getApprovalStatus(item.signatoryApprovals);
              const canApprove = !approvalStatus.currentVoted && item.status === "pending";
              
              return (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-start justify-between">
                    {/* SECTION: ITEM INFO */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(item.status, approvalStatus)}
                        <div>
                          <h3 className="text-lg font-semibold text-[#1e1b4b]">{item.title}</h3>
                          <p className="text-sm text-gray-500">{getStatusText(item.status, approvalStatus)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Member</p>
                          <p className="font-semibold text-gray-900">{item.memberName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Amount</p>
                          <p className="font-semibold text-[#1e1b4b]">P {item.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Date</p>
                          <p className="font-semibold text-gray-900">{item.date}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Description</p>
                        <p className="text-sm text-gray-700">{item.description}</p>
                      </div>

                      {/* SECTION: APPROVAL STATUS */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Signatory Approvals</p>
                        <div className="space-y-2">
                          {item.signatoryApprovals.map((approval) => (
                            <div key={approval.signatoryId} className="flex items-center justify-between text-sm">
                              <span className="font-medium">{approval.signatoryName}</span>
                              <div className="flex items-center gap-2">
                                {approval.approved ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-green-600 font-medium">Approved</span>
                                    {approval.approvalDate && (
                                      <span className="text-gray-500 text-xs">{approval.approvalDate}</span>
                                    )}
                                  </>
                                ) : approval.signatoryId === currentSignatoryId ? (
                                  <span className="text-gray-500 font-medium">Pending your decision</span>
                                ) : (
                                  <span className="text-gray-400">Not yet reviewed</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {item.requiresDualApproval && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-600">
                              <strong>Dual approval required:</strong> Both signatories must approve before this {item.type} can be processed.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SECTION: ACTIONS */}
                    {canApprove && (
                      <div className="ml-6 flex flex-col gap-2">
                        <button
                          onClick={() => handleApproval(item.id, true)}
                          disabled={processingId === item.id}
                          className="bg-[#10b981] hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
                        >
                          {processingId === item.id ? (
                            <>Processing...</>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleApproval(item.id, false)}
                          disabled={processingId === item.id}
                          className="bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
                        >
                          {processingId === item.id ? (
                            <>Processing...</>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              Reject
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
