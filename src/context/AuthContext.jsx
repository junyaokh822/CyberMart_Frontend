// AuthContext.jsx
// Global authentication context provider
// Manages user state, token persistence, and auth operations (login/register/logout)
import { createContext, useState, useEffect, useContext } from "react";
import {
  login as loginApi,
  register as registerApi,
  getProfile,
} from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Load user data when token exists
  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Fetch user profile from API
  const loadUser = async () => {
    try {
      const { data } = await getProfile();
      setUser(data);
    } catch (error) {
      console.error("Failed to load user", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login user and store token
  const login = async (email, password) => {
    const { data } = await loginApi({ email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  // Register new user and store token
  const register = async (userData) => {
    const { data } = await registerApi(userData);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data);
    return data;
  };

  // Logout user and clear token
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Context value with auth state and methods
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loadUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
