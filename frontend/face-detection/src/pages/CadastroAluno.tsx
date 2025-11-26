import { useEffect, useState, type ChangeEvent } from "react";
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
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [jaCadastrado, setJaCadastrado] = useState(false);

  const [errors, setErrors] = useState({
    nome: "",
    email: "",
    foto: "",
    backend: "",
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

    setErrors((prev) => ({ ...prev, [field]: error, backend: "" }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
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

    setErrors((prev) => ({ ...prev, ...newErrors, backend: "" }));
    return Object.keys(newErrors).length === 0;
  };

  const handleFoto = (file: File | null) => {
    setFoto(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }

    setErrors((prev) => ({ ...prev, foto: "", backend: "" }));
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

    } catch (error: any) {
      console.error("ERRO AO ENVIAR:", error);

      let backendMsg = "Erro desconhecido ao enviar cadastro.";

      if (error?.response?.data) {
        const data = error.response.data;

        if (typeof data === "string") {
          backendMsg = data;
        } else if (typeof data === "object") {
          backendMsg = data.message || JSON.stringify(data);
        }
      } else if (error?.message) {
        backendMsg = error.message;
      }

      alert(backendMsg);
    }

    setLoading(false);
  };

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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111827",
        padding: "16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <ConfirmDialog />
        <div
          style={{
            background: "#1f2937",
            color: "#fff",
            padding: "1.25rem",
            borderRadius: 12,
            boxShadow:
              "0 10px 20px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Cadastro do Aluno</h2>

          {jaCadastrado && (
            <Message
              severity="info"
              text="Seu cadastro já foi enviado e não pode ser modificado."
              className="w-full mb-4"
            />
          )}

          {errors.backend && (
            <Message
              severity="error"
              text={errors.backend}
              className="w-full mb-4"
            />
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <label htmlFor="matricula" style={{ color: "#fff", fontSize: 14 }}>
              Matrícula
            </label>
            <InputText
              id="matricula"
              value={form.matricula}
              disabled
              style={{ width: "100%" }}
            />

            <label htmlFor="nome" style={{ color: "#fff", fontSize: 14 }}>
              Nome
            </label>
            <InputText
              id="nome"
              value={form.nome}
              onChange={(e) => handleChange(e, "nome")}
              disabled={jaCadastrado}
              style={{ width: "100%" }}
            />
            {errors.nome && <Message severity="error" text={errors.nome} />}

            <label htmlFor="email" style={{ color: "#fff", fontSize: 14 }}>
              Email
            </label>
            <InputText
              id="email"
              value={form.email}
              onChange={(e) => handleChange(e, "email")}
              disabled={jaCadastrado}
              style={{ width: "100%" }}
            />
            {errors.email && <Message severity="error" text={errors.email} />}

            <div>
              <label htmlFor="foto" style={{ color: "#fff", fontSize: 14 }}>
                Foto
              </label>
              <input
                id="foto"
                type="file"
                accept="image/*"
                onChange={(e) => handleFoto(e.target.files?.[0] || null)}
                disabled={jaCadastrado}
                style={{ width: "100%" }}
              />
              {errors.foto && <Message severity="error" text={errors.foto} />}
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    marginTop: "12px",
                    width: "120px",
                    height: "160px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    margin: "0 auto",
                  }}
                />
              )}
            </div>

            <Button
              label={jaCadastrado ? "Cadastro já enviado" : loading ? "Salvando..." : "Salvar"}
              onClick={confirmarEnvio}
              style={{ width: "100%", marginTop: "12px" }}
              disabled={loading || jaCadastrado}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
