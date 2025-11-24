import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { matricula, logout } = useAuth();

  return (
    <div className="flex justify-between p-3 bg-gray-800 text-white">
      <div>
        <Link to="/">Home</Link> |
        <Link to="/turmas" className="ml-2">Turmas</Link>
      </div>

      {matricula && (
        <Button label="Sair" onClick={logout} />
      )}
    </div>
  );
};
