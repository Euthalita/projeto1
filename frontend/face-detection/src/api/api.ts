import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080", // Ajuste para o seu backend
  headers: {
    "Content-Type": "application/json",
  },
});

