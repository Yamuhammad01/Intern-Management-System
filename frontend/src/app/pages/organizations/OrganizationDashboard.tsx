import { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Globe,
  Users,
  ChevronRight,
  Trash2,
  Edit3,
  X,
  Briefcase,
  Phone,
  Mail,
  Filter,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { OrganizationForm } from "./OrganizationForm";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface Organization {
  id: string;
  name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  sector: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function OrganizationDashboard() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        ...(search && { search }),
        ...(sectorFilter && { sector: sectorFilter }),
      });

      const res = await fetch(`${API_BASE}/organizations?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch organizations");

      const data = await res.json();
      if (data.success) {
        setOrganizations(data.data.organizations);
        setPagination(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [pagination.page, sectorFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    fetchOrganizations();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this organization?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/organizations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete organization");

      setOrganizations((orgs) => orgs.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete organization");
    }
  };

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingOrg(null);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    fetchOrganizations();
  };

  const sectorBadgeColor: Record<string, string> = {
    TECHNOLOGY: "bg-blue-100 text-blue-700 border-blue-200",
    FINANCE: "bg-emerald-100 text-emerald-700 border-emerald-200",
    HEALTHCARE: "bg-red-100 text-red-700 border-red-200",
    EDUCATION: "bg-violet-100 text-violet-700 border-violet-200",
    ENGINEERING: "bg-orange-100 text-orange-700 border-orange-200",
    MANUFACTURING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    RETAIL: "bg-pink-100 text-pink-700 border-pink-200",
    MEDIA: "bg-purple-100 text-purple-700 border-purple-200",
    CONSULTING: "bg-cyan-100 text-cyan-700 border-cyan-200",
    NON_PROFIT: "bg-lime-100 text-lime-700 border-lime-200",
    GOVERNMENT: "bg-gray-100 text-gray-700 border-gray-200",
    OTHER: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Organizations</h1>
            <p className="text-[11px] text-gray-500">Manage partner organizations and placements</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Organization
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-black/[0.07] p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs outline-none w-full placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white outline-none"
            >
              <option value="">All Sectors</option>
              <option value="TECHNOLOGY">Technology</option>
              <option value="FINANCE">Finance</option>
              <option value="HEALTHCARE">Healthcare</option>
              <option value="EDUCATION">Education</option>
              <option value="ENGINEERING">Engineering</option>
              <option value="MANUFACTURING">Manufacturing</option>
              <option value="RETAIL">Retail</option>
              <option value="MEDIA">Media</option>
              <option value="CONSULTING">Consulting</option>
              <option value="NON_PROFIT">Non-Profit</option>
              <option value="GOVERNMENT">Government</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
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
          <div className="p-8 text-center text-xs text-gray-500">Loading organizations...</div>
        ) : organizations.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500">No organizations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-3 font-semibold text-gray-600">Organization</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Sector</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Contact</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Location</th>
                  <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{org.name}</p>
                          {org.website && (
                            <a
                              href={org.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:underline flex items-center gap-1"
                            >
                              <Globe className="w-3 h-3" />
                              {org.website.replace(/^https?:\/\//, "")}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                          sectorBadgeColor[org.sector] || sectorBadgeColor["OTHER"]
                        }`}
                      >
                        {org.sector.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5">
                        {org.email && (
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="truncate max-w-[180px]">{org.email}</span>
                          </div>
                        )}
                        {org.phone && (
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{org.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {org.address ? (
                        <div className="flex items-start gap-1.5 text-gray-600">
                          <MapPin className="w-3 h-3 text-gray-400 mt-0.5" />
                          <span className="line-clamp-2">{org.address}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(org)}
                          className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-600 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(org.id)}
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
        {!loading && organizations.length > 0 && (
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

      {/* Modal */}
      {showForm && (
        <OrganizationForm
          organization={editingOrg}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}