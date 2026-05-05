import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, ShieldCheck, Users, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";
 
type UserRole = "member" | "signatory" | null;
 
/* ------------------------------------------------------------------ */
/*  Mock credentials — swap with real API calls when backend is ready  */
/* ------------------------------------------------------------------ */
const MOCK_USERS = [
  { email: "hope@re-mmogo.bw",     password: "member123",    role: "member"    as const, name: "Hope Kenosi"    },
  { email: "eugene@re-mmogo.bw",   password: "member123",    role: "member"    as const, name: "Eugene Member"  },
  { email: "victor@re-mmogo.bw",   password: "sign123",      role: "signatory" as const, name: "Victor Coder"  },
  { email: "admin@re-mmogo.bw",    password: "sign123",      role: "signatory" as const, name: "Group Admin"   },
];
 
export default function SignInPage() {
  const navigate = useNavigate();
 
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPass, setShowPass]         = useState(false);
  const [loading, setLoading]           = useState(false);
 
  /* ---------------------------------------------------------------- */
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) { toast.error("Please select your account type first."); return; }
 
    setLoading(true);
 
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.email === email.trim().toLowerCase() && u.password === password && u.role === selectedRole
      );
 
      if (user) {
        // Store minimal session info (replace with proper auth later)
        sessionStorage.setItem("rm_user", JSON.stringify({ name: user.name, role: user.role, email: user.email }));
        toast.success(`Welcome back, ${user.name}!`);
        setTimeout(() => navigate("/dashboard"), 800);
      } else {
        toast.error("Invalid credentials or wrong account type selected.");
        setLoading(false);
      }
    }, 900);
  };
 
  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-[#0d0b2b] flex flex-col">
      <Toaster position="top-right" richColors />
 
      {/* ── Decorative background blobs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#3730a3]/30 blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-[#6d28d9]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 rounded-full bg-[#1e40af]/25 blur-3xl" />
      </div>
 
      {/* ── Logo / brand bar ── */}
      <header className="relative z-10 flex items-center gap-3 px-8 py-6">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center shadow-lg">
          <span className="text-white font-black text-sm">RM</span>
        </div>
        <span className="text-white font-bold tracking-widest text-lg uppercase">Re‑Mmogo</span>
      </header>
 
      {/* ── Centered card ── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
 
          {/* Headline */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              Sign In
            </h1>
            <p className="text-indigo-300/80 text-sm">
              Select your account type, then enter your credentials
            </p>
          </div>
 
          {/* Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
 
            {/* ── Role selector ── */}
            <p className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-3">
              I am a…
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {/* Member tile */}
              <button
                type="button"
                onClick={() => setSelectedRole("member")}
                className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all duration-200
                  ${selectedRole === "member"
                    ? "border-indigo-400 bg-indigo-500/20 shadow-lg shadow-indigo-900/40"
                    : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
                  ${selectedRole === "member" ? "bg-indigo-500 text-white" : "bg-white/10 text-indigo-300"}`}>
                  <Users className="w-6 h-6" />
                </div>
                <span className={`text-sm font-semibold transition-colors
                  ${selectedRole === "member" ? "text-white" : "text-indigo-200"}`}>
                  Member
                </span>
                <span className="text-[11px] text-indigo-300/60 text-center leading-snug">
                  Regular group member
                </span>
                {selectedRole === "member" && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400 ring-2 ring-indigo-900" />
                )}
              </button>
 
              {/* Signatory tile */}
              <button
                type="button"
                onClick={() => setSelectedRole("signatory")}
                className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all duration-200
                  ${selectedRole === "signatory"
                    ? "border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-900/40"
                    : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                  }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
                  ${selectedRole === "signatory" ? "bg-purple-500 text-white" : "bg-white/10 text-purple-300"}`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className={`text-sm font-semibold transition-colors
                  ${selectedRole === "signatory" ? "text-white" : "text-indigo-200"}`}>
                  Signatory
                </span>
                <span className="text-[11px] text-indigo-300/60 text-center leading-snug">
                  Authorised approver
                </span>
                {selectedRole === "signatory" && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-400 ring-2 ring-purple-900" />
                )}
              </button>
            </div>
 
            {/* ── Credentials form ── */}
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@re-mmogo.bw"
                  className="w-full bg-white/8 border border-white/15 text-white placeholder:text-white/30
                    rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/60
                    focus:border-transparent transition-all"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                />
              </div>
 
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/8 border border-white/15 text-white placeholder:text-white/30
                      rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/60
                      focus:border-transparent transition-all"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300/60 hover:text-indigo-200 transition-colors"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={() => toast.info("Password reset — feature coming soon.")}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
 
              {/* Role badge reminder */}
              {selectedRole && (
                <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium
                  ${selectedRole === "member"
                    ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                    : "bg-purple-500/15 text-purple-300 border border-purple-500/20"
                  }`}>
                  {selectedRole === "member"
                    ? <Users className="w-3.5 h-3.5 shrink-0" />
                    : <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  }
                  Signing in as&nbsp;<span className="font-bold capitalize">{selectedRole}</span>
                </div>
              )}
 
              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !selectedRole}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm
                  transition-all duration-200 mt-2
                  ${!selectedRole
                    ? "bg-white/10 text-white/30 cursor-not-allowed"
                    : selectedRole === "signatory"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60"
                      : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-900/40 hover:shadow-indigo-900/60"
                  }`}
              >
                {loading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {loading ? "Signing in…" : "Sign In"}
              </button>
 
              {/* ── Register link ── */}
              <div className="flex items-center gap-3 mt-5">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/30 shrink-0">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="w-full flex items-center justify-center gap-2 py-3.5 mt-3 rounded-xl
                  border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25
                  text-white/70 hover:text-white font-semibold text-sm transition-all duration-200"
              >
                <UserPlus className="w-4 h-4" />
                Don't have an account? Register
              </button>
            </form>
          </div>
 
          {/* Demo hint */}
          <div className="mt-6 p-4 rounded-xl border border-white/8 bg-white/4 text-center">
            <p className="text-xs text-indigo-300/50 mb-1 font-semibold uppercase tracking-widest">Demo credentials</p>
            <p className="text-xs text-indigo-200/60">
              Member: <span className="font-mono text-indigo-300">hope@re-mmogo.bw</span> / <span className="font-mono text-indigo-300">member123</span>
            </p>
            <p className="text-xs text-purple-200/60 mt-0.5">
              Signatory: <span className="font-mono text-purple-300">victor@re-mmogo.bw</span> / <span className="font-mono text-purple-300">sign123</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}