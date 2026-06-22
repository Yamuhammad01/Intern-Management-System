import { useState, useEffect } from "react";
import {
  ClipboardList,
  Plus,
  Clock,
  CalendarCheck,
  TrendingUp,
  CheckCircle2,
  XCircle,
  FileText,
  BookOpen,
  ChevronRight,
  Loader2,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface LogEntry {
  id: string;
  entryType: "DAILY" | "WEEKLY";
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  logDate: string;
  activity: string;
  skills: string | null;
  hoursWorked: number | null;
  notes: string | null;
  createdAt: string;
}

interface DashboardStats {
  totalLogs: number;
  draftLogs: number;
  submittedLogs: number;
  approvedLogs: number;
  rejectedLogs: number;
  dailyLogs: number;
  weeklyLogs: number;
  thisWeekHours: number;
  thisMonthHours: number;
  recentEntries: LogEntry[];
}

interface LogDashboardProps {
  onNavigate: (tab: string, params?: any) => void;
}

export function LogDashboard({ onNavigate }: LogDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/logbook/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch stats");

      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <FileText className="w-3.5 h-3.5 text-gray-500" />;
      case "SUBMITTED":
        return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case "APPROVED":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case "REJECTED":
        return <XCircle className="w-3.5 h-3.5 text-red-500" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "SUBMITTED":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "APPROVED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Activity Logbook</h1>
            <p className="text-[11px] text-gray-500">Track your daily and weekly internship activities</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate("Create Log")}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          New Log Entry
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <ClipboardList className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.totalLogs || 0}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Total Logs</p>
        </div>

        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.submittedLogs || 0}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Pending Review</p>
        </div>

        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.approvedLogs || 0}</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Approved</p>
        </div>

        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.thisWeekHours || 0}h</p>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">This Week</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-black/[0.07] p-3 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 font-medium uppercase">Daily Logs</p>
            <p className="text-lg font-bold text-gray-800">{stats?.dailyLogs || 0}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/[0.07] p-3 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 font-medium uppercase">Weekly Logs</p>
            <p className="text-lg font-bold text-gray-800">{stats?.weeklyLogs || 0}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/[0.07] p-3 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 font-medium uppercase">Draft</p>
            <p className="text-lg font-bold text-gray-800">{stats?.draftLogs || 0}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/[0.07] p-3 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 font-medium uppercase">This Month</p>
            <p className="text-lg font-bold text-gray-800">{stats?.thisMonthHours || 0}h</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigate("Create Log", { type: "DAILY" })}
          className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-200 transition-colors">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Daily Activity Log</p>
              <p className="text-[10px] text-gray-500">Record today's activities and achievements</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </div>
        </button>

        <button
          onClick={() => onNavigate("Create Log", { type: "WEEKLY" })}
          className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Weekly Summary Log</p>
              <p className="text-[10px] text-gray-500">Summarize your week's learning and progress</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 transition-colors" />
          </div>
        </button>

        <button
          onClick={() => onNavigate("Log History")}
          className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-200 transition-colors">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">View Log History</p>
              <p className="text-[10px] text-gray-500">Browse all your submitted and draft logs</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 transition-colors" />
          </div>
        </button>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Recent Entries</h3>
          <button
            onClick={() => onNavigate("Log History")}
            className="text-[11px] text-emerald-600 hover:underline font-medium"
          >
            View All
          </button>
        </div>

        {(stats?.recentEntries || []).length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-3">
              <ClipboardList className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-gray-800">No entries yet</p>
            <p className="text-[11px] text-gray-500 mt-1">Start logging your activities today.</p>
            <button
              onClick={() => onNavigate("Create Log")}
              className="mt-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Create First Entry
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {stats?.recentEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onNavigate("Log Detail", { logId: entry.id })}
                className="px-4 py-3 hover:bg-gray-50/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      {getStatusIcon(entry.status)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {entry.activity.length > 50
                            ? entry.activity.substring(0, 50) + "..."
                            : entry.activity}
                        </p>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border shrink-0 ${
                            getStatusBadge(entry.status)
                          }`}
                        >
                          {entry.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                        <span>{formatDate(entry.logDate)}</span>
                        <span>·</span>
                        <span>{entry.entryType === "DAILY" ? "Daily" : "Weekly"}</span>
                        {entry.hoursWorked && (
                          <>
                            <span>·</span>
                            <span>{entry.hoursWorked}h</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}