import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../../features/admin/adminSlice";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css"

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useSelector(state => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(adminLogin({ email, password }))
      .unwrap()
      .then(() => navigate("/admin"))
      .catch(() => {});
  };

  return (
 <div className="admin-login">
  <div className="admin-login-container">
    <h2>Admin Login</h2>
    {error && <p className="error">{error}</p>}
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
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