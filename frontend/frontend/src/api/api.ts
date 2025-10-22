import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // backend Spring Boot
});

export default api;
