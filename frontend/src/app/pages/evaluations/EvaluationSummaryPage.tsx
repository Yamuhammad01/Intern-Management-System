import React from "react";
import { Users, ClipboardCheck, AlertCircle, TrendingUp } from "lucide-react";

export const EvaluationSummaryPage: React.FC = () => {
  // Mock data - replace with actual API call
  const summaryData = {
    totalEvaluations: 24,
    completedEvaluations: 18,
    pendingEvaluations: 6,
    averageScore: 83,
    topPerformers: [
      { name: "Fatima Ali", score: 91, program: "Academic Research" },
      { name: "John Doe", score: 85, program: "Software Engineering" },
      { name: "Jane Smith", score: 82, program: "Product Design" },
    ],
    needsImprovement: [
      { name: "Ahmed Musa", score: 65, program: "Data Analytics" },
      { name: "Ali Hassan", score: 68, program: "Marketing" },
    ],
    criteriaBreakdown: [
      { criterion: "Attendance", average: 8.5, max: 10 },
      { criterion: "Technical Skills", average: 8.2, max: 10 },
      { criterion: "Communication", average: 7.8, max: 10 },
      { criterion: "Teamwork", average: 8.7, max: 10 },
      { criterion: "Initiative", average: 7.9, max: 10 },
      { criterion: "Problem Solving", average: 8.1, max: 10 },
      { criterion: "Professional Conduct", average: 8.4, max: 10 },
    ],
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600 bg-emerald-50";
    if (score >= 80) return "text-blue-600 bg-blue-50";
    if (score >= 70) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Total Evaluations</p>
              <p className="text-[22px] font-bold text-gray-800 leading-none">{summaryData.totalEvaluations}</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-400">
            {summaryData.completedEvaluations} completed · {summaryData.pendingEvaluations} pending
          </p>
        </div>

        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Average Score</p>
              <p className="text-[22px] font-bold text-gray-800 leading-none">{summaryData.averageScore}%</p>
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 font-medium">+2.4% from last month</p>
        </div>

        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Completion Rate</p>
              <p className="text-[22px] font-bold text-gray-800 leading-none">
                {Math.round((summaryData.completedEvaluations / summaryData.totalEvaluations) * 100)}%
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${(summaryData.completedEvaluations / summaryData.totalEvaluations) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Pending Review</p>
              <p className="text-[22px] font-bold text-gray-800 leading-none">{summaryData.pendingEvaluations}</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-400">Require attention</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Criteria Performance */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-black/[0.07] shadow-sm p-5">
          <h3 className="text-[13px] font-bold text-gray-800 mb-4">Performance by Criteria</h3>
          <div className="space-y-3">
            {summaryData.criteriaBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-700">{item.criterion}</span>
                  <span className="text-[11px] font-semibold text-gray-800">
                    {item.average}/{item.max}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.average >= 8 ? "bg-emerald-500" :
                      item.average >= 7 ? "bg-blue-500" :
                      item.average >= 6 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${(item.average / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers & Needs Improvement Side by Side */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Top Performers */}
          <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-5">
            <h3 className="text-[13px] font-bold text-gray-800 mb-3">Top Performers</h3>
            <div className="space-y-2.5">
              {summaryData.topPerformers.map((performer, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-emerald-700">#{idx + 1}</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-800 leading-none">{performer.name}</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">{performer.program}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${getScoreColor(performer.score)}`}>
                    {performer.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Needs Improvement */}
          <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-5">
            <h3 className="text-[13px] font-bold text-gray-800 mb-3">Needs Improvement</h3>
            <div className="space-y-2.5">
              {summaryData.needsImprovement.map((person, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-red-700">!</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-800 leading-none">{person.name}</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">{person.program}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${getScoreColor(person.score)}`}>
                    {person.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};