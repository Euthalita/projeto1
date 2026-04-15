import { api } from "./api";

export const listarAlunos = () => api.get("/students");