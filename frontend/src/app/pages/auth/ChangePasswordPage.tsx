import React, { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { AlertCircle, CheckCircle2, Loader2, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "../../components/ui/button";

export const ChangePasswordPage: React.FC = () => {
  const { changePassword, error, clearError } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!currentPassword) {
      setLocalError("Current password is required");
      return;
    }
    if (!newPassword) {
      setLocalError("New password is required");
      return;
    }
    if (newPassword.length < 8) {
      setLocalError("New password must be at least 8 characters");
      return;
    }
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!passwordPattern.test(newPassword)) {
      setLocalError("New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      return;
    }
    if (newPassword !== confirmPassword) {
      setLocalError("New passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setLocalError(err.message || "Failed to change password. Please check your current password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#d8e5ee] p-6 shadow-xs max-w-xl">
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="w-8 h-8 rounded-lg bg-[#e6f4f8] text-[#1c647e] flex items-center justify-center font-bold">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#183348]">Security & Credentials</h3>
          <p className="text-[11px] text-[#607b91]">Update your account password regularly to protect your session</p>
        </div>
      </div>

      <div className="my-4 h-[1px] bg-[#eef3f7]" />

      {success && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-800 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Your password has been changed successfully.</span>
        </div>
      )}

      {(localError || error) && (
        <div className="mb-4 bg-red-50 border border-red-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{localError || error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Current Password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#1d3d56]" htmlFor="currentPassword">
            Current Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-[#8aa3b5] absolute left-3.5 pointer-events-none" />
            <input
              id="currentPassword"
              type={showPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all duration-150"
            />
          </div>
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#1d3d56]" htmlFor="newPassword">
            New Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-[#8aa3b5] absolute left-3.5 pointer-events-none" />
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
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

        {/* Confirm New Password */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-[#1d3d56]" htmlFor="confirmNewPassword">
            Confirm New Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-[#8aa3b5] absolute left-3.5 pointer-events-none" />
            <input
              id="confirmNewPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all duration-150"
            />
          </div>
        </div>

        <p className="text-[10px] text-[#718c9f] leading-tight">
          Password must be at least 8 characters and include uppercase, lowercase, numeric, and special symbols.
        </p>

        <Button
          type="submit"
          variant="navy"
          disabled={isSubmitting}
          className="w-full sm:w-auto self-start mt-2 px-6 text-white text-xs font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving Password...
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </div>
  );
};
