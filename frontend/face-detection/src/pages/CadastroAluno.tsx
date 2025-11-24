import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { atualizarCadastro } from "../api/alunoService";

export default function CadastroAluno() {
  const [matricula, setMatricula] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("cadastro", new Blob([JSON.stringify({ nome, email })], { type: "application/json" }));
    if (foto) formData.append("foto", foto);

    const response = await atualizarCadastro(matricula, formData);
    alert("Cadastro atualizado!");
    console.log(response);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2>Cadastro do Aluno</h2>

      <InputText value={matricula} placeholder="Matrícula"
        onChange={(e) => setMatricula(e.target.value)} className="w-full mb-3" />

      <InputText value={nome} placeholder="Nome"
        onChange={(e) => setNome(e.target.value)} className="w-full mb-3" />

      <InputText value={email} placeholder="Email"
        onChange={(e) => setEmail(e.target.value)} className="w-full mb-3" />

      <input type="file" onChange={(e) => setFoto(e.target.files?.[0] || null)} />

      <Button label="Salvar" className="w-full mt-3" onClick={handleSubmit} />
    </div>
  );
}
