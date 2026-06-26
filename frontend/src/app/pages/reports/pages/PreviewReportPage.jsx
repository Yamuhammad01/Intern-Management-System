import React, { useState, useEffect } from "react";
import { useAuth } from "../../../components/AuthContext";
import {
  Briefcase, Download, Printer, SlidersHorizontal, FileDown,
  ChevronRight as ChevronR, Award, AlertTriangle, Loader2,
} from "lucide-react";
import {
  Card, Chip, Ini, Breadcrumb, TASK_DETAILS,
  ORG_STATS,
} from "../components/reports/ReportsShared.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

function PreviewReportPage({ navigate, reportType = "intern" }) {
  const { user } = useAuth();
  const titles = {
    intern: "Intern Performance Report — Q2 2025",
    organization: "Organization Internship Overview — Q2 2025",
  };

  // ─── Fetch executive summary from API (intern report only) ──────────────
  const [execSummary, setExecSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // ─── Fetch scorecard from API (intern report only) ──────────────────────
  const [scorecards, setScorecards] = useState([]);
  const [scorecardsLoading, setScorecardsLoading] = useState(false);

  // ─── Fetch skills assessment from API (intern report only) ──────────────
  const [skillsAssessment, setSkillsAssessment] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);

  useEffect(() => {
    if (reportType !== "intern") return;

    const fetchSummary = async () => {
      setSummaryLoading(true);
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/supervisor/report/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        console.log("[PreviewReportPage] report summary response:", json);
        if (json.success && json.data) {
          setExecSummary(json.data);
        } else if (json.data) {
          setExecSummary(json.data);
        }
      } catch (err) {
        console.error("Failed to load report summary", err);
        if (res && !res.ok) {
          console.error(`HTTP ${res.status}: ${res.statusText}`);
        }
      } finally {
        setSummaryLoading(false);
      }
    };
    fetchSummary();
  }, [reportType]);

  useEffect(() => {
    if (reportType !== "intern") return;

    const fetchScorecards = async () => {
      setScorecardsLoading(true);
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/scorecards`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        console.log("[PreviewReportPage] scorecards response:", json);
        if (json.success && Array.isArray(json.data)) {
          setScorecards(json.data);
        }
      } catch (err) {
        console.error("Failed to load scorecards", err);
      } finally {
        setScorecardsLoading(false);
      }
    };
    fetchScorecards();
  }, [reportType]);

  useEffect(() => {
    if (reportType !== "intern") return;

    const fetchSkills = async () => {
      setSkillsLoading(true);
      try {
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/evaluations/skills-assessment`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        console.log("[PreviewReportPage] skills assessment response:", json);
        if (json.success && Array.isArray(json.data)) {
          setSkillsAssessment(json.data);
        }
      } catch (err) {
        console.error("Failed to load skills assessment", err);
      } finally {
        setSkillsLoading(false);
      }
    };
    fetchSkills();
  }, [reportType]);

  // Derive executive summary stats from API data only
  const summaryStats = execSummary
    ? [
        { label: "Total Interns", value: String(execSummary.totalInterns), delta: "Assigned to you", pos: true },
        { label: "Avg. Performance", value: execSummary.averagePerformance !== null ? String(execSummary.averagePerformance) : "N/A", delta: "Overall score", pos: true },
        { label: "Attendance Rate", value: `${execSummary.averageAttendance}%`, delta: "Across all interns", pos: true },
        { label: "Tasks Completed", value: String(execSummary.tasksCompleted), delta: `${execSummary.tasksPending} pending`, pos: execSummary.tasksPending <= execSummary.tasksCompleted },
      ]
    : [];

  // Map scorecards to report intern format
  const mapScorecardToReport = (s) => ({
    name: s.name,
    matricNo: s.matricNo || s.matric_no || s.id,
    id: s.matricNo || s.matric_no || s.id,
    program: s.program || "N/A",
    attendance: s.attendance ?? 0,
    score: s.score ?? 0,
    status: s.status || "PENDING",
    ini: s.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
    bg: "bg-emerald-500",
  });

  // Attendance color helper: high -> green, medium -> grey, low -> red
  const attendanceColor = (pct) => {
    if (pct >= 90) return "text-emerald-600";
    if (pct >= 75) return "text-gray-500";
    return "text-red-500";
  };

  // Status color helper: COMPLETED -> green
  const statusCls = (s) =>
    s === "Completed" || s === "COMPLETED" || s === "Excellent" ? "bg-emerald-100 text-emerald-700" :
    s === "Good" ? "bg-blue-100 text-blue-700" :
    "bg-red-100 text-red-600";

  const mappedScorecards = scorecards.map(mapScorecardToReport);
  const topPerformers = [...mappedScorecards].sort((a, b) => b.score - a.score).slice(0, 3);
  const atRiskInterns = [...mappedScorecards]
    .filter((s) => s.scorecardStatus !== undefined ? s.scorecardStatus : true)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return (
    <main className="flex-1 overflow-hidden flex flex-col">
      {/* Action bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between shrink-0">
        <Breadcrumb
          crumbs={[
            { label: "Reports", action: () => navigate("overview") },
            { label: "New Report", action: () => navigate("new-report", { reportType }) },
            { label: "Preview" },
          ]}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("new-report", { reportType })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12.5px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />Edit Filters
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[12.5px] font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Printer className="w-3.5 h-3.5" />Print
          </button>
          <button
            onClick={() => navigate("export", { reportType })}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[12.5px] font-semibold transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />Export Report
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* A4 document preview */}
        <div className="flex-1 bg-[#e8eaed] overflow-y-auto p-8">
          <div className="max-w-[780px] mx-auto bg-white shadow-2xl rounded-sm" style={{ minHeight: "1060px" }}>
            {/* Report header */}
            <div className="bg-[#0f2d1e] px-10 py-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-white font-bold text-[15px] block leading-none">InternHub</span>
                    <span className="text-emerald-300/70 text-[10px]">Internship Management System</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-200/60 text-[10px]">Generated: 20 Jun 2025, 09:42 AM</p>
                  <p className="text-emerald-200/60 text-[10px] mt-0.5">Prepared by: Jamie Liu · Confidential</p>
                </div>
              </div>
              <h1 className="text-white text-[22px] font-bold mb-1">{titles[reportType]}</h1>
              <p className="text-emerald-200/70 text-[12px]">
                Period: January 1, 2025 – June 30, 2025 · Programs: Engineering, Design, Marketing, Research
              </p>
            </div>

            <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300" />

            <div className="px-10 py-8 space-y-8">
              {/* 1. Executive Summary */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white font-bold">1</div>
                  <h2 className="text-[15px] font-bold text-[#0f2d1e]">Executive Summary</h2>
                </div>
                {summaryStats.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {summaryStats.map((s) => (
                      <div key={s.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-[10px] text-gray-500 font-medium mb-1">{s.label}</p>
                        <p className="text-[20px] font-bold text-[#111827] leading-none">{s.value}</p>
                        <p className={`text-[10px] mt-1 font-medium ${s.pos ? "text-emerald-600" : "text-amber-600"}`}>{s.delta}</p>
                      </div>
                    ))}
                  </div>
                ) : summaryLoading ? (
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="col-span-4 bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                      <p className="text-[11px] text-gray-400">Loading executive summary...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="col-span-4 bg-red-50 rounded-xl p-4 border border-red-100 text-center">
                      <p className="text-[11px] text-red-500">Unable to load executive summary. Please check console for details.</p>
                    </div>
                  </div>
                )}
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <p className="text-[12px] text-[#0f2d1e] leading-relaxed font-medium">
                    The Q2 2025 internship cohort demonstrated strong performance growth across all four programs, with a 4.8-point
                    improvement in average scores compared to Q1. Attendance rates remained consistently high, and the majority of
                    interns are on track to complete their program deliverables by the end of the term.
                  </p>
                </div>
              </section>

              <div className="h-px bg-gray-100" />

              {/* 2. Intern / Org table */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white font-bold">2</div>
                  <h2 className="text-[15px] font-bold text-[#0f2d1e]">
                    {reportType === "organization" ? "Department Breakdown" : "Individual Intern Scorecards"}
                  </h2>
                </div>
                {reportType === "organization" ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        {["Department", "Interns", "Avg. Score", "Task Completion", "At-Risk"].map((h) => (
                          <th key={h} className="text-left text-[10.5px] text-gray-500 font-semibold pb-2 pr-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ORG_STATS.map((r, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-0">
                          <td className="py-2.5 pr-4 text-[12.5px] font-semibold text-[#111827]">{r.dept}</td>
                          <td className="py-2.5 pr-4 text-[12px] text-gray-600">{r.interns}</td>
                          <td className="py-2.5 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${r.avgScore}%` }} />
                              </div>
                              <span className="text-[12px] font-semibold text-[#111827]">{r.avgScore}</span>
                            </div>
                          </td>
                          <td className="py-2.5 pr-4 text-[12px] text-gray-600">{r.completion}%</td>
                          <td className="py-2.5">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.risk > 3 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>{r.risk} interns</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        {["Intern", "Program", "Attendance", "Score", "Status"].map((h) => (
                          <th key={h} className="text-left text-[10.5px] text-gray-500 font-semibold pb-2 pr-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {scorecardsLoading ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center">
                            <div className="flex items-center justify-center gap-2 text-[12px] text-gray-500">
                              <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                              Loading scorecards...
                            </div>
                          </td>
                        </tr>
                      ) : mappedScorecards.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-[12px] text-gray-500">
                            No scorecards available. Complete evaluations to generate scorecards.
                          </td>
                        </tr>
                      ) : (
                        mappedScorecards.map((r, i) => (
                          <tr key={i} className="border-b border-gray-100 last:border-0">
                            <td className="py-2.5 pr-3">
                              <div className="flex items-center gap-2">
                                <Ini s={r.ini} bg={r.bg} size={6} />
                                <div>
                                  <p className="text-[11.5px] font-semibold leading-none">{r.name}</p>
                                  <p className="text-[9.5px] text-gray-400 mt-0.5">{r.matricNo}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 pr-3 text-[11px] text-gray-600">{r.program}</td>
                            <td className="py-2.5 pr-3">
                              <span className={`text-[11px] font-semibold ${attendanceColor(r.attendance)}`}>{r.attendance}%</span>
                            </td>
                            <td className="py-2.5 pr-3">
                              <span className={`text-[11px] font-semibold ${r.score >= 90 ? "text-emerald-600" : r.score >= 80 ? "text-blue-600" : "text-amber-600"}`}>{r.score}</span>
                            </td>
                            <td className="py-2.5">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusCls(r.status)}`}>{r.status}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </section>

              <div className="h-px bg-gray-100" />

              {/* 3. Skills Assessment */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white font-bold">3</div>
                  <h2 className="text-[15px] font-bold text-[#0f2d1e]">Skills Assessment</h2>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    {["Intern", "Technical Skills", "Communication", "Problem Solving", "Attendance", "Conduct"].map((h) => (
                      <div key={h} className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center first:text-left">{h}</div>
                    ))}
                  </div>
                  {skillsLoading ? (
                    <div className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-[12px] text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                        Loading skills assessment...
                      </div>
                    </div>
                  ) : skillsAssessment.length === 0 ? (
                    <div className="py-4 text-center text-[12px] text-gray-500">
                      No skills assessment data available. Complete evaluations to view skills breakdown.
                    </div>
                  ) : (
                    skillsAssessment.map((s, i) => (
                      <div key={s.id || i} className="grid grid-cols-6 gap-2 py-2 border-t border-gray-200/60 items-center">
                        <div className="flex items-center gap-2">
                          <Ini s={s.ini || "NA"} bg={s.bg || "bg-emerald-500"} size={5} />
                          <div>
                            <p className="text-[11px] font-semibold leading-none">{s.name}</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">{s.matricNo}</p>
                          </div>
                        </div>
                        {[s.technicalSkills, s.communication, s.problemSolving, s.attendance, s.professionalConduct].map((score, j) => (
                          <div key={j} className="flex flex-col items-center">
                            <span className={`text-[11px] font-bold ${score >= 90 ? "text-emerald-600" : score >= 80 ? "text-blue-600" : "text-amber-600"}`}>{score}</span>
                            <div className="w-full h-1 bg-gray-200 rounded-full mt-1">
                              <div className={`h-full rounded-full ${score >= 90 ? "bg-emerald-500" : score >= 80 ? "bg-blue-500" : "bg-amber-500"}`} style={{ width: `${score}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </section>

              <div className="h-px bg-gray-100" />

              {/* 4. Task Completion */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white font-bold">4</div>
                  <h2 className="text-[15px] font-bold text-[#0f2d1e]">Task Completion</h2>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Total Tasks", value: "14", delta: "Across all interns", pos: true },
                    { label: "Completed", value: "7", delta: "50% completion rate", pos: true },
                    { label: "In Progress", value: "3", delta: "On track", pos: true },
                    { label: "Pending/Overdue", value: "4", delta: "2 at risk", pos: false },
                  ].map((s) => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-[10px] text-gray-500 font-medium mb-1">{s.label}</p>
                      <p className="text-[20px] font-bold text-[#111827] leading-none">{s.value}</p>
                      <p className={`text-[10px] mt-1 font-medium ${s.pos ? "text-emerald-600" : "text-amber-600"}`}>{s.delta}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-100/50">
                        {["Task ID", "Task Name", "Intern", "Program", "Assigned", "Due", "Status", "Priority", "Evaluation"].map((h) => (
                          <th key={h} className="text-left text-[10px] text-gray-500 font-semibold pb-2 pr-3 pt-2 pl-2">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TASK_DETAILS.map((t, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-0">
                          <td className="py-2 pr-3 pl-2 text-[10.5px] font-mono text-gray-600">{t.id}</td>
                          <td className="py-2 pr-3 text-[11px] font-semibold text-[#111827]">{t.name}</td>
                          <td className="py-2 pr-3 text-[10.5px] text-gray-600">{t.intern}</td>
                          <td className="py-2 pr-3 text-[10.5px] text-gray-600">{t.program}</td>
                          <td className="py-2 pr-3 text-[10.5px] text-gray-600">{t.assigned}</td>
                          <td className="py-2 pr-3 text-[10.5px] text-gray-600">{t.due}</td>
                          <td className="py-2 pr-3">
                            <span className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-full ${
                              t.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                              t.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                              t.status === "Overdue" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"
                            }`}>{t.status}</span>
                          </td>
                          <td className="py-2 pr-3">
                            <span className={`text-[9.5px] font-semibold px-2 py-0.5 rounded-full ${
                              t.priority === "High" ? "bg-red-50 text-red-600" : t.priority === "Medium" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"
                            }`}>{t.priority}</span>
                          </td>
                          <td className="py-2 pr-2">
                            <span className={`text-[9.5px] font-semibold ${
                              t.evaluation === "Excellent" ? "text-emerald-600" : t.evaluation === "Pass" ? "text-blue-600" :
                              t.evaluation === "Needs Improvement" ? "text-amber-600" : "text-gray-400"
                            }`}>{t.evaluation}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {reportType === "intern" && (
                <>
                  <div className="h-px bg-gray-100" />

                  {/* 5. Top Performers */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white font-bold">5</div>
                      <h2 className="text-[15px] font-bold text-[#0f2d1e]">Top Performers</h2>
                    </div>
                    <div className="space-y-3">
                      {topPerformers.map((intern, i) => (
                        <div key={intern.ini} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gradient-to-r from-emerald-50/50 to-transparent">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-[11px] shrink-0">
                            #{i + 1}
                          </div>
                          <Ini s={intern.ini} bg={intern.bg} size={8} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-[#111827]">{intern.name}</p>
                            <p className="text-[10px] text-gray-400">{intern.program} · {intern.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[16px] font-bold text-emerald-600">{intern.score}</p>
                            <p className="text-[9px] text-emerald-500 font-medium">Score</p>
                          </div>
                          <div className="w-16 text-right">
                            <p className="text-[11px] font-semibold text-[#111827]">{intern.attendance}%</p>
                            <p className="text-[9px] text-gray-400">Attend.</p>
                          </div>
                          <Award className="w-4 h-4 text-amber-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                  </section>

                  <div className="h-px bg-gray-100" />

                  {/* 6. At-Risk Interns */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white font-bold">6</div>
                      <h2 className="text-[15px] font-bold text-[#0f2d1e]">At-Risk Interns</h2>
                    </div>
                    <div className="space-y-3">
                      {atRiskInterns.map((intern, i) => (
                        <div key={intern.ini} className="flex items-center gap-4 p-4 rounded-xl border border-amber-100 bg-gradient-to-r from-amber-50/50 to-transparent">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-[11px] shrink-0">
                            #{i + 1}
                          </div>
                          <Ini s={intern.ini} bg={intern.bg} size={8} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-[#111827]">{intern.name}</p>
                            <p className="text-[10px] text-gray-400">{intern.program} · {intern.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[16px] font-bold text-red-500">{intern.score}</p>
                            <p className="text-[9px] text-red-400 font-medium">Score</p>
                          </div>
                          <div className="w-16 text-right">
                            <p className="text-[11px] font-semibold text-[#111827]">{intern.attendance}%</p>
                            <p className="text-[9px] text-gray-400">Attend.</p>
                          </div>
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        </div>
                      ))}
                      <div className="bg-red-50 border border-red-100 rounded-xl p-3 mt-2">
                        <p className="text-[11px] text-red-700 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                          {atRiskInterns[0]?.name} requires immediate intervention. Mentor feedback session recommended.
                        </p>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {/* Footer */}
              <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
                <p className="text-[10px] text-gray-400">InternHub · Confidential — For internal use only. Generated on 20 Jun 2025.</p>
                <p className="text-[10px] text-gray-400">Page 1 of 4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar: TOC + quick export */}
        <div className="w-[220px] shrink-0 bg-white border-l border-gray-100 overflow-y-auto p-4 space-y-5">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Contents</p>
            <div className="space-y-1">
              {reportType === "intern"
                ? ["Executive Summary", "Intern Scorecards", "Skills Assessment", "Task Completion", "Top Performers", "At-Risk Interns"].map((s, i) => (
                    <button key={s} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 text-left transition-colors">
                      <span className="text-[10px] text-gray-400 w-4 shrink-0">{i + 1}.</span>
                      <span className="text-[11.5px] text-gray-700">{s}</span>
                    </button>
                  ))
                : ["Executive Summary", "Intern Scorecards", "Skills Assessment", "Task Completion"].map((s, i) => (
                    <button key={s} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 text-left transition-colors">
                      <span className="text-[10px] text-gray-400 w-4 shrink-0">{i + 1}.</span>
                      <span className="text-[11.5px] text-gray-700">{s}</span>
                    </button>
                  ))
              }
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Export</p>
            <div className="space-y-2">
              <button
                onClick={() => navigate("export", { reportType })}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                <FileDown className="w-3.5 h-3.5 shrink-0" />
                <div className="text-left">
                  <p className="text-[11.5px] font-semibold leading-none">Export as PDF</p>
                  <p className="text-[10px] text-emerald-100 mt-0.5">Recommended</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors">
                <Printer className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11.5px] font-medium">Print Report</span>
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Report Info</p>
            <div className="space-y-2">
              {[
                { label: "Type", value: reportType === "intern" ? "Intern" : "Organization" },
                { label: "Period", value: "Q2 2025" },
                { label: "Pages", value: reportType === "intern" ? "~6" : "~4" },
                { label: "Sections", value: reportType === "intern" ? "6" : "4" },
              ].map((r) => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-[11px] text-gray-400">{r.label}</span>
                  <span className="text-[11px] font-medium text-gray-700">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export { PreviewReportPage };