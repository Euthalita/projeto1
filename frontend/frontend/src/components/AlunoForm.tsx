import { useState } from "react";
import api from "../services/api";

const AlunoForm = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foto) {
      setMensagem("Selecione uma foto!");
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("matricula", matricula);
    formData.append("foto", foto);

    try {
      await api.post("/alunos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMensagem("Aluno cadastrado com sucesso!");
      setNome("");
      setEmail("");
      setMatricula("");
      setFoto(null);
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setMensagem("❌ Matrícula já cadastrada!");
      } else {
        setMensagem("⚠️ Erro ao cadastrar aluno.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded shadow-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-bold mb-4">Cadastro de Aluno</h2>

      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="text"
        placeholder="Matrícula"
        value={matricula}
        onChange={(e) => setMatricula(e.target.value)}
        required
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFoto(e.target.files ? e.target.files[0] : null)}
        required
        className="w-full p-2 border rounded mb-2"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Cadastrar
      </button>

      {mensagem && <p className="mt-2 text-center">{mensagem}</p>}
    </form>
  );
};

export default AlunoForm;
