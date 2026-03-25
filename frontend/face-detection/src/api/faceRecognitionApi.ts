import { api } from "./api";

export const recognizeFace = async (data: string | Blob) => {

  try {

    // Se for Blob → tempo real
    if (data instanceof Blob) {

      const formData = new FormData();
      formData.append("file", data, "face.jpg");

      const response = await api.post("/recognize", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      return response.data;
    }

    // Se for base64 → cadastro
    else {

      const response = await api.post("/recognize", {
        fotoBase64: data
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      return response.data;
    }

  } catch (error) {
    console.error("Erro ao reconhecer:", error);
    throw error;
  }
};