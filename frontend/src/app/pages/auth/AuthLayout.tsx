import React from "react";
import { useAuth } from "../../components/AuthContext";
import { Logo } from "../../components/brand/Logo";
import { BRAND_CONFIG } from "../../components/brand/BrandConfig";
import { CheckCircle2, ShieldCheck, Sparkles, Building2, TrendingUp } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { isMockMode } = useAuth();

  return (
    <div
      className="min-h-screen app-min-viewport-height w-full flex bg-[#f4f7fa] text-[#183348] overflow-hidden relative"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Mock Mode Banner */}
      {isMockMode && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-amber-50/95 border border-amber-300/80 backdrop-blur-xs rounded-full px-3.5 py-1 text-[11px] font-medium text-amber-900 shadow-sm animate-pulse">
          <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0"></span>
          Running in Demo / Mock Mode (Backend Offline)
        </div>
      )}

      {/* Left Panel: Enterprise Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar-gradient text-white flex-col justify-between p-10 xl:p-14 relative overflow-hidden select-none">
        {/* Subtle Ambient Glows matching the InternPath Palette */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#2eb4d6]/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-[#52bdd5]/15 blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-[#1e425e]/40 blur-[80px] pointer-events-none" />

        {/* Translucent Fluid Shapes (inspired by reference image sidebar bottom) */}
        <div className="absolute -bottom-16 -left-16 w-80 h-80 pointer-events-none opacity-40">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#2eb4d6"
              d="M38.8,-53.4C50.2,-44.6,59.3,-33.5,63.9,-20.3C68.6,-7.1,68.7,8.2,63.8,21.9C58.8,35.6,48.8,47.8,36.2,56.5C23.5,65.3,8.2,70.6,-5.9,68.6C-20,66.5,-32.9,57,-44.6,46.1C-56.3,35.2,-66.8,22.8,-69.4,8.7C-72.1,-5.5,-66.9,-21.4,-57.4,-32.9C-47.8,-44.3,-33.9,-51.4,-20.5,-58.8C-7.1,-66.2,5.7,-74,18.4,-70.6C31.1,-67.2,27.4,-62.2,38.8,-53.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        <div className="absolute -bottom-10 left-20 w-72 h-72 pointer-events-none opacity-30">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#82d8eb"
              d="M44.7,-60.2C56.6,-52.7,64,-38.9,67.6,-24.3C71.2,-9.7,70.9,5.7,65.8,19.3C60.6,33,50.6,44.9,38.3,53.2C26,61.5,11.4,66.2,-2.7,69.9C-16.7,73.6,-30.2,76.2,-41.8,69.7C-53.4,63.2,-63.1,47.6,-68.2,31.2C-73.4,14.8,-74,-2.4,-68.9,-17.4C-63.7,-32.4,-52.8,-45.2,-40.1,-52.5C-27.4,-59.8,-13.7,-61.6,1.2,-63.2C16.1,-64.8,32.8,-67.7,44.7,-60.2Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        {/* Header Logo */}
        <div className="z-10 flex items-center justify-between">
          <Logo variant="white" size={38} />
          <span className="text-[11px] font-semibold text-[#bfeaf5] bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-xs">
            Commercial Portal
          </span>
        </div>

        {/* Center Showcase Content */}
        <div className="my-auto z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 bg-[#2eb4d6]/20 border border-[#2eb4d6]/30 text-[#d4f4fb] px-3.5 py-1.5 rounded-full text-xs font-medium mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#2eb4d6]" />
            Enterprise Internship Management
          </div>

          <h1 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight text-white mb-4">
            Transform Talent Placements into High-Impact Outcomes
          </h1>
          <p className="text-sm text-[#c8e6f3] leading-relaxed mb-8">
            A cohesive platform for host enterprises, academic supervisors, and student interns.
            Coordinate verifiable logbooks, rubric evaluations, and real-time progress.
          </p>

          {/* Metric Showcase Cards inspired by InternPath design */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-gradient-ip-navy p-4 rounded-xl border border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-[#c8e4f1]">Openings</span>
                <Building2 className="w-4 h-4 text-[#8cdcf0]" />
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">240+</p>
              <p className="text-[10.5px] text-[#b0d8ea] mt-0.5">Enterprise Roles Active</p>
            </div>

            <div className="bg-gradient-ip-teal p-4 rounded-xl border border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-white/90">Placements</span>
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">17K+</p>
              <p className="text-[10.5px] text-white/80 mt-0.5">Certified Track Record</p>
            </div>
          </div>

          {/* Feature Checklist */}
          <div className="mt-7 space-y-2.5 text-xs text-[#d1edf7]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#89dfef] shrink-0" />
              <span>Cryptographically secured attendance and logbook verifications</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#89dfef] shrink-0" />
              <span>Multi-criteria rubric evaluations with automated report generation</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 text-[11px] text-[#9ecce2] flex justify-between items-center border-t border-white/10 pt-4">
          <span>{BRAND_CONFIG.copyright}</span>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Compliance</span>
            <span className="hover:text-white cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Active Authentication Screen */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-5 sm:p-10 md:p-12 overflow-y-auto min-h-screen app-min-viewport-height">
        <div className="w-full max-w-[430px] py-6 flex flex-col justify-center animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#d8e5ee] p-7 sm:p-9 shadow-sm">
            {children}
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
