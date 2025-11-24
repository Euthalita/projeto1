import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children }: any) => {
  const { matricula } = useAuth();

  if (!matricula) return <Navigate to="/login" />;

  return children;
};
