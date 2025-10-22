import { useEffect, useState } from "react";
import api from "../services/api";

interface Aluno {
  id: number;
  nome: string;
  email: string;
  matricula: string;
  foto: string;
}

const AlunoList = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  useEffect(() => {
    const fetchAlunos = async () => {
      const response = await api.get<Aluno[]>("/alunos");
      setAlunos(response.data);
    };
    fetchAlunos();
  }, []);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Lista de Alunos</h2>
      <ul className="space-y-2">
        {alunos.map((aluno) => (
          <li
            key={aluno.id}
            className="p-2 border rounded flex items-center justify-between"
          >
            <div>
              <p><strong>Nome:</strong> {aluno.nome}</p>
              <p><strong>Email:</strong> {aluno.email}</p>
              <p><strong>Matrícula:</strong> {aluno.matricula}</p>
            </div>
            {aluno.foto && (
              <img
                src={`http://localhost:8080/${aluno.foto}`}
                alt={aluno.nome}
                className="w-16 h-16 object-cover rounded"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlunoList;
