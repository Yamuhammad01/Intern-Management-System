import React, { useState } from "react";
import { 
  ClipboardList, Calendar, CheckCircle2, AlertCircle, 
  ArrowUpRight, Star, Clock, FileText, Send, UserCheck
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

interface InternDashboardProps {
  user: any;
}

export const InternDashboard: React.FC<InternDashboardProps> = ({ user }) => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Refactor Authentication UI using Figma guidelines", status: "Pending", deadline: "24 Jun 2026", category: "Design & UX", grade: null },
    { id: 2, title: "Write API Integration tests for JWT verification", status: "Submitted", deadline: "18 Jun 2026", category: "Engineering", grade: "Pending Review" },
    { id: 3, title: "Create PostgreSQL Prisma Schema migrations", status: "Completed", deadline: "15 Jun 2026", category: "Database", grade: "4.8/5" },
    { id: 4, title: "Participate in Weekly Sync & Design Review", status: "Completed", deadline: "12 Jun 2026", category: "Engagement", grade: "5.0/5" },
  ]);

  const [feedback, setFeedback] = useState([
    { id: 1, supervisor: "Jamie Liu", text: "Excellent work on the Prisma migration. The schema structure is clean and correctly mapped out.", date: "16 Jun 2026", rating: 4.8 },
    { id: 2, supervisor: "Jamie Liu", text: "Active participation in the design session. Keep pushing details on animations.", date: "13 Jun 2026", rating: 5.0 },
    { id: 3, supervisor: "Jamie Liu", text: "Integration tests have good coverage, but please verify edge cases for expired tokens.", date: "10 Jun 2026", rating: 4.2 }
  ]);

  const [newSubmissionTitle, setNewSubmissionTitle] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [targetTaskId, setTargetTaskId] = useState<number | null>(null);

  // Performance score history for the intern
  const perfData = [
    { week: "W1", score: 80 },
    { week: "W2", score: 82 },
    { week: "W3", score: 85 },
    { week: "W4", score: 88 },
    { week: "W5", score: 92 },
    { week: "W6", score: 95 },
  ];

  const handleOpenSubmit = (taskId: number) => {
    setTargetTaskId(taskId);
    setShowSubmitModal(true);
  };

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubmissionTitle.trim() || targetTaskId === null) return;

    setTasks(prev => prev.map(t => {
      if (t.id === targetTaskId) {
        return { ...t, status: "Submitted", grade: "Pending Review" };
      }
      return t;
    }));
    
    setNewSubmissionTitle("");
    setShowSubmitModal(false);
    setTargetTaskId(null);
  };

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "My Attendance Rate", value: "96.4%", sub: "1 Late check-in this month", change: "+1.2%", pos: true, icon: UserCheck, color: "text-emerald-600 bg-emerald-50" },
          { label: "Tasks Completed", value: `${tasks.filter(t => t.status === "Completed").length} / ${tasks.length}`, sub: "1 Task pending action", change: "+25%", pos: true, icon: ClipboardList, color: "text-blue-600 bg-blue-50" },
          { label: "Average Evaluation", value: "4.7 / 5.0", sub: "Based on 3 supervisor ratings", change: "+0.3", pos: true, icon: Star, color: "text-amber-500 bg-amber-50" },
          { label: "Hours Logged", value: "128 Hrs", sub: "Required: 160 Hrs this term", change: "+40h", pos: true, icon: Clock, color: "text-indigo-600 bg-indigo-50" },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-500 font-medium">{c.label}</span>
              <div className={`p-1.5 rounded-lg ${c.color}`}>
                <c.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-[24px] font-semibold leading-none">{c.value}</span>
              <span className="flex items-center gap-0.5 text-[10.5px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                <ArrowUpRight className="w-2.5 h-2.5" />{c.change}
              </span>
            </div>
            <p className="text-[10.5px] text-gray-400 leading-snug">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Row 2: Tasks and Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Deliverables List */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-2">
              <h3 className="text-[13px] font-semibold text-gray-800">My Assigned Tasks</h3>
              <span className="text-[10.5px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Cohort A</span>
            </div>
            <div className="divide-y divide-gray-50 max-h-[295px] overflow-y-auto pr-1">
              {tasks.map(t => (
                <div key={t.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-800 leading-tight">{t.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">{t.category}</span>
                      <span>Due: {t.deadline}</span>
                      {t.grade && <span className="font-semibold text-emerald-700 bg-emerald-50 px-1 rounded">Grade: {t.grade}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      t.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                      t.status === "Submitted" ? "bg-blue-100 text-blue-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>{t.status}</span>
                    {t.status === "Pending" && (
                      <button
                        onClick={() => handleOpenSubmit(t.id)}
                        className="bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                      >
                        <Send className="w-2.5 h-2.5" /> Submit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Performance Curve */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[13px] font-semibold text-gray-800">My Performance Score</h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Engineering Track</span>
            </div>
            <div className="mb-3">
              <span className="text-2xl font-bold">95.0%</span>
              <span className="text-[10px] text-emerald-600 ml-1.5 font-semibold">↑ +3.2pts (This Week)</span>
              <p className="text-[10px] text-gray-400">Personal performance evaluation trend</p>
            </div>
          </div>
          <div className="w-full h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={perfData} margin={{ top: 5, right: 10, left: -30, bottom: 0 }}>
                <XAxis dataKey="week" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, padding: "4px 8px" }} />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ r: 3.5, fill: "#10b981" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Supervisor Feedback and Logged Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Feedback List */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <h3 className="text-[13px] font-semibold text-gray-800 mb-3.5 border-b border-gray-50 pb-2">Supervisor Evaluations & Comments</h3>
          <div className="space-y-3.5">
            {feedback.map(f => (
              <div key={f.id} className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11.5px] font-bold text-gray-700">{f.supervisor}</span>
                    <span className="text-[9.5px] text-gray-400">{f.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-normal">{f.text}</p>
                </div>
                <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-lg text-amber-700 shrink-0">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[11px] font-bold">{f.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <h3 className="text-[13px] font-semibold text-gray-800 mb-3 border-b border-gray-50 pb-2">Upcoming Calendar</h3>
          <div className="space-y-3">
            {[
              { title: "Weekly 1:1 Review with Jamie Liu", time: "22 Jun 2026 · 10:00 AM", type: "Mentor Review", bg: "bg-emerald-50 text-emerald-700 border-emerald-100" },
              { title: "Training: Advanced PostgreSQL Schema Design", time: "24 Jun 2026 · 02:00 PM", type: "Academic Program", bg: "bg-blue-50 text-blue-700 border-blue-100" },
              { title: "Milestone: Submit Authentication UI Wireframes", time: "26 Jun 2026 · 05:00 PM", type: "Submission Deadline", bg: "bg-red-50 text-red-700 border-red-100" },
            ].map((s, i) => (
              <div key={i} className={`p-2.5 rounded-xl border text-left ${s.bg}`}>
                <span className="text-[9px] font-bold uppercase tracking-wider">{s.type}</span>
                <p className="text-xs font-semibold leading-tight mt-1 text-gray-800">{s.title}</p>
                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-400" /> {s.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for Deliverable Submission */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-black/[0.07] animate-scale-up">
            <div className="flex items-center gap-2 mb-3.5">
              <FileText className="w-5 h-5 text-emerald-500" />
              <h3 className="text-[14.5px] font-bold text-gray-800">Submit Deliverable</h3>
            </div>
            
            <p className="text-xs text-gray-500 mb-4">
              Enter the deliverable details or paste the repository/Figma file link below.
            </p>

            <form onSubmit={handleSubmitDeliverable} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-gray-600" htmlFor="link">
                  Deliverable Link / Notes
                </label>
                <textarea
                  id="link"
                  rows={3}
                  value={newSubmissionTitle}
                  onChange={(e) => setNewSubmissionTitle(e.target.value)}
                  placeholder="e.g. github.com/username/project or Figma board URL..."
                  className="w-full bg-[#f3f3f5] border-0 outline-none rounded-xl px-4 py-2.5 text-xs placeholder:text-gray-400 focus:bg-white focus:ring-1.5 focus:ring-emerald-500 transition-all duration-200 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmitModal(false);
                    setTargetTaskId(null);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-600 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
};
