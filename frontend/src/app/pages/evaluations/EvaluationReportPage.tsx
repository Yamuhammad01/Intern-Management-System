import React from "react";
import { Download, Printer, Share2, ArrowLeft } from "lucide-react";

export const EvaluationReportPage: React.FC<{ onNavigate?: (view: string, params?: any) => void }> = ({ onNavigate }) => {
  // Mock data - replace with actual API call
  const evaluation = {
    id: "1",
    internName: "John Doe",
    internEmail: "john.doe@university.edu",
    supervisorName: "Mr. Bello",
    placement: "TechCorp Inc. - Frontend Developer",
    program: "Software Engineering",
    status: "Completed",
    date: "2026-06-15",
    overallScore: 85,
    criteria: {
      attendance: { score: 9, max: 10, comment: "Excellent punctuality and consistent attendance" },
      technicalSkills: { score: 8, max: 10, comment: "Strong grasp of React and TypeScript" },
      communication: { score: 7, max: 10, comment: "Good written communication, improving verbally" },
      teamwork: { score: 9, max: 10, comment: "Works well in team settings, collaborative" },
      initiative: { score: 8, max: 10, comment: "Proactively seeks out new tasks" },
      problemSolving: { score: 8, max: 10, comment: "Effective analytical skills" },
      professionalConduct: { score: 9, max: 10, comment: "Maintains professional demeanor" },
    },
    strengths: [
      "Excellent technical foundation",
      "Strong team collaboration skills",
      "Consistent attendance and punctuality",
    ],
    improvements: [
      "Continue developing verbal communication skills",
      "Seek more leadership opportunities",
    ],
    comments: "John has been an outstanding intern throughout the program. His technical skills and teamwork make him a valuable team member. I recommend considering him for future roles.",
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-emerald-100 text-emerald-700";
    if (score >= 80) return "bg-blue-100 text-blue-700";
    if (score >= 70) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const getGrade = (score: number) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B+";
    if (score >= 70) return "B";
    if (score >= 60) return "C+";
    return "C";
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-[15px] font-bold text-gray-800">Evaluation Report</h2>
              <p className="text-[11px] text-gray-500">Performance Assessment Details</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white text-[12px] font-semibold hover:bg-emerald-700 transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-6">
        {/* Report Header */}
        <div className="border-b border-gray-100 pb-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[18px] font-bold text-gray-800 mb-2">Performance Evaluation Report</h1>
              <p className="text-[11px] text-gray-500">Generated on {new Date(evaluation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg ${getScoreColor(evaluation.overallScore)}`}>
              <div className="text-center">
                <div className="text-[24px] font-bold leading-none">{evaluation.overallScore}%</div>
                <div className="text-[10px] font-semibold mt-0.5">Grade: {getGrade(evaluation.overallScore)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Intern & Placement Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h3 className="text-[13px] font-bold text-gray-800">Intern Information</h3>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-gray-500">Full Name</p>
                <p className="text-[13px] font-semibold text-gray-800">{evaluation.internName}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Email</p>
                <p className="text-[12px] text-gray-700">{evaluation.internEmail}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Program</p>
                <p className="text-[12px] text-gray-700">{evaluation.program}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-[13px] font-bold text-gray-800">Placement Details</h3>
            <div className="space-y-2">
              <div>
                <p className="text-[10px] text-gray-500">Organization</p>
                <p className="text-[13px] font-semibold text-gray-800">{evaluation.placement}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Supervisor</p>
                <p className="text-[12px] text-gray-700">{evaluation.supervisorName}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Evaluation Status</p>
                <p className="text-[12px] font-semibold text-emerald-600">{evaluation.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Criteria Scores */}
        <div className="mb-6">
          <h3 className="text-[13px] font-bold text-gray-800 mb-4">Evaluation Criteria</h3>
          <div className="space-y-3">
            {Object.entries(evaluation.criteria).map(([key, data]: [string, any]) => (
              <div key={key} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-gray-800 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${getScoreColor(data.score)}`}>
                    {data.score}/{data.max}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${(data.score / data.max) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-600 italic">{data.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-3">Key Strengths</h3>
            <ul className="space-y-2">
              {evaluation.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-emerald-700">✓</span>
                  </span>
                  <span className="text-[12px] text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-bold text-gray-800 mb-3">Areas for Improvement</h3>
            <ul className="space-y-2">
              {evaluation.improvements.map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-amber-700">!</span>
                  </span>
                  <span className="text-[12px] text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Additional Comments */}
        <div>
          <h3 className="text-[13px] font-bold text-gray-800 mb-3">Supervisor Comments</h3>
          <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
            <p className="text-[12px] text-gray-700 leading-relaxed italic">"{evaluation.comments}"</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500">Report generated by Intern Management System</p>
            <p className="text-[10px] text-gray-400">Report ID: EVAL-{evaluation.id.toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold text-gray-800">{evaluation.supervisorName}</p>
            <p className="text-[10px] text-gray-500">Supervisor</p>
          </div>
        </div>
      </div>
    </div>
  );
};