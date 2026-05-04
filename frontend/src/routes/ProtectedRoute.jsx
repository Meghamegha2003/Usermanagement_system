import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, authChecked } = useSelector((state) => state.auth);
  if (!authChecked) return <p>Checking auth...</p>;
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;