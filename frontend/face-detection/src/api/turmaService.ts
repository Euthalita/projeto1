import { api } from "./api";

export const listarTurmas = () => api.get("/classes");

export const buscarTurma = (id: number) =>
  api.get(`/classes/${id}`);

export const criarTurma = (data: any) =>
  api.post("/classes", data);

export const atualizarTurma = (id: number, data: any) =>
  api.put(`/classes/${id}`, data);

export const removerTurma = (id: number) =>
  api.delete(`/classes/${id}`);

export const listarAlunosDaTurma = (id: number) =>
  api.get(`/classes/${id}/students`);

export const adicionarAlunoNaTurma = (classId: number, studentId: number) =>
  api.post(`/classes/${classId}/students`, { studentId });

export const iniciarAula = (classId: number) =>
  api.post(`/attendance/start/${classId}`);

export const finalizarAula = (classId: number) =>
  api.post(`/attendance/end/${classId}`);

export const statusAula = (classId: number) =>
  api.get(`/attendance/status/${classId}`);