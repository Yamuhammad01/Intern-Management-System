import React, { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { AlertCircle, Loader2, ArrowLeft, CheckCircle2, User, Mail, Lock, GraduationCap, Eye, EyeOff } from "lucide-react";
import { LogoIcon } from "../../components/brand/Logo";
import { Button } from "../../components/ui/button";

interface RegisterPageProps {
  onNavigate: (page: "welcome" | "login" | "forgot") => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register, login, error, clearError } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const REGISTER_ROLE = "INTERN";
  const [program, setProgram] = useState("Software Engineering");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // Validations
    if (!fullName.trim()) {
      setLocalError("Full name is required");
      return;
    }
    if (!email.trim()) {
      setLocalError("Email address is required");
      return;
    }
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

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "Intern";

    setIsSubmitting(true);
    try {
      await register({
        email,
        password,
        firstName,
        lastName,
        role: REGISTER_ROLE,
        program,
      });

      setSuccess(true);
      setTimeout(async () => {
        try {
          await login(email, password);
        } catch {
          onNavigate("login");
        }
      }, 1000);
    } catch (err: any) {
      setLocalError(err.message || "Failed to create account. Email might already be registered.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Brand Icon Header */}
      <div className="flex flex-col items-center text-center mb-5">
        <div className="w-12 h-12 rounded-xl bg-[#e6f4f8] flex items-center justify-center mb-2.5 shadow-2xs">
          <LogoIcon size={30} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#183348]">
          Create Intern Account
        </h2>
        <p className="text-xs text-[#607b91] mt-1 leading-snug">
          Register to begin your internship tracking and logbook submissions
        </p>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Account created successfully! Preparing your workspace session...</span>
        </div>
      )}

      {/* Errors Display */}
      {(localError || error) && (
        <div className="mb-4 bg-red-50 border border-red-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{localError || error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="text-[11.5px] font-semibold text-[#1d3d56]" htmlFor="fullName">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-[#8aa3b5] absolute left-3.5 pointer-events-none" />
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-4 py-2 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all duration-150"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1">
          <label className="text-[11.5px] font-semibold text-[#1d3d56]" htmlFor="email">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-[#8aa3b5] absolute left-3.5 pointer-events-none" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex.morgan@email.com"
              className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-4 py-2 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all duration-150"
            />
          </div>
        </div>

        {/* Program / Discipline */}
        <div className="flex flex-col gap-1">
          <label className="text-[11.5px] font-semibold text-[#1d3d56]" htmlFor="program">
            Academic / Internship Program
          </label>
          <div className="relative flex items-center">
            <GraduationCap className="w-4 h-4 text-[#8aa3b5] absolute left-3.5 pointer-events-none" />
            <select
              id="program"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-4 py-2 text-xs text-[#183348] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all duration-150 cursor-pointer"
            >
              <option value="Software Engineering">Software Engineering</option>
              <option value="Computer Science">Computer Science & IT</option>
              <option value="Data Analytics">Data Analytics & AI</option>
              <option value="Product Design">Product & UI/UX Design</option>
              <option value="Finance & Accounting">Commerce & Accounting</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Electrical Engineering">Electrical & Electronics</option>
              <option value="Corporate Affairs">Marketing & Communications</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-[11.5px] font-semibold text-[#1d3d56]" htmlFor="password">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-[#8aa3b5] absolute left-3.5 pointer-events-none" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-10 py-2 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all duration-150"
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
        <div className="flex flex-col gap-1">
          <label className="text-[11.5px] font-semibold text-[#1d3d56]" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-4 h-4 text-[#8aa3b5] absolute left-3.5 pointer-events-none" />
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-4 py-2 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all duration-150"
            />
          </div>
        </div>

        {/* Password Hint */}
        <p className="text-[10px] text-[#718c9f] leading-tight">
          Must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special symbol (@$!%*?&amp;).
        </p>

        {/* Register Button */}
        <Button
          type="submit"
          variant="navy"
          size="lg"
          disabled={isSubmitting || success}
          className="w-full text-white text-[13.5px] font-semibold mt-1.5 shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Registering Account...
            </>
          ) : (
            "Create Intern Account"
          )}
        </Button>
      </form>

      {/* Footer Navigation */}
      <div className="flex flex-col items-center gap-2.5 mt-5 pt-4 border-t border-[#e5edf3] text-xs text-[#638096]">
        <div>
          <span>Already registered? </span>
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="font-semibold text-[#265275] hover:text-[#2eb4d6] transition-colors"
          >
            Sign In here
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
