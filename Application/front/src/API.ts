import axios from "axios";
import { getToken } from "./utils/authToken";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5050/api",
  withCredentials: false,
});

// Add token automatically
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Globally process the 401
API.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      // optional: clear and redirect to login
      localStorage.removeItem("token");
      // window.location.href = “/”; // if you want autologout
    }
    return Promise.reject(err);
  }
);

export default API;
