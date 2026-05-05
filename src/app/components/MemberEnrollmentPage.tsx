import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Users, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { ROLE_OPTIONS, CONTRIBUTION_DAY_OPTIONS } from "../config/dataConfig";

interface EnrollFormData {
  fullName: string;
  phone: string;
  idNumber: string;
  email: string;
  occupation: string;
  monthlyIncome: string;
  contributionDay: string;
  role: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  declaration: boolean;
}


export default function MemberEnrollmentPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnrollFormData>();

  const onSubmit = async (data: EnrollFormData) => {
    // FEATURE PENDING: Replace with real API call
    console.log("Enrollment payload:", data);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success(`${data.fullName} enrolled successfully!`);
    setSubmitted(true);
  };

  if (submitted) {
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
            <h2 className="text-2xl font-bold text-[#1e1b4b] mb-2">Member Enrolled!</h2>
            <p className="text-gray-500 mb-6">
              The new member has been enrolled and is pending admin approval before appearing in the group table.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setSubmitted(false)}
                className="flex-1 border border-[#1e1b4b] text-[#1e1b4b] hover:bg-gray-50 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                Enroll Another
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

      {/* SECTION: FORM */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* SECTION: FORM HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#1e1b4b] p-2 rounded-lg">
              <Users className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1e1b4b]">Member Enrollment</h2>
              <p className="text-sm text-gray-500">Register a new member into the RE-MMOGO savings group</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* SECTION: PERSONAL DETAILS */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    {...register("fullName", { required: "Full name is required" })}
                    placeholder="e.g. Victor Coder"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.fullName ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ID / Omang Number</label>
                  <input
                    {...register("idNumber", { required: "ID number is required" })}
                    placeholder="National ID number"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.idNumber ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.idNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.idNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: { value: /^\+?[0-9]{7,15}$/, message: "Enter a valid phone number" },
                    })}
                    placeholder="+267 7X XXX XXX"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.phone ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                    })}
                    type="email"
                    placeholder="member@example.com"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.email ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION: FINANCIAL & ROLE */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Financial & Group Role
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Occupation</label>
                  <input
                    {...register("occupation", { required: "Occupation is required" })}
                    placeholder="e.g. Teacher, Nurse, Trader"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.occupation ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.occupation && (
                    <p className="text-red-500 text-xs mt-1">{errors.occupation.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Income (P)</label>
                  <input
                    {...register("monthlyIncome", {
                      required: "Monthly income is required",
                      validate: (val) => {
                        const n = parseFloat(val);
                        if (isNaN(n) || !/^\d+(\.\d+)?$/.test(val.trim()))
                          return "Income must be a valid number";
                        if (n <= 0) return "Income must be greater than 0";
                        return true;
                      },
                    })}
                    placeholder="e.g. 8000"
                    inputMode="decimal"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.monthlyIncome ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.monthlyIncome && (
                    <p className="text-red-500 text-xs mt-1">{errors.monthlyIncome.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Group Role</label>
                  <select
                    {...register("role", { required: "Please select a role" })}
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition bg-white ${
                      errors.role ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  >
                    <option value="">Select role...</option>
                    {ROLE_OPTIONS.map((r: string) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Preferred Contribution Day
                  </label>
                  <select
                    {...register("contributionDay", { required: "Please select a contribution day" })}
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition bg-white ${
                      errors.contributionDay ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  >
                    <option value="">Select day...</option>
                    {CONTRIBUTION_DAY_OPTIONS.map((d: string) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                  {errors.contributionDay && (
                    <p className="text-red-500 text-xs mt-1">{errors.contributionDay.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION: EMERGENCY CONTACT */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Name</label>
                  <input
                    {...register("emergencyContactName", { required: "Emergency contact name is required" })}
                    placeholder="e.g. Jane Kenosi"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.emergencyContactName ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.emergencyContactName && (
                    <p className="text-red-500 text-xs mt-1">{errors.emergencyContactName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    {...register("emergencyContactPhone", {
                      required: "Emergency contact phone is required",
                      pattern: { value: /^\+?[0-9]{7,15}$/, message: "Enter a valid phone number" },
                    })}
                    placeholder="+267 7X XXX XXX"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.emergencyContactPhone ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.emergencyContactPhone && (
                    <p className="text-red-500 text-xs mt-1">{errors.emergencyContactPhone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION: DECLARATION */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  {...register("declaration", { required: "Declaration must be acknowledged" })}
                  type="checkbox"
                  className="mt-0.5 accent-[#10b981]"
                />
                <span className="text-sm text-gray-700">
                  I confirm that the information provided is accurate and that this member agrees to abide by the{" "}
                  <span className="text-[#10b981] font-semibold">RE-MMOGO group rules</span>, including monthly
                  contributions of P1,000 and the collective savings goal of P5,000.
                </span>
              </label>
              {errors.declaration && (
                <p className="text-red-500 text-xs mt-2">{errors.declaration.message}</p>
              )}
            </div>

            {/* SECTION: SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1e1b4b] hover:bg-[#2d2755] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition-colors"
            >
              {isSubmitting ? "Enrolling Member..." : "Enroll Member"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
