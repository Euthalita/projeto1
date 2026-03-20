import { api } from "./api";

export const atualizarCadastro = async (
  matricula: string,
  data: {
    nome: string;
    email: string;
    fotoBase64: string;
  }
) => {
  const response = await api.post(
    `/api/cadastro/${matricula}`,
    data
  );

  return response.data;
};

export const buscarCadastro = async (matricula: string) => {
  const response = await api.get(
    `/api/cadastro/siga/alunos/${matricula}`
  );

  return response.data;
};