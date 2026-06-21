import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "ADMIN" | "SUPERVISOR" | "INTERN" | "MENTOR" | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  department?: string;
  program?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isMockMode: boolean;
  apiConnected: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:3000/api/auth";

const DEFAULT_MOCK_USERS: User[] = [
  {
    id: "mock-intern-1",
    email: "intern@internhub.com",
    firstName: "Aria",
    lastName: "Chen",
    role: "INTERN",
    phone: "+1234567890",
    program: "Software Engineering"
  },
  {
    id: "mock-supervisor-1",
    email: "supervisor@internhub.com",
    firstName: "Jamie",
    lastName: "Liu",
    role: "SUPERVISOR",
    phone: "+1987654321",
    department: "Engineering"
  },
  {
    id: "mock-admin-1",
    email: "admin@internhub.com",
    firstName: "Sarah",
    lastName: "Jenkins",
    role: "ADMIN",
    phone: "+1555555555",
    department: "Administration"
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMockMode, setIsMockMode] = useState<boolean>(true);
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Mock users database in localStorage
  useEffect(() => {
    if (!localStorage.getItem("mock_users")) {
      localStorage.setItem("mock_users", JSON.stringify(DEFAULT_MOCK_USERS));
    }
    if (!localStorage.getItem("mock_users_passwords")) {
      localStorage.setItem(
        "mock_users_passwords",
        JSON.stringify({
          "intern@internhub.com": "Password123!",
          "supervisor@internhub.com": "Password123!",
          "admin@internhub.com": "Password123!"
        })
      );
    }
  }, []);

  // Check backend server status
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.data);
          setToken(localStorage.getItem("token"));
          setIsMockMode(false);
          setApiConnected(true);
        } else {
          // If 401/Unauthorized, backend is online but token is expired or missing
          setApiConnected(true);
          setIsMockMode(false);
        }
      } catch (err) {
        // Backend offline, fallback to mock mode
        console.warn("Backend API offline. Running in Mock Mode client-side.");
        setIsMockMode(true);
        setApiConnected(false);
        
        // Restore session from localStorage if in mock mode
        const savedUser = localStorage.getItem("mock_logged_user");
        const savedToken = localStorage.getItem("token");
        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        }
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setError(null);
    setLoading(true);

    if (!isMockMode) {
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        const resData = await res.json();
        
        if (!res.ok) {
          throw new Error(resData.message || "Failed to log in");
        }

        const { accessToken, user: loggedUser } = resData.data;
        setUser(loggedUser);
        setToken(accessToken);
        localStorage.setItem("token", accessToken);
        return loggedUser;
      } catch (err: any) {
        setError(err.message || "Network error. Connecting via Mock Mode.");
        // Fallback to mock login if backend failed during execution
        return loginMock(email, password);
      } finally {
        setLoading(false);
      }
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const loggedUser = loginMock(email, password);
            resolve(loggedUser);
          } catch (err: any) {
            reject(err);
          } finally {
            setLoading(false);
          }
        }, 800); // simulate network latency
      });
    }
  };

  const loginMock = (email: string, password: string): User => {
    const mockUsers: User[] = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const passwords = JSON.parse(localStorage.getItem("mock_users_passwords") || "{}");
    
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser || passwords[foundUser.email.toLowerCase()] !== password) {
      const err = "Invalid email or password";
      setError(err);
      throw new Error(err);
    }

    setUser(foundUser);
    setToken("mock-jwt-token");
    localStorage.setItem("token", "mock-jwt-token");
    localStorage.setItem("mock_logged_user", JSON.stringify(foundUser));
    return foundUser;
  };

  const register = async (data: any): Promise<any> => {
    setError(null);
    setLoading(true);

    if (!isMockMode) {
      try {
        const res = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: data.role,
            department: data.department,
            program: data.program
          })
        });
        const resData = await res.json();

        if (!res.ok) {
          throw new Error(resData.message || "Failed to register");
        }
        return resData.data;
      } catch (err: any) {
        setError(err.message || "Registration failed. Trying Mock Registration.");
        return registerMock(data);
      } finally {
        setLoading(false);
      }
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const newUser = registerMock(data);
            resolve(newUser);
          } catch (err: any) {
            reject(err);
          } finally {
            setLoading(false);
          }
        }, 800);
      });
    }
  };

  const registerMock = (data: any): any => {
    const mockUsers: User[] = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const passwords = JSON.parse(localStorage.getItem("mock_users_passwords") || "{}");

    if (mockUsers.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      const err = "A user with this email already exists";
      setError(err);
      throw new Error(err);
    }

    const newUser: User = {
      id: `mock-user-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || "INTERN",
      phone: data.phone || "",
      department: data.department || "",
      program: data.program || ""
    };

    mockUsers.push(newUser);
    passwords[newUser.email.toLowerCase()] = data.password;

    localStorage.setItem("mock_users", JSON.stringify(mockUsers));
    localStorage.setItem("mock_users_passwords", JSON.stringify(passwords));
    return newUser;
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    if (!isMockMode) {
      try {
        await fetch(`${API_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`
          }
        });
      } catch (err) {
        console.error("Logout request failed, logging out client side anyway", err);
      }
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("mock_logged_user");
    setLoading(false);
  };

  const forgotPassword = async (email: string): Promise<void> => {
    setError(null);
    setLoading(true);

    if (!isMockMode) {
      try {
        const res = await fetch(`${API_URL}/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to send reset link");
        }
      } catch (err: any) {
        console.warn("Forgot password API failed, running mock simulation");
      } finally {
        setLoading(false);
      }
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`[MOCK] Password reset request for ${email}`);
          setLoading(false);
          resolve();
        }, 600);
      });
    }
  };

  const resetPassword = async (password: string, resetToken: string): Promise<void> => {
    setError(null);
    setLoading(true);

    if (!isMockMode) {
      try {
        const res = await fetch(`${API_URL}/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: resetToken, password })
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to reset password");
        }
      } catch (err: any) {
        setError(err.message || "Failed to reset password");
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          const passwords = JSON.parse(localStorage.getItem("mock_users_passwords") || "{}");
          const mockUsers: User[] = JSON.parse(localStorage.getItem("mock_users") || "[]");
          const target = mockUsers[0];
          if (target) {
            passwords[target.email.toLowerCase()] = password;
            localStorage.setItem("mock_users_passwords", JSON.stringify(passwords));
          }
          setLoading(false);
          resolve();
        }, 800);
      });
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    setError(null);
    setLoading(true);

    if (!isMockMode) {
      try {
        const res = await fetch(`${API_URL}/change-password`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`
          },
          body: JSON.stringify({ currentPassword, newPassword })
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to change password");
        }
      } catch (err: any) {
        setError(err.message || "Failed to change password");
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!user) {
            reject(new Error("No user logged in"));
            return;
          }
          const passwords = JSON.parse(localStorage.getItem("mock_users_passwords") || "{}");
          if (passwords[user.email.toLowerCase()] !== currentPassword) {
            const err = "Current password is incorrect";
            setError(err);
            setLoading(false);
            reject(new Error(err));
            return;
          }
          passwords[user.email.toLowerCase()] = newPassword;
          localStorage.setItem("mock_users_passwords", JSON.stringify(passwords));
          setLoading(false);
          resolve();
        }, 600);
      });
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isMockMode,
        apiConnected,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,
        clearError,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
