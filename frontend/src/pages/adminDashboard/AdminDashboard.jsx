import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, removeUser } from "../../features/admin/adminSlice";
import "./AdminDashboard.css";
import AdminHeader from "../../components/adminHeader/AdminHeader";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { admin, users, loading, error } = useSelector(state => state.admin);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!admin) return;
    dispatch(fetchUsers(search));
  }, [dispatch, search, admin]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) dispatch(removeUser(id));
  };

  if (!admin) return <p>Please login to view dashboard.</p>;

  return (
    
    <>      <AdminHeader />
    <div className="admin-dashboard">
      <div className="dashboard-body">
        <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="search-box" />
        {loading && <p>Loading users...</p>}
        {error && <p className="error">{error}</p>}
        <div className="user-list">
          {users.length === 0 && !loading && <p>No users found.</p>}
          {users.map(u => (
            <div key={u._id} className="user-card">
              <div>
                <p><strong>Name:</strong> {u.name}</p>
                <p><strong>Email:</strong> {u.email}</p>
              </div>
              <div className="actions">
                <button>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(u._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>

  );
};

export default AdminDashboard;