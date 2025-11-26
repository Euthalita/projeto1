import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate, useParams } from "react-router-dom";
import { criarTurma, atualizarTurma, listarTurmas } from "../api/turmaService";

export default function TurmaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");

  useEffect(() => {
    if (id) {
      listarTurmas().then(res => {
        const turma = res.data.find((t: any) => t.id === Number(id));
        if (turma) setNome(turma.nome);
      });
    }
  }, [id]);

  const handleSubmit = async () => {
    if (id) await atualizarTurma(Number(id), { nome });
    else await criarTurma({ nome });

    navigate("/turmas");
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
        <div
          style={{
            background: "#1f2937",
            color: "#fff",
            padding: "1.25rem",
            borderRadius: 12,
            boxShadow:
              "0 10px 20px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            {id ? "Editar Turma" : "Nova Turma"}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label htmlFor="nome" style={{ color: "#fff", fontSize: 14 }}>
              Nome da Turma
            </label>
            <InputText
              id="nome"
              value={nome}
              placeholder="Nome da Turma"
              onChange={(e) => setNome(e.target.value)}
              style={{ width: "100%" }}
            />

            <Button
              label="Salvar"
              onClick={handleSubmit}
              style={{ width: "100%", marginTop: "12px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
