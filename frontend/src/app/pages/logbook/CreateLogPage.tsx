import { useState } from "react";
import {
  ClipboardList,
  ArrowLeft,
  CalendarCheck,
  BookOpen,
  Save,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface CreateLogPageProps {
  onNavigate: (tab: string) => void;
  preselectedType?: "DAILY" | "WEEKLY";
}

export function CreateLogPage({ onNavigate, preselectedType }: CreateLogPageProps) {
  const [entryType, setEntryType] = useState<"DAILY" | "WEEKLY">(preselectedType || "DAILY");
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);
  const [activity, setActivity] = useState("");
  const [skills, setSkills] = useState("");
  const [hoursWorked, setHoursWorked] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const validate = (): string | null => {
    if (!logDate) return "Date is required";
    if (logDate > today) return "Cannot backdate logs. Date cannot be in the future.";
    if (!activity || activity.length < 10) return "Activity description must be at least 10 characters";
    if (hoursWorked !== "" && (hoursWorked < 0 || hoursWorked > 24)) return "Hours must be between 0 and 24";
    return null;
  };

  const handleSave = async (status: "DRAFT" | "SUBMITTED") => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (status === "SUBMITTED") {
      setSubmitting(true);
    } else {
      setSaving(true);
    }
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/logbook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          entryType,
          logDate: new Date(logDate).toISOString(),
          activity,
          skills: skills || undefined,
          hoursWorked: hoursWorked !== "" ? Number(hoursWorked) : undefined,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create log entry");
      }

      if (status === "SUBMITTED") {
        const logId = data.data.id;
        const submitRes = await fetch(`${API_BASE}/logbook/${logId}/submit`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!submitRes.ok) {
          const submitData = await submitRes.json();
          throw new Error(submitData.message || "Failed to submit log entry");
        }
      }

      onNavigate("Logbook");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate("Logbook")}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Create Log Entry</h1>
            <p className="text-[11px] text-gray-500">Record your internship activities</p>
          </div>
        </div>
      </div>

      {/* Entry Type Toggle */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
        <p className="text-[11px] text-gray-500 font-semibold uppercase mb-2">Entry Type</p>
        <div className="flex gap-2">
          <button
            onClick={() => setEntryType("DAILY")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors border ${
              entryType === "DAILY"
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            Daily Log
          </button>
          <button
            onClick={() => setEntryType("WEEKLY")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors border ${
              entryType === "WEEKLY"
                ? "bg-purple-500 text-white border-purple-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Weekly Summary
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-5 shadow-sm space-y-4">
        {/* Date */}
        <div>
          <label className="text-[11px] text-gray-500 font-semibold uppercase block mb-1.5">
            Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            value={logDate}
            max={today}
            onChange={(e) => setLogDate(e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400 transition-colors"
          />
          <p className="text-[10px] text-gray-400 mt-1">Backdating prevention is enabled. Cannot select future dates.</p>
        </div>

        {/* Activity */}
        <div>
          <label className="text-[11px] text-gray-500 font-semibold uppercase block mb-1.5">
            Activity Performed <span className="text-red-400">*</span>
          </label>
          <textarea
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            rows={4}
            placeholder="Describe what you did during this period..."
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400 transition-colors resize-none placeholder:text-gray-300"
          />
          <div className="flex justify-between mt-1">
            <p className="text-[10px] text-gray-400">Minimum 10 characters</p>
            <p className="text-[10px] text-gray-400">{activity.length}/5000</p>
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="text-[11px] text-gray-500 font-semibold uppercase block mb-1.5">
            Skills Acquired
          </label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            rows={2}
            placeholder="List the skills you learned or improved..."
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400 transition-colors resize-none placeholder:text-gray-300"
          />
        </div>

        {/* Hours Worked */}
        <div>
          <label className="text-[11px] text-gray-500 font-semibold uppercase block mb-1.5">
            Hours Worked
          </label>
          <div className="relative w-32">
            <input
              type="number"
              value={hoursWorked}
              onChange={(e) => setHoursWorked(e.target.value ? Number(e.target.value) : "")}
              min={0}
              max={24}
              step={0.5}
              placeholder="0"
              className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400 transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-medium">
              hrs
            </span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-[11px] text-gray-500 font-semibold uppercase block mb-1.5">
            Supporting Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Any additional notes or observations..."
            className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-400 transition-colors resize-none placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => onNavigate("Logbook")}
          className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSave("DRAFT")}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          Save as Draft
        </button>
        <button
          onClick={() => handleSave("SUBMITTED")}
          disabled={submitting}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          Submit for Review
        </button>
      </div>
    </div>
  );
}