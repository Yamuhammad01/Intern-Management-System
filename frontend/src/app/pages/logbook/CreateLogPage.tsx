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
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "../../components/ui/button";

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
          logDate,
          activity,
          skills: skills || null,
          hoursWorked: hoursWorked === "" ? null : Number(hoursWorked),
          notes: notes || null,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create log entry");
      }

      onNavigate("Logbook");
    } catch (err: any) {
      setError(err.message || "Something went wrong while saving");
    } finally {
      setSubmitting(false);
      setSaving(false);
    }
  };

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
          Back to Logbook Dashboard
        </button>
        <span className="text-xs font-semibold text-[#607b91] bg-white border border-[#d8e5ee] px-3 py-1 rounded-full shadow-2xs">
          New Entry
        </span>
      </div>

      {/* ── Main Form Card ── */}
      <div className="bg-white rounded-2xl border border-[#d8e5ee] p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#183348]">Create Log Entry</h2>
          <p className="text-xs text-[#607b91] mt-1">
            Record your daily technical contributions, problem-solving reflections, and hours worked.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-700 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* ── Entry Type Toggle (Segmented Control) ── */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#1d3d56]">Log Entry Type</label>
          <div className="inline-flex p-1 bg-[#f0f5f9] border border-[#d8e5ee] rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setEntryType("DAILY")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                entryType === "DAILY"
                  ? "bg-[#265275] text-white shadow-xs"
                  : "text-[#607b91] hover:text-[#183348]"
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              Daily Activity
            </button>
            <button
              type="button"
              onClick={() => setEntryType("WEEKLY")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                entryType === "WEEKLY"
                  ? "bg-[#265275] text-white shadow-xs"
                  : "text-[#607b91] hover:text-[#183348]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Weekly Summary
            </button>
          </div>
        </div>

        {/* ── Date and Hours Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="logDate" className="text-xs font-semibold text-[#1d3d56]">
              Entry Date *
            </label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-[#8aa3b5] absolute left-3.5 pointer-events-none" />
              <input
                id="logDate"
                type="date"
                max={today}
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
                className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#183348] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="hoursWorked" className="text-xs font-semibold text-[#1d3d56]">
              Hours Worked (Optional)
            </label>
            <div className="relative flex items-center">
              <Clock className="w-4 h-4 text-[#8aa3b5] absolute left-3.5 pointer-events-none" />
              <input
                id="hoursWorked"
                type="number"
                min="0"
                max="24"
                step="0.5"
                placeholder="e.g. 8"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── Activity Description ── */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="activity" className="text-xs font-semibold text-[#1d3d56]">
              Activity Description *
            </label>
            <span className="text-[10.5px] text-[#8aa3b5]">Minimum 10 characters</span>
          </div>
          <textarea
            id="activity"
            rows={4}
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="Detail your engineering contributions, bugs resolved, architectural discussions, or tasks completed..."
            className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl p-3.5 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all resize-y leading-relaxed"
          />
        </div>

        {/* ── Skills & Technologies ── */}
        <div className="space-y-1.5">
          <label htmlFor="skills" className="text-xs font-semibold text-[#1d3d56]">
            Competencies & Technologies Applied
          </label>
          <input
            id="skills"
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. React.js, PostgreSQL, Query Optimization, JWT Authentication"
            className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl px-4 py-2.5 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all"
          />
        </div>

        {/* ── Supervisor / Self Notes ── */}
        <div className="space-y-1.5">
          <label htmlFor="notes" className="text-xs font-semibold text-[#1d3d56]">
            Reflection / Challenges Encountered
          </label>
          <textarea
            id="notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any blockers encountered, questions for your supervisor, or insights gained..."
            className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl p-3 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all resize-y leading-relaxed"
          />
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#eef4f8]">
          <Button
            type="button"
            variant="outline"
            disabled={saving || submitting}
            onClick={() => handleSave("DRAFT")}
            className="w-full sm:w-auto border-[#d7e4ed] text-[#265275] text-xs font-semibold"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Saving Draft...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Save as Draft
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="navy"
            disabled={saving || submitting}
            onClick={() => handleSave("SUBMITTED")}
            className="w-full sm:w-auto text-white text-xs font-semibold shadow-xs"
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
        </div>
      </div>
    </div>
  );
}
