import axiosInstance from "./axiosInstance";

const videosAPI = {
  korean: (page, limit) =>
    axiosInstance.get(`/api/v1/videos/koreanbj?page=${page}&limit=${limit}`),
  koreanItem: (id) => axiosInstance.get(`/api/v1/videos/koreanbj/${id}`),
  relistic: (page, limit) =>
    axiosInstance.get(`/api/v1/videos/realistic?page=${page}&limit=${limit}`),
  relisticItem: (id) => axiosInstance.get(`/api/v1/videos/realistic/${id}`),
};

export default videosAPI;
