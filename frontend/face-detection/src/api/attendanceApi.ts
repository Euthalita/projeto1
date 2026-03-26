import { api } from "./api";

export const saveAttendance = async (data: any[]) => {
  const response = await api.post("/attendance", data);
  return response.data;
};