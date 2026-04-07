import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const adminLogin = createAsyncThunk(
  "admin/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await API.post("/admin/login", credentials);
      localStorage.setItem("adminToken", res.data.token);
      return res.data.admin;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (search = "", { rejectWithValue }) => {
    try {
      const res = await API.get(`/admin/users?search=${search}`);
      return res.data.users || [];
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

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admin: null,
    users: [],
    loading: false,
    error: null,
  },
  reducers: {
    logoutAdmin: (state) => {
      state.admin = null;
      state.users = [];
      state.error = null;
      localStorage.removeItem("adminToken");
    },
    clearAdminError: (state) => {
      state.error = null;
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(adminLogin.fulfilled, (state, action) => { state.loading = false; state.admin = action.payload; })
      .addCase(adminLogin.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(removeUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
      });
  },
});

export const { logoutAdmin, clearAdminError, setAdmin } = adminSlice.actions;
export default adminSlice.reducer;