// src/services/axiosInstance.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // أو خليها زي ما عندك
  // withCredentials: true, // فعّلها لو انت محتاج كوكيز
});

const getTokenHeader = () => {
  const keys = ["token", "accessToken", "authToken"];

  let raw = "";
  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v) {
      raw = v;
      break;
    }
  }
  if (!raw) return "";

  // Support JSON stored token:
  // 1) {"token":"Bearer ..."} / {"accessToken":"..."}
  // 2) "\"Bearer ...\"" (stringified string)
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") raw = parsed;
    else if (parsed?.token) raw = parsed.token;
    else if (parsed?.accessToken) raw = parsed.accessToken;
  } catch {
    // not JSON -> ignore
  }

  const cleaned = String(raw).replace(/^"+|"+$/g, "").trim();
  if (!cleaned) return "";

  const tokenOnly = cleaned.replace(/^Bearer\s+/i, "").trim();
  if (!tokenOnly) return "";

  return `Bearer ${tokenOnly}`;
};

// ✅ Attach Authorization automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const auth = getTokenHeader();

    if (auth) {
      config.headers = config.headers ?? {};
      // مهم: خليه Authorization بالظبط
      (config.headers as any).Authorization = auth;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// (اختياري) Response interceptor — لو عايز تتعامل مع 401 بشكل موحد
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Example:
    // لو 401 ممكن تعمل logout/redirect
    // if (error?.response?.status === 401) { ... }
    return Promise.reject(error);
  }
);

export default axiosInstance;








