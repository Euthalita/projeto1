import { useState } from "react"; 
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();
  const { loginUser } = useAuth();
  

  const handleLogin = async () => {
    const ok = await loginUser(matricula, senha);
    if (ok) {
      navigate(`/cadastro/${matricula}`); // redireciona para cadastro
    } else {
      alert("Erro ao fazer login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Card
        title="Acesso ao Sistema"
        className="shadow-2xl w-full max-w-md p-6 rounded-lg bg-gray-800 text-white"
      >
        <div className="flex flex-col gap-4">

          <span className="p-float-label">
            <InputText
              id="matricula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              className="w-full"
            />
            <label htmlFor="matricula" className="text-white">Matrícula</label>
          </span>

          <span className="p-float-label">
            <InputText
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full"
            />
            <label htmlFor="senha" className="text-white">Senha</label>
          </span>

          <Button
            label="Entrar"
            className="w-full mt-2 p-button-raised p-button-primary"
            onClick={handleLogin}
          />
        </div>
      </Card>
    </div>
  );
}
