import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";
import jwt_decode from "jwt-decode";

export const adminLogin = createAsyncThunk(
  "admin/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await API.post("/admin/login", credentials);
      if (!res.data.token) return rejectWithValue("No token received");
      localStorage.setItem("adminToken", res.data.token);
      const decoded = jwt_decode(res.data.token);
      const adminData = { id: decoded.id, name: "Admin", role: decoded.role };
      localStorage.setItem("adminData", JSON.stringify(adminData));
      return adminData;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const loadAdminFromToken = createAsyncThunk(
  "admin/loadFromToken",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const adminData = localStorage.getItem("adminData");
      if (!token || !adminData) return rejectWithValue("No token found");
      const decoded = jwt_decode(token);
      if (decoded.role !== "admin") return rejectWithValue("Not an admin");
      return JSON.parse(adminData);
    } catch (err) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      return rejectWithValue("Invalid token");
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (search = "", { rejectWithValue }) => {
    try {
      const res = await API.get("/admin/users", { params: { search } });
      return res.data.users || res.data.data?.users || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const removeUser = createAsyncThunk(
  "admin/removeUser",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/admin/users/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete user");
    }
  }
);

export const editUser = createAsyncThunk(
  "admin/editUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/admin/users/${id}`, data);
      return res.data.user || res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update user");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: { admin: null, users: [], loading: false, error: null },
  reducers: {
    logoutAdmin: (state) => {
      state.admin = null;
      state.users = [];
      state.error = null;
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
    },
    clearAdminError: (state) => { state.error = null; },
    setAdmin: (state, action) => { state.admin = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(adminLogin.fulfilled, (state, action) => { state.loading = false; state.admin = action.payload; })
      .addCase(adminLogin.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(loadAdminFromToken.fulfilled, (state, action) => { state.admin = action.payload; })
      .addCase(loadAdminFromToken.rejected, (state) => {
        state.admin = null;
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
      })
      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(removeUser.fulfilled, (state, action) => { state.users = state.users.filter(u => u._id !== action.payload); })
      .addCase(editUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(editUser.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { logoutAdmin, clearAdminError, setAdmin } = adminSlice.actions;
export default adminSlice.reducer;