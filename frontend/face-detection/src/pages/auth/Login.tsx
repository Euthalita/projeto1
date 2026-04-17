import { useState, type ChangeEvent } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();
  const { loginUser } = useAuth();

const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  setLoading(true);

  const result = await loginUser(matricula, senha);

  setLoading(false);

  if (!result.success) {
    alert("Erro ao fazer login");
    return;
  }

  if (!result.userExists) {
    navigate(`/cadastro/${matricula}`);
    return;
  }

  if (result.role?.toUpperCase() === "STUDENT") {
    navigate("/student");
    return;
  }

  if (result.role?.toUpperCase() === "TEACHER") {
    navigate("/teacher");
    return;
  }
};
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111827",
        padding: "16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Card
          title="Acesso ao Sistema"
          style={{
            background: "#1f2937",
            color: "#fff",
            padding: "1.25rem",
            borderRadius: 12,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label>Matrícula</label>
            <InputText
              value={matricula}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMatricula(e.target.value)
              }
            />

            <label>Senha</label>
            <InputText
              type="password"
              value={senha}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSenha(e.target.value)
              }
            />

            <Button label="Entrar" onClick={handleLogin} />
          </div>
        </Card>
      </div>
    </div>
  );
}