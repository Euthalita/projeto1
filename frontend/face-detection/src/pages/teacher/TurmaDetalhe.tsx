import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import {
  buscarTurma,
  listarAlunosDaTurma,
  adicionarAlunoNaTurma,
  iniciarAula,
  finalizarAula,
  statusAula
} from "../../api/turmaService";
import { listarAlunos } from "../../api/studentService";

export default function TurmaDetalhe() {
  const { id } = useParams();

  const [turma, setTurma] = useState<any>(null);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [todosAlunos, setTodosAlunos] = useState<any[]>([]);
  const [aulaAtiva, setAulaAtiva] = useState(false);

  const loadTurma = async () => {
    const { data } = await buscarTurma(Number(id));
    setTurma(data);
  };

  const loadAlunos = async () => {
    const { data } = await listarAlunosDaTurma(Number(id));
    setAlunos(data);
  };

  const loadTodosAlunos = async () => {
    const { data } = await listarAlunos();
    setTodosAlunos(data);
  };

  const loadStatus = async () => {
    const { data } = await statusAula(Number(id));
    setAulaAtiva(data.active);
  };

  const loadAll = async () => {
    await Promise.all([
      loadTurma(),
      loadAlunos(),
      loadTodosAlunos(),
      loadStatus()
    ]);
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  const handleAddAluno = async (studentId: number) => {
    await adicionarAlunoNaTurma(Number(id), studentId);
    loadAlunos();
  };

  const handleStart = async () => {
    await iniciarAula(Number(id));
    setAulaAtiva(true);
  };

  const handleEnd = async () => {
    await finalizarAula(Number(id));
    setAulaAtiva(false);
  };

  if (!turma) return <div style={{ color: "#fff" }}>Carregando...</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111827",
        padding: "20px",
        color: "#fff"
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* INFO TURMA */}
        <h2>{turma.nome}</h2>

        <p><strong>Código:</strong> {turma.codigo}</p>
        <p><strong>Professor:</strong> {turma.professor}</p>
        <p><strong>Sala:</strong> {turma.sala}</p>
        <p><strong>Horário:</strong> {turma.horario}</p>
        <p><strong>Semestre:</strong> {turma.semestre}</p>

        {/* CONTROLE DA AULA */}
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          {!aulaAtiva ? (
            <Button
              label="Iniciar Chamada"
              severity="success"
              onClick={handleStart}
            />
          ) : (
            <Button
              label="Finalizar Chamada"
              severity="danger"
              onClick={handleEnd}
            />
          )}
        </div>

        {/* ALUNOS DA TURMA */}
        <h3>Alunos matriculados</h3>

        {alunos.length === 0 ? (
          <p>Nenhum aluno na turma</p>
        ) : (
          alunos.map((a) => (
            <div
              key={a.id}
              style={{
                background: "#2d3748",
                padding: 10,
                marginBottom: 6,
                borderRadius: 6
              }}
            >
              {a.nome}
            </div>
          ))
        )}

        {/* ADICIONAR ALUNO */}
        <h3 style={{ marginTop: 20 }}>Adicionar aluno</h3>

        {todosAlunos.map((a) => (
          <div key={a.id} style={{ marginBottom: 6 }}>
            {a.nome}
            <Button
              label="Adicionar"
              size="small"
              style={{ marginLeft: 10 }}
              onClick={() => handleAddAluno(a.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}