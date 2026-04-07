import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/userHeader/Navbar";
import { setUser } from "../../features/auth/authSlice";
import API from "../../api/axios";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
   
        const token = localStorage.getItem("token");
        const res = await API.get("/", { headers: { Authorization: `Bearer ${token}` } });
        dispatch(setUser(res.data.user));
      
    };
    if (!user) fetchUser();
  }, [dispatch, user]);

  return (
    <>
      <Navbar />
      <div className="home-container">
        <h1>Welcome {user?.name || "Guest"}!</h1>
        <p>This is your user dashboard.</p>
      </div>
    </>
  );
};

export default Home;