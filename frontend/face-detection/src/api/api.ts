import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // evita travamento infinito
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    //adicionar token futuramente
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Erro API:", error.response.data);
    } else if (error.request) {
      console.error("Sem resposta do servidor");
    } else {
      console.error("Erro ao configurar requisição:", error.message);
    }

    return Promise.reject(error);
  }
);