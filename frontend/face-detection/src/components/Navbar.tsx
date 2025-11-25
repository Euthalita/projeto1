import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { login } from "../api/authService";

export const Navbar = () => {
  const auth = useAuth();
  const matricula = auth?.user;

  return (
    <div className="flex justify-between p-3 bg-gray-800 text-white">
      <div>
        {matricula && (
          <>
            <Link to="/">Home</Link>
            <Link to="/turmas" className="ml-2">Turmas</Link>
          </>
        )}
      </div>

      {matricula && (
        <Button label="Sair" onClick={auth.logout} />
      )}
    </div>
  );
};
