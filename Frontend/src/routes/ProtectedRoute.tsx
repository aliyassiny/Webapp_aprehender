import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const refreshAccessToken = async () => {

  const { refreshToken, setAccessToken } = useAuth();

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to refresh token");
    }

    setAccessToken(data.accessToken);
  } catch (error) {
    console.error("Error refreshing token:", error);
  }   
};

export const permissionRole = (role: string) => {
  const { user } = useAuth();
  return user?.role === role;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

  const { accessToken, refreshToken} = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false); 

  useEffect(() => {
  const verifyToken = async () => {

      if (accessToken) {
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }
      
      if (!refreshToken || hasAttemptedRefresh) {
        setLoading(false);
        return;
      }
      
      try {
        await refreshAccessToken();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        setHasAttemptedRefresh(true);
      } finally {
        setLoading(false);
      }
    };
    
    verifyToken();
  }, [accessToken, refreshToken, hasAttemptedRefresh]);


  if (loading) {
    return <>
      <div className="wrapper">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="shadow"></div>
          <div className="shadow"></div>
          <div className="shadow"></div>
      </div>
    </>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>{children}</>
  )
}

export default ProtectedRoute
