import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  TrendingUp,
  MessageSquare,
  BarChart2,
  Building2,
  MapPin,
  ClipboardCheck,
  Settings,
  LogOut,
  ChevronDown,
  UserCircle,
  X,
  LucideIcon,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Logo } from "../brand/Logo";
import { BRAND_CONFIG } from "../brand/BrandConfig";
import { User } from "../AuthContext";

export interface NavItemConfig {
  icon: LucideIcon;
  label: string;
}

export interface NavSection {
  title: string;
  items: NavItemConfig[];
}

interface AppSidebarProps {
  user: User;
  activeTab: string;
  onNavClick: (label: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  mobileRef?: React.RefObject<HTMLElement | null>;
  mobileCloseRef?: React.RefObject<HTMLButtonElement | null>;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  user,
  activeTab,
  onNavClick,
  onLogout,
  isOpen,
  onClose,
  mobileRef,
  mobileCloseRef,
}) => {
  // Collapsible section state for sidebar categories
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionTitle: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  // Structured navigation with sections inspired by InternPath
  const getNavSections = (): NavSection[] => {
    switch (user.role) {
      case "INTERN":
        return [
          {
            title: "Overview",
            items: [{ icon: LayoutDashboard, label: "Dashboard" }],
          },
          {
            title: "Workflows",
            items: [
              { icon: ClipboardList, label: "Logbook" },
              { icon: TrendingUp, label: "My Evaluations" },
            ],
          },
          {
            title: "Account",
            items: [
              { icon: UserCircle, label: "Intern Profile" },
              { icon: Settings, label: "Settings" },
            ],
          },
        ];

      case "SUPERVISOR":
      case "MENTOR":
        return [
          {
            title: "Overview",
            items: [{ icon: LayoutDashboard, label: "Dashboard" }],
          },
          {
            title: "Management",
            items: [
              { icon: Users, label: "Supervise" },
              { icon: ClipboardList, label: "Review Logs" },
              { icon: MessageSquare, label: "Feedback" },
              { icon: ClipboardCheck, label: "Evaluations" },
            ],
          },
          {
            title: "Documents",
            items: [
              { icon: BarChart2, label: "Reports" },
              { icon: Settings, label: "Settings" },
            ],
          },
        ];

      case "ADMIN":
      case "SUPER_ADMIN":
      default:
        return [
          {
            title: "Overview",
            items: [{ icon: LayoutDashboard, label: "Dashboard" }],
          },
          {
            title: "Management",
            items: [
              { icon: Building2, label: "Organizations" },
              { icon: MapPin, label: "Placements" },
              { icon: BarChart2, label: "Reports" },
            ],
          },
          {
            title: "Documents",
            items: [
              { icon: ClipboardCheck, label: "Evaluations" },
              { icon: Settings, label: "Settings" },
            ],
          },
        ];
    }
  };

  const navSections = getNavSections();

  const renderNavContent = (isMobile = false) => (
    <div className="flex flex-col h-full justify-between relative z-10">
      {/* Top Brand Block */}
      <div className="px-5 pt-6 pb-5 flex items-center justify-between border-b border-white/10 select-none">
        <Logo variant="white" size={30} showWordmark={true} />
        {isMobile && (
          <button
            ref={mobileCloseRef as any}
            onClick={onClose}
            aria-label="Close navigation drawer"
            className="p-1.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 scrollbar-thin">
        {navSections.map((section) => {
          const isCollapsed = collapsedSections[section.title];
          return (
            <div key={section.title} className="space-y-1.5">
              {/* Category Header */}
              {section.title !== "Overview" && (
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-1 text-[11.5px] italic font-semibold text-[#b3e1f0] hover:text-white transition-colors cursor-pointer select-none"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#b3e1f0] transition-transform duration-200 ${
                      isCollapsed ? "-rotate-90" : "rotate-0"
                    }`}
                  />
                </button>
              )}

              {/* Category Nav Items */}
              {!isCollapsed && (
                <div className="space-y-1">
                  {section.items.map(({ icon: Icon, label }) => {
                    const isActive = activeTab === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          onNavClick(label);
                          if (isMobile) onClose();
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-150 text-left cursor-pointer ${
                          isActive
                            ? "bg-white text-[#205c80] font-bold shadow-md shadow-[#18394e]/20"
                            : "text-[#d8eff7] hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? "text-[#205c80]" : "text-[#a5d8eb]"
                          }`}
                        />
                        <span className="truncate">{label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fluid Bottom Shapes matching the InternPath reference image */}
      <div className="relative pt-6 px-4 pb-4 border-t border-white/10 select-none overflow-hidden">
        {/* Vector Blobs in Cyan / Teal overlaying bottom */}
        <div className="absolute -bottom-10 -left-10 w-44 h-44 pointer-events-none opacity-30">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#2eb4d6"
              d="M41.7,-58.9C53.7,-52.3,63,-40.4,67.6,-26.8C72.2,-13.2,72,2.2,67.3,16.4C62.6,30.6,53.4,43.6,41.4,52.9C29.4,62.2,14.7,67.8,-0.9,69.1C-16.5,70.3,-33.1,67.2,-45.3,58C-57.5,48.8,-65.4,33.5,-69.1,17.2C-72.9,0.9,-72.6,-16.4,-65.5,-29.9C-58.4,-43.4,-44.6,-53.1,-30.7,-58.8C-16.9,-64.5,-2.9,-66.2,10.6,-64.6C24.1,-63.1,29.7,-65.5,41.7,-58.9Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        <div className="absolute -bottom-6 right-2 w-32 h-32 pointer-events-none opacity-25">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#82d8eb"
              d="M38.8,-53.4C50.2,-44.6,59.3,-33.5,63.9,-20.3C68.6,-7.1,68.7,8.2,63.8,21.9C58.8,35.6,48.8,47.8,36.2,56.5C23.5,65.3,8.2,70.6,-5.9,68.6C-20,66.5,-32.9,57,-44.6,46.1C-56.3,35.2,-66.8,22.8,-69.4,8.7C-72.1,-5.5,-66.9,-21.4,-57.4,-32.9C-47.8,-44.3,-33.9,-51.4,-20.5,-58.8C-7.1,-66.2,5.7,-74,18.4,-70.6C31.1,-67.2,27.4,-62.2,38.8,-53.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        {/* Client Edition Tag */}
        <div className="relative z-10 mb-3 bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Sparkles className="w-3 h-3 text-[#7fe0f4]" />
            <span className="text-[10.5px] font-semibold text-white">{BRAND_CONFIG.name}</span>
          </div>
          <p className="text-[9.5px] text-[#bde7f5] leading-snug">
            {BRAND_CONFIG.edition} v{BRAND_CONFIG.version}
          </p>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={() => {
            onLogout();
            if (isMobile) onClose();
          }}
          className="relative z-10 w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#b8e6f4] hover:bg-white/10 hover:text-white transition-colors text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-[#89d6ec] shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Rail (in-flow, 220px) ── */}
      <aside className="hidden md:flex w-[220px] shrink-0 flex-col bg-sidebar-gradient text-white overflow-hidden z-20 shadow-lg relative">
        {renderNavContent(false)}
      </aside>

      {/* ── Mobile Drawer (< 768px) ── */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Main Navigation Drawer"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <aside
            id="mobile-sidebar"
            ref={mobileRef as any}
            className="absolute inset-y-0 left-0 w-[270px] max-w-[85vw] flex flex-col bg-sidebar-gradient text-white overflow-hidden overscroll-contain shadow-2xl animate-drawer-in"
          >
            {renderNavContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
