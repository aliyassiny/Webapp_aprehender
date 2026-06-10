import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types/index";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = sessionStorage.getItem("user");
    if (!savedUser || savedUser === "undefined") return null;
    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessTokenState] = useState<string | null>(() => {
    const savedToken = sessionStorage.getItem("accessToken");
    return savedToken || null;
  });

  const [refreshToken, setRefreshTokenState] = useState<string | null>(() => {
    const savedRefreshToken = sessionStorage.getItem("refreshToken");
    return savedRefreshToken || null;
  });

  // Sincronizar con sessionStorage cuando cambian los tokens
  useEffect(() => {
    const handleStorageChange = () => {
      const newAccessToken = sessionStorage.getItem("accessToken");
      const newRefreshToken = sessionStorage.getItem("refreshToken");
      
      if (newAccessToken !== accessToken) {
        setAccessTokenState(newAccessToken);
      }
      if (newRefreshToken !== refreshToken) {
        setRefreshTokenState(newRefreshToken);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [accessToken, refreshToken]);

  const login = (data_user: User, accessToken: string, refreshToken: string) => {
    setUser(data_user);
    setAccessTokenState(accessToken);
    setRefreshTokenState(refreshToken);

    sessionStorage.setItem("user", JSON.stringify(data_user));
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);
  };

  const logout = () => {
    setUser(null);
    setAccessTokenState(null);
    setRefreshTokenState(null);

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
  };

  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    if (token) {
      sessionStorage.setItem("accessToken", token);
    } else {
      sessionStorage.removeItem("accessToken");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, refreshToken, login, logout, setAccessToken }}
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