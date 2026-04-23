import { api } from "./api";

export interface LoginDTO {
  email: string;
  senha: string;
}

export const login = async (data: LoginDTO) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
