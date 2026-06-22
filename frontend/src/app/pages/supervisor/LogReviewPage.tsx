import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ClipboardList,
  Calendar,
  Clock,
  BookOpen,
  Send,
  XCircle,
  CheckCircle2,
  Loader2,
  MessageSquare,
  User,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface LogReviewPageProps {
  onNavigate: (tab: string, params?: any) => void;
  logId: string;
  internId: string;
}

export function LogReviewPage({ onNavigate, logId, internId }: LogReviewPageProps) {
  const [log, setLog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}/logbook/${logId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data.success) setLog(data.data);
      } catch (err) {
        setError("Failed to load log entry");
      } finally {
        setLoading(false);
      }
    };
    fetchLog();
  }, [logId]);

  const handleReview = async (status: "APPROVED" | "REJECTED") => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/supervisor/logs/${logId}/review`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, reviewNotes }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to review");
      }
      onNavigate("Submitted Logs");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          Loading log entry...
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-gray-600">Log entry not found</p>
        <button onClick={() => onNavigate("Submitted Logs")} className="mt-3 text-xs text-emerald-600 hover:underline">
          Back to submissions
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate("Submitted Logs")} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Review Log Entry</h1>
            <p className="text-[11px] text-gray-500">Submitted by {log.internName}</p>
          </div>
        </div>
      </div>

      {/* Log Details */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-2">Activity Performed</p>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{log.activity}</p>
        </div>

        {log.skills && (
          <div className="p-5 border-b border-gray-50">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-2">Skills Acquired</p>
            <p className="text-xs text-gray-700 whitespace-pre-wrap">{log.skills}</p>
          </div>
        )}

        {log.notes && (
          <div className="p-5 border-b border-gray-50">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-2">Supporting Notes</p>
            <p className="text-xs text-gray-700 whitespace-pre-wrap">{log.notes}</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-gray-50">
          <div className="bg-white p-4">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Date</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {formatDate(log.logDate)}
            </div>
          </div>
          <div className="bg-white p-4">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Hours</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              {log.hoursWorked ? `${log.hoursWorked}h` : "—"}
            </div>
          </div>
          <div className="bg-white p-4">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Type</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <BookOpen className="w-3.5 h-3.5 text-gray-400" />
              {log.entryType === "DAILY" ? "Daily" : "Weekly"}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-50 text-[10px] text-gray-400">
          Created: {new Date(log.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Review Actions */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-gray-800">Your Review</h3>
        <textarea
          value={reviewNotes}
          onChange={(e) => setReviewNotes(e.target.value)}
          placeholder="Add review notes (optional but recommended)..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-emerald-500 transition-colors min-h-[100px] resize-y"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2.5">
            <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => handleReview("REJECTED")}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
            Reject
          </button>
          <button
            onClick={() => setShowFeedback(true)}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Add Feedback
          </button>
          <button
            onClick={() => handleReview("APPROVED")}
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            Approve
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <FeedbackModal
          onClose={() => setShowFeedback(false)}
          onSubmit={() => {
            setShowFeedback(false);
            onNavigate("Submitted Logs");
          }}
          internId={internId}
          logEntryId={logId}
        />
      )}
    </div>
  );
}

function FeedbackModal({ onClose, onSubmit, internId, logEntryId }: {
  onClose: () => void;
  onSubmit: () => void;
  internId: string;
  logEntryId: string;
}) {
  const [content, setContent] = useState("");
  const [type, setType] = useState("GENERAL");
  const [rating, setRating] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/supervisor/feedback`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ internId, logEntryId, type, rating: rating || undefined, content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed");
      }
      onSubmit();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">Add Feedback</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <XCircle className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] text-gray-500 font-semibold uppercase">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none mt-1"
            >
              <option value="GENERAL">General</option>
              <option value="PERFORMANCE">Performance</option>
              <option value="SKILLS">Skills</option>
              <option value="CONDUCT">Conduct</option>
              <option value="GOAL">Goal</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-semibold uppercase">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value ? Number(e.target.value) : "")}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none mt-1"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-semibold uppercase">Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={10}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none mt-1 min-h-[100px]"
              placeholder="Your detailed feedback..."
            />
          </div>
          {error && <p className="text-[11px] text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-xs font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 disabled:opacity-50">
              {submitting ? "Saving..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}