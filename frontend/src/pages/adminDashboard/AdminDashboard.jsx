import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  removeUser,
  editUser,
} from "../../features/admin/adminSlice";

import AdminHeader from "../../components/adminHeader/AdminHeader";
import { showToast } from "../../utils/toastService";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { admin, users, loading, error } = useSelector(
    (state) => state.admin
  );

  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (!admin) return;

    const timer = setTimeout(() => {
      dispatch(fetchUsers(search.trim()));
    }, 300);

    return () => clearTimeout(timer);
  }, [search, admin, dispatch]);

  const handleDelete = (id) => {
    showToast.confirm(
      "Are you sure you want to delete this user?",
      async () => {
        try {
          await dispatch(removeUser(id)).unwrap();
          showToast.success("User deleted successfully!");
        } catch (err) {
          showToast.error("Delete failed!");
        }
      }
    );
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditData({
      name: user.name,
      email: user.email,
    });
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async () => {
    if (!editingUser) return;

    if (!editData.name.trim() || !editData.email.trim()) {
      showToast.error("Fields cannot be empty");
      return;
    }

    try {
      await dispatch(
        editUser({
          id: editingUser._id,
          data: editData,
        })
      ).unwrap();

      showToast.success("User updated successfully!");
      setEditingUser(null);
      setEditData({ name: "", email: "" });
    } catch {
      showToast.error("Update failed!");
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
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />

        {loading && <p>Loading users...</p>}
        {error && <p className="error">{error}</p>}

        <div className="user-list">
          {users.length === 0 && !loading && (
            <p>No users found.</p>
          )}

          {users.map((u) => (
            <div key={u._id} className="user-card">
              <div className="user-info">
                {editingUser && editingUser._id === u._id ? (
                  <>
                    <input
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                    />
                    <input
                      name="email"
                      value={editData.email}
                      onChange={handleEditChange}
                    />
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Name:</strong> {u.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {u.email}
                    </p>
                  </>
                )}
              </div>

              <div className="actions">
                {editingUser && editingUser._id === u._id ? (
                  <>
                    <button onClick={handleEditSubmit}>Save</button>
                    <button
                      onClick={() => {
                        setEditingUser(null);
                        setEditData({ name: "", email: "" });
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(u)}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(u._id)}>
                      Delete
                    </button>
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