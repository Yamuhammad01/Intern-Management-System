import React from "react";
import { Search, Bell, Settings, Menu, Shield } from "lucide-react";
import { User } from "../AuthContext";

interface AppTopbarProps {
  user: User;
  onOpenMobileMenu: () => void;
  onNavigateToSettings: () => void;
  mobileMenuButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

export const AppTopbar: React.FC<AppTopbarProps> = ({
  user,
  onOpenMobileMenu,
  onNavigateToSettings,
  mobileMenuButtonRef,
}) => {
  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleLabel = () => {
    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") return "Admin";
    if (user.role === "SUPERVISOR" || user.role === "MENTOR") return "Supervisor";
    return "Intern";
  };

  return (
    <header className="h-[64px] bg-white border-b border-[#d8e5ee] flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 shrink-0 z-10 shadow-2xs">
      {/* Left: Mobile Menu Trigger + Stylized Howdy Greeting */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          ref={mobileMenuButtonRef as any}
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open Navigation Menu"
          className="md:hidden p-2 rounded-xl text-[#265275] hover:bg-[#eef5fa] transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Stylized greeting matching reference image: Howdy! Admin */}
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="text-base sm:text-lg italic font-normal text-[#4e6f87] tracking-tight">
            Howdy!
          </span>
          <span className="text-base sm:text-lg font-bold text-[#183348] tracking-tight truncate">
            {user.firstName || getRoleLabel()}
          </span>
        </div>
      </div>

      {/* Middle: Pill Search Input (matching the reference image) */}
      <div className="flex-1 max-w-md hidden md:block">
        <label className="flex items-center gap-2.5 bg-white border border-[#d8e5ee] rounded-full px-4 py-2 shadow-xs hover:border-[#2eb4d6] focus-within:border-[#2eb4d6] focus-within:ring-2 focus-within:ring-[#2eb4d6]/20 transition-all cursor-text">
          <Search className="w-4 h-4 text-[#2eb4d6] shrink-0" />
          <input
            type="text"
            placeholder="Search JOBS, records, interns..."
            aria-label="Search platform records"
            className="bg-transparent text-xs text-[#183348] placeholder:text-[#8ea5b6] placeholder:italic outline-none w-full"
          />
        </label>
      </div>

      {/* Right Controls: Notifications, Cyan Gear Icon, Profile Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2.5 rounded-full hover:bg-[#f1f6fa] text-[#4d6d84] transition-colors shrink-0 cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#dc2626] rounded-full ring-2 ring-white" />
        </button>

        {/* Quick Settings Gear Icon (Radiant Cyan matching reference image!) */}
        <button
          type="button"
          onClick={onNavigateToSettings}
          aria-label="System Settings"
          title="Account & System Settings"
          className="p-2.5 rounded-full bg-[#e3f5fa] hover:bg-[#d0eef7] text-[#2eb4d6] hover:text-[#209bb9] transition-all shrink-0 cursor-pointer shadow-2xs hover:rotate-45"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile Avatar Pill */}
        <button
          type="button"
          onClick={onNavigateToSettings}
          aria-label="User Account"
          className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 rounded-full border border-transparent hover:border-[#d8e5ee] hover:bg-[#f6f9fc] transition-all cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-ip-teal text-white flex items-center justify-center text-xs font-bold shadow-xs">
            {getInitials()}
          </div>
          <div className="hidden lg:flex flex-col text-left leading-none">
            <span className="text-xs font-bold text-[#183348]">
              {user.firstName} {user.lastName.charAt(0)}.
            </span>
            <span className="text-[10px] text-[#607b91] mt-0.5 font-medium">
              {getRoleLabel()}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
