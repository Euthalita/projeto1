import { useEffect, useState } from "react";
import { listarTurmas, removerTurma } from "../api/turmaService";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

export default function TurmasList() {
  const [turmas, setTurmas] = useState([]);

  const loadTurmas = async () => {
    const { data } = await listarTurmas();
    setTurmas(data);
  };

  useEffect(() => { loadTurmas(); }, []);

  return (
    <div className="p-4">
      <h2>Turmas</h2>

      <Link to="/turmas/nova">
        <Button label="Nova Turma" className="mb-3" />
      </Link>

      {turmas.map((t: any) => (
        <div key={t.id} className="p-3 border mb-2 flex justify-between">
          {t.nome}

          <div>
            <Link to={`/turmas/editar/${t.id}`}>
              <Button label="Editar" className="mr-2" />
            </Link>
            <Button label="Excluir" severity="danger"
              onClick={() => removerTurma(t.id).then(loadTurmas)} />
          </div>
        </div>
      ))}
    </div>
  );
}
