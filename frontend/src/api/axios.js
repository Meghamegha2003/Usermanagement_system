import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

API.interceptors.request.use((req) => {
  const token = req.url.startsWith("/admin")
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("token");

  if (token) req.headers.Authorization = `Bearer ${token}`;
  if (req.data instanceof FormData) req.headers["Content-Type"] = "multipart/form-data";

  return req;
});

export default API;