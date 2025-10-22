import React, { useState } from "react";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

interface Aluno {
  matricula: string;
  nome?: string;
  email?: string;
  foto?: string;
}

const App: React.FC = () => {
  const [aluno, setAluno] = useState<Aluno | null>(null);

  return (
    <>
      {!aluno ? (
        <Login onLogin={setAluno} />
      ) : (
        <Cadastro matricula={aluno.matricula} />
      )}
    </>
  );
};

export default App;
