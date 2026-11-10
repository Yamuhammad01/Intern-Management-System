import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Calendar,
  ArrowUpRight,
  Star,
  Clock,
  UserCheck,
  Loader2,
  TrendingUp,
  Award,
  CheckCircle2,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

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

  const [feedback] = useState([
    {
      id: 1,
      supervisor: "Dr. Ngozi Eze",
      text: "Outstanding progress on database indexing. Your query optimization resolved the slowest route on the ledger service.",
      date: "18 Sep 2026",
      rating: 5.0,
      avatar: "NE",
    },
    {
      id: 2,
      supervisor: "Engr. T. Alabi",
      text: "Well structured pull requests and test coverage on the authentication token refresh pipeline.",
      date: "11 Sep 2026",
      rating: 4.8,
      avatar: "TA",
    },
    {
      id: 3,
      supervisor: "Dr. Ngozi Eze",
      text: "Punctual, analytical, and communicative during daily standups and engineering syncs.",
      date: "04 Sep 2026",
      rating: 4.7,
      avatar: "NE",
    },
  ]);

  // Performance score trajectory for the intern
  const perfData = [
    { week: "W1", score: 78 },
    { week: "W2", score: 81 },
    { week: "W3", score: 84 },
    { week: "W4", score: 86 },
    { week: "W5", score: 91 },
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
      } catch {
        // Fallback for offline/demo mode
        setTaskStats({ total: 18, completed: 14, inProgress: 3, pendingOverdue: 1 });
      } finally {
        setLoading(false);
      }
    };
    fetchTaskStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Top Metric Cards (Directly styled after InternPath gradient cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Attendance (Navy Gradient) */}
        <div className="bg-gradient-ip-navy rounded-2xl p-5 text-white shadow-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#c8e4f1]">Attendance Rate</span>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              <UserCheck className="w-4 h-4 text-[#8cdcf0]" />
            </div>
          </div>
          <div className="my-3">
            <p className="text-3xl font-extrabold tracking-tight">96.4%</p>
            <p className="text-[11px] text-[#b0d8ea] mt-0.5">1 Late check-in this month</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8de2f5]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+1.2% over target</span>
          </div>
        </div>

        {/* Card 2: Tasks Completed (Teal Gradient) */}
        <div className="bg-gradient-ip-teal rounded-2xl p-5 text-white shadow-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-white/90">Tasks Completed</span>
            <div className="p-2 rounded-xl bg-white/15 backdrop-blur-xs">
              <ClipboardList className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="my-3">
            <p className="text-3xl font-extrabold tracking-tight">
              {loading ? "-" : taskStats ? `${taskStats.completed}/${taskStats.total}` : "0/0"}
            </p>
            <p className="text-[11px] text-white/80 mt-0.5">
              {loading
                ? "Loading records..."
                : taskStats
                ? `${taskStats.inProgress} active, ${taskStats.pendingOverdue} pending`
                : "No tasks yet"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{taskStats?.completed || 0} milestones verified</span>
          </div>
        </div>

        {/* Card 3: Evaluation Rating (Blue Gradient) */}
        <div className="bg-gradient-ip-blue rounded-2xl p-5 text-white shadow-md flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#cce7f5]">Average Score</span>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
              <Star className="w-4 h-4 text-[#ffe066]" />
            </div>
          </div>
          <div className="my-3">
            <p className="text-3xl font-extrabold tracking-tight">4.8 <span className="text-lg font-normal text-[#cce7f5]">/ 5.0</span></p>
            <p className="text-[11px] text-[#b3daf0] mt-0.5">Based on 3 supervisor reviews</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8ee3f5]">
            <Award className="w-3.5 h-3.5" />
            <span>Top Tier Standing</span>
          </div>
        </div>

        {/* Card 4: Hours Logged (Crisp White Card with Cyan Accents) */}
        <div className="bg-white rounded-2xl border border-[#d8e5ee] p-5 shadow-xs flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#607b91]">Hours Logged</span>
            <div className="p-2 rounded-xl bg-[#e6f4f8] text-[#1c647e]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <p className="text-3xl font-extrabold text-[#183348] tracking-tight">128 <span className="text-lg font-normal text-[#607b91]">Hrs</span></p>
            <p className="text-[11px] text-[#607b91] mt-0.5">Requirement: 160 Hrs this term</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2eb4d6]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>32 hours remaining (80%)</span>
          </div>
        </div>
      </div>

      {/* ── Row 2: Milestone Completion Breakdown & Performance Trajectory ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Milestone Completion Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#d8e5ee] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-[#eef4f8] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#183348]">Milestone Breakdown</h3>
              <p className="text-[11px] text-[#607b91]">Active deliverables and logbook validation states</p>
            </div>
            <Badge variant="cyan">Real-time Sync</Badge>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-[#2eb4d6]" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              {[
                {
                  label: "Total Work Items",
                  value: taskStats?.total || 0,
                  desc: "Assigned program tasks",
                  bg: "bg-[#f4f8fb]",
                  border: "border-[#d8e5ee]",
                  text: "text-[#183348]",
                },
                {
                  label: "Approved & Completed",
                  value: taskStats?.completed || 0,
                  desc: "Verified by mentor",
                  bg: "bg-[#eaf8f3]",
                  border: "border-[#bde8d6]",
                  text: "text-[#0d6e46]",
                },
                {
                  label: "In Progress",
                  value: taskStats?.inProgress || 0,
                  desc: "Under active development",
                  bg: "bg-[#eef8fc]",
                  border: "border-[#c4e6f4]",
                  text: "text-[#196587]",
                },
                {
                  label: "Pending Review",
                  value: taskStats?.pendingOverdue || 0,
                  desc: "Awaiting supervisor sign-off",
                  bg: "bg-[#fff8ea]",
                  border: "border-[#fce1b4]",
                  text: "text-[#975a16]",
                },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} ${s.border} rounded-xl p-4 border flex flex-col gap-1`}>
                  <span className="text-[11px] font-semibold text-[#5a768c]">{s.label}</span>
                  <span className={`text-2xl font-black tracking-tight ${s.text}`}>{s.value}</span>
                  <span className="text-[10px] text-[#718b9e]">{s.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Performance Curve */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#d8e5ee] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#183348]">Performance Score Trend</h3>
              <span className="text-[10.5px] bg-[#e6f4f8] text-[#1c647e] px-2.5 py-0.5 rounded-full font-semibold">
                Weekly Rubric
              </span>
            </div>
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#183348]">95.0%</span>
                <span className="text-xs text-emerald-600 font-bold">↑ +4.0 pts (Week 6)</span>
              </div>
              <p className="text-[11px] text-[#607b91]">Cumulative score calculated from weekly supervisor evaluations</p>
            </div>
          </div>

          <div className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={perfData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="ip-chart-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2eb4d6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2eb4d6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#607b91" }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: "#607b91" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#183348",
                    color: "#ffffff",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "11px",
                    padding: "6px 12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#2eb4d6"
                  strokeWidth={2.5}
                  fill="url(#ip-chart-grad)"
                  dot={{ r: 4, fill: "#265275", stroke: "#ffffff", strokeWidth: 1.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Row 3: Supervisor Feedback and Upcoming Schedule ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Supervisor Evaluations & Comments */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#d8e5ee] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-[#eef4f8] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#183348]">Recent Mentor Feedback</h3>
              <p className="text-[11px] text-[#607b91]">Verifiable rubric ratings logged by your supervisor</p>
            </div>
            <Sparkles className="w-4 h-4 text-[#2eb4d6]" />
          </div>

          <div className="space-y-3.5">
            {feedback.map((f) => (
              <div
                key={f.id}
                className="bg-[#f9fbfd] rounded-xl p-4 border border-[#e2ecf3] flex items-start justify-between gap-3 transition-colors hover:bg-[#f3f8fc]"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-ip-teal text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    {f.avatar}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#183348]">{f.supervisor}</span>
                      <span className="text-[10px] text-[#718c9f]">{f.date}</span>
                    </div>
                    <p className="text-xs text-[#3a586e] leading-relaxed">{f.text}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-[#fff8ea] border border-[#fce1b4] px-2.5 py-1 rounded-full text-amber-800 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-extrabold">{f.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#d8e5ee] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-[#eef4f8] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#183348]">Program Calendar</h3>
              <p className="text-[11px] text-[#607b91]">Upcoming milestones & reviews</p>
            </div>
            <CalendarDays className="w-4 h-4 text-[#2eb4d6]" />
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Mid-Term Review with Dr. Ngozi Eze",
                time: "22 Jun 2026 · 10:00 AM",
                type: "Supervisor Sync",
                bg: "bg-[#eaf5f8] border-[#c4e4ee] text-[#1a5b74]",
              },
              {
                title: "Workshop: Production Microservices with Prisma",
                time: "24 Jun 2026 · 02:00 PM",
                type: "Technical Seminar",
                bg: "bg-[#f0f4f9] border-[#d4e1ed] text-[#224867]",
              },
              {
                title: "Logbook Submission Deadline (Week 6)",
                time: "26 Jun 2026 · 05:00 PM",
                type: "Submission Due",
                bg: "bg-[#fef2f2] border-[#fecaca] text-[#991b1b]",
              },
            ].map((s, i) => (
              <div key={i} className={`p-3 rounded-xl border text-left ${s.bg}`}>
                <span className="text-[9.5px] font-bold uppercase tracking-wider opacity-80">{s.type}</span>
                <p className="text-xs font-bold leading-snug mt-1 text-[#183348]">{s.title}</p>
                <p className="text-[10px] mt-1.5 flex items-center gap-1.5 opacity-80">
                  <Calendar className="w-3 h-3" /> {s.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
