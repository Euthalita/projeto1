import { api } from "./api";

export const recognizeFace = async (imageBase64: string) => {
  try {
    const payload = {
      fotoBase64: imageBase64
    };

    const response = await api.post("/recognize", payload, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao reconhecer o rosto:", error);
    throw error;
  }
};