import React, { useState, useEffect } from "react";

function ReportViewPage({ navigate, reportType = "intern" }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add class to body when on report view page
    document.body.classList.add('report-view-mode');
    
    fetchReportData();
    
    return () => {
      document.body.classList.remove('report-view-mode');
    };
  }, []);

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/reports/${reportType}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        setReportData(result.data);
      } else {
        // Use mock data if API fails
        setReportData(getMockReportData(reportType));
      }
    } catch (error) {
      console.error('Failed to fetch report data, using mock data:', error);
      // Use mock data as fallback
      setReportData(getMockReportData(reportType));
    }
    setLoading(false);
    
    // Auto-trigger print dialog after data loads
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const getMockReportData = (type) => ({
    reportType: type,
    dateRange: 'Jan 1, 2025 – Jun 30, 2025',
    sections: {
      executiveSummary: {
        totalInterns: 45,
        totalEvaluations: 156,
        averageScore: 7.8,
        completionRate: 92,
        topPerformers: 12,
        improvementAreas: ['Technical Skills', 'Communication'],
      },
      internScorecards: [
        {
          name: 'Sarah Johnson',
          department: 'Engineering',
          overallScore: 9.2,
          skills: { technical: 9.5, communication: 8.8, teamwork: 9.3 },
          tasksCompleted: 24,
          tasksTotal: 26,
        },
        {
          name: 'Michael Chen',
          department: 'Engineering',
          overallScore: 8.9,
          skills: { technical: 9.1, communication: 8.5, teamwork: 9.1 },
          tasksCompleted: 22,
          tasksTotal: 24,
        },
        {
          name: 'Emily Rodriguez',
          department: 'Design',
          overallScore: 9.0,
          skills: { technical: 8.8, communication: 9.2, teamwork: 9.0 },
          tasksCompleted: 28,
          tasksTotal: 30,
        },
        {
          name: 'David Kim',
          department: 'Marketing',
          overallScore: 8.5,
          skills: { technical: 8.2, communication: 8.8, teamwork: 8.5 },
          tasksCompleted: 20,
          tasksTotal: 22,
        },
      ],
      skillsAssessment: {
        technicalSkills: {
          average: 8.5,
          breakdown: {
            programming: 9.0,
            debugging: 8.3,
            systemDesign: 8.1,
            testing: 8.6,
          },
        },
        softSkills: {
          average: 8.2,
          breakdown: {
            communication: 8.4,
            teamwork: 8.7,
            leadership: 7.8,
            timeManagement: 7.9,
          },
        },
      },
      taskCompletion: {
        totalTasks: 156,
        completed: 142,
        pending: 14,
        averageCompletionTime: '3.2 days',
        byDepartment: [
          { department: 'Engineering', completed: 85, total: 92 },
          { department: 'Design', completed: 32, total: 35 },
          { department: 'Marketing', completed: 25, total: 29 },
        ],
      },
      mentorFeedback: [
        {
          mentor: 'Dr. Emily Rodriguez',
          feedback: 'Excellent progress this quarter. Shows strong aptitude for system design and architecture.',
          intern: 'Sarah Johnson',
          date: '2025-05-15',
        },
        {
          mentor: 'Prof. David Kim',
          feedback: 'Great improvement in communication skills. Ready for more complex tasks and leadership roles.',
          intern: 'Michael Chen',
          date: '2025-05-12',
        },
        {
          mentor: 'Dr. Lisa Thompson',
          feedback: 'Creative problem solver. Consistently delivers high-quality design work.',
          intern: 'Emily Rodriguez',
          date: '2025-05-10',
        },
      ],
      recommendations: {
        trainingPrograms: [
          'Advanced JavaScript Workshop',
          'Communication Skills Training',
          'Project Management Basics',
          'Leadership Development Program',
        ],
        nextSteps: [
          'Schedule quarterly reviews for all interns',
          'Expand mentorship program to include cross-department pairing',
          'Implement skill-based task assignments',
          'Introduce peer feedback sessions',
        ],
      },
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-gray-500">Loading report...</div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-gray-500">Failed to load report data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Report Header */}
      <div className="max-w-4xl mx-auto mb-8 text-center border-b pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">IH</span>
          </div>
          <div className="text-left">
            <h1 className="text-xl font-bold text-gray-900">InternHub</h1>
            <p className="text-xs text-gray-600">Internship Management System</p>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Q2 2025 {reportType === "intern" ? "Intern" : "Organization"} Report
        </h2>
        <p className="text-sm text-gray-600">January 1, 2025 – June 30, 2025</p>
      </div>

      {/* Executive Summary */}
      <div className="max-w-4xl mx-auto mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Executive Summary</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Interns</p>
            <p className="text-3xl font-bold text-gray-900">{reportData.sections.executiveSummary.totalInterns}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Evaluations</p>
            <p className="text-3xl font-bold text-gray-900">{reportData.sections.executiveSummary.totalEvaluations}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Average Score</p>
            <p className="text-3xl font-bold text-gray-900">{reportData.sections.executiveSummary.averageScore}/10</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
            <p className="text-3xl font-bold text-gray-900">{reportData.sections.executiveSummary.completionRate}%</p>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">Key Improvement Areas</p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {reportData.sections.executiveSummary.improvementAreas.map((area, idx) => (
              <li key={idx}>{area}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Intern Scorecards */}
      {reportData.sections.internScorecards && reportData.sections.internScorecards.length > 0 && (
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Intern Scorecards</h3>
          <div className="space-y-4">
            {reportData.sections.internScorecards.map((scorecard, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{scorecard.name}</h4>
                    <p className="text-sm text-gray-600">{scorecard.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Overall Score</p>
                    <p className="text-2xl font-bold text-gray-900">{scorecard.overallScore}/10</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-700 mb-1">Technical Skills</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${scorecard.skills.technical * 10}%` }}></div>
                    </div>
                    <p className="text-xs font-bold text-gray-900 mt-1">{scorecard.skills.technical}/10</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 mb-1">Communication</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${scorecard.skills.communication * 10}%` }}></div>
                    </div>
                    <p className="text-xs font-bold text-gray-900 mt-1">{scorecard.skills.communication}/10</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 mb-1">Teamwork</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${scorecard.skills.teamwork * 10}%` }}></div>
                    </div>
                    <p className="text-xs font-bold text-gray-900 mt-1">{scorecard.skills.teamwork}/10</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  Task Completion: {scorecard.tasksCompleted} of {scorecard.tasksTotal} tasks completed
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Assessment */}
      {reportData.sections.skillsAssessment && (
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Skills Assessment</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Technical Skills</h4>
              <p className="text-sm text-gray-700 mb-3">Average Score: {reportData.sections.skillsAssessment.technicalSkills.average}/10</p>
              <div className="space-y-3">
                {Object.entries(reportData.sections.skillsAssessment.technicalSkills.breakdown).map(([skill, value]) => (
                  <div key={skill}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-bold text-gray-900">{value}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${value * 10}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Soft Skills</h4>
              <p className="text-sm text-gray-700 mb-3">Average Score: {reportData.sections.skillsAssessment.softSkills.average}/10</p>
              <div className="space-y-3">
                {Object.entries(reportData.sections.skillsAssessment.softSkills.breakdown).map(([skill, value]) => (
                  <div key={skill}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-bold text-gray-900">{value}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${value * 10}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Completion */}
      {reportData.sections.taskCompletion && (
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Task Completion</h3>
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900">{reportData.sections.taskCompletion.totalTasks}</p>
                <p className="text-xs text-gray-600 mt-1">Total Tasks</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-600">{reportData.sections.taskCompletion.completed}</p>
                <p className="text-xs text-gray-600 mt-1">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-600">{reportData.sections.taskCompletion.pending}</p>
                <p className="text-xs text-gray-600 mt-1">Pending</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">Average Completion Time: {reportData.sections.taskCompletion.averageCompletionTime}</p>
            <div className="space-y-2">
              {reportData.sections.taskCompletion.byDepartment.map((dept, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {dept.completed}/{dept.total} ({Math.round((dept.completed/dept.total)*100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mentor Feedback */}
      {reportData.sections.mentorFeedback && reportData.sections.mentorFeedback.length > 0 && (
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Mentor Feedback</h3>
          <div className="space-y-4">
            {reportData.sections.mentorFeedback.map((feedback, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{feedback.mentor}</p>
                    <p className="text-xs text-gray-600">Regarding: {feedback.intern}</p>
                  </div>
                  <p className="text-xs text-gray-500">{feedback.date}</p>
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed">"{feedback.feedback}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {reportData.sections.recommendations && (
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Recommendations</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Training Programs</h4>
              <ul className="space-y-2">
                {reportData.sections.recommendations.trainingPrograms.map((program, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                    <span className="text-emerald-600 font-bold mr-2">•</span>
                    <span>{program}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-5">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Next Steps</h4>
              <ul className="space-y-2">
                {reportData.sections.recommendations.nextSteps.map((step, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                    <span className="text-emerald-600 font-bold mr-2">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-12 pt-6 border-t text-center">
        <p className="text-xs text-gray-500">Generated by InternHub Internship Management System</p>
        <p className="text-xs text-gray-500 mt-1">Report Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>
  );
}

export { ReportViewPage };