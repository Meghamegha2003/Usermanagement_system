import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Home from "../pages/home/Home";
import Profile from "../pages/profile/Profile";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/adminDashboard/AdminDashboard";
import AdminLogin from "../pages/adminLogin/AdminLogin";
import AdminProtectedRoute from "./AdminProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;