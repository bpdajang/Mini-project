import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/authContext.jsx";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};
