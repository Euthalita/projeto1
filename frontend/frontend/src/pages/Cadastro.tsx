import React, { useState } from "react";
import api from "../api/api";

interface CadastroProps {
  matricula: string;
}

const Cadastro: React.FC<CadastroProps> = ({ matricula }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("email", email);
    if (foto) {
      formData.append("foto", foto);
    }

    try {
      await api.post(`/cadastro/${matricula}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Cadastro atualizado com sucesso!");
    } catch (err: any) {
      setMessage(err.response?.data || "Erro ao atualizar cadastro");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Cadastro Complementar
        </h2>

        {message && <p className="mb-3 text-center text-blue-500">{message}</p>}

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        <input
          type="file"
          onChange={(e) => setFoto(e.target.files ? e.target.files[0] : null)}
          className="w-full border p-2 mb-3 rounded"
          accept="image/*"
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Salvar
        </button>
      </form>
    </div>
  );
};

export default Cadastro;
