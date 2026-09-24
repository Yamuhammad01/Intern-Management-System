import React from "react";
import { Briefcase, ArrowRight, ShieldCheck, Users, GraduationCap } from "lucide-react";
import { useAuth } from "../../components/AuthContext";

interface WelcomePageProps {
  onNavigate: (page: "login" | "register" | "forgot") => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onNavigate }) => {
  const { login } = useAuth();

  const handleDemoLogin = async (role: "intern" | "supervisor" | "admin") => {
    const emailMap = {
      intern: "intern@internhub.com",
      supervisor: "supervisor@internhub.com",
      admin: "admin@internhub.com"
    };
    try {
      await login(emailMap[role], "Password123!");
    } catch (e) {
      console.error("Demo login error:", e);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Small top logo for small screens */}
      <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
          <Briefcase className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-lg tracking-tight">InternHub</span>
      </div>

      {/* Main content header */}
      <div className="text-center lg:text-left mb-8">
        {/* Custom Logo Icon */}
        <div className="hidden lg:flex justify-center lg:justify-start mb-6">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 0C34.1503 0 44 9.84974 44 22C44 34.1503 34.1503 44 22 44C9.84974 44 0 34.1503 0 22C0 9.84974 9.84974 0 22 0Z" fill="#10b981" fillOpacity="0.08"/>
            <path d="M14.5 22L29.5 22" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M22 14.5L22 29.5" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="22" cy="22" r="3.5" fill="#047857"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#111827] mb-2">
          Internship Management System
        </h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Access the secure portal to coordinate, monitor, and evaluate student internships.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3.5 mb-8">
        <button
          onClick={() => onNavigate("login")}
          className="w-full bg-[#10b981] hover:bg-[#059669] text-white text-[13.5px] font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group hover:translate-y-[-1px]"
        >
          Sign In to Your Account
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>

        <button
          onClick={() => onNavigate("register")}
          className="w-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-[#374151] text-[13.5px] font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
        >
          Create New Account
        </button>
      </div>

      {/* Quick Demo Access Dashboard Divider */}
      <div className="flex items-center gap-3 my-2 mb-6">
        <div className="h-[1px] flex-1 bg-gray-100"></div>
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Quick Demo Access</span>
        <div className="h-[1px] flex-1 bg-gray-100"></div>
      </div>

      {/* Demo Selector Panel */}
      <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-4 flex flex-col gap-3">
        <p className="text-[10.5px] text-gray-500 font-medium text-center mb-1">
          Select a role to bypass sign-in and explore the interface:
        </p>
        
        <div className="grid grid-cols-1 gap-2.5">
          {/* Intern Option */}
          <button
            onClick={() => handleDemoLogin("intern")}
            className="flex items-center justify-between p-2.5 bg-white border border-gray-200/60 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/20 text-left transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">Student Intern</p>
                <p className="text-[9.5px] text-gray-400">View tasks, attendance & evaluations</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </button>

          {/* Supervisor Option */}
          <button
            onClick={() => handleDemoLogin("supervisor")}
            className="flex items-center justify-between p-2.5 bg-white border border-gray-200/60 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/20 text-left transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">Program Supervisor</p>
                <p className="text-[9.5px] text-gray-400">Track interns, submit reviews & reports</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </button>

          {/* Admin Option */}
          <button
            onClick={() => handleDemoLogin("admin")}
            className="flex items-center justify-between p-2.5 bg-white border border-gray-200/60 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/20 text-left transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">System Administrator</p>
                <p className="text-[9.5px] text-gray-400">Approve users & manage global settings</p>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};
