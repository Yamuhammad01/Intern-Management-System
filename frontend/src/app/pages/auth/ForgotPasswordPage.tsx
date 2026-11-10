import React, { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft, Mail } from "lucide-react";
import { LogoIcon } from "../../components/brand/Logo";
import { Button } from "../../components/ui/button";

interface ForgotPasswordPageProps {
  onNavigate: (page: "welcome" | "login" | "register") => void;
  onSetResetToken: (token: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate, onSetResetToken }) => {
  const { forgotPassword, error, clearError, isMockMode } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim()) {
      setLocalError("Email address is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setSuccess(true);

      if (isMockMode) {
        const fakeToken = "mock-reset-token-xyz-" + Date.now();
        console.log(`[MOCK] Reset token generated: ${fakeToken}`);
        onSetResetToken(fakeToken);
      }
    } catch (err: any) {
      setLocalError(err.message || "Failed to submit request.");
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
          Reset Your Password
        </h2>
        <p className="text-xs text-[#607b91] mt-1 leading-snug">
          Enter your registered email address to receive password recovery instructions
        </p>
      </div>

      {/* Success Notification */}
      {success ? (
        <div className="flex flex-col items-center gap-3 bg-[#eefafc] border border-[#bfe7f3] rounded-2xl p-5 text-center text-xs text-[#1a5b75] animate-fade-in">
          <div className="w-10 h-10 rounded-full bg-[#d2f3fa] flex items-center justify-center text-[#248da9]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm text-[#18485d] mb-1">Reset Instructions Sent</p>
            <p className="text-[11.5px] text-[#4b7a8f] leading-relaxed">
              If an account matches <b>{email}</b>, you will receive password reset instructions.
            </p>
          </div>
          <Button
            variant="cyan"
            size="sm"
            onClick={() => onNavigate("login")}
            className="mt-2 text-white font-medium"
          >
            Return to Sign In
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
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1d3d56]" htmlFor="email">
                Registered Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#8aa3b5] absolute left-3.5 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah.johnson@company.com"
                  className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all duration-150"
                />
              </div>
            </div>

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
                  Sending Link...
                </>
              ) : (
                "Send Password Reset Link"
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
