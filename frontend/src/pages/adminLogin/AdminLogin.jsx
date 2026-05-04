import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../../features/admin/adminSlice";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toastService";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      return showToast.error("Please fill in all fields");
    }

    dispatch(adminLogin({ email, password }))
      .unwrap()
      .then(() => {
        showToast.success("Admin login successful!");
        setTimeout(() => navigate("/admin"), 500);
      })
      .catch((err) => {
        showToast.error(err || "Invalid email or password");
      });
  };

  return (
    <div className="admin-login">
      <div className="admin-login-container">
        <h2>Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}