import React, { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface ResetPasswordPageProps {
  token: string;
  onNavigate: (page: "login" | "welcome") => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ token, onNavigate }) => {
  const { resetPassword, error, clearError } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      setLocalError(err.message || "Failed to reset password. Token may have expired.");
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
          <path d="M14 26C14 20.4772 17.5817 17 22 17C26.4183 17 30 20.4772 30 26V30H14V26Z" fill="#10b981" fillOpacity="0.15" />
          <path d="M14 26C14 20.4772 17.5817 17 22 17C26.4183 17 30 20.4772 30 26M18 17V12C18 9.79086 19.7909 8 22 8C24.2091 8 26 9.79086 26 12V17" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="22" cy="23" r="2.5" fill="#047857" />
        </svg>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[#111827]">
          Reset Password
        </h2>
        <p className="text-xs text-gray-500 mt-1 leading-snug">
          Create a new strong password for your account to secure access
        </p>
      </div>

      {success ? (
        <div className="flex flex-col items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center text-xs text-emerald-800">
          <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
          <div>
            <p className="font-semibold text-sm mb-1">Password Changed!</p>
            <p className="leading-relaxed">
              Your password has been reset successfully. You can now use your new password to log in.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-semibold py-2.5 rounded-xl transition-all duration-200"
          >
            Go to Login
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

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-semibold text-gray-700" htmlFor="password">
              New Password
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

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11.5px] font-semibold text-gray-700" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
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
                Resetting password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      )}
    </div>
  );
};
