import API from "./axios";

export const loginUser = (data) => API.post("/login", data);
export const registerUser = (data) => API.post("/register", data);

export const getProfile = () => API.get("/profile");

export const updateProfileApi = (formData) =>
  API.put("/profile", formData);