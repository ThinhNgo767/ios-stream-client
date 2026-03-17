import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "./AuthContext";
import authAPI from "../../apis/authAPI";
import userAPI from "../../apis/userAPI";
import { local, session } from "../../utils/sessionStorageUtils";

const STORAGE_KEYS = {
  TOKEN: "accessToken",
  KEY: "secretKey",
  USER_INFO: "userInfo",
  VERIFY_CODE: "validated",
  ACTIVE: "active",
};

const AuthState = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {},
    error: null,
  });
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const time = useRef(null);

  const clearStorage = () => {
    local.remove(STORAGE_KEYS.TOKEN);
    local.remove(STORAGE_KEYS.KEY);
    session.remove(STORAGE_KEYS.USER_INFO);
    session.remove(STORAGE_KEYS.VERIFY_CODE);
    local.remove(STORAGE_KEYS.ACTIVE);

    setAuth({ isAuthenticated: false, user: {}, error: null });
  };

  const handleSubmitLogout = useCallback(async () => {
    if (time.current) clearTimeout(time.current);
    try {
      await userAPI.change({ isActive: false });
      time.current = setTimeout(() => {
        navigate("/", { replace: true });
      }, 50);
      clearStorage();
    } catch (error) {
      console.error(error);
    }
  }, [navigate]);

  const handleUserLogin = useCallback(async () => {
    setError(null);

    try {
      // Lấy thông tin user mới nhất

      const user = await authAPI.info();

      setAuth({
        isAuthenticated: true,
        user: user?.userInfo,
        error: null,
      });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin user:", error);
      setError(error?.response?.data?.message || "Có lỗi xảy ra");
      handleSubmitLogout();
    } finally {
      setLoading(false);
    }
  }, [handleSubmitLogout]);

  const handleSubmitLogin = useCallback(
    async (e, name, pass, path) => {
      e.preventDefault();

      if (!name || !pass) {
        setError("Please fill in both fields.");
        return;
      }

      const payloadLogin = {
        usernameOrEmail: name,
        password: pass,
      };

      try {
        const response = await authAPI.login(payloadLogin);

        const { accessToken, secretKey } = response;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("secretKey", secretKey);

        await handleUserLogin();

        navigate(path, { replace: true });
      } catch (err) {
        setError(err.response?.data?.message);
      }
    },
    [handleUserLogin, navigate],
  );

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = local.get(STORAGE_KEYS.TOKEN);

      if (storedToken && storedToken !== "undefined") {
        // Nếu có token, cố gắng khôi phục session
        await handleUserLogin();
      } else {
        // Nếu không có token, người dùng rõ ràng là chưa đăng nhập
        setLoading(false); // Kết thúc loading ngay lập tức

        clearStorage();
      }
    };
    initAuth();
  }, [handleUserLogin]);

  const contextValue = useMemo(
    () => ({
      auth,
      error,

      handleSubmitLogin,
      handleSubmitLogout,
      loading,
    }),
    [auth, error, handleSubmitLogin, handleSubmitLogout, loading],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
export default AuthState;
