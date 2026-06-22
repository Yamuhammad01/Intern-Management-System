import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Calendar,
  MessageSquare,
  Loader2,
  Star,
  BookOpen,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface InternProgress {
  intern: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    matricNumber: string | null;
    institution: string | null;
    organizationName: string | null;
  };
  stats: {
    totalLogs: number;
    submittedLogs: number;
    approvedLogs: number;
    rejectedLogs: number;
    totalHours: number;
    weeklyHours: number;
    monthlyHours: number;
    approvalRate: number;
  };
  recentLogs: Array<{
    id: string;
    entryType: "DAILY" | "WEEKLY";
    status: string;
    logDate: string;
    activity: string;
    hoursWorked: number | null;
    createdAt: string;
  }>;
  recentFeedback: Array<{
    id: string;
    type: string;
    rating: number | null;
    content: string;
    strengths: string | null;
    improvements: string | null;
    createdAt: string;
  }>;
}

interface InternProgressPageProps {
  onNavigate: (tab: string, params?: any) => void;
  internId: string;
}

export function InternProgressPage({ onNavigate, internId }: InternProgressPageProps) {
  const [progress, setProgress] = useState<InternProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}/supervisor/interns/${internId}/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data.success) setProgress(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [internId]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          Loading progress...
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-gray-600">Intern not found</p>
        <button onClick={() => onNavigate("My Interns")} className="mt-3 text-xs text-emerald-600 hover:underline">
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate("My Interns")} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
            {progress.intern.firstName.charAt(0)}{progress.intern.lastName.charAt(0)}
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">{progress.intern.firstName} {progress.intern.lastName}</h1>
            <p className="text-[11px] text-gray-500">{progress.intern.institution || progress.intern.organizationName || "Intern"}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm text-center">
          <ClipboardList className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-800">{progress.stats.totalLogs}</p>
          <p className="text-[9px] text-gray-500 uppercase">Total Logs</p>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm text-center">
          <Clock className="w-4 h-4 text-amber-600 mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-800">{progress.stats.submittedLogs}</p>
          <p className="text-[9px] text-gray-500 uppercase">Pending</p>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-gray-800">{progress.stats.totalHours}h</p>
          <p className="text-[9px] text-gray-500 uppercase">Hours Worked</p>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm text-center">
          <TrendingUp className="w-4 h-4 text-blue-600 mx-auto mb-1" />
          <p className="text-xl font-bold text-gray-800">{progress.stats.approvalRate}%</p>
          <p className="text-[9px] text-gray-500 uppercase">Approval Rate</p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <p className="text-[10px] text-gray-500 font-semibold uppercase mb-2">This Week</p>
          <p className="text-lg font-bold text-gray-800">{progress.stats.weeklyHours}h</p>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(progress.stats.weeklyHours / 40 * 100, 100)}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <p className="text-[10px] text-gray-500 font-semibold uppercase mb-2">This Month</p>
          <p className="text-lg font-bold text-gray-800">{progress.stats.monthlyHours}h</p>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(progress.stats.monthlyHours / 160 * 100, 100)}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <p className="text-[10px] text-gray-500 font-semibold uppercase mb-2">Logs Status</p>
          <div className="flex items-center gap-3 mt-1">
            <div className="text-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
              <p className="text-sm font-bold text-gray-800">{progress.stats.approvedLogs}</p>
            </div>
            <div className="text-center">
              <XCircle className="w-4 h-4 text-red-400 mx-auto" />
              <p className="text-sm font-bold text-gray-800">{progress.stats.rejectedLogs}</p>
            </div>
            <div className="text-center">
              <Clock className="w-4 h-4 text-amber-500 mx-auto" />
              <p className="text-sm font-bold text-gray-800">{progress.stats.submittedLogs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Logs */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Recent Logs</h3>
        </div>
        {progress.recentLogs.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500">No logs yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Type</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Activity</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Hours</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {progress.recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 text-gray-700">{formatDate(log.logDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border ${
                        log.entryType === "DAILY" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-purple-50 text-purple-700 border-purple-200"
                      }`}>
                        {log.entryType === "DAILY" ? "Daily" : "Weekly"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{log.activity}</td>
                    <td className="px-4 py-3 text-gray-600">{log.hoursWorked ? `${log.hoursWorked}h` : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium border ${
                        log.status === "APPROVED" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                        log.status === "REJECTED" ? "bg-red-100 text-red-700 border-red-200" :
                        log.status === "SUBMITTED" ? "bg-amber-100 text-amber-700 border-amber-200" :
                        "bg-gray-100 text-gray-600 border-gray-200"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Feedback */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">Recent Feedback</h3>
        </div>
        {progress.recentFeedback.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500">No feedback yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {progress.recentFeedback.map((fb) => (
              <div key={fb.id} className="px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border bg-purple-50 text-purple-700 border-purple-200">
                    {fb.type}
                  </span>
                  {fb.rating && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600">
                      <Star className="w-3 h-3 fill-current" />{fb.rating}/5
                    </span>
                  )}
                  <span className="text-[9px] text-gray-400 ml-auto">{formatDate(fb.createdAt)}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{fb.content}</p>
                {fb.strengths && <p className="text-[10px] text-emerald-700 mt-1">Strengths: {fb.strengths}</p>}
                {fb.improvements && <p className="text-[10px] text-amber-700 mt-0.5">Improvements: {fb.improvements}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}