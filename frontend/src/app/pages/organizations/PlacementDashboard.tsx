import { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Search,
  MapPin,
  User,
  Users as UsersIcon,
  Trash2,
  Edit3,
  X,
  Filter,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { PlacementForm, Placement } from "./PlacementForm";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function PlacementDashboard() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<Placement | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [organizations, setOrganizations] = useState<{ id: string; name: string }[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchPlacements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(organizationFilter && { organizationId: organizationFilter }),
      });

      const res = await fetch(`${API_BASE}/placements?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch placements");

      const data = await res.json();
      if (data.success) {
        setPlacements(data.data.placements);
        setPagination(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/organizations?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrganizations(data.data.organizations);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlacements();
    fetchOrganizations();
  }, [pagination.page, statusFilter, organizationFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    fetchPlacements();
  };

  const handleEdit = (placement: Placement) => {
    setEditingPlacement(placement);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this placement?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/placements/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete placement");

      setPlacements((pls) => pls.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete placement");
    }
  };

  const statusBadgeColor: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
    COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
    TERMINATED: "bg-red-100 text-red-700 border-red-200",
    ON_HOLD: "bg-yellow-100 text-yellow-700 border-yellow-200",
    PENDING: "bg-orange-100 text-orange-700 border-orange-200",
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Placements</h1>
            <p className="text-[11px] text-gray-500">Manage intern placements and supervisors</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          New Placement
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search placements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs outline-none w-full placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="TERMINATED">Terminated</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
          <select
            value={organizationFilter}
            onChange={(e) => setOrganizationFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none"
          >
            <option value="">All Organizations</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Loading placements...</div>
        ) : placements.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">No placements found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 font-semibold text-gray-600">Intern</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Organization</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Role / Dept</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Supervisor</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {placements.map((placement) => (
                  <tr key={placement.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 text-[10px] font-bold">
                          {placement.internName
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{placement.internName}</p>
                          <p className="text-[10px] text-gray-500">{placement.internEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{placement.organizationName}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                        {placement.organizationSector.replace(/_/g, " ")}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {placement.role && (
                        <p className="font-medium text-gray-800">{placement.role}</p>
                      )}
                      {placement.department && (
                        <p className="text-[10px] text-gray-500">{placement.department}</p>
                      )}
                      {!placement.role && !placement.department && (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {placement.supervisorName ? (
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <User className="w-3 h-3 text-gray-400" />
                          <span>{placement.supervisorName}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                          statusBadgeColor[placement.status] || statusBadgeColor["PENDING"]
                        }`}
                      >
                        {placement.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(placement)}
                          className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-600 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(placement.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && placements.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-[11px] text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={pagination.page === 1}
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
              </button>
              {Array.from({ length: pagination.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPagination((p) => ({ ...p, page: i + 1 }))}
                  className={`w-7 h-7 rounded-md text-[11px] font-medium transition-colors ${
                    pagination.page === i + 1
                      ? "bg-emerald-500 text-white"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Placement Form Modal */}
      {showForm && (
        <PlacementForm
          placement={editingPlacement}
          onClose={() => {
            setShowForm(false);
            setEditingPlacement(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingPlacement(null);
            fetchPlacements();
          }}
        />
      )}
    </div>
  );
}