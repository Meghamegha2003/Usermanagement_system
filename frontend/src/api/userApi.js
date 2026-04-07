import API from "./axios";

export const getAdmin = (data)=>{
   return API.get("/admin/users",data);
}

export const getUsers = (search) => {
  return API.get(`/admin/users?search=${search || ""}`);
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

















