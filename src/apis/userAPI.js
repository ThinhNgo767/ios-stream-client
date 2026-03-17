import axiosInstance from "./axiosInstance";

const userAPI = {
  status: () => axiosInstance.get("/api/v1/user/status"),
  change: (value) => axiosInstance.post("/api/v1/user/chage-active", value),
};

export default userAPI;
