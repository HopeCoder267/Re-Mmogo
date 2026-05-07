import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { CreditCard, ArrowLeft, CheckCircle, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { LoanRepayment, Loan, Member } from "../../types";
import { LOANS, MEMBERS, GROUP_CONFIG } from "../config/dataConfig";

interface RepaymentFormData {
  loanId: string;
  memberId: string;
  amount: string;
  paymentDate: string;
  proofOfPayment: FileList;
  notes: string;
}

export default function LoanRepaymentPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<RepaymentFormData | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RepaymentFormData>();

  const selectedLoanId = watch("loanId", "");
  const selectedMemberId = watch("memberId", "");
  const selectedLoan = LOANS.find(l => l.id === parseInt(selectedLoanId));
  const selectedMember = MEMBERS.find(m => m.id === parseInt(selectedMemberId));

  // Filter loans for the selected member
  const memberLoans = selectedMember 
    ? LOANS.filter(loan => loan.memberId === selectedMember.id && loan.status === 'active')
    : [];

  const onSubmit = async (data: RepaymentFormData) => {
    try {
      // Create loan repayment object
      const repayment: LoanRepayment = {
        id: Date.now(), // Temporary ID generation
        loanId: parseInt(data.loanId),
        memberId: parseInt(data.memberId),
        amount: parseFloat(data.amount),
        paymentDate: data.paymentDate,
        status: "pending", // Requires signatory approval
        proofOfPayment: uploadedFile ? `/uploads/${uploadedFile.name}` : undefined,
        signatoryApprovals: [
          { signatoryId: 1, approved: false },
          { signatoryId: 2, approved: false },
        ],
      };

      // FEATURE PENDING: Replace with real API call
      console.log("Loan repayment payload:", repayment);
      await new Promise((r) => setTimeout(r, 1500));
      
      setSubmittedData(data);
      setSubmitted(true);
      toast.success("Loan repayment submitted for signatory approval!");
    } catch (error) {
      toast.error("Failed to process repayment. Please try again.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (PDF, JPG, PNG)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF, JPG, or PNG file");
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      setUploadedFile(file);
    }
  };

  if (submitted && submittedData && selectedLoan && selectedMember) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* SECTION: NAVBAR */}
        <nav className="bg-[#1e1b4b] text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
            <h1 className="text-2xl font-bold tracking-wide">RE-MMOGO</h1>
          </div>
        </nav>

        {/* SECTION: SUCCESS STATE */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
            <CheckCircle className="w-16 h-16 text-[#10b981] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#1e1b4b] mb-2">Repayment Submitted!</h2>
            <p className="text-gray-500 mb-6">
              Loan repayment of <strong>P {parseFloat(submittedData.amount).toLocaleString()}</strong> for {selectedMember.fullName} has been submitted and is pending signatory approval.
            </p>

            {/* SECTION: SUMMARY TABLE */}
            <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 mb-6">
              {[
                ["Member", selectedMember.fullName],
                ["Loan ID", `#${selectedLoan.id}`],
                ["Amount", `P ${parseFloat(submittedData.amount).toLocaleString()}`],
                ["Payment Date", submittedData.paymentDate],
                ["Status", "Pending Signatory Approval"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-[#1e1b4b]">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSubmitted(false)}
                className="flex-1 border border-[#1e1b4b] text-[#1e1b4b] hover:bg-gray-50 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                Make Another Payment
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-[#1e1b4b] hover:bg-[#2d2755] text-white py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
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
          <h1 className="text-2xl font-bold tracking-wide">RE-MMOGO</h1>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </nav>

      {/* SECTION: INFO BANNER */}
      <div className="bg-[#1e1b4b] border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#10b981]" />
            <div>
              <p className="text-sm font-semibold">Loan Repayment Tracking</p>
              <p className="text-xs text-gray-300">All loan repayments require signatory approval before being recorded</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: FORM */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* SECTION: FORM HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#1e1b4b] p-2 rounded-lg">
              <CreditCard className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1e1b4b]">Record Loan Repayment</h2>
              <p className="text-sm text-gray-500">Submit loan repayment for signatory approval</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* SECTION: MEMBER SELECT */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Member</label>
              <select
                {...register("memberId", { 
                  required: "Please select a member",
                  onChange: () => {
                    // Reset loan selection when member changes
                    const loanSelect = document.querySelector('select[name="loanId"]') as HTMLSelectElement;
                    if (loanSelect) loanSelect.value = "";
                  }
                })}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition bg-white ${
                  errors.memberId ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              >
                <option value="">Select member...</option>
                {MEMBERS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} - {m.role}
                  </option>
                ))}
              </select>
              {errors.memberId && (
                <p className="text-red-500 text-xs mt-1">{errors.memberId.message}</p>
              )}
            </div>

            {/* SECTION: LOAN SELECT */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Active Loan</label>
              <select
                {...register("loanId", { required: "Please select a loan" })}
                disabled={!selectedMember}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition bg-white ${
                  errors.loanId ? "border-red-400 bg-red-50" : "border-gray-200"
                } ${!selectedMember ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <option value="">
                  {selectedMember ? "Select loan..." : "Select member first"}
                </option>
                {memberLoans.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    Loan #{loan.id} - P {loan.amount.toLocaleString()} - {loan.purpose}
                  </option>
                ))}
              </select>
              {errors.loanId && (
                <p className="text-red-500 text-xs mt-1">{errors.loanId.message}</p>
              )}
              {selectedMember && memberLoans.length === 0 && (
                <p className="text-gray-500 text-xs mt-1">No active loans found for this member</p>
              )}
            </div>

            {/* SECTION: LOAN DETAILS */}
            {selectedLoan && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Loan Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Original Amount:</span>
                    <span className="ml-2 font-semibold">P {selectedLoan.amount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Remaining Balance:</span>
                    <span className="ml-2 font-semibold text-red-600">P {selectedLoan.remainingBalance.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Monthly Payment:</span>
                    <span className="ml-2 font-semibold">P {selectedLoan.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Interest Rate:</span>
                    <span className="ml-2 font-semibold">{(selectedLoan.interestRate * 100).toFixed(0)}%/month</span>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION: PAYMENT AMOUNT */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Repayment Amount (P)
              </label>
              <input
                {...register("amount", {
                  required: "Amount is required",
                  validate: (val) => {
                    const n = parseFloat(val);
                    if (isNaN(n) || !/^\d+(\.\d+)?$/.test(val.trim()))
                      return "Amount must be a valid number";
                    if (n <= 0) return "Amount must be greater than 0";
                    if (selectedLoan && n > selectedLoan.remainingBalance)
                      return `Amount cannot exceed remaining balance of P ${selectedLoan.remainingBalance.toLocaleString()}`;
                    return true;
                  },
                })}
                placeholder="e.g. 2000"
                inputMode="decimal"
                disabled={!selectedLoan}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                  errors.amount ? "border-red-400 bg-red-50" : "border-gray-200"
                } ${!selectedLoan ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              {errors.amount ? (
                <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
              ) : selectedLoan ? (
                <p className="text-gray-500 text-xs mt-1">Expected monthly payment: P {selectedLoan.monthlyPayment.toLocaleString()}</p>
              ) : null}
            </div>

            {/* SECTION: PAYMENT DATE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Date</label>
              <input
                {...register("paymentDate", { required: "Payment date is required" })}
                type="date"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                  errors.paymentDate ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.paymentDate && (
                <p className="text-red-500 text-xs mt-1">{errors.paymentDate.message}</p>
              )}
            </div>

            {/* SECTION: PROOF OF PAYMENT */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Proof of Payment (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">
                  {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500">PDF, JPG, or PNG (max 5MB)</p>
                <input
                  {...register("proofOfPayment")}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="repayment-proof-upload"
                />
                <label
                  htmlFor="repayment-proof-upload"
                  className="cursor-pointer inline-flex items-center gap-2 bg-[#1e1b4b] hover:bg-[#2d2755] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors mt-3"
                >
                  <Upload className="w-4 h-4" />
                  Choose File
                </label>
              </div>
              {uploadedFile && (
                <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
                  <span className="text-sm text-green-700">{uploadedFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* SECTION: NOTES */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Additional Notes
                <span className="font-normal text-gray-400"> (optional)</span>
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="Any additional information about this repayment..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition resize-none"
              />
            </div>

            {/* SECTION: APPROVAL NOTICE */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-semibold mb-1">Signatory Approval Required</p>
                  <p>This loan repayment will be recorded as pending and requires approval from both group signatories before it's officially applied to the loan balance.</p>
                </div>
              </div>
            </div>

            {/* SECTION: SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting || !selectedLoan}
              className="w-full bg-[#1e1b4b] hover:bg-[#2d2755] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition-colors"
            >
              {isSubmitting ? "Processing Repayment..." : "Submit Loan Repayment"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
