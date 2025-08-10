import { Navigate } from "react-router-dom";
import useAuth from "../context/AuthContext";
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAuth();
  const { token, loading } = state;

  if (loading) {
    return <div className="p-6 text-gray-600">Checking session…</div>;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
