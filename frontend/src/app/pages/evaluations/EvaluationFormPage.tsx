import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Award, ArrowLeft, Star, CheckCircle2, Loader2, Sparkles, AlertCircle, Building2, User } from "lucide-react";
import { Button } from "../../components/ui/button";

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

export const EvaluationFormPage: React.FC<{ onNavigate?: (view: string, params?: any) => void }> = ({
  onNavigate,
}) => {
  const [formData, setFormData] = useState({
    placementId: "",
    internId: "",
    attendance: "9",
    technicalSkills: "9",
    communication: "8",
    teamwork: "9",
    initiative: "8",
    problemSolving: "9",
    professionalConduct: "10",
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

        if (!internsRes.ok || !placementsRes.ok) {
          throw new Error("Failed to fetch interns/placements");
        }

        const internsJson = await internsRes.json();
        const placementsJson = await placementsRes.json();

        setInterns(internsJson.data || []);
        setPlacements(placementsJson.data?.placements || []);
      } catch (err) {
        console.warn("Using fallback demo options:", err);
        setInterns([
          { id: "int-1", firstName: "Adaeze", lastName: "Nwosu" },
          { id: "int-2", firstName: "Oluwaseun", lastName: "Adeyemi" },
        ]);
        setPlacements([
          {
            id: "plc-1",
            internId: "int-1",
            organizationId: "org-1",
            role: "Backend Engineering Intern",
            department: "Core Payments",
            status: "ACTIVE",
            internName: "Adaeze Nwosu",
            organizationName: "Flutterwave Technology Solutions",
          },
          {
            id: "plc-2",
            internId: "int-2",
            organizationId: "org-2",
            role: "Software Engineering Intern",
            department: "Platform Engineering",
            status: "ACTIVE",
            internName: "Oluwaseun Adeyemi",
            organizationName: "Andela Nigeria",
          },
        ]);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScoreChange = (criterionKey: string, score: number) => {
    setFormData((prev) => ({ ...prev, [criterionKey]: score.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.internId || !formData.placementId) {
      toast.error("Please select both an intern and their corresponding placement.");
      return;
    }

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
          attendance: parseInt(formData.attendance, 10) * 10,
          technicalSkills: parseInt(formData.technicalSkills, 10) * 10,
          communication: parseInt(formData.communication, 10) * 10,
          teamwork: parseInt(formData.teamwork, 10) * 10,
          initiative: parseInt(formData.initiative, 10) * 10,
          problemSolving: parseInt(formData.problemSolving, 10) * 10,
          professionalConduct: parseInt(formData.professionalConduct, 10) * 10,
          strengths: formData.strengths,
          improvements: formData.improvements,
          comments: formData.comments,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to submit evaluation");
      }

      toast.success("Evaluation Submitted Successfully!");
      onNavigate?.("evaluations-summary");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong during submission");
    } finally {
      setLoading(false);
    }
  };

  const criteria = [
    { key: "attendance", label: "Attendance & Punctuality", description: "Timeliness, presence, and adherence to working hours" },
    { key: "technicalSkills", label: "Technical Competence", description: "Job-related skills, code quality, and execution speed" },
    { key: "communication", label: "Communication & Clarity", description: "Verbal standups, written notes, and async documentation" },
    { key: "teamwork", label: "Team Collaboration", description: "Receptiveness to feedback, cross-functional synergy" },
    { key: "initiative", label: "Proactive Initiative", description: "Self-driven problem exploration, ownership of tasks" },
    { key: "problemSolving", label: "Analytical Problem Solving", description: "Critical thinking and debugging methodologies" },
    { key: "professionalConduct", label: "Workplace Ethics & Conduct", description: "Professional integrity, respect, and company policies" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate?.("Dashboard")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#265275] hover:text-[#2eb4d6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Supervisor Dashboard
        </button>

        <span className="text-xs font-semibold text-[#1c647e] bg-[#e6f4f8] border border-[#c4e4ee] px-3.5 py-1 rounded-full">
          Formal Grading Rubric
        </span>
      </div>

      {/* ── Form Card ── */}
      <div className="bg-white rounded-2xl border border-[#d8e5ee] p-6 sm:p-8 shadow-xs space-y-7">
        <div className="border-b border-[#eef4f8] pb-4">
          <div className="flex items-center gap-2.5 mb-1">
            <Award className="w-5 h-5 text-[#2eb4d6]" />
            <h2 className="text-xl font-bold text-[#183348]">Formal Performance Evaluation</h2>
          </div>
          <p className="text-xs text-[#607b91]">
            Grade the student intern across the 7 institutional performance criteria (rated 1 - 10).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* ── Intern and Placement Selectors ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f8fafc] border border-[#e4ecf2] rounded-xl p-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1d3d56]">
                Select Student Intern <span className="text-red-500">*</span>
              </label>
              <select
                name="internId"
                value={formData.internId}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#d7e4ed] bg-white px-3.5 py-2.5 text-xs text-[#183348] font-medium outline-none focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all cursor-pointer"
                required
                disabled={loadingOptions}
              >
                <option value="">
                  {loadingOptions ? "Loading student list..." : "-- Select Student Intern --"}
                </option>
                {interns.map((intern) => (
                  <option key={intern.id} value={intern.id}>
                    {intern.firstName} {intern.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1d3d56]">
                Host Organization Placement <span className="text-red-500">*</span>
              </label>
              <select
                name="placementId"
                value={formData.placementId}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#d7e4ed] bg-white px-3.5 py-2.5 text-xs text-[#183348] font-medium outline-none focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all cursor-pointer"
                required
                disabled={loadingOptions}
              >
                <option value="">
                  {loadingOptions ? "Loading placement records..." : "-- Select Placement Record --"}
                </option>
                {placements.map((plc) => (
                  <option key={plc.id} value={plc.id}>
                    {plc.organizationName} {plc.role ? `(${plc.role})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── 7 Evaluation Criteria ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#183348]">Evaluation Criteria (1 to 10 Scale)</h3>
              <span className="text-[11px] text-[#607b91]">1 = Needs Development, 10 = Exceptional</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criteria.map((item) => {
                const currentScore = parseInt((formData as any)[item.key], 10) || 5;
                return (
                  <div
                    key={item.key}
                    className="bg-[#f9fbfd] border border-[#dce7ef] rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#183348]">{item.label}</p>
                        <p className="text-[10.5px] text-[#718c9f] mt-0.5">{item.description}</p>
                      </div>
                      <span className="text-base font-black text-[#265275] bg-white border border-[#d7e4ed] px-2.5 py-1 rounded-lg shadow-2xs">
                        {currentScore}/10
                      </span>
                    </div>

                    {/* Numeric Selector (1 - 10) */}
                    <div className="grid grid-cols-10 gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleScoreChange(item.key, num)}
                          className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            num === currentScore
                              ? "bg-[#265275] text-white shadow-xs scale-105"
                              : "bg-white border border-[#d8e5ee] text-[#557388] hover:bg-[#eef5fa] hover:text-[#183348]"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Qualitative Assessment ── */}
          <div className="space-y-4 pt-2 border-t border-[#eef4f8]">
            <h3 className="text-sm font-bold text-[#183348]">Qualitative Remarks</h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1d3d56]">Demonstrated Strengths</label>
                <textarea
                  name="strengths"
                  value={formData.strengths}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Detail outstanding accomplishments, fast learning abilities, or technical leadership..."
                  className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl p-3.5 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all resize-y leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1d3d56]">Recommended Areas for Growth</label>
                <textarea
                  name="improvements"
                  value={formData.improvements}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Suggest technical domains, communication habits, or architectural skills to strengthen..."
                  className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl p-3.5 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all resize-y leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1d3d56]">General Supervisor Assessment</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Overall concluding summary on the intern's contribution to the team and institution..."
                  className="w-full bg-[#f8fafc] border border-[#d7e4ed] rounded-xl p-3.5 text-xs text-[#183348] placeholder:text-[#8ea5b6] outline-none focus:bg-white focus:border-[#2eb4d6] focus:ring-2 focus:ring-[#2eb4d6]/20 transition-all resize-y leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eef4f8]">
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate?.("Dashboard")}
              className="border-[#d7e4ed] text-[#265275] text-xs font-semibold"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="navy"
              disabled={loading}
              className="text-white text-xs font-semibold shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Submitting Scorecard...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Publish Official Evaluation
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
