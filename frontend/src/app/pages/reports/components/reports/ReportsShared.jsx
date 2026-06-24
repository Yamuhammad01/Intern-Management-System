import React from "react";
import { ChevronRight as ChevronR } from "lucide-react";

// ─── Shared primitives ────────────────────────────────────────────────────────
export function Card({ children, className = "", onClick }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-xl border border-black/[0.07] shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Chip({ children, className = "" }) {
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${className}`}>{children}</span>;
}

export function Ini({ s, bg, size = 6 }) {
  return (
    <span className={`w-${size} h-${size} ${bg} rounded-full flex items-center justify-center text-white font-bold shrink-0 ${size <= 6 ? "text-[10px]" : "text-xs"}`}>
      {s}
    </span>
  );
}

export function Breadcrumb({ crumbs }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
      {crumbs.map((c, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronR className="w-3 h-3 text-gray-400" />}
          {c.action
            ? <button onClick={c.action} className="hover:text-emerald-700 transition-colors font-medium">{c.label}</button>
            : <span className={i === crumbs.length - 1 ? "text-[#111827] font-semibold" : ""}>{c.label}</span>
          }
        </div>
      ))}
    </div>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────
export const REPORT_PERF = [
  { month: "Jan", Engineering: 68, Design: 72, Marketing: 65, Research: 70 },
  { month: "Feb", Engineering: 71, Design: 74, Marketing: 68, Research: 73 },
  { month: "Mar", Engineering: 70, Design: 71, Marketing: 67, Research: 72 },
  { month: "Apr", Engineering: 76, Design: 78, Marketing: 72, Research: 77 },
  { month: "May", Engineering: 82, Design: 84, Marketing: 78, Research: 80 },
  { month: "Jun", Engineering: 87, Design: 89, Marketing: 82, Research: 85 },
];

export const ATTENDANCE_TREND = [
  { week: "W1", rate: 88 }, { week: "W2", rate: 91 }, { week: "W3", rate: 89 }, { week: "W4", rate: 94 },
  { week: "W5", rate: 92 }, { week: "W6", rate: 95 }, { week: "W7", rate: 93 }, { week: "W8", rate: 96 },
];

export const TASK_COMPLETION = [
  { program: "Engineering", completed: 84, pending: 16 }, { program: "Design", completed: 78, pending: 22 },
  { program: "Marketing", completed: 71, pending: 29 }, { program: "Research", completed: 88, pending: 12 },
];

export const SKILLS_ASSESSMENT = [
  { ini: "AC", name: "Aria Chen", id: "#INT-2031", technical: 92, communication: 88, problemSolving: 90, leadership: 85, domain: 91 },
  { ini: "LT", name: "Liam Torres", id: "#INT-2032", technical: 80, communication: 82, problemSolving: 78, leadership: 70, domain: 76 },
  { ini: "PN", name: "Priya Nair", id: "#INT-2033", technical: 95, communication: 90, problemSolving: 94, leadership: 88, domain: 93 },
  { ini: "MW", name: "Marcus Webb", id: "#INT-2034", technical: 72, communication: 68, problemSolving: 70, leadership: 65, domain: 74 },
  { ini: "SG", name: "Sophie Grant", id: "#INT-2035", technical: 88, communication: 90, problemSolving: 86, leadership: 82, domain: 87 },
];

export const TASK_DETAILS = [
  { id: "TSK-001", name: "API Integration", intern: "Aria Chen", program: "Software Eng.", assigned: "01 Jan", due: "15 Jan", status: "Completed", priority: "High", evaluation: "Pass" },
  { id: "TSK-002", name: "Database Schema Design", intern: "Aria Chen", program: "Software Eng.", assigned: "16 Jan", due: "30 Jan", status: "Completed", priority: "High", evaluation: "Pass" },
  { id: "TSK-003", name: "User Authentication Flow", intern: "Aria Chen", program: "Software Eng.", assigned: "01 Feb", due: "14 Feb", status: "Completed", priority: "Medium", evaluation: "Pass" },
  { id: "TSK-004", name: "Wireframe Creation", intern: "Liam Torres", program: "Product Design", assigned: "05 Jan", due: "19 Jan", status: "Completed", priority: "High", evaluation: "Pass" },
  { id: "TSK-005", name: "Prototype Testing", intern: "Liam Torres", program: "Product Design", assigned: "20 Jan", due: "03 Feb", status: "In Progress", priority: "Medium", evaluation: "-" },
  { id: "TSK-006", name: "Final Design Handoff", intern: "Liam Torres", program: "Product Design", assigned: "04 Feb", due: "18 Feb", status: "Pending", priority: "High", evaluation: "-" },
  { id: "TSK-007", name: "Data Pipeline Setup", intern: "Priya Nair", program: "Data Analytics", assigned: "10 Jan", due: "24 Jan", status: "Completed", priority: "High", evaluation: "Pass" },
  { id: "TSK-008", name: "Dashboard Development", intern: "Priya Nair", program: "Data Analytics", assigned: "25 Jan", due: "08 Feb", status: "Completed", priority: "High", evaluation: "Excellent" },
  { id: "TSK-009", name: "Campaign Strategy Plan", intern: "Marcus Webb", program: "Marketing", assigned: "12 Jan", due: "26 Jan", status: "Completed", priority: "High", evaluation: "Needs Improvement" },
  { id: "TSK-010", name: "Social Media Analytics", intern: "Marcus Webb", program: "Marketing", assigned: "27 Jan", due: "10 Feb", status: "In Progress", priority: "Medium", evaluation: "-" },
  { id: "TSK-011", name: "Competitor Research", intern: "Sophie Grant", program: "Research", assigned: "08 Jan", due: "22 Jan", status: "Completed", priority: "Medium", evaluation: "Pass" },
  { id: "TSK-012", name: "Final Report Writing", intern: "Sophie Grant", program: "Research", assigned: "23 Jan", due: "06 Feb", status: "In Progress", priority: "High", evaluation: "-" },
];

export const REPORT_INTERNS = [
  { name: "Aria Chen", id: "#INT-2031", program: "Software Eng.", mentor: "David Park", attendance: 96, score: 91, tasks: "12/13", status: "Excellent", ini: "AC", bg: "bg-emerald-500" },
  { name: "Liam Torres", id: "#INT-2032", program: "Product Design", mentor: "Sarah Kim", attendance: 88, score: 84, tasks: "9/11", status: "Good", ini: "LT", bg: "bg-blue-500" },
  { name: "Priya Nair", id: "#INT-2033", program: "Data Analytics", mentor: "James Wu", attendance: 97, score: 93, tasks: "14/14", status: "Excellent", ini: "PN", bg: "bg-violet-500" },
  { name: "Marcus Webb", id: "#INT-2034", program: "Marketing", mentor: "Lisa Chen", attendance: 72, score: 76, tasks: "7/12", status: "At Risk", ini: "MW", bg: "bg-amber-500" },
  { name: "Sophie Grant", id: "#INT-2035", program: "Research", mentor: "Tom Reed", attendance: 94, score: 88, tasks: "11/12", status: "Good", ini: "SG", bg: "bg-pink-500" },
];

export const RECENT_REPORTS = [
  { name: "Q2 2025 Intern Performance Summary", type: "Performance", generated: "15 Jun 2025", by: "Jamie Liu", size: "2.4 MB", status: "Ready" },
  { name: "May 2025 Attendance Report", type: "Attendance", generated: "01 Jun 2025", by: "System", size: "1.1 MB", status: "Ready" },
  { name: "Spring Cohort Intern Overview", type: "Intern", generated: "28 May 2025", by: "Jamie Liu", size: "3.2 MB", status: "Ready" },
  { name: "Organization Program Analysis", type: "Organization", generated: "20 May 2025", by: "Admin", size: "4.8 MB", status: "Ready" },
  { name: "April Performance Scorecard", type: "Performance", generated: "01 May 2025", by: "System", size: "2.1 MB", status: "Archived" },
];

export const ORG_STATS = [
  { dept: "Engineering", interns: 38, avgScore: 87, completion: 84, risk: 2 },
  { dept: "Product Design", interns: 22, avgScore: 84, completion: 78, risk: 3 },
  { dept: "Marketing", interns: 18, avgScore: 76, completion: 71, risk: 5 },
  { dept: "Research", interns: 12, avgScore: 88, completion: 88, risk: 1 },
];