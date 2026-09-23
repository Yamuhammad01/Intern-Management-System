import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "../../components/AuthContext";
import { getAccessToken, clearAccessToken } from "../../utils/authToken";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InternProfile {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  department: string | null;
  program: string | null;
  matricNumber: string | null;
  faculty: string | null;
  institution: string | null;
  avatarUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  supervisorName: string | null;
  organizationName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  department?: string;
  program?: string;
  matricNumber?: string;
  faculty?: string;
  institution?: string;
  startDate?: string;
  endDate?: string;
  supervisorName?: string;
  organizationName?: string;
}

interface ProfileContextType {
  profile: InternProfile | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  updateContact: (phone: string) => Promise<void>;
  uploadAvatar: (base64: string) => Promise<void>;
  clearError: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const MOCK_PROFILE_KEY = "mock_intern_profile";

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token, isMockMode, logout } = useAuth();
  const [profile, setProfile] = useState<InternProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Auth helpers ──────────────────────────────────────────────────────────

  const getAuthToken = (): string | null => {
    
    return token ?? getAccessToken();
  };

  const authHeaders = () => {
    const t = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
    };
  };

  /**
   * Handle HTTP 401 Unauthorized responses.
   * If the backend rejects the token, log the user out (triggers redirect to login).
   */
  const handleUnauthorized = () => {
    setError("Your session has expired. Please log in again.");
    // Clear stale token
    clearAccessToken();
    localStorage.removeItem("mock_logged_user");
    // Log out (AuthContext will reset user to null, showing login screen)
    logout();
  };

  /**
   * Generic fetch wrapper with auth token validation.
   * - Throws on network errors
   * - Handles 401 by logging user out
   * - Handles 403 (forbidden) with clear message
   * - Handles 429 (rate limit) with retry-after message
   */
  const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const t = getAuthToken();
    if (!t) {
      throw new Error("No authentication token available. Please log in.");
    }

    const res = await fetch(url, {
      ...options,
      headers: {
        ...authHeaders(),
        ...(options.headers || {}),
      },
    });

    if (res.status === 401) {
      handleUnauthorized();
      throw new Error("Session expired. Redirecting to login...");
    }

    if (res.status === 403) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Access denied. You don't have permission to perform this action.");
    }

    if (res.status === 429) {
      throw new Error("Too many requests. Please wait a moment and try again.");
    }

    return res;
  };

  // ── Mock helpers ──────────────────────────────────────────────────────────

  const buildMockProfile = (): InternProfile => {
    const saved = localStorage.getItem(MOCK_PROFILE_KEY);
    if (saved) return JSON.parse(saved);
    const base: InternProfile = {
      id: "mock-profile-1",
      userId: user?.id ?? "mock-intern-1",
      email: user?.email ?? "intern@internhub.com",
      fullName: `${user?.firstName ?? "Aria"} ${user?.lastName ?? "Chen"}`,
      firstName: user?.firstName ?? "Aria",
      lastName: user?.lastName ?? "Chen",
      phone: user?.phone ?? "+1234567890",
      role: user?.role ?? "INTERN",
      department: user?.department ?? "Computer Science",
      program: user?.program ?? "Software Engineering",
      matricNumber: "CSC/2021/001",
      faculty: "Faculty of Computing",
      institution: "University of Technology",
      avatarUrl: null,
      startDate: "2026-01-15T00:00:00.000Z",
      endDate: "2026-07-31T00:00:00.000Z",
      supervisorName: "Jamie Liu",
      organizationName: "InternHub Technologies",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(base));
    return base;
  };

  const saveMock = (updated: InternProfile) => {
    localStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(updated));
    setProfile(updated);
  };

  // ── fetchProfile ──────────────────────────────────────────────────────────

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    if (isMockMode) {
      await new Promise((r) => setTimeout(r, 400));
      setProfile(buildMockProfile());
      setLoading(false);
      return;
    }

    try {
      const res = await authenticatedFetch(`${API_BASE}/profile/me`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to fetch profile");
      setProfile(data.data);
    } catch (err: any) {
      // Only set error if it's not an auth redirect (which logout handles)
      if (err.message !== "Session expired. Redirecting to login...") {
        setError(err.message ?? "Network error");
      }
      // Fall back to mock for offline resilience
      if (!navigator.onLine) {
        setProfile(buildMockProfile());
      }
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, isMockMode]);

  // ── updateProfile ─────────────────────────────────────────────────────────

  const updateProfile = async (payload: UpdateProfilePayload) => {
    setSaving(true);
    setError(null);

    if (isMockMode) {
      await new Promise((r) => setTimeout(r, 600));
      const current = profile ?? buildMockProfile();
      const nameParts = (payload.fullName ?? current.fullName).trim().split(/\s+/);
      const updated: InternProfile = {
        ...current,
        ...payload,
        fullName: payload.fullName ?? current.fullName,
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" ") || current.lastName,
        updatedAt: new Date().toISOString(),
      };
      saveMock(updated);
      setSaving(false);
      return;
    }

    try {
      const res = await authenticatedFetch(`${API_BASE}/profile`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to update profile");
      setProfile(data.data);
    } catch (err: any) {
      if (err.message !== "Session expired. Redirecting to login...") {
        setError(err.message ?? "Failed to save profile");
      }
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // ── updateContact ─────────────────────────────────────────────────────────

  const updateContact = async (phone: string) => {
    setSaving(true);
    setError(null);

    if (isMockMode) {
      await new Promise((r) => setTimeout(r, 400));
      const current = profile ?? buildMockProfile();
      saveMock({ ...current, phone, updatedAt: new Date().toISOString() });
      setSaving(false);
      return;
    }

    try {
      const res = await authenticatedFetch(`${API_BASE}/profile/contact`, {
        method: "PATCH",
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to update contact");
      setProfile(data.data);
    } catch (err: any) {
      if (err.message !== "Session expired. Redirecting to login...") {
        setError(err.message ?? "Failed to update contact");
      }
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // ── uploadAvatar ──────────────────────────────────────────────────────────

  const uploadAvatar = async (base64: string) => {
    setSaving(true);
    setError(null);

    if (isMockMode) {
      await new Promise((r) => setTimeout(r, 700));
      const current = profile ?? buildMockProfile();
      saveMock({ ...current, avatarUrl: base64, updatedAt: new Date().toISOString() });
      setSaving(false);
      return;
    }

    try {
      const res = await authenticatedFetch(`${API_BASE}/profile/avatar`, {
        method: "PUT",
        body: JSON.stringify({ avatar: base64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to upload avatar");
      setProfile(data.data);
    } catch (err: any) {
      if (err.message !== "Session expired. Redirecting to login...") {
        setError(err.message ?? "Failed to upload avatar");
      }
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const clearError = () => setError(null);

  // Load profile on mount / user change
  useEffect(() => {
    if (user) fetchProfile();
  }, [user, fetchProfile]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        saving,
        error,
        fetchProfile,
        updateProfile,
        updateContact,
        uploadAvatar,
        clearError,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useProfile = (): ProfileContextType => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider");
  return ctx;
};