import axios from "axios";
import { store } from "@/store";
import { logout, setCredentials } from "@/store/slices/authSlice";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
export const GOOGLE_AUTH_URL = `${BASE_URL}/auth/google`;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // required to send httpOnly cookies on every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: read access token from Redux store, never localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: on 401, call /auth/refresh, update Redux, and retry
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") &&
      !originalRequest.url?.includes("/auth/register") &&
      !originalRequest.url?.includes("/auth/login")
    ) {
      originalRequest._retry = true;
      try {
        const res = await axiosInstance.post("/auth/refresh");
        const data = res.data;
        const token =
          data.accessToken ||
          data.token ||
          data.data?.accessToken ||
          data.data?.token;
        const user = data.user || data.data?.user;

        if (token && user) {
          console.log(token);
          store.dispatch(setCredentials({ user, token }));
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } else {
          store.dispatch(logout());
          return Promise.reject(error);
        }
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const apiClient = axiosInstance;
export default axiosInstance;
