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
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/ui/button";

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
    } catch {
      // Empty state / offline fallback
      setStats({
        totalLogs: 0,
        draftLogs: 0,
        submittedLogs: 0,
        approvedLogs: 0,
        rejectedLogs: 0,
        dailyLogs: 0,
        weeklyLogs: 0,
        thisWeekHours: 0,
        thisMonthHours: 0,
        recentEntries: [],
      });
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
        return <FileText className="w-3.5 h-3.5 text-[#607b91]" />;
      case "SUBMITTED":
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
      case "APPROVED":
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#0d6e46]" />;
      case "REJECTED":
        return <XCircle className="w-3.5 h-3.5 text-red-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-[#607b91]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-[#edf3f7] text-[#4e6c82] border-[#d4e2eb]";
      case "SUBMITTED":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "REJECTED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-[#edf3f7] text-[#4e6c82] border-[#d4e2eb]";
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
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#2eb4d6]" />
        <span className="text-xs text-[#607b91] font-medium">Loading logbook workspace...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl border border-[#d8e5ee] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#e6f4f8] text-[#1c647e] flex items-center justify-center shrink-0 shadow-2xs">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-[#183348]">Activity Logbook</h1>
            <p className="text-xs text-[#607b91]">Record, organize, and verify daily tasks and weekly reflections</p>
          </div>
        </div>

        <Button
          variant="cyan"
          size="default"
          onClick={() => onNavigate("Create Log")}
          className="text-white font-semibold text-xs shadow-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Log Entry
        </Button>
      </div>

      {/* ── KPI Metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#d8e5ee] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#607b91] uppercase tracking-wider">Total Logs</span>
            <div className="p-2 rounded-xl bg-[#eef5fa] text-[#265275]">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#183348] tracking-tight">{stats?.totalLogs || 0}</p>
          <p className="text-[10px] text-[#7893a6] mt-1">Recorded entries to date</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#d8e5ee] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#607b91] uppercase tracking-wider">Under Review</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#183348] tracking-tight">{stats?.submittedLogs || 0}</p>
          <p className="text-[10px] text-[#7893a6] mt-1">Awaiting mentor sign-off</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#d8e5ee] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#607b91] uppercase tracking-wider">Approved</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#183348] tracking-tight">{stats?.approvedLogs || 0}</p>
          <p className="text-[10px] text-[#7893a6] mt-1">Verified & signed logs</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#d8e5ee] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#607b91] uppercase tracking-wider">Hours Tracked</span>
            <div className="p-2 rounded-xl bg-[#e6f4f8] text-[#1c647e]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#183348] tracking-tight">{stats?.thisWeekHours || 0}h</p>
          <p className="text-[10px] text-[#7893a6] mt-1">Logged this week</p>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => onNavigate("Create Log", { type: "DAILY" })}
          className="bg-white rounded-2xl border border-[#d8e5ee] p-5 shadow-xs hover:border-[#2eb4d6] hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#e6f4f8] text-[#1c647e] flex items-center justify-center group-hover:bg-[#2eb4d6] group-hover:text-white transition-colors">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#183348]">Daily Activity Log</p>
              <p className="text-[11px] text-[#607b91]">Log today's tasks and skills learned</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9fb8cb] group-hover:text-[#2eb4d6] transition-colors" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("Create Log", { type: "WEEKLY" })}
          className="bg-white rounded-2xl border border-[#d8e5ee] p-5 shadow-xs hover:border-[#2eb4d6] hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#f0effb] text-[#5546b3] flex items-center justify-center group-hover:bg-[#5546b3] group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#183348]">Weekly Summary Log</p>
              <p className="text-[11px] text-[#607b91]">Synthesize milestone reflections</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9fb8cb] group-hover:text-[#5546b3] transition-colors" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("Log History")}
          className="bg-white rounded-2xl border border-[#d8e5ee] p-5 shadow-xs hover:border-[#2eb4d6] hover:shadow-md transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#fef7ee] text-[#b46513] flex items-center justify-center group-hover:bg-[#b46513] group-hover:text-white transition-colors">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#183348]">Browse Full History</p>
              <p className="text-[11px] text-[#607b91]">Filter submitted and draft logs</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#9fb8cb] group-hover:text-[#b46513] transition-colors" />
          </div>
        </button>
      </div>

      {/* ── Recent Log Entries ── */}
      <div className="bg-white rounded-2xl border border-[#d8e5ee] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-[#eef4f8] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#183348]">Recent Logbook Entries</h3>
            <p className="text-[11px] text-[#607b91]">Submissions waiting for approval or recently verified</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("Log History")}
            className="text-xs font-semibold text-[#265275] hover:text-[#2eb4d6] transition-colors"
          >
            View Complete History →
          </button>
        </div>

        {(stats?.recentEntries || []).length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#e6f4f8] border border-[#bfe7f3] flex items-center justify-center text-[#248da9] mb-3">
              <ClipboardList className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#183348]">No activity logs recorded yet</p>
            <p className="text-xs text-[#607b91] mt-1 max-w-sm leading-relaxed">
              Maintain an active log of your daily contributions, technical discoveries, and supervisor feedback.
            </p>
            <Button
              variant="cyan"
              size="default"
              onClick={() => onNavigate("Create Log")}
              className="mt-4 text-white font-medium text-xs shadow-xs"
            >
              Record First Entry
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-[#eef4f8]">
            {stats?.recentEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => onNavigate("Log Detail", { logId: entry.id })}
                className="px-6 py-3.5 hover:bg-[#f8fafc] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-xl bg-[#f4f7fa] border border-[#d8e5ee] flex items-center justify-center shrink-0">
                      {getStatusIcon(entry.status)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-[#183348] truncate">
                          {entry.activity.length > 60
                            ? entry.activity.substring(0, 60) + "..."
                            : entry.activity}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-bold border shrink-0 ${getStatusBadge(
                            entry.status
                          )}`}
                        >
                          {entry.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10.5px] text-[#607b91] mt-0.5">
                        <span>{formatDate(entry.logDate)}</span>
                        <span>•</span>
                        <span>{entry.entryType === "DAILY" ? "Daily Entry" : "Weekly Summary"}</span>
                        {entry.hoursWorked && (
                          <>
                            <span>•</span>
                            <span>{entry.hoursWorked} hours logged</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#9fb8cb] shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
