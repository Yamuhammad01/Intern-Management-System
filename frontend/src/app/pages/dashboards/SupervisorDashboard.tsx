import React, { useState } from "react";
import { 
  Users, CalendarCheck, ClipboardList, TrendingUp, 
  MoreHorizontal, Star, Edit, Send, Check, RefreshCw 
} from "lucide-react";
import { useAuth } from "../../components/AuthContext";

interface SupervisorDashboardProps {
  user: any;
  onAddActivity?: (activity: any) => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ user, onAddActivity }) => {
  const [interns, setInterns] = useState([
    { id: "INT-2031", name: "Aria Chen", program: "Software Engineering", attendance: "96.4%", score: 4.8, status: "On Time", ini: "AC", bg: "bg-emerald-500", reviews: 3 },
    { id: "INT-2032", name: "Liam Torres", program: "Product Design", attendance: "89.2%", score: 4.2, status: "Late", ini: "LT", bg: "bg-blue-500", reviews: 2 },
    { id: "INT-2033", name: "Priya Nair", program: "Data Analytics", attendance: "95.0%", score: 4.5, status: "On Time", ini: "PN", bg: "bg-violet-500", reviews: 2 },
    { id: "INT-2034", name: "Marcus Webb", program: "Marketing & Outreach", attendance: "91.8%", score: 4.0, status: "On Leave", ini: "MW", bg: "bg-amber-500", reviews: 1 },
    { id: "INT-2035", name: "Sophie Grant", program: "Academic Research", attendance: "98.1%", score: 4.6, status: "On Time", ini: "SG", bg: "bg-pink-500", reviews: 3 }
  ]);

  const [submissions, setSubmissions] = useState([
    { id: 1, name: "Aria Chen", task: "Write API Integration tests for JWT verification", date: "18 Jun 2026", status: "Pending Review" },
    { id: 2, name: "Liam Torres", task: "Figma wireframe deliverables for onboarding flow", date: "19 Jun 2026", status: "Pending Review" },
  ]);

  const [evalSelectedIntern, setEvalSelectedIntern] = useState(interns[0].id);
  const [evalScore, setEvalScore] = useState(5);
  const [evalComments, setEvalComments] = useState("");
  const [evalSuccess, setEvalSuccess] = useState(false);

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalComments.trim()) return;

    const targetIntern = interns.find(i => i.id === evalSelectedIntern);
    if (!targetIntern) return;

    // Update intern average score
    setInterns(prev => prev.map(i => {
      if (i.id === evalSelectedIntern) {
        const newScore = Number(((i.score * i.reviews + evalScore) / (i.reviews + 1)).toFixed(2));
        return { ...i, score: newScore, reviews: i.reviews + 1 };
      }
      return i;
    }));

    // Trigger parent callback to add activity if defined
    if (onAddActivity) {
      onAddActivity({
        ini: "DP",
        bg: "bg-blue-600",
        name: `Supervisor: ${user.firstName} ${user.lastName.charAt(0)}.`,
        text: `left feedback rating ${evalScore}/5 for ${targetIntern.name}`,
        time: "Just now"
      });
    }

    setEvalSuccess(true);
    setEvalComments("");
    setTimeout(() => setEvalSuccess(false), 3000);
  };

  const handleReviewSubmission = (subId: number, status: "Approved" | "Revision Requested") => {
    setSubmissions(prev => prev.filter(s => s.id !== subId));
    
    const targetSub = submissions.find(s => s.id === subId);
    if (targetSub && onAddActivity) {
      onAddActivity({
        ini: "DP",
        bg: "bg-blue-600",
        name: `Supervisor: ${user.firstName} ${user.lastName.charAt(0)}.`,
        text: `${status.toLowerCase()} deliverable by ${targetSub.name}`,
        time: "Just now"
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Assigned Interns", value: `${interns.length} Active`, sub: "Across 5 program tracks", change: "+1", pos: true, icon: Users, color: "text-emerald-600 bg-emerald-50" },
          { label: "Attendance Rate", value: "94.1%", sub: "Weekly target: 92.0%", change: "+2.1%", pos: true, icon: CalendarCheck, color: "text-blue-600 bg-blue-50" },
          { label: "Pending Reviews", value: `${submissions.length} Tasks`, sub: "Deliverables awaiting review", change: "-2", pos: true, icon: ClipboardList, color: "text-amber-500 bg-amber-50" },
          { label: "Average Evaluation", value: "4.42 / 5.0", sub: "Global performance average", change: "+0.15", pos: true, icon: TrendingUp, color: "text-indigo-600 bg-indigo-50" },
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
                {c.change}
              </span>
            </div>
            <p className="text-[10.5px] text-gray-400 leading-snug">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Row 2: Interns Directory */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-[13px] font-semibold text-gray-800">Assigned Student Interns</h3>
          <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Department: {user.department || "Engineering"}</span>
        </div>
        
        <div className="scroll-x-contained">
        <table className="w-full min-w-[620px]">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-[10.5px] font-medium text-left">
              <th className="pb-2 pr-3 pl-0">Student Name</th>
              <th className="pb-2 pr-3">Program Track</th>
              <th className="pb-2 pr-3 text-center">Attendance Rate</th>
              <th className="pb-2 pr-3 text-center">Performance Rating</th>
              <th className="pb-2 pr-3">Daily Status</th>
              <th className="pb-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {interns.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                <td className="py-2.5 pr-3 pl-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 ${r.bg} rounded-full flex items-center justify-center text-white font-bold text-[10px]`}>
                      {r.ini}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-gray-800 leading-none">{r.name}</p>
                      <p className="text-[9.5px] text-gray-400 mt-0.5">{r.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 pr-3 text-xs text-gray-700">{r.program}</td>
                <td className="py-2.5 pr-3 text-xs text-gray-700 text-center font-medium">{r.attendance}</td>
                <td className="py-2.5 pr-3 text-center">
                  <div className="inline-flex items-center gap-0.5 bg-amber-50 border border-amber-200/50 px-1.5 py-0.5 rounded text-amber-700 font-bold text-[10.5px]">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    {r.score.toFixed(1)}
                  </div>
                </td>
                <td className="py-2.5 pr-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    r.status === "On Time" ? "bg-emerald-100 text-emerald-700" :
                    r.status === "Late"    ? "bg-red-100 text-red-600" :
                    "bg-gray-100 text-gray-500"
                  }`}>{r.status}</span>
                </td>
                <td className="py-2.5 text-right">
                  <button 
                    onClick={() => {
                      setEvalSelectedIntern(r.id);
                      setEvalSuccess(false);
                      const selectElement = document.getElementById("internSelect");
                      if (selectElement) selectElement.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-emerald-600 transition-colors inline-flex items-center gap-1 text-[10.5px] font-bold"
                  >
                    <Edit className="w-3 h-3" /> Grade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Row 3: Evaluation Form and Task Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Submit Review Card */}
        <div id="internSelect" className="lg:col-span-6 bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[13px] font-semibold text-gray-800 mb-3 border-b border-gray-50 pb-2">Evaluate Student Performance</h3>
            
            {evalSuccess && (
              <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-800 text-center font-medium animate-pulse">
                Evaluation submitted successfully! Intern dashboard updated.
              </div>
            )}

            <form onSubmit={handleSubmitEvaluation} className="space-y-3.5">
              {/* Select Intern */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-600">Select Intern</label>
                <select
                  value={evalSelectedIntern}
                  onChange={(e) => setEvalSelectedIntern(e.target.value)}
                  className="w-full bg-[#f3f3f5] border-0 outline-none rounded-xl px-4 py-2.5 text-xs text-gray-800 appearance-none focus:bg-white focus:ring-1.5 focus:ring-emerald-500 transition-all duration-200"
                >
                  {interns.map(i => (
                    <option key={i.id} value={i.id}>{i.name} ({i.id})</option>
                  ))}
                </select>
              </div>

              {/* Select Rating */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-600">Performance Rating (1-5 Stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEvalScore(s)}
                      className="p-1 rounded hover:bg-slate-100 transition-colors"
                    >
                      <Star className={`w-6 h-6 ${s <= evalScore ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comments */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-600">Evaluation Comments</label>
                <textarea
                  rows={3}
                  value={evalComments}
                  onChange={(e) => setEvalComments(e.target.value)}
                  placeholder="Provide constructive feedback about code quality, reliability, collaboration..."
                  className="w-full bg-[#f3f3f5] border-0 outline-none rounded-xl px-4 py-2.5 text-xs placeholder:text-gray-400 focus:bg-white focus:ring-1.5 focus:ring-emerald-500 transition-all duration-200 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold py-2 px-4 rounded-xl transition-all duration-200 shadow-sm flex items-center gap-1.5 hover:translate-y-[-1px]"
              >
                <Send className="w-3.5 h-3.5" /> Submit Evaluation
              </button>
            </form>
          </div>
        </div>

        {/* Pending Submissions Card */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
          <h3 className="text-[13px] font-semibold text-gray-800 mb-3 border-b border-gray-50 pb-2">Student Task Submissions</h3>
          
          {submissions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-10 text-center gap-2">
              <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300">
                <Check className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-xs font-semibold text-gray-600">All submissions graded!</p>
              <p className="text-[10px] text-gray-400">You are completely caught up on reviews.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {submissions.map((s) => (
                <div key={s.id} className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">{s.name}</span>
                    <span className="text-[10px] text-gray-400">{s.date}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-snug">{s.task}</p>
                  
                  <div className="flex justify-end gap-2 text-[10px] font-bold mt-1">
                    <button
                      onClick={() => handleReviewSubmission(s.id, "Revision Requested")}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 text-amber-600 rounded border border-amber-200 transition-colors flex items-center gap-0.5"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> Revision
                    </button>
                    <button
                      onClick={() => handleReviewSubmission(s.id, "Approved")}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded border border-emerald-200 transition-colors flex items-center gap-0.5"
                    >
                      <Check className="w-2.5 h-2.5" /> Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
