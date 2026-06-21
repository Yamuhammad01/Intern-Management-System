import React, { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export const ChangePasswordPage: React.FC = () => {
  const { changePassword, error, clearError } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    <div className="bg-white rounded-xl border border-black/[0.07] p-5 shadow-sm max-w-md">
      <div className="mb-4">
        <h3 className="text-[13.5px] font-semibold text-gray-800">Security & Password</h3>
        <p className="text-[11px] text-gray-400">Update your account password regularly to keep your credentials secure.</p>
      </div>

      {success && (
        <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-800">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>Your password has been changed successfully.</span>
        </div>
      )}

      {(localError || error) && (
        <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{localError || error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-gray-600" htmlFor="currentPassword">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              setSuccess(false);
            }}
            placeholder="Enter current password"
            className="w-full bg-[#f3f3f5] border-0 outline-none rounded-xl px-4 py-2.5 text-xs placeholder:text-gray-400 focus:bg-white focus:ring-1.5 focus:ring-emerald-500 transition-all duration-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-gray-600" htmlFor="newPassword">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setSuccess(false);
            }}
            placeholder="Enter new password"
            className="w-full bg-[#f3f3f5] border-0 outline-none rounded-xl px-4 py-2.5 text-xs placeholder:text-gray-400 focus:bg-white focus:ring-1.5 focus:ring-emerald-500 transition-all duration-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-gray-600" htmlFor="confirmNewPassword">
            Confirm New Password
          </label>
          <input
            id="confirmNewPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setSuccess(false);
            }}
            placeholder="Confirm new password"
            className="w-full bg-[#f3f3f5] border-0 outline-none rounded-xl px-4 py-2.5 text-xs placeholder:text-gray-400 focus:bg-white focus:ring-1.5 focus:ring-emerald-500 transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#10b981] hover:bg-[#059669] text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 mt-2 flex items-center justify-center gap-2 self-start hover:translate-y-[-1px] disabled:opacity-75"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Updating...
            </>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
  );
};
