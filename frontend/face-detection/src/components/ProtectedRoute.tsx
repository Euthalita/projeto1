import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "STUDENT" | "TEACHER";
}) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  // REGRA PARA ALUNO SEM CADASTRO
  if (
    user.role === "STUDENT" &&
    !user.temCadastro &&
    location.pathname !== "/cadastro"
  ) {
    return <Navigate to="/cadastro" />;
  }

  if (
    user.role === "STUDENT" &&
    user.temCadastro &&
    location.pathname === "/cadastro"
  ) {
    return <Navigate to="/student" />;
  }

  return children;
}