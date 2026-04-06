import API from "./axios";

export const getUser = (search)=>{
    API.get(`/admin/users?search=${search||""}`)
}

export const createUser =(data)=> API.post('/admin/users',data)
export const updateUser =(id,data)=>{
    API.put(`/admin/users/${id}`,data)
}

export const deleteUser = (id)=>API.delete(`.admin/users/${id}`)