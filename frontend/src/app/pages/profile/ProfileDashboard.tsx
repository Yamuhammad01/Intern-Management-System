import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  ChevronRight,
  Edit3,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Award,
  Hash,
} from "lucide-react";
import { useProfile, InternProfile } from "./ProfileContext";
import { ImageUpload } from "../../components/ImageUpload";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
};

const formatDate = (iso: string | null): string => {
  if (!iso) return "Not Set";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const capitalizeRole = (role: string) => {
  return role
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// ─── Info Row Component ───────────────────────────────────────────────────────

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string | null;
  fallback?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  icon: Icon,
  label,
  value,
  fallback = "Not provided",
}) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-b-0">
    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-xs font-medium text-gray-800 mt-0.5 break-words">
        {value || fallback}
      </p>
    </div>
  </div>
);

// ─── Edit Form Component ──────────────────────────────────────────────────────

interface EditFormProps {
  profile: InternProfile;
  onSave: (data: Record<string, string>) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

const EditForm: React.FC<EditFormProps> = ({
  profile,
  onSave,
  onCancel,
  saving,
}) => {
  const [form, setForm] = useState({
    fullName: profile.fullName,
    phone: profile.phone || "",
    department: profile.department || "",
    matricNumber: profile.matricNumber || "",
    faculty: profile.faculty || "",
    institution: profile.institution || "",
    startDate: profile.startDate ? profile.startDate.split("T")[0] : "",
    endDate: profile.endDate ? profile.endDate.split("T")[0] : "",
    supervisorName: profile.supervisorName || "",
    organizationName: profile.organizationName || "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onSave({
        ...form,
        startDate: form.startDate
          ? new Date(form.startDate).toISOString()
          : "",
        endDate: form.endDate ? new Date(form.endDate).toISOString() : "",
      });
    } catch (err: any) {
      setError(err.message ?? "Failed to save profile");
    }
  };

  // All fields are read-only EXCEPT the phone number, which remains editable.
  const fields = [
    {
      key: "fullName",
      label: "Full Name",
      icon: User,
      placeholder: "Enter your full name",
      editable: false,
    },
    {
      key: "matricNumber",
      label: "Matric Number",
      icon: Hash,
      placeholder: "e.g. CSC/2021/001",
      editable: false,
    },
    {
      key: "department",
      label: "Department",
      icon: BookOpen,
      placeholder: "e.g. Computer Science",
      editable: false,
    },
    {
      key: "faculty",
      label: "Faculty",
      icon: Building2,
      placeholder: "e.g. Faculty of Computing",
      editable: false,
    },
    {
      key: "institution",
      label: "Institution",
      icon: GraduationCap,
      placeholder: "e.g. University of Technology",
      editable: false,
    },
    {
      key: "phone",
      label: "Phone Number",
      icon: Phone,
      placeholder: "+234 800 000 0000",
      type: "tel",
      editable: true,
    },
    {
      key: "organizationName",
      label: "Organization",
      icon: Briefcase,
      placeholder: "Internship organization name",
      editable: false,
    },
    {
      key: "supervisorName",
      label: "Supervisor Name",
      icon: User,
      placeholder: "Your assigned supervisor",
      editable: false,
    },
  ];

  const dateFields = [
    { key: "startDate", label: "Internship Start Date", editable: false },
    { key: "endDate", label: "Internship End Date", editable: false },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-2 text-[11px] text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Personal & College Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3.5">
        {fields.map(({ key, label, icon: Icon, placeholder, type, editable }) => (
          <div key={key} className="flex flex-col gap-1">
            <label
              htmlFor={`edit-${key}`}
              className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5"
            >
              <Icon className="w-3 h-3 text-gray-400" />
              {label}
            </label>
            <input
              id={`edit-${key}`}
              type={type || "text"}
              value={(form as any)[key]}
              onChange={editable ? (e) => handleChange(key, e.target.value) : undefined}
              readOnly={!editable}
              placeholder={placeholder}
              className={`w-full bg-[#f3f3f5] border-0 outline-none rounded-xl px-4 py-2.5 text-xs placeholder:text-gray-400 transition-all duration-200 ${
                editable
                  ? "focus:bg-white focus:ring-1.5 focus:ring-emerald-500"
                  : "cursor-not-allowed"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Date Fields */}
      <div>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
          Internship Timeline
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3.5">
          {dateFields.map(({ key, label, editable }) => (
            <div key={key} className="flex flex-col gap-1">
              <label
                htmlFor={`edit-${key}`}
                className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5"
              >
                <Calendar className="w-3 h-3 text-gray-400" />
                {label}
              </label>
              <input
                id={`edit-${key}`}
                type="date"
                value={(form as any)[key]}
                onChange={editable ? (e) => handleChange(key, e.target.value) : undefined}
                readOnly={!editable}
                className="w-full bg-[#f3f3f5] border-0 outline-none rounded-xl px-4 py-2.5 text-xs placeholder:text-gray-400 focus:bg-white focus:ring-1.5 focus:ring-emerald-500 transition-all duration-200"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <X className="w-3.5 h-3.5 inline mr-1" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
        >
          {saving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const InternshipProgress: React.FC<{ start: string | null; end: string | null }> = ({
  start,
  end,
}) => {
  if (!start || !end) {
    return (
      <p className="text-xs text-gray-400 italic">
        Timeline dates not yet configured.
      </p>
    );
  }

  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  const now = Date.now();

  let percent = 0;
  if (now >= endMs) percent = 100;
  else if (now > startMs) {
    percent = Math.round(((now - startMs) / (endMs - startMs)) * 100);
  }

  const daysLeft = Math.max(
    0,
    Math.ceil((endMs - now) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-gray-500 font-medium">{percent}% Complete</span>
        <span className="text-emerald-600 font-semibold">
          {daysLeft} days remaining
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
};

// ─── Profile Completion Score ─────────────────────────────────────────────────

const getCompletionScore = (profile: InternProfile): { score: number; total: number } => {
  const fields = [
    profile.matricNumber,
    profile.faculty,
    profile.institution,
    profile.department,
    profile.phone,
    profile.startDate,
    profile.endDate,
    profile.supervisorName,
    profile.organizationName,
  ];
  const filled = fields.filter((f) => f !== null && f !== "").length;
  return { score: filled, total: fields.length };
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE DASHBOARD MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const ProfileDashboard: React.FC = () => {
  const { profile, loading, saving, error, fetchProfile, updateProfile, uploadAvatar } =
    useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = async (data: Record<string, string>) => {
    await updateProfile(data);
    setIsEditing(false);
    setSuccessMsg("Profile updated successfully!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleUploadAvatar = async (base64: string) => {
    await uploadAvatar(base64);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
          <p className="text-xs font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-800">Profile Unavailable</p>
          <p className="text-xs text-gray-500 mt-1">
            Could not load profile data. Try refreshing the page.
          </p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { score, total } = getCompletionScore(profile);
  const completionPercent = Math.round((score / total) * 100);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── Header with Avatar ── */}
      <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-emerald-600 to-emerald-400 relative" />

        <div className="px-5 pb-5">
          {/* Avatar */}
          <div className="flex items-end -mt-10 mb-3">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-50">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white text-xl font-bold">
                    {getInitials(profile.fullName)}
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                title="Edit profile"
              >
                <Edit3 className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>

            <div className="ml-4 pb-1">
              <h2 className="text-base font-bold text-gray-800">{profile.fullName}</h2>
              <p className="text-[11px] text-gray-500 font-medium">
                {capitalizeRole(profile.role)}
                {profile.matricNumber && (
                  <> &middot; {profile.matricNumber}</>
                )}
              </p>
            </div>
          </div>

          {/* Success message */}
          {successMsg && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              {successMsg}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-1.5 text-[11px] text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg mb-3">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Profile completion bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-gray-400 font-medium">Profile Completion</span>
                <span className="text-emerald-600 font-bold">{completionPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`shrink-0 text-[11px] font-semibold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                isEditing
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
              }`}
            >
              {isEditing ? (
                <>
                  <X className="w-3.5 h-3.5" /> Close
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Personal & College Info */}
        <div className="lg:col-span-7 space-y-4">
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
            <h3 className="text-[13px] font-semibold text-gray-800 mb-0.5">
              Personal Information
            </h3>
            <p className="text-[10px] text-gray-400 mb-2">
              Your basic contact and identity details
            </p>
            <div className="divide-y divide-gray-50">
              <InfoRow icon={User} label="Full Name" value={profile.fullName} />
              <InfoRow icon={Mail} label="Email Address" value={profile.email} />
              <InfoRow icon={Phone} label="Phone Number" value={profile.phone} />
              <InfoRow
                icon={Hash}
                label="Matric Number"
                value={profile.matricNumber}
                fallback="Not yet set"
              />
              <InfoRow
                icon={Award}
                label="Role"
                value={capitalizeRole(profile.role)}
              />
            </div>
          </div>

          {/* College Information */}
          <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
            <h3 className="text-[13px] font-semibold text-gray-800 mb-0.5">
              Academic Information
            </h3>
            <p className="text-[10px] text-gray-400 mb-2">
              Your institution and course details
            </p>
            <div className="divide-y divide-gray-50">
              <InfoRow
                icon={GraduationCap}
                label="Institution"
                value={profile.institution}
                fallback="Not yet set"
              />
              <InfoRow
                icon={Building2}
                label="Faculty"
                value={profile.faculty}
                fallback="Not yet set"
              />
              <InfoRow
                icon={BookOpen}
                label="Department"
                value={profile.department}
                fallback="Not yet set"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Internship Details */}
        <div className="lg:col-span-5 space-y-4">
          {/* Internship Timeline */}
          <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
            <h3 className="text-[13px] font-semibold text-gray-800 mb-0.5">
              Internship Timeline
            </h3>
            <p className="text-[10px] text-gray-400 mb-3">
              Your program duration and progress
            </p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50/40 rounded-xl p-3 border border-emerald-100/50">
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold mb-1">
                    <Calendar className="w-3 h-3" />
                    Start Date
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    {formatDate(profile.startDate)}
                  </p>
                </div>
                <div className="bg-amber-50/40 rounded-xl p-3 border border-amber-100/50">
                  <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-semibold mb-1">
                    <Calendar className="w-3 h-3" />
                    End Date
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    {formatDate(profile.endDate)}
                  </p>
                </div>
              </div>
              <InternshipProgress start={profile.startDate} end={profile.endDate} />

              {(!profile.startDate || !profile.endDate) && (
                <div className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  Set your internship dates to track progress
                </div>
              )}
            </div>
          </div>

          {/* Supervisor & Organization */}
          <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
            <h3 className="text-[13px] font-semibold text-gray-800 mb-0.5">
              Supervisor & Organization
            </h3>
            <p className="text-[10px] text-gray-400 mb-2">
              Your assigned mentor and host company
            </p>
            <div className="divide-y divide-gray-50">
              <div className="flex items-start gap-3 py-2.5">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Supervisor
                  </p>
                  <p className="text-xs font-medium text-gray-800 mt-0.5">
                    {profile.supervisorName || (
                      <span className="text-gray-400 italic">Not assigned</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 py-2.5">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600 shrink-0 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Organization
                  </p>
                  <p className="text-xs font-medium text-gray-800 mt-0.5">
                    {profile.organizationName || (
                      <span className="text-gray-400 italic">Not assigned</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Avatar Upload Card */}
          <div className="bg-white rounded-xl border border-black/[0.07] shadow-sm p-4">
            <h3 className="text-[13px] font-semibold text-gray-800 mb-0.5">
              Profile Photo
            </h3>
            <p className="text-[10px] text-gray-400 mb-3">
              Upload or update your profile picture
            </p>
            <ImageUpload
              currentAvatar={profile.avatarUrl}
              onUpload={handleUploadAvatar}
              saving={saving}
            />
          </div>
        </div>
      </div>

      {/* ── Edit Profile Full-Screen Modal ── */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-black/[0.07] animate-scale-up">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-5 py-3.5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-gray-800">Edit Profile</h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                aria-label="Close edit profile"
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-5 py-4">
              <EditForm
                profile={profile}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
                saving={saving}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};