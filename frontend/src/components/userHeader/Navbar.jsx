import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser, logout } from "../../features/auth/authSlice";
import "./Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  const renderProfile = () => {
    if (user?.profileImage) {
      return <img src={user.profileImage} alt="Profile" className="navbar-profile-image" />;
    } else if (user?.name) {
      return <div className="navbar-profile-initial">{user.name.charAt(0).toUpperCase()}</div>;
    } else {
      return <div className="navbar-profile-initial">G</div>;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo"><Link to="/">UserApp</Link></div>
      <ul className={`navbar-links ${open ? "active" : ""}`}>
        <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
        {user && (
          <li>
            <Link to="/profile" onClick={() => setOpen(false)}>{renderProfile()}</Link>
          </li>
        )}
        {user ? (
          <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
        ) : (
          <>
            <li><Link to="/login" onClick={() => setOpen(false)}>Login</Link></li>
            <li><Link to="/register" onClick={() => setOpen(false)}>Register</Link></li>
          </>
        )}
      </ul>
      <div className={`hamburger ${open ? "toggle" : ""}`} onClick={() => setOpen(!open)}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
    </nav>
  );
};

export default Navbar;