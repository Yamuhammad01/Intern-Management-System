import React, { useState, useEffect } from "react";
import { 
  ClipboardList, Calendar, CheckCircle2, AlertCircle, 
  ArrowUpRight, Star, Clock, FileText, Send, UserCheck, Loader2
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/tasks`
  : "http://localhost:3000/api/v1/tasks";

interface InternDashboardProps {
  user: any;
}

interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  pendingOverdue: number;
}

export const InternDashboard: React.FC<InternDashboardProps> = ({ user }) => {
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [feedback, setFeedback] = useState([
    { id: 1, supervisor: "Jamie Liu", text: "Excellent work on the Prisma migration. The schema structure is clean and correctly mapped out.", date: "16 Jun 2026", rating: 4.8 },
    { id: 2, supervisor: "Jamie Liu", text: "Active participation in the design session. Keep pushing details on animations.", date: "13 Jun 2026", rating: 5.0 },
    { id: 3, supervisor: "Jamie Liu", text: "Integration tests have good coverage, but please verify edge cases for expired tokens.", date: "10 Jun 2026", rating: 4.2 }
  ]);

  // Performance score history for the intern
  const perfData = [
    { week: "W1", score: 80 },
    { week: "W2", score: 82 },
    { week: "W3", score: 85 },
    { week: "W4", score: 88 },
    { week: "W5", score: 92 },
    { week: "W6", score: 95 },
  ];

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) setTaskStats(data.data);
        }
      } catch (err) {
        console.warn("Failed to fetch task stats, using fallback");
        setTaskStats({ total: 0, completed: 0, inProgress: 0, pendingOverdue: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchTaskStats();
  }, []);

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "My Attendance Rate", value: "96.4%", sub: "1 Late check-in this month", change: "+1.2%", pos: true, icon: UserCheck, color: "text-emerald-600 bg-emerald-50" },
          { 
            label: "Tasks Completed", 
            value: loading ? "-" : taskStats ? `${taskStats.completed} / ${taskStats.total}` : "0 / 0", 
            sub: loading ? "Loading..." : taskStats ? `${taskStats.inProgress} in progress, ${taskStats.pendingOverdue} pending` : "No tasks yet", 
            change: loading ? "" : `${taskStats?.completed || 0} done`, 
            pos: true, 
            icon: ClipboardList, 
            color: "text-blue-600 bg-blue-50" 
          },
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

      {/* Row 2: Task Stats Breakdown and Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Task Stats Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-gray-50 pb-2">
            <h3 className="text-[13px] font-semibold text-gray-800">Task Completion Status</h3>
            <span className="text-[10.5px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Logbook Entry Status</span>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : taskStats ? (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Total Tasks", value: taskStats.total, color: "bg-gray-100 text-gray-700", border: "border-gray-200" },
                { label: "Completed", value: taskStats.completed, color: "bg-emerald-50 text-emerald-700", border: "border-emerald-200" },
                { label: "In Progress", value: taskStats.inProgress, color: "bg-blue-50 text-blue-700", border: "border-blue-200" },
                { label: "Pending / Overdue", value: taskStats.pendingOverdue, color: "bg-amber-50 text-amber-700", border: "border-amber-200" },
              ].map((s, i) => (
                <div key={i} className={`${s.color} ${s.border} rounded-xl p-4 border flex flex-col gap-1`}>
                  <span className="text-[11px] font-medium opacity-80">{s.label}</span>
                  <span className="text-2xl font-bold">{s.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">Unable to load task stats</p>
          )}
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
    </div>
  );
};