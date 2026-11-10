import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  CheckCircle2,
  XCircle,
  Send,
  Edit3,
  Trash2,
  Loader2,
  User,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/ui/button";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface LogEntryDetail {
  id: string;
  internId: string;
  internName: string;
  internEmail: string;
  entryType: "DAILY" | "WEEKLY";
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  logDate: string;
  activity: string;
  skills: string | null;
  hoursWorked: number | null;
  notes: string | null;
  reviewedBy: string | null;
  reviewerName: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LogDetailPageProps {
  onNavigate: (tab: string, params?: any) => void;
  logId: string;
}

export function LogDetailPage({ onNavigate, logId }: LogDetailPageProps) {
  const [entry, setEntry] = useState<LogEntryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const fetchEntry = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/logbook/${logId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch log entry details");

      const data = await res.json();
      if (data.success) {
        setEntry(data.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load log detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntry();
  }, [logId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/logbook/${logId}/submit`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to submit log entry");
      }

      fetchEntry();
    } catch (err: any) {
      setError(err.message || "Failed to submit for approval");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this log entry? This cannot be undone.")) return;

    setDeleting(true);
    setError("");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/logbook/${logId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete log entry");
      }

      onNavigate("Logbook");
    } catch (err: any) {
      setError(err.message || "Failed to delete log entry");
    } finally {
      setDeleting(false);
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
        <span className="text-xs text-[#607b91] font-medium">Loading log entry details...</span>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="bg-white rounded-2xl border border-[#d8e5ee] p-12 text-center max-w-md mx-auto space-y-3">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-[#183348]">Entry Not Found</h3>
        <p className="text-xs text-[#607b91]">This log entry could not be located or may have been deleted.</p>
        <Button variant="outline" size="sm" onClick={() => onNavigate("Logbook")}>
          Return to Logbook
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate("Logbook")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#265275] hover:text-[#2eb4d6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Logbook
        </button>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
            entry.status
          )}`}
        >
          {entry.status}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-700 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* ── Main Detail Card ── */}
      <div className="bg-white rounded-2xl border border-[#d8e5ee] p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#2eb4d6] uppercase tracking-wider">
              {entry.entryType === "DAILY" ? "Daily Activity Record" : "Weekly Summary"}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#183348]">{formatDate(entry.logDate)}</h2>
        </div>

        {/* ── Metadata Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8fafc] border border-[#e4ecf2] rounded-xl p-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#718c9f] tracking-wide">Date</span>
            <p className="font-semibold text-[#183348] mt-0.5">{formatDate(entry.logDate)}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#718c9f] tracking-wide">Hours</span>
            <p className="font-semibold text-[#183348] mt-0.5">{entry.hoursWorked ? `${entry.hoursWorked} hrs` : "N/A"}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#718c9f] tracking-wide">Type</span>
            <p className="font-semibold text-[#183348] mt-0.5">{entry.entryType}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#718c9f] tracking-wide">Recorded</span>
            <p className="font-semibold text-[#183348] mt-0.5">{formatDate(entry.createdAt)}</p>
          </div>
        </div>

        {/* ── Activity Narrative ── */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#4d6f88]">
            Activity Description
          </h4>
          <div className="bg-[#fcfdfd] border border-[#e6edf2] rounded-xl p-4 text-xs text-[#26445c] leading-relaxed whitespace-pre-wrap">
            {entry.activity}
          </div>
        </div>

        {/* ── Skills & Technologies ── */}
        {entry.skills && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4d6f88]">
              Applied Skills & Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {entry.skills.split(",").map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#e6f4f8] text-[#1c647e] border border-[#c6e5ee]"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Reflections & Notes ── */}
        {entry.notes && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4d6f88]">
              Challenges & Reflections
            </h4>
            <div className="bg-[#fcfdfd] border border-[#e6edf2] rounded-xl p-4 text-xs text-[#3f5c72] leading-relaxed whitespace-pre-wrap">
              {entry.notes}
            </div>
          </div>
        )}

        {/* ── Supervisor Review Card (If reviewed) ── */}
        {entry.reviewedAt && (
          <div className="bg-[#eef8fc] border border-[#bfe1ef] rounded-2xl p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2eb4d6]" />
                <span className="text-xs font-bold text-[#183348]">
                  Reviewed by {entry.reviewerName || "Supervisor"}
                </span>
              </div>
              <span className="text-[10px] text-[#607b91]">
                {formatDate(entry.reviewedAt)}
              </span>
            </div>
            {entry.reviewNotes ? (
              <p className="text-xs text-[#234d67] leading-relaxed bg-white/70 p-3 rounded-xl border border-[#cfe7f3]">
                "{entry.reviewNotes}"
              </p>
            ) : (
              <p className="text-xs text-[#4b728b] italic">No written comments attached with approval.</p>
            )}
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#eef4f8]">
          {/* Destructive Delete for Drafts */}
          {entry.status === "DRAFT" ? (
            <button
              type="button"
              disabled={deleting}
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
            >
              {deleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              Delete Draft
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2.5">
            {(entry.status === "DRAFT" || entry.status === "REJECTED") && (
              <Button
                variant="outline"
                size="default"
                onClick={() => onNavigate("Edit Log", { logId: entry.id })}
                className="border-[#d8e5ee] text-[#265275] text-xs font-semibold"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                Edit Details
              </Button>
            )}

            {entry.status === "DRAFT" && (
              <Button
                variant="navy"
                size="default"
                disabled={submitting}
                onClick={handleSubmit}
                className="text-white text-xs font-semibold shadow-xs"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Submit for Approval
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
