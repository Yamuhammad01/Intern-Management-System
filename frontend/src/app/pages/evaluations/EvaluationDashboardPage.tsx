import React, { useState } from "react";
import { Star, Download, Eye, Search } from "lucide-react";

export const EvaluationDashboardPage: React.FC<{ onNavigate?: (view: string, params?: any) => void }> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - replace with actual API call
  const evaluations = [
    {
      id: "1",
      internName: "John Doe",
      supervisorName: "Mr. Bello",
      program: "Software Engineering",
      score: 85,
      status: "Completed",
      date: "2026-06-15",
      criteria: {
        attendance: 9,
        technicalSkills: 8,
        communication: 7,
        teamwork: 9,
        initiative: 8,
        problemSolving: 8,
        professionalConduct: 9,
      },
    },
    {
      id: "2",
      internName: "Mary Sule",
      supervisorName: "Mrs. Amina",
      program: "Product Design",
      score: 72,
      status: "Completed",
      date: "2026-06-14",
      criteria: {
        attendance: 7,
        technicalSkills: 7,
        communication: 8,
        teamwork: 8,
        initiative: 6,
        problemSolving: 7,
        professionalConduct: 7,
      },
    },
    {
      id: "3",
      internName: "Ahmed Musa",
      supervisorName: "Mr. David",
      program: "Data Analytics",
      score: null,
      status: "Pending",
      date: "2026-06-16",
      criteria: {},
    },
    {
      id: "4",
      internName: "Fatima Ali",
      supervisorName: "Ms. Sarah",
      program: "Academic Research",
      score: 91,
      status: "Completed",
      date: "2026-06-13",
      criteria: {
        attendance: 10,
        technicalSkills: 9,
        communication: 9,
        teamwork: 9,
        initiative: 10,
        problemSolving: 9,
        professionalConduct: 9,
      },
    },
  ];

  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch = evaluation.internName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || evaluation.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getScoreColor = (score: number | null) => {
    if (!score) return "bg-gray-100 text-gray-500";
    if (score >= 90) return "bg-emerald-100 text-emerald-700";
    if (score >= 80) return "bg-blue-100 text-blue-700";
    if (score >= 70) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500 font-medium">Total Evaluations</span>
            <Star className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-[26px] font-semibold leading-none">24</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Across all interns</p>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500 font-medium">Completed</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-[26px] font-semibold leading-none">18</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">75% completion rate</p>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500 font-medium">Pending</span>
            <Search className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-[26px] font-semibold leading-none">6</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Awaiting review</p>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-500 font-medium">Average Score</span>
            <Star className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-[26px] font-semibold leading-none">83%</span>
          </div>
          <p className="text-[10px] text-emerald-600 mt-1">+2.4 from last month</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-bold text-gray-800">Evaluation History</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search interns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-[12px] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-[12px] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
        </div>

        {/* Evaluations Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[10.5px] text-gray-400 font-medium pb-2 pr-3">Intern</th>
                <th className="text-left text-[10.5px] text-gray-400 font-medium pb-2 pr-3">Program</th>
                <th className="text-left text-[10.5px] text-gray-400 font-medium pb-2 pr-3">Supervisor</th>
                <th className="text-left text-[10.5px] text-gray-400 font-medium pb-2 pr-3">Date</th>
                <th className="text-left text-[10.5px] text-gray-400 font-medium pb-2 pr-3">Score</th>
                <th className="text-left text-[10.5px] text-gray-400 font-medium pb-2 pr-3">Status</th>
                <th className="text-left text-[10.5px] text-gray-400 font-medium pb-2 pr-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvaluations.map((evaluation) => (
                <tr key={evaluation.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 pr-3">
                    <div>
                      <p className="text-[12px] font-semibold leading-none">{evaluation.internName}</p>
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-[11.5px] text-gray-700">{evaluation.program}</td>
                  <td className="py-3 pr-3 text-[11.5px] text-gray-600">{evaluation.supervisorName}</td>
                  <td className="py-3 pr-3 text-[11.5px] text-gray-600">
                    {new Date(evaluation.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-3">
                    {evaluation.score ? (
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${getScoreColor(evaluation.score)}`}>
                        {evaluation.score}%
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400">Not scored</span>
                    )}
                  </td>
                  <td className="py-3 pr-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      evaluation.status === "Completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : evaluation.status === "Pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {evaluation.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                        title="Download Report"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEvaluations.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[12px] text-gray-400">No evaluations found</p>
          </div>
        )}
      </div>
    </div>
  );
};