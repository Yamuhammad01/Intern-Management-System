import React, { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { AlertCircle, Loader2 } from "lucide-react";

interface RegisterPageProps {
  onNavigate: (page: "welcome" | "login" | "forgot") => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register, login, error, clearError } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Self-registration is intern-only: the role is always INTERN (not user-selectable).
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
    // Check password pattern (capital letter, number, special char)
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!passwordPattern.test(password)) {
      setLocalError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    // Split name into first and last
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "User"; // Fallback if no last name

    setIsSubmitting(true);
    try {
      // Register request
      await register({
        email,
        password,
        firstName,
        lastName,
        role: REGISTER_ROLE,
        program,
      });

      setSuccess(true);
      // Auto login after successful registration
      setTimeout(async () => {
        try {
          await login(email, password);
        } catch (loginErr) {
          onNavigate("login");
        }
      }, 1000);

    } catch (err: any) {
      setLocalError(err.message || "Failed to create account. Email might already be taken.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Logo SVG */}
      <div className="flex justify-center mb-5">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 0C34.1503 0 44 9.84974 44 22C44 34.1503 34.1503 44 22 44C9.84974 44 0 34.1503 0 22C0 9.84974 9.84974 0 22 0Z" fill="#10b981" fillOpacity="0.08"/>
          <path d="M16 22L22 16L28 22L22 28Z" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="22" cy="22" r="2" fill="#047857" />
        </svg>
      </div>

      <div className="text-center mb-5">
        <h2 className="text-xl font-bold tracking-tight text-[#111827]">
          Create Your Account
        </h2>
        <p className="text-xs text-gray-500 mt-1 leading-snug">
          Join InternHub to streamline your internship program experience
        </p>
      </div>

      {/* Success alert */}
      {success && (
        <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800 text-center font-medium animate-pulse">
          Account created successfully! Logging you in...
        </div>
      )}

      {/* Error alert */}
      {(localError || error) && !success && (
        <div className="mb-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{localError || error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-gray-700" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Sarah Johnson"
            className="w-full bg-[#f3f3f5] border-0 outline-none rounded-xl px-4 py-2.5 text-xs placeholder:text-gray-400 focus:bg-white focus:ring-1.5 focus:ring-emerald-500 transition-all duration-200"
            disabled={success}
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-gray-700" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. sarah.johnson@email.com"
            className="w-full bg-[#f3f3f5] border-0 outline-none rounded-xl px-4 py-2.5 text-xs placeholder:text-gray-400 focus:bg-white focus:ring-1.5 focus:ring-emerald-500 transition-all duration-200"
            disabled={success}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            className="w-full bg-[#f3f3f5] border-0 outline-none rounded-xl px-4 py-2.5 text-xs placeholder:text-gray-400 focus:bg-white focus:ring-1.5 focus:ring-emerald-500 transition-all duration-200"
            disabled={success}
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-gray-700" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            className="w-full bg-[#f3f3f5] border-0 outline-none rounded-xl px-4 py-2.5 text-xs placeholder:text-gray-400 focus:bg-white focus:ring-1.5 focus:ring-emerald-500 transition-all duration-200"
            disabled={success}
          />
        </div>

        {/* Internship Program — pick from the list or type your own */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-gray-700" htmlFor="program">
            Internship Program
          </label>
          <div className="relative">
            <input
              id="program"
              type="text"
              list="program-options"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="Select a program or type your own"
              autoComplete="off"
              className="w-full bg-[#f3f3f5] border-0 outline-none rounded-xl px-4 py-2.5 pr-10 text-xs text-gray-800 placeholder:text-gray-400 focus:bg-white focus:ring-1.5 focus:ring-emerald-500 transition-all duration-200"
              disabled={success}
            />
            <datalist id="program-options">
              <option value="Software Engineering" />
              <option value="Product Design" />
              <option value="Data Analytics" />
              <option value="Marketing & Communications" />
              <option value="Academic Research" />
            </datalist>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Select from the list or type your own program name. 
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || success}
          className="w-full bg-[#10b981] hover:bg-[#059669] text-white text-[13px] font-semibold py-2.5 rounded-xl transition-all duration-200 mt-2 flex items-center justify-center gap-2 hover:translate-y-[-1px] disabled:opacity-75 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        {/* Already have account */}
        <div className="text-center mt-3 text-xs text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors underline decoration-2 decoration-emerald-500/20"
          >
            Login here
          </button>
        </div>
      </form>
    </div>
  );
};
