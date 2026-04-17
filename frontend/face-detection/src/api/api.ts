import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("❌ Erro API:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method,
      });
    } else if (error.request) {
      console.error("🌐 Sem resposta do servidor:", {
        url: error.config?.url,
      });
    } else {
      console.error("⚙️ Erro ao configurar requisição:", error.message);
    }

    return Promise.reject(error);
  }
);