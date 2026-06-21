import React, { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { AlertCircle, Loader2 } from "lucide-react";

interface LoginPageProps {
  onNavigate: (page: "welcome" | "register" | "forgot") => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim()) {
      setLocalError("Email address is required");
      return;
    }
    if (!password) {
      setLocalError("Password is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setLocalError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Title logo SVG */}
      <div className="flex justify-center mb-6">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 0C34.1503 0 44 9.84974 44 22C44 34.1503 34.1503 44 22 44C9.84974 44 0 34.1503 0 22C0 9.84974 9.84974 0 22 0Z" fill="#10b981" fillOpacity="0.08"/>
          {/* Logo representation from TeamHub image */}
          <path d="M22 13L22 31M13 22L31 22M16 16L28 28M16 28L28 16" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-10" />
          <path d="M16 22L22 16L28 22L22 28Z" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="22" cy="22" r="2" fill="#047857" />
        </svg>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#111827]">
          Welcome Back
        </h2>
        <p className="text-xs text-gray-500 mt-1 leading-snug">
          Log in to your InternHub dashboard to continue managing your internship
        </p>
      </div>

      {/* Errors display */}
      {(localError || error) && (
        <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-700 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{localError || error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Address */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11.5px] font-semibold text-gray-700" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. sarah.johnson@email.com"
            className="w-full bg-[#f3f3f5] border-0 outline-none rounded-xl px-4 py-3 text-xs placeholder:text-gray-400 focus:bg-white focus:ring-1.5 focus:ring-emerald-500 transition-all duration-200"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11.5px] font-semibold text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            className="w-full bg-[#f3f3f5] border-0 outline-none rounded-xl px-4 py-3 text-xs placeholder:text-gray-400 focus:bg-white focus:ring-1.5 focus:ring-emerald-500 transition-all duration-200"
          />
        </div>

        {/* Options */}
        <div className="flex items-center justify-between text-xs mt-1.5">
          <label className="flex items-center gap-2 font-medium text-gray-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            Remember Me
          </label>
          <button
            type="button"
            onClick={() => onNavigate("forgot")}
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Forgot Password
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#10b981] hover:bg-[#059669] text-white text-[13px] font-semibold py-3 rounded-xl transition-all duration-200 mt-4 flex items-center justify-center gap-2 hover:translate-y-[-1px] disabled:opacity-75 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log In"
          )}
        </button>

        {/* Navigation back */}
        <div className="text-center mt-6 text-xs text-gray-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => onNavigate("register")}
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors underline decoration-2 decoration-emerald-500/20"
          >
            Register now
          </button>
        </div>

        {/* Back to Home link */}
        <div className="text-center mt-2">
          <button
            type="button"
            onClick={() => onNavigate("welcome")}
            className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Back to Welcome Page
          </button>
        </div>
      </form>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 2;
        }
      `}</style>
    </div>
  );
};
