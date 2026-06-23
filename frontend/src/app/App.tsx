import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ClipboardList,
  TrendingUp,
  MessageSquare,
  BookOpen,
  BarChart2,
  Briefcase,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Star,
  Zap,
  LogOut,
  User,
  GraduationCap,
  Lock,
  Phone,
  Mail,
  Loader2,
  UserCircle,
  Building2,
  MapPin,
  ClipboardCheck
} from "lucide-react";

import { AuthProvider, useAuth } from "./components/AuthContext";
import { AuthLayout } from "./pages/auth/AuthLayout";
import { WelcomePage } from "./pages/auth/WelcomePage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
import { ChangePasswordPage } from "./pages/auth/ChangePasswordPage";

// Dashboard Views
import { InternDashboard } from "./pages/dashboards/InternDashboard";
import { AdminDashboard } from "./pages/dashboards/AdminDashboard";

// Organization & Placement
import { OrganizationDashboard } from "./pages/organizations/OrganizationDashboard";
// import { OrganizationForm } from "./pages/organizations/OrganizationForm";
import { PlacementDashboard } from "./pages/organizations/PlacementDashboard";

// Profile
import { ProfileProvider } from "./pages/profile/ProfileContext";
import { ProfileDashboard } from "./pages/profile/ProfileDashboard";

// Logbook
import { LogDashboard } from "./pages/logbook/LogDashboard";
import { CreateLogPage } from "./pages/logbook/CreateLogPage";
import { EditLogPage } from "./pages/logbook/EditLogPage";
import { LogHistoryPage } from "./pages/logbook/LogHistoryPage";
import { LogDetailPage } from "./pages/logbook/LogDetailPage";

// Supervisor
import { SupervisorDashboard as SupervisorDashboardPage } from "./pages/supervisor/SupervisorDashboard";
import { InternListPage } from "./pages/supervisor/InternListPage";
import { SubmittedLogsPage } from "./pages/supervisor/SubmittedLogsPage";
import { LogReviewPage } from "./pages/supervisor/LogReviewPage";
import { FeedbackHistoryPage } from "./pages/supervisor/FeedbackHistoryPage";
import { InternProgressPage } from "./pages/supervisor/InternProgressPage";

// Evaluations
import {
  EvaluationDashboardPage,
  EvaluationFormPage,
  EvaluationSummaryPage,
  EvaluationReportPage,
} from "./pages/evaluations/index";

// Auth Guards
import { ProtectedRoute } from "./components/ProtectedRoute";

