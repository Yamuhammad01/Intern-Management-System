import { useState, useEffect } from "react";
import {
  ClipboardList,
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Loader2,
  Filter,
  Search,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface SubmittedLog {
  id: string;
  internId: string;
  internName: string;
  internEmail: string;
  entryType: "DAILY" | "WEEKLY";
  logDate: string;
  activity: string;
  hoursWorked: number | null;
  createdAt: string;
}

interface SubmittedLogsPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export function SubmittedLogsPage({ onNavigate }: SubmittedLogsPageProps) {
  const [logs, setLogs] = useState<SubmittedLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [internFilter, setInternFilter] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const params = new URLSearchParams({ page: "1", limit: "20", ...(internFilter && { internId: internFilter }) });
        const res = await fetch(`${API_BASE}/supervisor/submitted-logs?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data.success) setLogs(data.data.logs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [internFilter]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          Loading submissions...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => onNavigate("Supervise")} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Submitted Logs</h1>
              <p className="text-[11px] text-gray-500">{logs.length} entries pending review</p>
            </div>
          </div>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-xl border border-black/[0.07] p-8 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-gray-800">No log availabe</p>
          <p className="text-[11px] text-gray-500 mt-1">No pending submissions from your interns.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {logs.map((log) => (
              <div
                key={log.id}
                onClick={() => onNavigate("Log Review", { logId: log.id, internId: log.internId })}
                className="px-4 py-3 hover:bg-gray-50/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-gray-800">{log.internName}</p>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border ${
                          log.entryType === "DAILY" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}>
                          {log.entryType === "DAILY" ? "Daily" : "Weekly"}
                        </span>
                        {log.hoursWorked && <span className="text-[10px] text-gray-400">{log.hoursWorked}h</span>}
                      </div>
                      <p className="text-[10px] text-gray-600 mt-0.5 truncate">{log.activity.substring(0, 100)}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">{formatDate(log.logDate)}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}