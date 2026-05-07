import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, LogIn, User } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "../../hooks/useDebounce";
import { useAuth } from "../../hooks/useAuth";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<LoginFormData>({
    mode: "onChange",
  });

  const email = watch("email");
  const password = watch("password");
  const debouncedEmail = useDebounce(email, 300);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password });
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const getFieldError = (field: string) => {
    const error = errors[field as keyof LoginFormData];
    return error?.message;
  };

  const validateField = async (field: string) => {
    await trigger(field as keyof LoginFormData);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1e1b4b] rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to RE-MMOGO
          </h1>
          <p className="text-gray-600">
            Sign in to access your savings group
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  id="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1e1b4b] focus:border-transparent transition-colors ${
                    focusedField === "email" || email
                      ? "border-[#1e1b4b]"
                      : "border-gray-300"
                  } ${errors.email ? "border-red-500" : ""}`}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => {
                    setFocusedField(null);
                    validateField("email");
                  }}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {getFieldError("email")}
                  </p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#1e1b4b] focus:border-transparent transition-colors ${
                    focusedField === "password" || password
                      ? "border-[#1e1b4b]"
                      : "border-gray-300"
                  } ${errors.password ? "border-red-500" : ""}`}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => {
                    setFocusedField(null);
                    validateField("password");
                  }}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {errors.password && (
                  <p
                    id="password-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {getFieldError("password")}
                  </p>
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  {...register("rememberMe")}
                  type="checkbox"
                  className="w-4 h-4 text-[#1e1b4b] border-gray-300 rounded focus:ring-[#1e1b4b]"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => console.log("Feature Pending: Forgot Password")}
                className="text-sm text-[#1e1b4b] hover:text-[#2d2755] font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="w-full bg-[#1e1b4b] hover:bg-[#2d2755] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-[#10b981] font-semibold hover:underline transition-colors"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>

        {/* Demo Accounts Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Demo Accounts</h3>
          <div className="space-y-1 text-xs text-blue-800">
            <p><strong>Member:</strong> hope@example.com / password123</p>
            <p><strong>Signatory:</strong> bokao@example.com / password123</p>
            <p><strong>Treasurer:</strong> victor@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
