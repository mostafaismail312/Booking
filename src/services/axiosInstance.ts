import axios from "axios";
import { baseURL } from "./apiEndpoints";

export const axiosInstance = axios.create({
  baseURL,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (config) {
      config.headers.Authorization = `Bearer${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);







