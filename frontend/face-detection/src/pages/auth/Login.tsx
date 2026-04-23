import { useState, type ChangeEvent } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleLogin = async () => {
    if (!email || !senha) {
      alert("Preencha email e senha");
      return;
    }

    setLoading(true);

    const result = await loginUser(email, senha);

    setLoading(false);

    if (!result.success) {
  alert(result.message || "Email ou senha inválidos");
  return;
}


    // NÃO TEM CADASTRO → vai cadastrar
    if (!result.userExists) {
      navigate(`/cadastro?email=${email}`);
      return;
    }

    // TEM CADASTRO → segue fluxo normal
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
            <label>Email</label>
            <InputText
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
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

             <Button
              label={loading ? "Entrando..." : "Entrar"}
              onClick={handleLogin}
              disabled={loading}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}