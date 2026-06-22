import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MessageSquare,
  ChevronRight,
  Loader2,
  Trash2,
  Star,
  User,
  Calendar,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface FeedbackItem {
  id: string;
  internId: string;
  internName: string;
  logEntryId: string | null;
  type: string;
  rating: number | null;
  content: string;
  strengths: string | null;
  improvements: string | null;
  isPrivate: boolean;
  createdAt: string;
}

interface FeedbackHistoryPageProps {
  onNavigate: (tab: string, params?: any) => void;
}

export function FeedbackHistoryPage({ onNavigate }: FeedbackHistoryPageProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}/supervisor/feedback`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data.success) setFeedbacks(data.data.feedbacks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this feedback? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/supervisor/feedback/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
          Loading feedback...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate("Supervise")} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center text-white">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Feedback History</h1>
            <p className="text-[11px] text-gray-500">{feedbacks.length} feedback{feedbacks.length !== 1 ? "s" : ""} given</p>
          </div>
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <div className="bg-white rounded-xl border border-black/[0.07] p-8 shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-500 mb-3">
            <MessageSquare className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-gray-800">No feedback yet</p>
          <p className="text-[11px] text-gray-500 mt-1">Start reviewing logs to provide feedback.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-semibold text-gray-800">{fb.internName}</p>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border bg-purple-50 text-purple-700 border-purple-200">
                        {fb.type}
                      </span>
                      {fb.rating && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600">
                          <Star className="w-3 h-3 fill-current" />{fb.rating}/5
                        </span>
                      )}
                      {fb.isPrivate && (
                        <span className="text-[9px] text-gray-400 italic">private</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-700 mt-1.5 leading-relaxed">{fb.content}</p>
                    {fb.strengths && (
                      <p className="text-[10px] text-emerald-700 mt-1.5 bg-emerald-50 rounded-lg px-2.5 py-1.5 border border-emerald-100">
                        <span className="font-semibold">Strengths: </span>{fb.strengths}
                      </p>
                    )}
                    {fb.improvements && (
                      <p className="text-[10px] text-amber-700 mt-1 bg-amber-50 rounded-lg px-2.5 py-1.5 border border-amber-100">
                        <span className="font-semibold">Improvements: </span>{fb.improvements}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(fb.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(fb.id)}
                  disabled={deletingId === fb.id}
                  className="p-1.5 rounded-md hover:bg-red-50 text-red-500 transition-colors shrink-0"
                >
                  {deletingId === fb.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}