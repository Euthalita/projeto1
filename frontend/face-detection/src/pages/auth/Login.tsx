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

    // ALUNO
    if (result.role?.toUpperCase() === "STUDENT") {
      if (!result.temCadastro) {
        navigate(`/cadastro?email=${email}`);
      } else {
        navigate("/student");
      }
      return;
    }

    // PROFESSOR
    if (result.role?.toUpperCase() === "TEACHER") {
      navigate("/teacher");
      return;
    }

    // fallback (caso role venha errada)
    alert("Tipo de usuário inválido");
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