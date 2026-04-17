import { api } from "./api";

export type AttendanceEvent = {
  type: "ENTER" | "EXIT";
  studentId: string;
  classId: string;
  timestamp: string;
};

export const sendAttendanceBatch = async (events: AttendanceEvent[]) => {
  try {
    const response = await api.post("/attendance", events, {
      timeout: 5000
    });

    return response?.data ?? null;

  } catch (error) {
    console.error("❌ Erro ao enviar eventos:", {
      error,
      events
    });

    throw error;
  }
};