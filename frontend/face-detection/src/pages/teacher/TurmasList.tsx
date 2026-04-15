import { useEffect, useState } from "react";
import { listarTurmas, removerTurma } from "../../api/turmaService";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

export default function TurmasList() {
  const [turmas, setTurmas] = useState<any[]>([]);
  const navigate = useNavigate();

  const loadTurmas = async () => {
    const { data } = await listarTurmas();
    setTurmas(data);
  };

  useEffect(() => {
    loadTurmas();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#111827", padding: "20px" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", color: "#fff" }}>
        <h2>Turmas</h2>

        {turmas.map((t) => (
          <div
            key={t.id}
            onClick={() => navigate(`/turmas/${t.id}`)}
            style={{
              background: "#2d3748",
              padding: "12px",
              marginBottom: "8px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            <strong>{t.nome}</strong>
            <br />
            <small>{t.professor} | Sala {t.sala}</small>

            <div style={{ marginTop: 10 }}>
              <Button
                label="Excluir"
                severity="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  removerTurma(t.id).then(loadTurmas);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}