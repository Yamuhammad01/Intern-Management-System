import React, { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

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
      
      // In mock mode, generate a fake token link in the console and auto-setup the token for the user to bypass easily
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
      {/* SVG Icon */}
      <div className="flex justify-center mb-6">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 0C34.1503 0 44 9.84974 44 22C44 34.1503 34.1503 44 22 44C9.84974 44 0 34.1503 0 22C0 9.84974 9.84974 0 22 0Z" fill="#10b981" fillOpacity="0.08"/>
          <path d="M15 25V19C15 15.134 18.134 12 22 12C25.866 12 29 15.134 29 19V25M12 22H32M22 28V32" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="22" cy="22" r="3.5" stroke="#10b981" strokeWidth="2.5" fill="#f8fafc" />
        </svg>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#111827]">
          Forgot Password
        </h2>
        <p className="text-xs text-gray-500 mt-1 leading-snug">
          Enter your email address and we'll send you a link to reset your account password
        </p>
      </div>

      {success ? (
        <div className="flex flex-col items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center text-xs text-emerald-800">
          <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
          <div>
            <p className="font-semibold text-sm mb-1">Reset Link Sent!</p>
            <p className="leading-relaxed">
              If an account is associated with <b>{email}</b>, we have sent instructions to reset your password.
            </p>
            {isMockMode && (
              <div className="mt-4 p-2.5 bg-emerald-100/50 rounded-xl border border-emerald-200/50 text-[10.5px]">
                <p className="font-semibold mb-1">Demo Shortcut:</p>
                <button
                  type="button"
                  onClick={() => onNavigate("welcome")} // parent will trigger reset password screen
                  className="font-bold text-emerald-700 underline hover:text-emerald-800 transition-colors"
                >
                  Click here to proceed to the Reset Password screen
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="mt-2 w-full border border-emerald-200 hover:bg-emerald-100/30 text-emerald-700 font-semibold py-2.5 rounded-xl transition-all"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Errors display */}
          {(localError || error) && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{localError || error}</span>
            </div>
          )}

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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white text-[13px] font-semibold py-3 rounded-xl transition-all duration-200 mt-2 flex items-center justify-center gap-2 hover:translate-y-[-1px] disabled:opacity-75 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>

          {/* Back to login navigation */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
