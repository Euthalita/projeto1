import { api } from "./api";

export const listarTurmas = () => api.get("/api/turmas");

export const criarTurma = (data: any) => api.post("/api/turmas", data);

export const atualizarTurma = (id: number, data: any) =>
  api.put(`/api/turmas/${id}`, data);

export const removerTurma = (id: number) =>
  api.delete(`/api/turmas/${id}`);
