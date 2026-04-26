import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useNavigate, useParams } from "react-router-dom";
import {
  criarTurma,
  atualizarTurma,
  buscarTurma
} from "../../api/turmaService";

export default function TurmaForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [professor, setProfessor] = useState("");
  const [sala, setSala] = useState("");
  const [semestre, setSemestre] = useState("");

  const periodos = [
    { label: "Manhã", value: "MANHA" },
    { label: "Tarde", value: "TARDE" },
    { label: "Noite", value: "NOITE" }
  ];

  useEffect(() => {
    if (id) {
      buscarTurma(Number(id)).then(res => {
        const t = res.data;
        setNome(t.nome || "");
        setCodigo(t.codigo || "");
        setPeriodo(t.periodo || "");
        setProfessor(t.professor || "");
        setSala(t.sala || "");
        setSemestre(t.semestre || "");
      });
    }
  }, [id]);

  const handleSubmit = async () => {
    try {
      const data = {
        nome,
        codigo,
        periodo,
        professor,
        sala,
        semestre
      };

      if (id) {
        await atualizarTurma(Number(id), data);
      } else {
        await criarTurma(data);
      }

      navigate("/turmas");
    } catch (error) {
      console.error("Erro ao salvar turma:", error);
      alert("Erro ao salvar turma");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
      <div style={{ width: 400, display: "flex", flexDirection: "column", gap: 10 }}>
        <h2>{id ? "Editar Turma" : "Nova Turma"}</h2>

        <InputText
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <InputText
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />

        <Dropdown
          value={periodo}
          options={periodos}
          onChange={(e) => setPeriodo(e.value)}
          placeholder="Selecione o período"
        />

        <InputText
          placeholder="Professor"
          value={professor}
          onChange={(e) => setProfessor(e.target.value)}
        />

        <InputText
          placeholder="Sala"
          value={sala}
          onChange={(e) => setSala(e.target.value)}
        />

        <InputText
          placeholder="Semestre"
          value={semestre}
          onChange={(e) => setSemestre(e.target.value)}
        />

        <Button label="Salvar" onClick={handleSubmit} />
      </div>
    </div>
  );
}