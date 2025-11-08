import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = authService.getCurrentUser();

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = (token, userData, otpRequired = false, identifier = "") => {
    if (otpRequired) {
      setRequiresOTP(true);
      setLoginIdentifier(identifier);
    } else {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
      setRequiresOTP(false);
      setLoginIdentifier("");
    }
  };

  const completeLogin = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setRequiresOTP(false);
    setLoginIdentifier("");
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setRequiresOTP(false);
    setLoginIdentifier("");
    window.location.href = "/login";
  };

  const value = {
    isAuthenticated,
    user,
    requiresOTP,
    loginIdentifier,
    login,
    completeLogin,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
