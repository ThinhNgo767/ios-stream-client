import React, { useContext } from "react";
import AuthContext from "../../contexts/AuthContext/AuthContext";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
  const { auth, loading } = useContext(AuthContext);
  const { isAuthenticated } = auth;

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    // const hasToken = localStorage.getItem("accessToken");

    // if (!hasToken) {
    //   return null;
    // }

    return <Navigate to="*" replace />;
  }

  // Đã login -> Cho phép xem nội dung
  return children;
};

export default ProtectedRoute;