// ─── Main Application Container ───
export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppContent />
      </ProfileProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [authScreen, setAuthScreen] = useState<"welcome" | "login" | "register" | "forgot" | "reset">("welcome");
  const [resetToken, setResetToken] = useState<string>("");
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [subScreen, setSubScreen] = useState<string | null>(null);
  const [subParams, setSubParams] = useState<any>({});
  
  // Handle logbook sub-navigation
  const handleLogbookNavigate = (tab: string, params?: any) => {
    if (tab === "Logbook") {
      setSubScreen(null);
      setSubParams({});
    } else if (tab === "Create Log") {
      setSubScreen("create");
      setSubParams({ type: params?.type || "DAILY" });
    } else if (tab === "Edit Log") {
      setSubScreen("edit");
      setSubParams({ logId: params?.logId });
    } else if (tab === "Log History") {
      setSubScreen("history");
      setSubParams({});
    } else if (tab === "Log Detail") {
      setSubScreen("detail");
      setSubParams({ logId: params?.logId });
    }
  };

    // Handle supervisor sub-navigation
    const handleSupervisorNavigate = (tab: string, params?: any) => {
      if (tab === "Dashboard") {
        setSubScreen("supervisor-dashboard");
        setSubParams({});
      } else if (tab === "Supervise") {
        setSubScreen("supervisor-interns");
        setSubParams({});
      } else if (tab === "Review Logs") {
        setSubScreen("supervisor-submitted");
        setSubParams({});
      } else if (tab === "Log Review") {
        setSubScreen("supervisor-review");
        setSubParams({ logId: params?.logId, internId: params?.internId });
      } else if (tab === "Feedback") {
        setSubScreen("supervisor-feedback");
        setSubParams({});
      } else if (tab === "Intern Progress") {
        setSubScreen("supervisor-progress");
        setSubParams({ internId: params?.internId });
      } else if (tab === "Evaluations") {
        setSubScreen("evaluations-form");
        setSubParams({});
      } else if (tab === "New Evaluation") {
        setSubScreen("evaluations-form");
        setSubParams({});
      }
    };

  const handleEvaluationNavigate = (view: string, params?: any) => {
    setSubScreen(`evaluations-${view}`);
    setSubParams(params || {});
  };

  // Reset sub-screen when changing tabs
  const handleTabChange = (label: string) => {
    setActiveTab(label);
    setSubScreen(null);
    setSubParams({});
  };
  
  // Custom activities state for real-time supervisor updates
  const [activities, setActivities] = useState([
    { ini: "AC", bg: "bg-emerald-500", name: "Aria Chen", text: "submitted the UI wireframes deliverable", time: "16 Jun 2026 · 10:40 AM" },
    { ini: "DP", bg: "bg-blue-600", name: "Mentor: D. Park", text: "left performance feedback for Liam Torres", time: "16 Jun 2026 · 09:30 AM" },
    { ini: "SY", bg: "bg-gray-400", name: "System", text: "Evaluation reminder sent to all supervisors for Q2", time: "15 Jun 2026 · 08:00 AM" },
  ]);

  const handleAddActivity = (newAct: any) => {
    setActivities(prev => [newAct, ...prev]);
  };

  // Listen for reset token in URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setResetToken(token);
      setAuthScreen("reset");
    }
  }, []);

  // Sync state with welcome screen helper
  const handleSetResetToken = (token: string) => {
    setResetToken(token);
    // In mock mode, we transition to reset screen immediately
    setAuthScreen("reset");
  };

  // Full screen loading indicator
  if (loading) {
    return (
      <div className="h-screen w-full bg-[#0f2d1e] flex flex-col items-center justify-center text-white gap-4 relative select-none">
        <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg animate-pulse">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          Securing authentication tunnel...
        </div>
      </div>
    );
  }

  // Render Authentication pages if user is not logged in
  if (!user) {
    return (
      <AuthLayout>
        {authScreen === "welcome" && <WelcomePage onNavigate={setAuthScreen} />}
        {authScreen === "login" && <LoginPage onNavigate={setAuthScreen} />}
        {authScreen === "register" && <RegisterPage onNavigate={setAuthScreen} />}
        {authScreen === "forgot" && <ForgotPasswordPage onNavigate={setAuthScreen} onSetResetToken={handleSetResetToken} />}
        {authScreen === "reset" && <ResetPasswordPage token={resetToken} onNavigate={setAuthScreen} />}
      </AuthLayout>
    );
  }

  // Determine Navigation items by user Role
  const getNavItems = () => {
    switch (user.role) {
      case "INTERN":
        return [
          { icon: LayoutDashboard, label: "Dashboard" },
          { icon: ClipboardList, label: "Logbook" },
          { icon: UserCircle, label: "Intern Profile" },
          { icon: CalendarCheck, label: "My Attendance" },
          { icon: Star, label: "Mentor Feedback" },
          { icon: Settings, label: "Settings" }
        ];
      case "SUPERVISOR":
      case "MENTOR":
        return [
          { icon: LayoutDashboard, label: "Dashboard" },
          { icon: Users, label: "Supervise" },
          { icon: ClipboardList, label: "Review Logs" },
          { icon: MessageSquare, label: "Feedback" },
          { icon: ClipboardCheck, label: "Evaluations" },
          { icon: Settings, label: "Settings" }
        ];
      case "ADMIN":
      case "SUPER_ADMIN":
      default:
        return [
          { icon: LayoutDashboard, label: "Dashboard" },
          { icon: Users, label: "Interns" },
          { icon: CalendarCheck, label: "Attendance" },
          { icon: ClipboardList, label: "Tasks & Deliverables" },
          { icon: TrendingUp, label: "Performance Tracking" },
          { icon: MessageSquare, label: "Mentor Feedback" },
          { icon: BookOpen, label: "Learning Milestones" },
          { icon: BarChart2, label: "Reports" },
          { icon: Briefcase, label: "Internship Programs" },
          { icon: Building2, label: "Organizations" },
          { icon: MapPin, label: "Placements" },
          { icon: ClipboardCheck, label: "Evaluations" },
          { icon: Settings, label: "Settings" }
        ];
    }
  };

  const navItems = getNavItems();

  // Get user avatar initials
  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  // Get human readable role name
  const getRoleLabel = () => {
    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") return "Administrator";
    if (user.role === "SUPERVISOR" || user.role === "MENTOR") return "Supervisor";
    return "Student Intern";
  };

  // Handle active navigation content render
  const renderMainContent = () => {
    if (activeTab === "Intern Profile") {
      return (
        <ProtectedRoute allowedRoles={["INTERN", "SUPER_ADMIN", "ADMIN"]}>
          <ProfileDashboard />
        </ProtectedRoute>
      );
    }
    
    if (activeTab === "Settings") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* User profile card */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-black/[0.07] p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-[13.5px] font-semibold text-gray-800">My Profile</h3>
              <p className="text-[11px] text-gray-400">View your registration details and program track.</p>
            </div>
            
            <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
              <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white text-lg font-bold">
                {getInitials()}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500 font-medium">{getRoleLabel()}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Email Address</p>
                  <p className="font-medium text-gray-700">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">Phone Number</p>
                  <p className="font-medium text-gray-700">{user.phone || "Not provided"}</p>
                </div>
              </div>
              {user.role === "INTERN" && user.program && (
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Internship Program</p>
                    <p className="font-medium text-gray-700">{user.program}</p>
                  </div>
                </div>
              )}
              {user.role !== "INTERN" && user.department && (
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">Associated Department</p>
                    <p className="font-medium text-gray-700">{user.department}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Change password security form */}
          <div className="lg:col-span-6">
            <ChangePasswordPage />
          </div>
        </div>
      );
    }

    // Organization & Placements
    if (activeTab === "Organizations") {
      return (
        <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
          <OrganizationDashboard />
        </ProtectedRoute>
      );
    }

    if (activeTab === "Placements") {
      return (
        <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
          <PlacementDashboard />
        </ProtectedRoute>
      );
    }

    // Logbook module
    if (activeTab === "Logbook") {
      return (
        <ProtectedRoute allowedRoles={["INTERN"]}>
          {subScreen === null && <LogDashboard onNavigate={handleLogbookNavigate} />}
          {subScreen === "create" && <CreateLogPage onNavigate={handleLogbookNavigate} preselectedType={subParams.type} />}
          {subScreen === "edit" && <EditLogPage onNavigate={handleLogbookNavigate} logId={subParams.logId} />}
          {subScreen === "history" && <LogHistoryPage onNavigate={handleLogbookNavigate} />}
          {subScreen === "detail" && <LogDetailPage onNavigate={handleLogbookNavigate} logId={subParams.logId} />}
        </ProtectedRoute>
      );
    }

    // Supervisor / Mentor screens
    if (user.role === "SUPERVISOR") {
      return (
        <ProtectedRoute allowedRoles={["SUPERVISOR"]}>
          {subScreen === "supervisor-dashboard" && <SupervisorDashboardPage onNavigate={handleSupervisorNavigate} />}
          {subScreen === "supervisor-interns" && <InternListPage onNavigate={handleSupervisorNavigate} />}
          {subScreen === "supervisor-submitted" && <SubmittedLogsPage onNavigate={handleSupervisorNavigate} />}
          {subScreen === "supervisor-review" && <LogReviewPage onNavigate={handleSupervisorNavigate} logId={subParams.logId} internId={subParams.internId} />}
          {subScreen === "supervisor-feedback" && <FeedbackHistoryPage onNavigate={handleSupervisorNavigate} />}
          {subScreen === "supervisor-progress" && <InternProgressPage onNavigate={handleSupervisorNavigate} internId={subParams.internId} />}

          {subScreen === "evaluations-form" && <EvaluationFormPage onNavigate={handleSupervisorNavigate} />}
          {subScreen === "evaluations-summary" && <EvaluationSummaryPage onNavigate={handleSupervisorNavigate} />}
          {subScreen === "evaluations-report" && <EvaluationReportPage onNavigate={handleSupervisorNavigate} />}
          {subScreen === null && <SupervisorDashboardPage onNavigate={handleSupervisorNavigate} />}
        </ProtectedRoute>
      );
    }

    // Admin evaluation screens
    if ((user.role === "ADMIN") && activeTab === "Evaluations") {
      return (
        <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
          {subScreen === "evaluations-dashboard" && <EvaluationDashboardPage onNavigate={handleEvaluationNavigate} />}
          {subScreen === "evaluations-summary" && <EvaluationSummaryPage onNavigate={handleEvaluationNavigate} />}
          {subScreen === "evaluations-report" && <EvaluationReportPage onNavigate={handleEvaluationNavigate} />}
          {subScreen === null && <EvaluationDashboardPage onNavigate={handleEvaluationNavigate} />}
        </ProtectedRoute>
      );
    }

    // Default dashboard views
    if (user.role === "INTERN") {
      return <InternDashboard user={user} />;
    }
    return <AdminDashboard user={user} activities={activities} onAddActivity={handleAddActivity} />;
  };

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }} className="flex h-screen w-full overflow-hidden bg-[#f4f6f8] text-[#111827] text-sm select-none">
      
      {/* ── Sidebar ── */}
      <aside className="w-[200px] shrink-0 flex flex-col bg-[#0f2d1e] text-[#d1fae5] overflow-y-auto z-10 shadow-lg">
        {/* Logo */}
        <div className="px-4 pt-5 pb-4 flex items-center gap-2 border-b border-white/[0.06] select-none">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md">
            <Briefcase className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">InternHub</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5">
          {navItems.map(({ icon: Icon, label }) => {
            const isSupervisorNav = user && (user.role === "SUPERVISOR" || user.role === "MENTOR") && ["Supervise", "Review Logs", "Feedback", "Evaluations"].includes(label);
            const isAdminEvaluationNav = user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN") && label === "Evaluations";
            return (
              <button
                key={label}
                onClick={() => {
                  if (isSupervisorNav) {
                    handleSupervisorNavigate(label);
                  } else if (isAdminEvaluationNav) {
                    setActiveTab("Evaluations");
                    setSubScreen("evaluations-dashboard");
                    setSubParams({});
                  } else {
                    handleTabChange(label);
                  }
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[12.5px] font-medium transition-colors text-left ${
                  activeTab === label
                    ? "bg-[#10b981] text-white shadow-sm"
                    : "text-[#a7f3d0] hover:bg-white/[0.07] hover:text-white"
                }`}
            >
              <Icon className="w-[15px] h-[15px] shrink-0" />
              {label}
            </button>
            );
          })}
        </nav>

        {/* Promo card */}
        <div className="mx-2.5 mb-2 rounded-xl bg-emerald-950/60 p-3 border border-emerald-800/20">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="w-3 h-3 text-emerald-300" />
            <p className="text-[11px] font-semibold text-emerald-200">University Portal</p>
          </div>
          <p className="text-[10px] text-emerald-300/60 leading-snug mb-2">
            Access secure grading modules and download internship reports.
          </p>
        </div>

        {/* Log Out button in sidebar */}
        <div className="p-2.5 border-t border-white/[0.06] mb-1">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[12.5px] font-medium text-emerald-300 hover:bg-red-950/20 hover:text-red-300 transition-colors text-left"
          >
            <LogOut className="w-[15px] h-[15px] shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Topbar */}
        <header className="h-[56px] bg-white border-b border-black/[0.07] flex items-center justify-between px-6 shrink-0 z-10 shadow-xs">
          <div>
            <p className="text-[10.5px] text-gray-400">Authenticated Portal</p>
            <p className="text-[14.5px] font-semibold text-[#111827] leading-tight">Welcome, {user.firstName}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 cursor-text">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input className="bg-transparent text-xs outline-none w-32 md:w-40 placeholder:text-gray-400" placeholder="Search resources..." />
            </label>
            
            <button className="relative p-1.5 rounded-lg hover:bg-gray-100 shrink-0">
              <Bell className="w-4 h-4 text-gray-500" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            </button>

            {/* Profile badge */}
            <div 
              onClick={() => setActiveTab("Settings")}
              className="flex items-center gap-2 cursor-pointer border border-transparent hover:border-gray-100 rounded-lg p-1.5 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                {getInitials()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold leading-none">{user.firstName} {user.lastName.charAt(0)}.</p>
                <p className="text-[9.5px] text-gray-400 mt-0.5">{getRoleLabel()}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400 hidden md:block" />
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-5 relative bg-[#f4f6f8]">
          {["Dashboard", "Settings", "Intern Profile", "Organizations", "Placements", "Logbook"].includes(activeTab) ? (
            renderMainContent()
          ) : (
            /* Tab Placeholder view */
            <div className="bg-white rounded-xl border border-black/[0.07] p-8 shadow-sm flex flex-col items-center justify-center text-center gap-4 max-w-md mx-auto my-12 animate-fade-in">
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Module Integrated</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  The <b>{activeTab}</b> features are active. In this release, all core metrics, databases, and evaluations are fully displayed and editable directly on the main <b>Dashboard</b> tab for convenience.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("Dashboard")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
