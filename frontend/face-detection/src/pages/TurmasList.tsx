import { useEffect, useState } from "react";
import { listarTurmas, removerTurma } from "../api/turmaService";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

export default function TurmasList() {
  const [turmas, setTurmas] = useState<any[]>([]);

  const loadTurmas = async () => {
    const { data } = await listarTurmas();
    setTurmas(data);
  };

  useEffect(() => {
    loadTurmas();
  }, []);

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
      <div style={{ width: "100%", maxWidth: 600 }}>
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
          <h2 className="text-2xl font-bold mb-4 text-center">Turmas</h2>

          <Link to="/turmas/nova">
            <Button label="Nova Turma" className="w-full mb-4" />
          </Link>

          {turmas.map((t: any) => (
            <div
              key={t.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px",
                marginBottom: "8px",
                background: "#2d3748",
                borderRadius: "8px",
              }}
            >
              <span>{t.nome}</span>

              <div>
                <Link to={`/turmas/editar/${t.id}`}>
                  <Button label="Editar" className="mr-2" />
                </Link>
                <Button
                  label="Excluir"
                  severity="danger"
                  onClick={() => removerTurma(t.id).then(loadTurmas)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
