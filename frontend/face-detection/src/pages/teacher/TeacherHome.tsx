import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarTurmas } from "../../api/turmaService";
import { Button } from "primereact/button";

export default function TeacherHome() {
  const navigate = useNavigate();
  const [turmas, setTurmas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTurmas = async () => {
    try {
      const { data } = await listarTurmas();
      setTurmas(data);
    } catch (err) {
      console.error("Erro ao carregar turmas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTurmas();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "#fff",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-4">
          👨‍🏫 Painel do Professor
        </h1>

        {/* AÇÕES */}
        <div style={{ marginBottom: 20 }}>
          <Button
            label="Nova Turma"
            icon="pi pi-plus"
            onClick={() => navigate("/turmas/nova")}
          />
        </div>

        {/* LISTA DE TURMAS */}
        <h2 className="text-xl font-semibold mb-3">Minhas Turmas</h2>

        {loading ? (
          <p>Carregando...</p>
        ) : turmas.length === 0 ? (
          <p>Nenhuma turma cadastrada</p>
        ) : (
          turmas.map((t) => (
            <div
              key={t.id}
              onClick={() => navigate(`/turmas/${t.id}`)}
              style={{
                background: "#1f2937",
                padding: "16px",
                borderRadius: "10px",
                marginBottom: "10px",
                cursor: "pointer",
                transition: "0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#374151")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#1f2937")
              }
            >
              <strong style={{ fontSize: "18px" }}>{t.nome}</strong>

              <div style={{ marginTop: 5, fontSize: "14px" }}>
                <span> Código: {t.codigo}</span> |{" "}
                <span> Sala: {t.sala}</span>
              </div>

              <div style={{ fontSize: "13px", marginTop: 4 }}>
                {t.professor} • {t.horario}
              </div>

              {/* BOTÕES */}
              <div style={{ marginTop: 10 }}>
                <Button
                  label="Abrir"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/turmas/${t.id}`);
                  }}
                />

                <Button
                  label="Chamada"
                  severity="success"
                  size="small"
                  style={{ marginLeft: 8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/chamada?classId=${t.id}`);
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}