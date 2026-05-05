import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Users, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Group, Member } from "../../types";
import { GROUP_CONFIG, ROLE_OPTIONS } from "../config/dataConfig";

interface GroupRegistrationFormData {
  groupName: string;
  description: string;
  maxMembers: string;
  monthlyContribution: string;
  targetGoalPerMember: string;
  interestRate: string;
  targetInterestPerMember: string;
  signatory1FullName: string;
  signatory1Email: string;
  signatory1Phone: string;
  signatory1IdNumber: string;
  signatory2FullName: string;
  signatory2Email: string;
  signatory2Phone: string;
  signatory2IdNumber: string;
  treasurerFullName: string;
  treasurerEmail: string;
  treasurerPhone: string;
  treasurerIdNumber: string;
  agreement: boolean;
}

export default function GroupRegistrationPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<Group | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GroupRegistrationFormData>();

  const interestRate = watch("interestRate", "20");
  const monthlyContribution = parseFloat(watch("monthlyContribution", "1000"));
  const targetGoalPerMember = parseFloat(watch("targetGoalPerMember", "5000"));
  const targetInterestPerMember = parseFloat(watch("targetInterestPerMember", "5000"));

  const onSubmit = async (data: GroupRegistrationFormData) => {
    try {
      // Create group object
      const newGroup: Group = {
        id: Date.now(), // Temporary ID generation
        name: data.groupName,
        description: data.description,
        maxMembers: parseInt(data.maxMembers),
        monthlyContribution: parseFloat(data.monthlyContribution),
        targetGoalPerMember: parseFloat(data.targetGoalPerMember),
        interestRate: parseFloat(data.interestRate) / 100, // Convert percentage to decimal
        targetInterestPerMember: parseFloat(data.targetInterestPerMember),
        createdDate: new Date().toISOString().split('T')[0],
        isActive: true,
        signatories: [1, 2], // Will be updated with actual member IDs
        treasurer: 3, // Will be updated with actual member ID
      };

      // Create member objects for signatories and treasurer
      const signatory1: Member = {
        id: 1,
        fullName: data.signatory1FullName,
        email: data.signatory1Email,
        phone: data.signatory1Phone,
        idNumber: data.signatory1IdNumber,
        occupation: "Signatory",
        monthlyIncome: 0,
        contributionDay: "1st",
        role: "Signatory",
        emergencyContactName: "",
        emergencyContactPhone: "",
        monthlyPaid: false,
        progressPercent: 0,
        signatoryStatus: "approved",
        balance: 0,
        totalContributed: 0,
        interestEarned: 0,
        dateJoined: new Date().toISOString().split('T')[0],
        isActive: true,
      };

      const signatory2: Member = {
        id: 2,
        fullName: data.signatory2FullName,
        email: data.signatory2Email,
        phone: data.signatory2Phone,
        idNumber: data.signatory2IdNumber,
        occupation: "Signatory",
        monthlyIncome: 0,
        contributionDay: "1st",
        role: "Signatory",
        emergencyContactName: "",
        emergencyContactPhone: "",
        monthlyPaid: false,
        progressPercent: 0,
        signatoryStatus: "approved",
        balance: 0,
        totalContributed: 0,
        interestEarned: 0,
        dateJoined: new Date().toISOString().split('T')[0],
        isActive: true,
      };

      const treasurer: Member = {
        id: 3,
        fullName: data.treasurerFullName,
        email: data.treasurerEmail,
        phone: data.treasurerPhone,
        idNumber: data.treasurerIdNumber,
        occupation: "Treasurer",
        monthlyIncome: 0,
        contributionDay: "1st",
        role: "Treasurer",
        emergencyContactName: "",
        emergencyContactPhone: "",
        monthlyPaid: false,
        progressPercent: 0,
        signatoryStatus: "approved",
        balance: 0,
        totalContributed: 0,
        interestEarned: 0,
        dateJoined: new Date().toISOString().split('T')[0],
        isActive: true,
      };

      // FEATURE PENDING: Replace with real API call
      console.log("Group registration payload:", { group: newGroup, members: [signatory1, signatory2, treasurer] });
      await new Promise((r) => setTimeout(r, 1500));
      
      setCreatedGroup(newGroup);
      setSubmitted(true);
      toast.success("Group registered successfully!");
    } catch (error) {
      toast.error("Failed to register group. Please try again.");
    }
  };

  if (submitted && createdGroup) {
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 max-w-2xl w-full text-center">
            <CheckCircle className="w-16 h-16 text-[#10b981] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#1e1b4b] mb-2">Group Registered Successfully!</h2>
            <p className="text-gray-500 mb-6">
              Your Motshelo group <strong>{createdGroup.name}</strong> has been created and is ready for member enrollment.
            </p>

            {/* SECTION: GROUP SUMMARY */}
            <div className="bg-gray-50 rounded-lg p-6 text-left space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-[#1e1b4b] mb-3">Group Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["Group Name", createdGroup.name],
                  ["Monthly Contribution", `P ${createdGroup.monthlyContribution.toLocaleString()}`],
                  ["Target Goal Per Member", `P ${createdGroup.targetGoalPerMember.toLocaleString()}`],
                  ["Interest Rate", `${(createdGroup.interestRate * 100).toFixed(0)}% monthly`],
                  ["Target Interest Per Member", `P ${createdGroup.targetInterestPerMember.toLocaleString()}`],
                  ["Max Members", createdGroup.maxMembers.toString()],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-[#1e1b4b]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSubmitted(false)}
                className="flex-1 border border-[#1e1b4b] text-[#1e1b4b] hover:bg-gray-50 py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                Register Another Group
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-[#1e1b4b] hover:bg-[#2d2755] text-white py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                Go to Dashboard
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* SECTION: FORM HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#1e1b4b] p-2 rounded-lg">
              <Users className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1e1b4b]">Register Motshelo Group</h2>
              <p className="text-sm text-gray-500">Create a new savings group and assign key roles</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* SECTION: GROUP DETAILS */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Group Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Group Name</label>
                  <input
                    {...register("groupName", { required: "Group name is required" })}
                    placeholder="e.g. Hope Coders Savings Group"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.groupName ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.groupName && (
                    <p className="text-red-500 text-xs mt-1">{errors.groupName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Max Members</label>
                  <input
                    {...register("maxMembers", {
                      required: "Max members is required",
                      validate: (val) => {
                        const n = parseInt(val);
                        if (isNaN(n) || n < 3) return "Minimum 3 members required";
                        if (n > 20) return "Maximum 20 members allowed";
                        return true;
                      },
                    })}
                    placeholder="e.g. 10"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.maxMembers ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.maxMembers && (
                    <p className="text-red-500 text-xs mt-1">{errors.maxMembers.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Group Description</label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  rows={3}
                  placeholder="Describe the purpose and goals of your savings group..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>

            {/* SECTION: FINANCIAL SETTINGS */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Financial Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Contribution (P)</label>
                  <input
                    {...register("monthlyContribution", {
                      required: "Monthly contribution is required",
                      validate: (val) => {
                        const n = parseFloat(val);
                        if (isNaN(n) || n <= 0) return "Amount must be greater than 0";
                        return true;
                      },
                    })}
                    placeholder="e.g. 1000"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.monthlyContribution ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.monthlyContribution && (
                    <p className="text-red-500 text-xs mt-1">{errors.monthlyContribution.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Target Goal Per Member (P)</label>
                  <input
                    {...register("targetGoalPerMember", {
                      required: "Target goal is required",
                      validate: (val) => {
                        const n = parseFloat(val);
                        if (isNaN(n) || n <= 0) return "Amount must be greater than 0";
                        return true;
                      },
                    })}
                    placeholder="e.g. 5000"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.targetGoalPerMember ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.targetGoalPerMember && (
                    <p className="text-red-500 text-xs mt-1">{errors.targetGoalPerMember.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Interest Rate (%)</label>
                  <input
                    {...register("interestRate", {
                      required: "Interest rate is required",
                      validate: (val) => {
                        const n = parseFloat(val);
                        if (isNaN(n) || n <= 0) return "Rate must be greater than 0";
                        if (n > 50) return "Rate cannot exceed 50%";
                        return true;
                      },
                    })}
                    placeholder="e.g. 20"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.interestRate ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.interestRate && (
                    <p className="text-red-500 text-xs mt-1">{errors.interestRate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Target Interest Per Member (P)</label>
                  <input
                    {...register("targetInterestPerMember", {
                      required: "Target interest is required",
                      validate: (val) => {
                        const n = parseFloat(val);
                        if (isNaN(n) || n <= 0) return "Amount must be greater than 0";
                        return true;
                      },
                    })}
                    placeholder="e.g. 5000"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.targetInterestPerMember ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.targetInterestPerMember && (
                    <p className="text-red-500 text-xs mt-1">{errors.targetInterestPerMember.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION: SIGNATORY 1 */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                First Signatory
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    {...register("signatory1FullName", { required: "Signatory 1 name is required" })}
                    placeholder="e.g. Hope Kenosi"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.signatory1FullName ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.signatory1FullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.signatory1FullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    {...register("signatory1Email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                    })}
                    type="email"
                    placeholder="signatory1@example.com"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.signatory1Email ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.signatory1Email && (
                    <p className="text-red-500 text-xs mt-1">{errors.signatory1Email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    {...register("signatory1Phone", {
                      required: "Phone number is required",
                      pattern: { value: /^\+?[0-9]{7,15}$/, message: "Enter a valid phone number" },
                    })}
                    placeholder="+267 7X XXX XXX"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.signatory1Phone ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.signatory1Phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.signatory1Phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ID / Omang Number</label>
                  <input
                    {...register("signatory1IdNumber", { required: "ID number is required" })}
                    placeholder="National ID number"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.signatory1IdNumber ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.signatory1IdNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.signatory1IdNumber.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION: SIGNATORY 2 */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Second Signatory
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    {...register("signatory2FullName", { required: "Signatory 2 name is required" })}
                    placeholder="e.g. Eugune Member"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.signatory2FullName ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.signatory2FullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.signatory2FullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    {...register("signatory2Email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                    })}
                    type="email"
                    placeholder="signatory2@example.com"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.signatory2Email ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.signatory2Email && (
                    <p className="text-red-500 text-xs mt-1">{errors.signatory2Email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    {...register("signatory2Phone", {
                      required: "Phone number is required",
                      pattern: { value: /^\+?[0-9]{7,15}$/, message: "Enter a valid phone number" },
                    })}
                    placeholder="+267 7X XXX XXX"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.signatory2Phone ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.signatory2Phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.signatory2Phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ID / Omang Number</label>
                  <input
                    {...register("signatory2IdNumber", { required: "ID number is required" })}
                    placeholder="National ID number"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.signatory2IdNumber ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.signatory2IdNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.signatory2IdNumber.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION: TREASURER */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                Treasurer
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    {...register("treasurerFullName", { required: "Treasurer name is required" })}
                    placeholder="e.g. Bokao Member"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.treasurerFullName ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.treasurerFullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.treasurerFullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    {...register("treasurerEmail", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                    })}
                    type="email"
                    placeholder="treasurer@example.com"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.treasurerEmail ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.treasurerEmail && (
                    <p className="text-red-500 text-xs mt-1">{errors.treasurerEmail.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    {...register("treasurerPhone", {
                      required: "Phone number is required",
                      pattern: { value: /^\+?[0-9]{7,15}$/, message: "Enter a valid phone number" },
                    })}
                    placeholder="+267 7X XXX XXX"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.treasurerPhone ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.treasurerPhone && (
                    <p className="text-red-500 text-xs mt-1">{errors.treasurerPhone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ID / Omang Number</label>
                  <input
                    {...register("treasurerIdNumber", { required: "ID number is required" })}
                    placeholder="National ID number"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.treasurerIdNumber ? "border-red-400 bg-red-50" : "border-gray-200"
                    }`}
                  />
                  {errors.treasurerIdNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.treasurerIdNumber.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION: AGREEMENT */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  {...register("agreement", { required: "You must agree to the terms" })}
                  type="checkbox"
                  className="mt-0.5 accent-[#10b981]"
                />
                <span className="text-sm text-gray-700">
                  I confirm that I have the authority to register this Motshelo group and that all signatories and treasurer have agreed to their roles. I understand the group rules including the {(interestRate || "20")}% monthly interest rate on loans and the P{(targetInterestPerMember || "5000")} interest target per member.
                </span>
              </label>
              {errors.agreement && (
                <p className="text-red-500 text-xs mt-2">{errors.agreement.message}</p>
              )}
            </div>

            {/* SECTION: SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1e1b4b] hover:bg-[#2d2755] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition-colors"
            >
              {isSubmitting ? "Registering Group..." : "Register Motshelo Group"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
