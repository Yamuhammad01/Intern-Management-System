import React from "react";
import { Briefcase } from "lucide-react";
import { useAuth } from "../../components/AuthContext";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { isMockMode } = useAuth();

  return (
    <div className="min-h-screen w-full flex bg-white text-[#111827] overflow-hidden relative" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      
      {/* Mock Mode Banner */}
      {isMockMode && (
        <div className="absolute top-3 right-4 z-50 flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-[11px] font-medium text-amber-800 shadow-sm animate-pulse">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
          Running in Demo/Mock Mode (Backend Offline)
        </div>
      )}

      {/* Left Panel: Welcome Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f2d1e] text-white flex-col justify-between p-12 relative overflow-hidden select-none">
        
        {/* SVG Textured Background Overlay */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        {/* Abstract Green Glows for visual depth */}
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none"></div>

        {/* Header Logo */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-950/20">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">InternHub</span>
        </div>

        {/* Main Content & Illustration */}
        <div className="my-auto flex flex-col items-center text-center z-10 max-w-lg mx-auto">
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight leading-tight mb-3">
            Welcome to InternHub
          </h1>
          <p className="text-sm text-emerald-200/80 leading-relaxed mb-12">
            Manage your internship programs smarter, faster, and easier — all in one place
          </p>

          {/* Premium Interactive SVG Illustration representing the original photo concept */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Background Circle Halo */}
            <div className="absolute w-52 h-52 rounded-full border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-center animate-spin-slow">
              <div className="w-44 h-44 rounded-full border border-dashed border-emerald-400/15"></div>
            </div>
            
            {/* Interactive Illustration */}
            <svg viewBox="0 0 200 200" className="w-56 h-56 relative z-10 transition-transform duration-500 hover:scale-105">
              {/* Textured background texture map inside illustration */}
              <defs>
                <linearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
                <linearGradient id="suitGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#08150f" />
                  <stop offset="100%" stopColor="#1e3e2c" />
                </linearGradient>
              </defs>

              {/* Dotted target lines */}
              <circle cx="100" cy="80" r="48" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-30" />

              {/* Paper cutout person */}
              <g className="animate-float">
                {/* Head */}
                <circle cx="100" cy="50" r="14" fill="url(#paperGrad)" className="shadow-lg" />
                {/* Body / Arms / Legs */}
                <path d="M72 82 C72 74, 82 72, 100 72 C118 72, 128 74, 128 82 C128 86, 122 88, 118 90 L118 108 C118 116, 112 118, 112 128 L112 136 C112 138, 108 140, 106 140 C104 140, 102 137, 102 134 L102 114 L98 114 L98 134 C98 137, 96 140, 94 140 C92 140, 88 138, 88 136 L88 128 C88 118, 82 116, 82 108 L82 90 C78 88, 72 86, 72 82 Z" fill="url(#paperGrad)" />
                {/* Visual shadow under the paper figure */}
                <ellipse cx="100" cy="148" rx="28" ry="4" fill="#000" className="opacity-20 blur-[1px]" />
              </g>

              {/* Hand Pointing (representing the hand in the photo) */}
              <g className="animate-point">
                {/* Sleeve / Suit cuff */}
                <path d="M82 200 L118 200 L118 165 C118 162, 112 160, 100 160 C88 160, 82 162, 82 165 Z" fill="url(#suitGrad)" />
                {/* White shirt trim */}
                <path d="M85 162 L115 162 L115 159 L85 159 Z" fill="#ffffff" />
                {/* Hand/Finger */}
                {/* Wrist */}
                <path d="M92 160 L108 160 L108 148 L92 148 Z" fill="#fbcfe8" className="opacity-80" /> {/* Skin tone */}
                {/* Hand Palm */}
                <path d="M88 148 C88 140, 91 134, 98 134 L102 134 C109 134, 112 140, 112 148 Z" fill="#fed7aa" />
                {/* Pointing Index Finger */}
                <path d="M98 134 L98 108 C98 105, 102 105, 102 108 L102 134 Z" fill="#fed7aa" />
                {/* Folded fingers */}
                <path d="M88 140 Q94 142 94 146" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M106 142 Q102 144 102 148" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 text-[11px] text-emerald-300/50 flex justify-between items-center border-t border-white/[0.06] pt-4">
          <span>Copyright © 2025 InternHub</span>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Content Form Wrapper */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 overflow-y-auto min-h-screen">
        <div className="w-full max-w-[420px] py-8 flex flex-col justify-center animate-fade-in">
          {children}
        </div>
      </div>

      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes point {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-point {
          animation: point 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-spin-slow {
          animation: spin 30s linear infinite;
        }
      `}</style>

    </div>
  );
};
