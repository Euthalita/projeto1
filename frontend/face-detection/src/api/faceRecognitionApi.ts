import { api } from "./api";

export const recognizeFace = async (imageBlob: Blob) => {

  const formData = new FormData();
  formData.append("image", imageBlob, "face.jpg");

  const response = await api.post("/recognize", formData);

  return response.data;
};