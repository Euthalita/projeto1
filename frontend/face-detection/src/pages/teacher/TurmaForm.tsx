import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
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
  const [horario, setHorario] = useState("");
  const [professor, setProfessor] = useState("");
  const [sala, setSala] = useState("");
  const [semestre, setSemestre] = useState("");

  useEffect(() => {
    if (id) {
      buscarTurma(Number(id)).then(res => {
        const t = res.data;
        setNome(t.nome);
        setCodigo(t.codigo);
        setHorario(t.horario);
        setProfessor(t.professor);
        setSala(t.sala);
        setSemestre(t.semestre);
      });
    }
  }, [id]);

  const handleSubmit = async () => {
    const data = { nome, codigo, horario, professor, sala, semestre };

    if (id) await atualizarTurma(Number(id), data);
    else await criarTurma(data);

    navigate("/turmas");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
      <div style={{ width: 400 }}>
        <h2>{id ? "Editar Turma" : "Nova Turma"}</h2>

        <InputText placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <InputText placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
        <InputText placeholder="Horário" value={horario} onChange={(e) => setHorario(e.target.value)} />
        <InputText placeholder="Professor" value={professor} onChange={(e) => setProfessor(e.target.value)} />
        <InputText placeholder="Sala" value={sala} onChange={(e) => setSala(e.target.value)} />
        <InputText placeholder="Semestre" value={semestre} onChange={(e) => setSemestre(e.target.value)} />

        <Button label="Salvar" onClick={handleSubmit} />
      </div>
    </div>
  );
}