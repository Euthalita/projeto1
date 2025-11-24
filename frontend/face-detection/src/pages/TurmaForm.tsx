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
    <div className="p-4 max-w-md mx-auto">
      <h2>{id ? "Editar Turma" : "Nova Turma"}</h2>

      <InputText value={nome} placeholder="Nome da Turma"
        onChange={(e) => setNome(e.target.value)} className="w-full mb-3" />

      <Button label="Salvar" className="w-full" onClick={handleSubmit} />
    </div>
  );
}
