import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../apis/axiosInstance";

// Đây là function dùng chung
export const useFetchData = (key, url, params = {}, options = {}) => {
  return useQuery({
    queryKey: [...key, params], // Định danh cho data (ví dụ: ['users'], ['products'])
    queryFn: async () => {
      return axiosInstance.get(url, { params });
    },
    ...options,
  });
};
