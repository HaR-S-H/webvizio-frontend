import axios from "axios";

const API_URL = import.meta.VITE_BACKEND_API || "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;