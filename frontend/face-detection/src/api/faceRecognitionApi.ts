import { api } from "./api";

export const recognizeFace = async (image: string) => {

  const response = await api.post("/recognize", {
    image
  });

  return response.data;
};