import React, { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";
import { LogoIcon } from "../../components/brand/Logo";
import { Button } from "../../components/ui/button";

interface ResetPasswordPageProps {
  token: string;
  onNavigate: (page: "login" | "welcome") => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ token, onNavigate }) => {
  const { resetPassword, error, clearError } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!password) {
      setLocalError("Password is required");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!passwordPattern.test(password)) {
      setLocalError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(password, token);
      setSuccess(true);
    } catch (err: any) {
      setLocalError(err.message || "Failed to reset password. Link may have expired.");
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
          Choose New Password
        </h2>
        <p className="text-xs text-[#607b91] mt-1 leading-snug">
          Create a secure password to restore access to your account
        </p>
      </div>

      {/* Success Notification */}
      {success ? (
        <div className="flex flex-col items-center gap-3 bg-[#eefafc] border border-[#bfe7f3] rounded-2xl p-5 text-center text-xs text-[#1a5b75] animate-fade-in">
          <div className="w-10 h-10 rounded-full bg-[#d2f3fa] flex items-center justify-center text-[#248da9]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm text-[#18485d] mb-1">Password Updated!</p>
            <p className="text-[11.5px] text-[#4b7a8f] leading-relaxed">
              Your account password has been successfully updated. You can now sign in with your new credentials.
            </p>
          </div>
          <Button
            variant="cyan"
            size="default"
            onClick={() => onNavigate("login")}
            className="mt-2 text-white font-medium"
          >
            Sign In with New Password
          </Button>
        </div>
      ) : (
        <>
          {/* Errors Display */}
          {(localError || error) && (
            <div className="mb-4 bg-red-50 border border-red-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{localError || error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1d3d56]" htmlFor="password">
                New Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#8aa3b5] absolute left-3.5 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter at least 8 characters"
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

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1d3d56]" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#8aa3b5] absolute left-3.5 pointer-events-none" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all duration-150"
                />
              </div>
            </div>

            <p className="text-[10px] text-[#718c9f] leading-tight">
              Password must be 8+ characters and contain uppercase, lowercase, number, and special character.
            </p>

            <Button
              type="submit"
              variant="navy"
              size="lg"
              disabled={isSubmitting}
              className="w-full text-white text-[13.5px] font-semibold mt-1 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                "Save New Password"
              )}
            </Button>
          </form>
        </>
      )}

      {/* Footer Navigation */}
      <div className="flex flex-col items-center gap-2.5 mt-6 pt-5 border-t border-[#e5edf3] text-xs text-[#638096]">
        <button
          type="button"
          onClick={() => onNavigate("login")}
          className="inline-flex items-center gap-1.5 font-semibold text-[#265275] hover:text-[#2eb4d6] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </button>
      </div>
    </div>
  );
};
