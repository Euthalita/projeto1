import { api } from "./api";

export interface LoginDTO {
  matricula: string;
  senha: string;
}

export const login = async (data: LoginDTO) => {
  const response = await api.post("http://localhost:8080/auth/api/login", data, {
    responseType: "text"
  });
  return response.data;
};
