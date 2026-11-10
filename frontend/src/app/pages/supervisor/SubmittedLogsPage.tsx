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
  User,
  Calendar,
} from "lucide-react";
import { Button } from "../../components/ui/button";

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
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const params = new URLSearchParams({
          page: "1",
          limit: "50",
          ...(internFilter && { internId: internFilter }),
        });
        const res = await fetch(`${API_BASE}/supervisor/submitted-logs?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch submitted logs");
        const data = await res.json();
        if (data.success) setLogs(data.data.logs || []);
      } catch {
        // Offline demo fallback
        setLogs([
          {
            id: "log-demo-1",
            internId: "int-1",
            internName: "Adaeze Nwosu",
            internEmail: "adaeze@internhub.com",
            entryType: "DAILY",
            logDate: new Date().toISOString(),
            activity: "Engineered database indexes for high-throughput billing ledger queries",
            hoursWorked: 8,
            createdAt: new Date().toISOString(),
          },
          {
            id: "log-demo-2",
            internId: "int-2",
            internName: "Oluwaseun Adeyemi",
            internEmail: "seun@internhub.com",
            entryType: "WEEKLY",
            logDate: new Date(Date.now() - 86400000).toISOString(),
            activity: "Refined API rate limiter configuration and middleware unit tests",
            hoursWorked: 35,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [internFilter]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate("Dashboard")}
            className="p-2 rounded-xl bg-white border border-[#d8e5ee] text-[#265275] hover:bg-[#eef5fa] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-[#183348]">Review Queue</h1>
            <p className="text-xs text-[#607b91]">Review, verify, and approve intern submissions</p>
          </div>
        </div>

        <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full">
          {logs.length} Submissions Awaiting Sign-off
        </span>
      </div>

      {/* ── Main List Container ── */}
      <div className="bg-white rounded-2xl border border-[#d8e5ee] shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#2eb4d6]" />
            <span className="text-xs text-[#607b91] font-medium">Loading review queue...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <p className="text-base font-bold text-[#183348]">All caught up!</p>
            <p className="text-xs text-[#607b91] mt-1 max-w-sm leading-relaxed">
              There are no pending logbook submissions requiring your review right now.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate("Dashboard")}
              className="mt-4 border-[#d8e5ee] text-[#265275]"
            >
              Back to Dashboard
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-[#eef4f8]">
            {logs.map((log) => (
              <div
                key={log.id}
                onClick={() => onNavigate("Log Review", { logId: log.id, internId: log.internId })}
                className="px-6 py-4.5 hover:bg-[#f9fbfd] transition-colors cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-ip-teal text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                    {log.internName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#183348]">{log.internName}</p>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#eef5fa] text-[#265275]">
                        {log.entryType}
                      </span>
                      {log.hoursWorked && (
                        <span className="text-[11px] text-[#607b91] font-medium">
                          • {log.hoursWorked} hrs
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#3a586e] truncate mt-1 leading-relaxed">
                      {log.activity}
                    </p>
                    <div className="flex items-center gap-2 text-[10.5px] text-[#718c9f] mt-1">
                      <Calendar className="w-3 h-3 text-[#8aa3b5]" />
                      <span>Activity Date: {formatDate(log.logDate)}</span>
                      <span>•</span>
                      <span>Submitted: {formatDate(log.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button variant="cyan" size="sm" className="text-white text-xs font-semibold">
                    Review & Verify
                  </Button>
                  <ChevronRight className="w-4 h-4 text-[#9fb8cb] group-hover:text-[#2eb4d6] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
