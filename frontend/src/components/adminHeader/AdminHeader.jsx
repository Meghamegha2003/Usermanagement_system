import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutAdmin } from "../../features/admin/adminSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminHeader.css";

const AdminHeader = () => {
  const { admin } = useSelector(state => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAdmin());
    toast.success("Admin logged out successfully! ");
    navigate("/admin/login");
  };

  return (
    <header className="admin-header">
      <h1>Dashboard</h1>
      <div className="header-right">
        {admin && <span>{admin.name}</span>}
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default AdminHeader;