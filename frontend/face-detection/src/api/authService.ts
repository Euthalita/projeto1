import { api } from "./api";

export interface LoginDTO {
  matricula: string;
  senha: string;
}

export const login = async (data: LoginDTO) => {
  const response = await api.post("/auth/api/login", data);
  return response.data;
};
