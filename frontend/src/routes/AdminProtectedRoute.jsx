import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
const { admin, adminChecked } = useSelector((state) => state.admin);

  if (!adminChecked) return <p>Checking admin...</p>;
  return admin ? children : <Navigate to="/admin/login" />;
};

export default AdminProtectedRoute;