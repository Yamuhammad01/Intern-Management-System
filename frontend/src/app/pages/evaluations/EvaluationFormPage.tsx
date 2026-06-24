import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface Intern {
  id: string;
  firstName: string;
  lastName: string;
  internProfile?: {
    id: string;
    userId: string;
  } | null;
}

interface Placement {
  id: string;
  internId: string;
  organizationId: string;
  role: string | null;
  department: string | null;
  status: string;
  internName: string;
  organizationName: string;
}

export const EvaluationFormPage: React.FC<{ onNavigate?: (view: string, params?: any) => void }> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    placementId: "",
    internId: "",
    attendance: "",
    technicalSkills: "",
    communication: "",
    teamwork: "",
    initiative: "",
    problemSolving: "",
    professionalConduct: "",
    strengths: "",
    improvements: "",
    comments: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [interns, setInterns] = useState<Intern[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const token = localStorage.getItem("accessToken");

        const [internsRes, placementsRes] = await Promise.all([
          fetch(`${API_BASE}/users?role=INTERN`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/placements/?limit=100`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!internsRes.ok) {
          throw new Error("Failed to fetch interns");
        }
        if (!placementsRes.ok) {
          throw new Error("Failed to fetch placements");
        }

        const internsJson = await internsRes.json();
        const placementsJson = await placementsRes.json();

        setInterns(internsJson.data || []);
        setPlacements(placementsJson.data?.placements || []);
      } catch (err) {
        console.error("Error fetching options:", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/evaluations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          internId: formData.internId,
          placementId: formData.placementId,
          attendance: parseInt(formData.attendance, 10) || undefined,
          technicalSkills: parseInt(formData.technicalSkills, 10) || undefined,
          communication: parseInt(formData.communication, 10) || undefined,
          teamwork: parseInt(formData.teamwork, 10) || undefined,
          initiative: parseInt(formData.initiative, 10) || undefined,
          problemSolving: parseInt(formData.problemSolving, 10) || undefined,
          professionalConduct: parseInt(formData.professionalConduct, 10) || undefined,
          strengths: formData.strengths,
          improvements: formData.improvements,
          comments: formData.comments,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit evaluation");
      }
      const data = await res.json();
      if (data.success) {
        onNavigate?.("evaluations-dashboard");
      }
    } catch (err: any) {
      console.error("Submit evaluation error:", err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const criteria = [
    { key: "attendance", label: "Attendance", description: "Punctuality and presence" },
    { key: "technicalSkills", label: "Technical Skills", description: "Job-related competencies" },
    { key: "communication", label: "Communication", description: "Verbal and written skills" },
    { key: "teamwork", label: "Teamwork", description: "Collaboration with others" },
    { key: "initiative", label: "Initiative", description: "Proactive problem-solving" },
    { key: "problemSolving", label: "Problem Solving", description: "Analytical and critical thinking" },
    { key: "professionalConduct", label: "Professional Conduct", description: "Workplace behavior and ethics" },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-6">
        <h2 className="text-[15px] font-bold text-gray-800 mb-1">Performance Evaluation Form</h2>
        <p className="text-[11px] text-gray-500 mb-6">
          Rate the intern on each criterion (1-10). All fields are required for completion.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Intern and Placement Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                Select Intern <span className="text-red-500">*</span>
              </label>
              <select
                name="internId"
                value={formData.internId}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
                disabled={loadingOptions}
              >
                <option value="">
                  {loadingOptions ? "Loading interns..." : "-- Select Intern --"}
                </option>
                {interns.map((intern) => (
                  <option key={intern.id} value={intern.id}>
                    {intern.firstName} {intern.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                Placement <span className="text-red-500">*</span>
              </label>
              <select
                name="placementId"
                value={formData.placementId}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
                disabled={loadingOptions}
              >
                <option value="">
                  {loadingOptions ? "Loading placements..." : "-- Select Placement --"}
                </option>
                {placements.map((placement) => (
                  <option key={placement.id} value={placement.id}>
                    {placement.organizationName}
                    {placement.role ? ` - ${placement.role}` : ""}
                    {placement.department ? ` (${placement.department})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scoring Criteria */}
          <div className="space-y-4">
            <h3 className="text-[13px] font-bold text-gray-800 pt-2">Evaluation Criteria</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criteria.map((criterion) => (
                <div key={criterion.key} className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className="block text-[12px] font-semibold text-gray-800">
                        {criterion.label}
                      </label>
                      <p className="text-[10px] text-gray-500">{criterion.description}</p>
                    </div>
                    <span className="text-[11px] text-gray-400">1-10</span>
                  </div>
                  <input
                    type="number"
                    name={criterion.key}
                    min="1"
                    max="10"
                    value={(formData as any)[criterion.key]}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Additional Comments */}
          <div className="space-y-4 pt-2">
            <h3 className="text-[13px] font-bold text-gray-800">Additional Feedback</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                  Strengths
                </label>
                <textarea
                  name="strengths"
                  value={formData.strengths}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Highlight the intern's key strengths..."
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                  Areas for Improvement
                </label>
                <textarea
                  name="improvements"
                  value={formData.improvements}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Suggest areas where the intern can grow..."
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
                  Additional Comments
                </label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-[13px] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Any other observations..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-emerald-600 text-white text-[12px] font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Submitting..." : "Submit Evaluation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};