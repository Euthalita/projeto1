import { api } from "./api";

export const listarTurmas = () => api.get("/api/turmas");

export const buscarTurma = (id: number) =>
  api.get(`/api/turmas/${id}`);

export const criarTurma = (data: any) =>
  api.post("/api/turmas", data);

export const atualizarTurma = (id: number, data: any) =>
  api.put(`/api/turmas/${id}`, data);

export const removerTurma = (id: number) =>
  api.delete(`/api/turmas/${id}`);

export const listarAlunosDaTurma = (id: number) =>
  api.get(`/api/turmas/${id}/students`);

export const adicionarAlunoNaTurma = (classId: number, studentId: number) =>
  api.post(`/api/turmas/${classId}/students`, { studentId });

export const iniciarAula = (classId: number) =>
  api.post(`/attendance/start/${classId}`);

export const finalizarAula = (classId: number) =>
  api.post(`/attendance/end/${classId}`);

export const statusAula = (classId: number) =>
  api.get(`/attendance/status/${classId}`);

export const adicionarAlunoNaTurma = (turmaId: number, alunoId: number) =>
  api.post(`/api/turma-aluno/${turmaId}/${alunoId}`);

export const listarAlunosDaTurma = (turmaId: number) =>
  api.get(`/api/turma-aluno/turma/${turmaId}`);