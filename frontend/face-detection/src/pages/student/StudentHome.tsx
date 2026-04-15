import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

export default function StudentHome() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Home do Aluno</h1>

      <Button
        label="Entrar na Aula"
        onClick={() => navigate("/chamada")}
      />
    </div>
  );
}