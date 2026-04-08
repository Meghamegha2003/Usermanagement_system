import API from "./axios";

export const getUsers = (search = "") => {
  return API.get("/admin/users", { params: { search } });
};

export const createUser = (data) => {
  return API.post("/admin/users", data);
};

export const updateUser = (id, data) => {
  return API.put(`/admin/users/${id}`, data);
};

export const deleteUser = (id) => {
  return API.delete(`/admin/users/${id}`);
};