import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "../../hooks/useDebounce";

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

function PasswordStrength({ password }: { password: string }) {
  const score =
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-lime-400",
    "bg-emerald-500",
  ];
  const textColors = [
    "",
    "text-red-500",
    "text-amber-500",
    "text-lime-600",
    "text-emerald-600",
  ];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs mt-1 font-medium ${textColors[score]}`}>
        {labels[score]}
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    mode: 'onBlur',
  });

  const password = watch("password", "");
  const debouncedEmail = useDebounce(watch("email", ""), 500);
  const debouncedPhone = useDebounce(watch("phone", ""), 500);

  const onSubmit = async (data: RegisterFormData) => {
    // FEATURE PENDING: Replace with real API call
    console.log("Register payload:", data);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Account created! Awaiting admin approval.");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* SECTION: NAVBAR */}
        <nav className="bg-[#1e1b4b] text-white shadow-lg" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide">RE-MMOGO</h1>
          </div>
        </nav>

        {/* SECTION: SUCCESS STATE */}
        <div className="flex-1 flex items-center justify-center px-3 sm:px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-10 max-w-md w-full text-center" role="alert" aria-live="polite">
            <CheckCircle className="w-16 h-16 text-[#10b981] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#1e1b4b] mb-2">
              Registration Successful!
            </h2>
            <p className="text-gray-500 mb-6">
              Welcome to RE-MMOGO. Your account is pending admin approval.
              You'll be notified once activated.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-[#1e1b4b] hover:bg-[#2d2755] text-white py-3 rounded-lg font-semibold transition-colors"
              aria-label="Return to dashboard"
              role="button"
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
      <nav className="bg-[#1e1b4b] text-white shadow-lg" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide">RE-MMOGO</h1>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs sm:text-sm hover:bg-white/10 px-2 sm:px-3 py-2 rounded-lg transition-colors"
            aria-label="Return to dashboard"
            role="button"
          >
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
        </div>
      </nav>

      {/* SECTION: FORM */}
      <main className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 py-8 sm:py-10" role="main">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {/* SECTION: HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#1e1b4b] p-2 rounded-lg">
              <UserPlus className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1e1b4b]">
                Create Your Account
              </h2>
              <p className="text-sm text-gray-500">
                Join the savings group and grow together
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* SECTION: NAME + EMAIL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="fullName" 
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  {...register("fullName", {
                    required: "Full name is required",
                    onBlur: () => trigger("fullName"),
                  })}
                  placeholder="e.g. Hope Kenosi"
                  aria-label="Enter your full name"
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  className={`w-full border rounded-lg px-3 sm:px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                    errors.fullName
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {errors.fullName && (
                  <p id="fullName-error" className="text-red-500 text-xs mt-1" role="alert">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                    errors.email
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* SECTION: PHONE + ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^\+?[0-9]{7,15}$/,
                      message: "Enter a valid phone number",
                    },
                  })}
                  placeholder="+267 7X XXX XXX"
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                    errors.phone
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ID / Omang Number
                </label>
                <input
                  {...register("idNumber", {
                    required: "ID number is required",
                  })}
                  placeholder="National ID number"
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                    errors.idNumber
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
                {errors.idNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.idNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* SECTION: PASSWORD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 8, message: "Minimum 8 characters" },
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.password
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
                <PasswordStrength password={password} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (val) =>
                        val === password || "Passwords do not match",
                    })}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat password"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#1e1b4b] transition ${
                      errors.confirmPassword
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* SECTION: TERMS */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  {...register("agreeTerms", {
                    required: "You must agree to the terms",
                  })}
                  type="checkbox"
                  className="mt-0.5 accent-[#10b981]"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <span className="text-[#10b981] font-semibold cursor-pointer hover:underline">
                    Terms & Conditions
                  </span>{" "}
                  and the group savings rules of RE-MMOGO.
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.agreeTerms.message}
                </p>
              )}
            </div>

            {/* SECTION: SUBMIT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1e1b4b] hover:bg-[#2d2755] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold text-sm transition-colors"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                className="text-[#10b981] font-semibold cursor-pointer hover:underline"
              >
                Back to Dashboard
              </span>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
