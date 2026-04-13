import { useState } from "react";
import { api } from "../api/api";

export const ClassControl = () => {
  const [isClassActive, setIsClassActive] = useState(false);

  const startClass = async () => {
    await api.post("/class/start");
    setIsClassActive(true);
  };

  const endClass = async () => {
    await api.post("/class/end");
    setIsClassActive(false);
  };

  return (
    <div>
      {!isClassActive ? (
        <button onClick={startClass}>Iniciar Aula</button>
      ) : (
        <button onClick={endClass}>Finalizar Aula</button>
      )}
    </div>
  );
};