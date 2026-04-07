import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./features/auth/authSlice";
import { setAdmin } from "./features/admin/adminSlice";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());

    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("adminData");
    if (token && adminData) {
      dispatch(setAdmin(JSON.parse(adminData)));
    }
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;