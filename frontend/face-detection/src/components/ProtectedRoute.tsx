import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "STUDENT" | "TEACHER";
}) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  // 🔥 REGRA PRINCIPAL
  if (user.role === "STUDENT") {
    if (!user.temCadastro) {
      return <Navigate to="/cadastro" />;
    }
  }

  return children;
}