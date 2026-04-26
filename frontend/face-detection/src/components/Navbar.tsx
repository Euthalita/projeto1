import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 🔥 função dinâmica de navegação
  const goHome = () => {
    if (!user) return;

    if (user.role === "STUDENT") {
      navigate("/student");
    } else if (user.role === "TEACHER") {
      navigate("/teacher");
    }
  };

  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
      command: goHome, 
    },
    ...(user?.role === "TEACHER"
      ? [
          {
            label: "Turmas",
            icon: "pi pi-users",
            command: () => navigate("/turmas"),
          },
        ]
      : []),
  ];

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  return (
    <div className="w-full">
      <Menubar
        model={items}
        style={{
          backgroundColor: "#120f24ff",
          padding: "0.8rem",
          borderRadius: 0,
        }}
        end={
          user ? (
            <Button
              label="Sair"
              icon="pi pi-sign-out"
              className="p-button-danger p-button-outlined"
              onClick={handleLogout} 
            />
          ) : null
        }
      />
    </div>
  );
};