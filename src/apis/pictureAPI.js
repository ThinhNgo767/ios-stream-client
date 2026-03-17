import axiosInstance from "./axiosInstance";

const pictureAPI = {
  pictures: (page, limit) =>
    axiosInstance.get(`/api/v1/pictures/gallerys?page=${page}&limit=${limit}`),
};

export default pictureAPI;
