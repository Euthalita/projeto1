import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { useAuth } from "../context/AuthContext";
import { atualizarCadastro, buscarCadastro } from "../api/alunoService";

export default function CadastroAluno() {
  const { user } = useAuth(); // matrícula do usuário logado

  const [form, setForm] = useState({
    matricula: user || "",
    nome: "",
    email: "",
  });

  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [jaCadastrado, setJaCadastrado] = useState(false);

  const [errors, setErrors] = useState({
    matricula: "",
    nome: "",
    email: "",
    foto: "",
  });

  // -----------------------------
  // 1. AUTOLOAD: busca o aluno do backend ao abrir a tela
  // -----------------------------
  useEffect(() => {
    if (!user) return;

    const loadAluno = async () => {
      try {
        const dados = await buscarCadastro(user);

        if (dados) {
          // Se já tem nome, email e foto, então está cadastrado
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

  // -----------------------------
  // 2. Validação individual
  // -----------------------------
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

  // -----------------------------
  // 3. Validação total antes de enviar
  // -----------------------------
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

  // -----------------------------
  // 4. Submit final
  // -----------------------------
  const handleSubmit = async () => {
    if (jaCadastrado) return; // bloqueia envio se já existe

    if (!validateForm()) return;

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

      // após cadastrar, bloqueia a tela
      setJaCadastrado(true);

    } catch (error) {
      alert("Erro ao enviar cadastro.");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Cadastro do Aluno</h2>

      {/* Se já cadastrado, mostrar aviso e bloquear tudo */}
      {jaCadastrado && (
        <Message
          severity="info"
          text="Seu cadastro já foi enviado e não pode ser modificado."
          className="w-full mb-4"
        />
      )}

      {/* Matrícula */}
      <div className="mb-3">
        <InputText
          value={form.matricula}
          disabled
          className="w-full bg-gray-200 text-gray-700"
        />
      </div>

      {/* Nome */}
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

      {/* Email */}
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

      {/* Foto */}
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
        label={jaCadastrado ? "Cadastro já enviado" : loading ? "Salvando..." : "Salvar"}
        className="w-full mt-3"
        onClick={handleSubmit}
        disabled={loading || jaCadastrado}
        loading={loading}
      />
    </div>
  );
}
