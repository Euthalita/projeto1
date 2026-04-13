import { api } from "./api";

// Tipos separados (mais seguro e profissional)

export type EnterEvent = {
  type: "ENTER";
  studentId: string;
  timestamp: string;
  confidence?: number;
};

export type ExitEvent = {
  type: "EXIT";
  studentId: string;
  timestamp: string;
};

export type AttendanceEvent = EnterEvent | ExitEvent;

// 🔥 Função principal (batch)
export const enqueueAttendance = async (events: AttendanceEvent[]) => {
  try {
    const response = await api.post("/attendance", events);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar eventos de presença:", error);
    throw error;
  }
};