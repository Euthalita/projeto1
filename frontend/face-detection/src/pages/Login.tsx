import { useState, type ChangeEvent } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [matricula, setMatricula] = useState<string>("");
  const [senha, setSenha] = useState<string>("");

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleLogin = async () => {
    const ok = await loginUser(matricula, senha);
    if (ok) {
      navigate(`/cadastro/${matricula}`);
    } else {
      alert("Erro ao fazer login");
    }
  };

  const handleChangeMatricula = (e: ChangeEvent<HTMLInputElement>) =>
    setMatricula(e.target.value);

  const handleChangeSenha = (e: ChangeEvent<HTMLInputElement>) =>
    setSenha(e.target.value);

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
            boxShadow:
              "0 10px 20px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label htmlFor="matricula" style={{ color: "#fff", fontSize: 14 }}>
              Matrícula
            </label>
            <InputText
              id="matricula"
              value={matricula}
              onChange={handleChangeMatricula}
              style={{ width: "100%" }}
            />

            <label
              htmlFor="senha"
              style={{ color: "#fff", fontSize: 14, marginTop: 6 }}
            >
              Senha
            </label>
            <InputText
              id="senha"
              type="password"
              value={senha}
              onChange={handleChangeSenha}
              style={{ width: "100%" }}
            />

            <Button
              label="Entrar"
              onClick={handleLogin}
              style={{ marginTop: 8, width: "100%" }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
