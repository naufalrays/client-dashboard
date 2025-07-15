import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import type { LoginRequest } from "../types/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status saat app load
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (_: LoginRequest): Promise<void> => {
    try {
      setLoading(true);
      //TODO: UNCOMMENT THIS LINE WHEN READY
      // await authService.login(credentials);
      setIsAuthenticated(true);
      // Navigation akan di-handle di component Login
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await authService.logout();
      setIsAuthenticated(false);
      // Navigation akan di-handle di component yang memanggil logout
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      setIsAuthenticated(false);
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
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
