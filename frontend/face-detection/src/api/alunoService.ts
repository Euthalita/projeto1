import { api } from "./api";

// CADASTRAR aluno
export const cadastrarAluno = async (data: {
  nome: string;
  email: string;
  matricula: string;
  fotoBase64: string;
}) => {
  const response = await api.post("/api/cadastro", data);
  return response.data;
};

// VERIFICAR se já existe cadastro (login flow)
export const verificarCadastro = async (email: string) => {
  const response = await api.get(`/api/cadastro/${email}`);
  return response.data;
};