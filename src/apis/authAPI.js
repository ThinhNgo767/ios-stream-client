import axiosInstance from "./axiosInstance";

const authAPI = {
  login: (values) => axiosInstance.post("/api/v1/auth/sig-in", values),
  info: () => axiosInstance.get("/api/v1/auth/me"),
  verifyCode: (code) => axiosInstance.post("/api/v1/auth/verify-code", code),
};

export default authAPI;
