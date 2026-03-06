// PrivateRoute.jsx
// Protected route component that requires user authentication
// Shows loading state while checking auth status, redirects to login if not authenticated
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Render children if authenticated, otherwise redirect to login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
