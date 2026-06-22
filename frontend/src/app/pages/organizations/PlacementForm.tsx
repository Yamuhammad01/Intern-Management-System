import { useEffect, useState } from "react";
import { X } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface Placement {
  id: string;
  internId: string;
  internName: string;
  internEmail: string;
  matricNumber: string | null;
  organizationId: string;
  organizationName: string;
  organizationSector: string;
  supervisorId: string | null;
  supervisorName: string | null;
  status: string;
  role: string | null;
  department: string | null;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Intern {
  id: string;
  userId: string;
  matricNumber: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface OrganizationOption {
  id: string;
  name: string;
  sector: string;
}

interface SupervisorOption {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface PlacementFormProps {
  placement: Placement | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function PlacementForm({ placement, onClose, onSuccess }: PlacementFormProps) {
  const [formData, setFormData] = useState({
    internId: "",
    organizationId: "",
    supervisorId: "",
    status: "ACTIVE",
    role: "",
    department: "",
    startDate: "",
    endDate: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [interns, setInterns] = useState<Intern[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([]);
  const [supervisors, setSupervisors] = useState<SupervisorOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    if (placement) {
      setFormData({
        internId: placement.internId,
        organizationId: placement.organizationId,
        supervisorId: placement.supervisorId || "",
        status: placement.status,
        role: placement.role || "",
        department: placement.department || "",
        startDate: placement.startDate || "",
        endDate: placement.endDate || "",
        notes: placement.notes || "",
      });
    }
  }, [placement]);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const token = localStorage.getItem("accessToken");

        const [internsRes, orgsRes, supervisorsRes] = await Promise.all([
          fetch(`${API_BASE}/users?role=INTERN`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/organizations?limit=100`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/users?role=SUPERVISOR`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const internsData = await internsRes.json();
        const orgsData = await orgsRes.json();
        const supervisorsData = await supervisorsRes.json();

        if (internsData.success && Array.isArray(internsData.data)) {
          const mappedInterns: Intern[] = internsData.data.map((u: any) => ({
            id: u.internProfile?.id || u.id,
            userId: u.id,
            matricNumber: u.internProfile?.matricNumber || null,
            user: {
              firstName: u.firstName,
              lastName: u.lastName,
              email: u.email,
            },
          }));
          setInterns(mappedInterns);
        }

        if (orgsData.success && Array.isArray(orgsData.data?.organizations)) {
          setOrganizations(orgsData.data.organizations);
        }

        if (supervisorsData.success && Array.isArray(supervisorsData.data)) {
          const mappedSupervisors: SupervisorOption[] = supervisorsData.data.map((u: any) => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
          }));
          setSupervisors(mappedSupervisors);
        }
      } catch (err) {
        console.error("Failed to fetch form options:", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      const url = placement
        ? `${API_BASE}/placements/${placement.id}`
        : `${API_BASE}/placements`;
      const method = placement ? "PUT" : "POST";

      const payload: any = { ...formData };
      if (!payload.supervisorId) delete payload.supervisorId;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save placement");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-lg w-full max-w-lg p-6 relative space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800">
            {placement ? "Edit Placement" : "Add Placement"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-md p-2">
            {error}
          </div>
        )}

        {loadingOptions ? (
          <div className="text-xs text-gray-500 py-4 text-center">Loading options...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                Intern <span className="text-red-500">*</span>
              </label>
              <select
                name="internId"
                value={formData.internId}
                onChange={handleChange}
                required
                disabled={!!placement}
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 bg-white disabled:bg-gray-50"
              >
                <option value="">Select an intern</option>
                {interns.map((intern) => (
                  <option key={intern.id} value={intern.id}>
                    {intern.user.firstName} {intern.user.lastName}
                    {intern.matricNumber ? ` (${intern.matricNumber})` : ""} - {intern.user.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                Organization <span className="text-red-500">*</span>
              </label>
              <select
                name="organizationId"
                value={formData.organizationId}
                onChange={handleChange}
                required
                disabled={!!placement}
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 bg-white disabled:bg-gray-50"
              >
                <option value="">Select an organization</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.sector})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 block mb-1">Supervisor</label>
              <select
                name="supervisorId"
                value={formData.supervisorId}
                onChange={handleChange}
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 bg-white"
              >
                <option value="">None / Unassigned</option>
                {supervisors.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.firstName} {sup.lastName} - {sup.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Developer"
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Engineering"
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 block mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 bg-white"
              >
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 block mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes about this placement..."
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50"
              >
                {loading ? "Saving..." : placement ? "Update" : "Create"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}