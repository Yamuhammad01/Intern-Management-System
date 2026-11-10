import React, { useState, useEffect, useRef } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";
import { User } from "../AuthContext";
import { Toaster } from "../ui/sonner";

interface AppLayoutProps {
  user: User;
  activeTab: string;
  onNavClick: (label: string) => void;
  onLogout: () => void;
  onNavigateToSettings: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  user,
  activeTab,
  onNavClick,
  onLogout,
  onNavigateToSettings,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mobileSidebarRef = useRef<HTMLElement | null>(null);
  const mobileCloseRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => {
    setSidebarOpen(false);
    mobileMenuButtonRef.current?.focus();
  };

  // Accessible Drawer: Close on Escape, Trap Tab Focus
  useEffect(() => {
    if (!sidebarOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
        mobileMenuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !mobileSidebarRef.current) return;

      const focusable = mobileSidebarRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const insideDrawer = active ? mobileSidebarRef.current.contains(active) : false;

      if (event.shiftKey && (active === first || !insideDrawer)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    mobileCloseRef.current?.focus();

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  // Discard mobile drawer if resized to desktop breakpoint
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setSidebarOpen(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return (
    <div
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      className="flex app-viewport-height w-full overflow-hidden bg-[#f4f7fa] text-[#183348] text-sm select-none"
    >
      <Toaster />

      {/* Sidebar Rail / Mobile Drawer */}
      <AppSidebar
        user={user}
        activeTab={activeTab}
        onNavClick={onNavClick}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        mobileRef={mobileSidebarRef}
        mobileCloseRef={mobileCloseRef}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <AppTopbar
          user={user}
          onOpenMobileMenu={openSidebar}
          onNavigateToSettings={onNavigateToSettings}
          mobileMenuButtonRef={mobileMenuButtonRef}
        />

        {/* Scrollable Main Workspace Canvas */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-7 relative bg-[#f4f7fa]">
          {children}
        </main>
      </div>
    </div>
  );
};
