import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { HandCoins, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { MEMBER_DATA, SUMMARY_DATA } from "../config/dataConfig";

interface LoanFormData {
  memberId: string;
  amount: string;
  purpose: string;
  repaymentMonths: string;
  notes: string;
}

const PURPOSE_OPTIONS = [
  "Medical Emergency",
  "School Fees",
  "Business Investment",
  "Home Repair",
  "Funeral / Burial",
  "Other",
];

const REPAYMENT_OPTIONS = [
  { label: "1 month", value: "1" },
  { label: "2 months", value: "2" },
  { label: "3 months", value: "3" },
  { label: "6 months", value: "6" },
];

// Extract pool total from config (strips "P " prefix and commas)
const POOL_VALUE_STR = SUMMARY_DATA.find((s) => s.label === "Total Group Pool")?.value ?? "P 45,000";
const POOL_TOTAL = parseInt(POOL_VALUE_STR.replace(/[^0-9]/g, ""), 10);
const MAX_LOAN = POOL_TOTAL * 0.5;
const MIN_LOAN = 500;
const INTEREST_RATE = 0.05;

function RepaymentBreakdown({
  amount,
  months,
}: {
  amount: number;
  months: number;
}) {
  const interest = amount * INTEREST_RATE;
  const total = amount + interest;
  const monthly = total / months;

  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mt-1">
      <p className="text-sm font-semibold text-[#1e1b4b] mb-3 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-[#10b981]" />
        Repayment Estimate (5% flat interest)
      </p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Principal", value: `P ${amount.toLocaleString()}` },
          { label: "Interest (5%)", value: `P ${interest.toFixed(2)}` },
          { label: `Monthly × ${months}`, value: `P ${monthly.toFixed(2)}`, highlight: true },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-lg p-3 text-center shadow-sm">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className={`text-sm font-bold mt-0.5 ${item.highlight ? "text-[#10b981]" : "text-[#1e1b4b]"}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoanRequestPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<LoanFormData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoanFormData>();

  const amountRaw = watch("amount", "");
  const monthsRaw = watch("repaymentMonths", "");
  const amountNum = parseFloat(amountRaw);
  const monthsNum = parseInt(monthsRaw, 10);
  const showBreakdown = !isNaN(amountNum) && amountNum >= MIN_LOAN && !isNaN(monthsNum) && monthsNum > 0;

  const onSubmit = async (data: LoanFormData) => {
    // FEATURE PENDING: Replace with real API call
    console.log("Loan request payload:", data);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Loan request submitted for signatory approval.");
    setSubmittedData(data);
    setSubmitted(true);
  };

  const getMemberName = (id: string) =>
    MEMBER_DATA.find((m) => m.id === parseInt(id))?.name ?? "";

  if (submitted && submittedData) {
    const amt = parseFloat(submittedData.amount);
    const mo = parseInt(submittedData.repaymentMonths);
    const monthly = ((amt * (1 + INTEREST_RATE)) / mo).toFixed(2);

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
            <h2 className="text-2xl font-bold text-[#1e1b4b] mb-1">Request Submitted!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Loan of{" "}
              <strong className="text-[#1e1b4b]">P {parseFloat(submittedData.amount).toLocaleString()}</strong>{" "}
              sent to signatories for approval.
            </p>

            {/* SECTION: SUMMARY TABLE */}
            <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 mb-6">
              {[
                ["Member", getMemberName(submittedData.memberId)],
                ["Amount", `P ${parseFloat(submittedData.amount).toLocaleString()}`],
                ["Purpose", submittedData.purpose],
                ["Repayment", `${submittedData.repaymentMonths} month(s)`],
                ["Monthly Payment", `P ${monthly} (incl. 5% interest)`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-[#1e1b4b]">{val}</span>
                </div>
              ))}
            </div>

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
          <h1 className="text-2xl font-bold tracking-wide">RE-MMOGO</h1>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </nav>

      {/* SECTION: POOL BANNER */}
      <div className="bg-[#1e1b4b] border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex justify-between text-white">
          <div>
            <p className="text-xs text-[#10b981] font-semibold uppercase tracking-wider">Total Group Pool</p>
            <p className="text-xl font-bold">P {POOL_TOTAL.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#10b981] font-semibold uppercase tracking-wider">Max Loan (50%)</p>
            <p className="text-xl font-bold">P {MAX_LOAN.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* SECTION: FORM */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* SECTION: FORM HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#1e1b4b] p-2 rounded-lg">
              <HandCoins className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1e1b4b]">Request a Loan</h2>
              <p className="text-sm text-gray-500">Signatory approval required before funds are released</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* SECTION: MEMBER SELECT */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name (Member)</label>
              <select
                {...register("memberId", { required: "Please select your name" })}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition bg-white ${
                  errors.memberId ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              >
                <option value="">Select your name...</option>
                {MEMBER_DATA.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {errors.memberId && (
                <p className="text-red-500 text-xs mt-1">{errors.memberId.message}</p>
              )}
            </div>

            {/* SECTION: AMOUNT */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Loan Amount (P)
              </label>
              <input
                {...register("amount", {
                  required: "Loan amount is required",
                  validate: (val) => {
                    const n = parseFloat(val);
                    if (isNaN(n) || !/^\d+(\.\d+)?$/.test(val.trim()))
                      return "Amount must be a valid number (digits only)";
                    if (n < MIN_LOAN) return `Minimum loan amount is P${MIN_LOAN}`;
                    if (n > MAX_LOAN)
                      return `Maximum loan is P${MAX_LOAN.toLocaleString()} (50% of pool)`;
                    return true;
                  },
                })}
                placeholder="e.g. 5000"
                inputMode="decimal"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                  errors.amount ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
              {errors.amount ? (
                <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
              ) : amountRaw && !isNaN(amountNum) ? (
                <p className="text-emerald-600 text-xs mt-1">✓ Valid amount</p>
              ) : null}
            </div>

            {/* SECTION: PURPOSE + REPAYMENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Loan Purpose</label>
                <select
                  {...register("purpose", { required: "Please select a purpose" })}
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition bg-white ${
                    errors.purpose ? "border-red-400 bg-red-50" : "border-gray-200"
                  }`}
                >
                  <option value="">Select purpose...</option>
                  {PURPOSE_OPTIONS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                {errors.purpose && (
                  <p className="text-red-500 text-xs mt-1">{errors.purpose.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Repayment Period</label>
                <select
                  {...register("repaymentMonths", { required: "Please select a repayment period" })}
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition bg-white ${
                    errors.repaymentMonths ? "border-red-400 bg-red-50" : "border-gray-200"
                  }`}
                >
                  <option value="">Select period...</option>
                  {REPAYMENT_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
                {errors.repaymentMonths && (
                  <p className="text-red-500 text-xs mt-1">{errors.repaymentMonths.message}</p>
                )}
              </div>
            </div>

            {/* SECTION: REPAYMENT BREAKDOWN */}
            {showBreakdown && (
              <RepaymentBreakdown amount={amountNum} months={monthsNum} />
            )}

            {/* SECTION: NOTES */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Additional Notes{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="Any supporting details for the signatories..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition resize-none"
              />
            </div>

            {/* SECTION: SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1e1b4b] hover:bg-[#2d2755] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition-colors"
            >
              {isSubmitting ? "Submitting Request..." : "Submit Loan Request"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
