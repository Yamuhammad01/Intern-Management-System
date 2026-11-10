import React from "react";
import { ArrowRight, Users, GraduationCap, ShieldCheck } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { Logo } from "../../components/brand/Logo";
import { Button } from "../../components/ui/button";

interface WelcomePageProps {
  onNavigate: (page: "login" | "register" | "forgot") => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onNavigate }) => {
  const { login } = useAuth();

  const handleDemoLogin = async (role: "intern" | "supervisor" | "admin") => {
    const emailMap = {
      intern: "intern@internhub.com",
      supervisor: "supervisor@internhub.com",
      admin: "admin@internhub.com",
    };
    try {
      await login(emailMap[role], "Password123!");
    } catch (e) {
      console.error("Demo login error:", e);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-7">
        <Logo size={42} showWordmark={true} className="mb-4" />
        <h2 className="text-xl font-bold tracking-tight text-[#183348] mt-1">
          Internship & Placement Portal
        </h2>
        <p className="text-xs text-[#607b91] mt-1.5 leading-relaxed max-w-xs">
          Secure enterprise workspace for managing internships, daily logbooks, and supervisor evaluations.
        </p>
      </div>

      {/* Main Authentication Actions */}
      <div className="flex flex-col gap-3 mb-6">
        <Button
          variant="cyan"
          size="lg"
          onClick={() => onNavigate("login")}
          className="w-full text-white font-semibold text-[13.5px] group justify-between px-5 shadow-xs"
        >
          <span>Sign In to Your Account</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => onNavigate("register")}
          className="w-full border-[#d7e4ed] hover:border-[#2eb4d6] hover:bg-[#eef8fb] text-[#244e6e] text-[13.5px] font-semibold"
        >
          Create New Intern Account
        </Button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-1 mb-5">
        <div className="h-[1px] flex-1 bg-[#e3edf3]" />
        <span className="text-[10px] uppercase font-bold text-[#819ab0] tracking-wider">
          Instant Demo Access
        </span>
        <div className="h-[1px] flex-1 bg-[#e3edf3]" />
      </div>

      {/* Demo Selector Panel */}
      <div className="bg-[#f5f9fc] border border-[#dce8f0] rounded-xl p-3.5 flex flex-col gap-2">
        <p className="text-[10.5px] text-[#638096] font-medium text-center mb-1">
          Explore role capabilities with pre-configured accounts:
        </p>

        <div className="grid grid-cols-1 gap-2">
          {/* Intern Demo */}
          <button
            onClick={() => handleDemoLogin("intern")}
            className="flex items-center justify-between p-2.5 bg-white border border-[#d8e5ee] rounded-xl hover:border-[#2eb4d6] hover:bg-[#f1fafc] text-left transition-all duration-150 group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#e2f5fa] text-[#1c647d] flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#183348]">Student Intern</p>
                <p className="text-[10px] text-[#718b9f]">Logbook, milestone tracking & grades</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#a4bccc] group-hover:text-[#2eb4d6] transition-colors" />
          </button>

          {/* Supervisor Demo */}
          <button
            onClick={() => handleDemoLogin("supervisor")}
            className="flex items-center justify-between p-2.5 bg-white border border-[#d8e5ee] rounded-xl hover:border-[#2eb4d6] hover:bg-[#f1fafc] text-left transition-all duration-150 group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#e6edf4] text-[#245277] flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#183348]">Program Supervisor</p>
                <p className="text-[10px] text-[#718b9f]">Review logs, scorecards & feedback</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#a4bccc] group-hover:text-[#2eb4d6] transition-colors" />
          </button>

          {/* Admin Demo */}
          <button
            onClick={() => handleDemoLogin("admin")}
            className="flex items-center justify-between p-2.5 bg-white border border-[#d8e5ee] rounded-xl hover:border-[#2eb4d6] hover:bg-[#f1fafc] text-left transition-all duration-150 group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#ebf3f7] text-[#1e425e] flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#183348]">System Administrator</p>
                <p className="text-[10px] text-[#718b9f]">Organizations, placements & analytics</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#a4bccc] group-hover:text-[#2eb4d6] transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};
