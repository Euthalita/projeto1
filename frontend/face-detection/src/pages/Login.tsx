import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleLogin = async () => {
    const ok = await loginUser(matricula, senha);
    if (ok) navigate("/");
    else alert("Erro ao fazer login");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="mb-3">Login</h2>

      <InputText placeholder="Matrícula"
        value={matricula} onChange={e => setMatricula(e.target.value)}
        className="w-full mb-3" />

      <InputText placeholder="Senha" type="password"
        value={senha} onChange={e => setSenha(e.target.value)}
        className="w-full mb-3" />

      <Button label="Entrar" className="w-full" onClick={handleLogin} />
    </div>
  );
}
