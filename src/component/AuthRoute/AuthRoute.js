import React, { useContext } from "react";
import AuthContext from "../../contexts/AuthContext/AuthContext";
import { Navigate, useLocation } from "react-router-dom"; // Sửa lỗi chính tả từ "react-router" thành "react-router-dom"

const AuthRoute = ({ children }) => {
  const { auth, loading } = useContext(AuthContext);
  const { isAuthenticated } = auth; // Chỉ cần isAuthenticated ở đây

  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Vẫn hiển thị loading trong khi chờ xác thực
  }

  if (isAuthenticated) {
    // Nếu có state 'from' (nơi người dùng vừa ở trước đó), đẩy về đó.
    // Nếu không, mặc định đẩy về /koreanbj
    const from = location.state?.from?.pathname || "/koreanbj";
    return <Navigate to={from} replace />;
  }

  // Chưa login -> Cho xem form Login
  return children;
};

export default AuthRoute;
