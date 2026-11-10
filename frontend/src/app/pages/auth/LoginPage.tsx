import React, { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { AlertCircle, Loader2, Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react";
import { LogoIcon } from "../../components/brand/Logo";
import { Button } from "../../components/ui/button";

interface LoginPageProps {
  onNavigate: (page: "welcome" | "register" | "forgot") => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      {/* Brand Icon Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#e6f4f8] flex items-center justify-center mb-3 shadow-2xs">
          <LogoIcon size={30} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#183348]">
          Welcome Back
        </h2>
        <p className="text-xs text-[#607b91] mt-1 leading-snug">
          Sign in to access your InternPath dashboard and active programs
        </p>
      </div>

      {/* Errors Display */}
      {(localError || error) && (
        <div className="mb-4 bg-red-50 border border-red-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-700 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{localError || error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Address */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#1d3d56]" htmlFor="email">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-[#8aa3b5] absolute left-3.5 pointer-events-none" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@company.com"
              className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all duration-150"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#1d3d56]" htmlFor="password">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-[#8aa3b5] absolute left-3.5 pointer-events-none" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your account password"
              className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all duration-150"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 p-1 text-[#8aa3b5] hover:text-[#265275] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs mt-0.5">
          <label className="flex items-center gap-2 font-medium text-[#4b6a82] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-[#c8d8e3] text-[#265275] focus:ring-[#2eb4d6] w-3.5 h-3.5 accent-[#265275]"
            />
            Remember Me
          </label>
          <button
            type="button"
            onClick={() => onNavigate("forgot")}
            className="font-semibold text-[#265275] hover:text-[#2eb4d6] transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="navy"
          size="lg"
          disabled={isSubmitting}
          className="w-full text-white text-[13.5px] font-semibold mt-2 shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Authenticating...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Footer Navigation */}
      <div className="flex flex-col items-center gap-3 mt-6 pt-5 border-t border-[#e5edf3] text-xs text-[#638096]">
        <div>
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={() => onNavigate("register")}
            className="font-semibold text-[#265275] hover:text-[#2eb4d6] transition-colors"
          >
            Create an account
          </button>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("welcome")}
          className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-[#819ab0] hover:text-[#265275] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Welcome Overview
        </button>
      </div>
    </div>
  );
};
