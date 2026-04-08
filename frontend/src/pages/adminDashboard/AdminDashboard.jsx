import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, removeUser, loadAdminFromToken, editUser } from "../../features/admin/adminSlice";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import { toast } from "react-toastify";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { admin, users, loading, error } = useSelector(state => state.admin);

  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "" });

  // Load admin from token once
  useEffect(() => {
    dispatch(loadAdminFromToken());
  }, [dispatch]);

  // Fetch users whenever admin is loaded or search changes
  useEffect(() => {
    if (!admin) return;
    dispatch(fetchUsers(search));
  }, [dispatch, search, admin]);

  // Delete user with toast confirm
  const handleDelete = (id) => {
    const confirmToast = toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this user? ❌</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
            <button onClick={() => {
              dispatch(removeUser(id));
              toast.dismiss(confirmToast);
              toast.success("User deleted successfully! 🗑️");
            }}>Yes</button>
            <button onClick={() => toast.dismiss(confirmToast)}>No</button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, closeButton: false }
    );
  };

  // Edit user
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditData({ name: user.name, email: user.email });
  };

  const handleEditChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleEditSubmit = () => {
    if (editingUser) {
      dispatch(editUser({ id: editingUser._id, data: editData }));
      toast.success("User updated successfully! ✏️");
      setEditingUser(null);
    }
  };

  if (!admin) return <p>Please login to view dashboard.</p>;

  return (
    <>
      <AdminHeader />
      <div className="admin-dashboard">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-box"
        />
        {loading && <p>Loading users...</p>}
        {error && <p className="error">{error}</p>}
        <div className="user-list">
          {users.length === 0 && !loading && <p>No users found.</p>}
          {users.map(u => (
            <div key={u._id} className="user-card">
              <div className="user-info">
                {editingUser && editingUser._id === u._id ? (
                  <>
                    <input name="name" value={editData.name} onChange={handleEditChange} />
                    <input name="email" value={editData.email} onChange={handleEditChange} />
                  </>
                ) : (
                  <>
                    <p><strong>Name:</strong> {u.name}</p>
                    <p><strong>Email:</strong> {u.email}</p>
                  </>
                )}
              </div>
              <div className="actions">
                {editingUser && editingUser._id === u._id ? (
                  <>
                    <button onClick={handleEditSubmit}>Save</button>
                    <button onClick={() => setEditingUser(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(u)}>Edit</button>
                    <button onClick={() => handleDelete(u._id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;