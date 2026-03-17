import axios from "axios";

import { local } from "../utils/sessionStorageUtils";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASEURI_API,
  timeout: 600000, // over 5 minutes stop calling
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Get accessToken from local storage
    const accessToken = local.get("accessToken");
    const secretKey = local.get("secretKey");

    if (accessToken) {
      config.headers["x-access-token"] = accessToken;
    }
    if (secretKey) {
      config.headers["x-api-key"] = secretKey;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp để hook không cần .data nữa
    return response.data;
  },
  (error) => {
    // Xử lý lỗi tập trung tại đây
    if (error.response && error.response.status === 401) {
      // Ví dụ: Nếu gặp lỗi 401, tự động xóa storage và đẩy về login
      localStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
