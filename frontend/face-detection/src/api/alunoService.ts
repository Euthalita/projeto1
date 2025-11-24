import { api } from "./api";

export const atualizarCadastro = async (matricula: string, formData: FormData) => {
  const response = await api.post(`/api/cadastro/${matricula}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const buscarCadastro = async (matricula: string) => {
  const response = await api.get(`/api/cadastro/siga/alunos/${matricula}`);
  return response.data;
};
