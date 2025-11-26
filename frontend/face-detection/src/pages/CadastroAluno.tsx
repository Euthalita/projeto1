import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useAuth } from "../context/AuthContext";
import { atualizarCadastro, buscarCadastro } from "../api/alunoService";

export default function CadastroAluno() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    matricula: user || "",
    nome: "",
    email: "",
  });

  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [jaCadastrado, setJaCadastrado] = useState(false);

  const [errors, setErrors] = useState({
    nome: "",
    email: "",
    foto: "",
  });

  useEffect(() => {
    if (!user) return;

    const loadAluno = async () => {
      try {
        const dados = await buscarCadastro(user);

        if (dados) {
          if (dados.nome && dados.email && dados.fotoUrl) {
            setJaCadastrado(true);
          }

          setForm({
            matricula: user,
            nome: dados.nome || "",
            email: dados.email || "",
          });
        }
      } catch (err) {
        console.error("Erro ao buscar aluno:", err);
      }
    };

    loadAluno();
  }, [user]);

  const validateField = (field: string, value: string) => {
    let error = "";

    if (field === "nome" && !value.trim()) error = "O nome é obrigatório.";

    if (field === "email") {
      if (!value.trim()) error = "O email é obrigatório.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = "Digite um email válido.";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (e: any, field: string) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.nome.trim()) newErrors.nome = "O nome é obrigatório.";
    if (!form.email.trim()) newErrors.email = "O email é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Digite um email válido.";
    if (!foto) newErrors.foto = "A foto é obrigatória.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (jaCadastrado) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append(
        "cadastro",
        new Blob([JSON.stringify({ nome: form.nome, email: form.email })], {
          type: "application/json",
        })
      );
      formData.append("foto", foto as File);

      await atualizarCadastro(form.matricula, formData);
      alert("Cadastro realizado com sucesso!");
      setJaCadastrado(true);
    } catch (error) {
      alert("Erro ao enviar cadastro.");
    }

    setLoading(false);
  };

  // ============================================
  // 🔥 NOVO: Confirmação antes do envio
  // ============================================
  const confirmarEnvio = () => {
    if (!validateForm()) return;

    confirmDialog({
      message:
        "Você tem certeza que deseja enviar? Após o envio não será possível fazer alterações.",
      header: "Confirmar envio",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim, enviar",
      rejectLabel: "Cancelar",
      accept: handleSubmit,
    });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <ConfirmDialog />

      <h2 className="text-xl font-bold mb-4">Cadastro do Aluno</h2>

      {jaCadastrado && (
        <Message
          severity="info"
          text="Seu cadastro já foi enviado e não pode ser modificado."
          className="w-full mb-4"
        />
      )}

      <div className="mb-3">
        <InputText
          value={form.matricula}
          disabled
          className="w-full bg-gray-200 text-gray-700"
        />
      </div>

      <div className="mb-3">
        <InputText
          value={form.nome}
          placeholder="Nome"
          onChange={(e) => handleChange(e, "nome")}
          disabled={jaCadastrado}
          className={`w-full ${errors.nome && "p-invalid"}`}
        />
        {errors.nome && <Message severity="error" text={errors.nome} />}
      </div>

      <div className="mb-3">
        <InputText
          value={form.email}
          placeholder="Email"
          onChange={(e) => handleChange(e, "email")}
          disabled={jaCadastrado}
          className={`w-full ${errors.email && "p-invalid"}`}
        />
        {errors.email && <Message severity="error" text={errors.email} />}
      </div>

      <div className="mb-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFoto(e.target.files?.[0] || null)}
          disabled={jaCadastrado}
          className={`${errors.foto && "p-invalid"}`}
        />
        {errors.foto && <Message severity="error" text={errors.foto} />}
      </div>

      <Button
        label={
          jaCadastrado ? "Cadastro já enviado" : loading ? "Salvando..." : "Salvar"
        }
        className="w-full mt-3"
        onClick={confirmarEnvio} // <<<<<<<<< ALTERAÇÃO AQUI
        disabled={loading || jaCadastrado}
        loading={loading}
      />
    </div>
  );
}
