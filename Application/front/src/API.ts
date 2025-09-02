import axios from "axios";
import { getToken } from "./utils/authToken";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5050/api",
  withCredentials: false,
});

// Добавляем токен автоматически
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Глобально обрабатываем 401
API.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      // опционально: очистить и редиректнуть на логин
      localStorage.removeItem("token");
      // window.location.href = "/"; // если хочешь автологАут
    }
    return Promise.reject(err);
  }
);

export default API;
