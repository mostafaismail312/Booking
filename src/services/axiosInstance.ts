import axios from "axios";
import { baseURL } from "./apiEndpoints";

export const axiosInstance = axios.create({
  baseURL,
});

// ✅ Add token dynamically before every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token.split(" ")[1]}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
