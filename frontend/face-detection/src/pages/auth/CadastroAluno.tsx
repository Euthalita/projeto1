import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useAuth } from "../../context/AuthContext";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import { api } from "../../api/api";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function CadastroAluno() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  const [detector, setDetector] = useState<FaceDetector | null>(null);
  const [cameraAtiva, setCameraAtiva] = useState(false);

  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [erroFace, setErroFace] = useState("");
  const [erroSiga, setErroSiga] = useState("");

  const animationRef = useRef<number | null>(null);

  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const [form, setForm] = useState({
    matricula: "",
    nome: "",
    email: emailFromUrl
  });

  const [errors, setErrors] = useState({
    nome: "",
    email: "",
    foto: ""
  });

  // ================= LOGOUT =================
  function handleLogout() {
    logout();
    navigate("/login");
  }

  // ================= BASE64 =================
  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]);
        } else reject("Erro ao ler arquivo");
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

 // ================= MEDIAPIPE =================
  useEffect(() => {
    iniciarMediaPipe();

    return () => {
      pararCamera(); // cleanup ao sair da tela
    };
  }, []);

  async function iniciarMediaPipe() {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite"
        }
      });

      setDetector(faceDetector);
    } catch {
      setErroFace("Erro ao carregar detector facial.");
    }
  }

  // ================= CAMERA =================
  async function iniciarCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraAtiva(true);

      if (detector) detectarEmTempoReal();

    } catch {
      setErroFace("Erro ao acessar câmera.");
    }
  }

  function pararCamera() {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setCameraAtiva(false);
  }

  // ================= DETECÇÃO =================
  function detectarEmTempoReal() {
  if (!videoRef.current || !overlayRef.current || !detector) return;

  const video = videoRef.current;
  const canvas = overlayRef.current;

  const context = canvas.getContext("2d");
  if (!context) return;

  // 🔥 FIX
  const ctx = context;
  const faceDetector = detector;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  function detectar() {
    if (video.readyState < 2) {
      animationRef.current = requestAnimationFrame(detectar);
      return;
    }

    const result = faceDetector.detect(video);

    // agora TS confia
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (result.detections) {
      result.detections.forEach(detection => {
        const box = detection.boundingBox;
        if (!box) return;

        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;

        ctx.strokeRect(
          box.originX,
          box.originY,
          box.width,
          box.height
        );
      });
    }

    animationRef.current = requestAnimationFrame(detectar);
  }

  detectar();
}

  // ================= FOTO =================
  async function capturarFoto() {
    if (!videoRef.current || !canvasRef.current || !detector) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const result = detector.detect(canvas);

    if (!result.detections || result.detections.length === 0) {
      setErroFace("Nenhum rosto detectado.");
      return;
    }

    if (result.detections.length > 1) {
      setErroFace("Mais de um rosto detectado.");
      return;
    }

    setErroFace("");

    canvas.toBlob(blob => {
      if (!blob) return;

      const file = new File([blob], "foto.jpg", { type: "image/jpeg" });
      setFoto(file);
      setPreview(URL.createObjectURL(blob));
    }, "image/jpeg");
  }

  // ================= FORM =================
  function handleChange(e: ChangeEvent<HTMLInputElement>, campo: string) {
    setForm(prev => ({ ...prev, [campo]: e.target.value }));
  }

  function validarFormulario() {
    const novosErros: any = {};

    if (!form.nome.trim()) novosErros.nome = "Nome obrigatório.";
    if (!form.email.trim()) novosErros.email = "Email obrigatório.";
    if (!foto) novosErros.foto = "Envie uma foto.";

    setErrors(novosErros);

    return Object.keys(novosErros).length === 0;
  }

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFoto(file);
    setPreview(URL.createObjectURL(file));
  }

  // ================= ENVIO =================
  async function confirmarEnvio() {
    if (!validarFormulario()) return;

    confirmDialog({
      message: "Deseja enviar o cadastro?",
      header: "Confirmação",
      accept: enviarCadastro
    });
  }

  async function enviarCadastro() {
    if (!foto) return;

    setLoading(true);
    setErroSiga("");

    try {
      const base64 = await fileToBase64(foto);

      await api.post("/api/cadastro", {
        ...form,
        fotoBase64: base64
      });

      alert("Cadastro realizado com sucesso!");
      navigate("/student");

    } catch (error: any) {
      const msg = error?.response?.data?.message || "";

      if (msg.includes("Nome")) {
        setErroSiga("Nome não confere com o SIGA. Use exatamente como no documento (com acentos).");
      } else if (msg.includes("Matrícula")) {
        setErroSiga("Matrícula inválida.");
      } else if (msg.includes("Email")) {
        setErroSiga("Email não encontrado no SIGA.");
      } else if (msg.includes("já possui cadastro")) {
        setErroSiga("Você já possui cadastro.");
      } else {
        setErroSiga("Erro ao cadastrar.");
      }
    }

    setLoading(false);
  }

  // ================= UI =================
  if (!detector) return <p>Carregando...</p>;

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <ConfirmDialog />

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button label="Sair" severity="danger" onClick={handleLogout} />
      </div>

      <h2>Cadastro do Aluno</h2>

      {erroFace && <Message severity="error" text={erroFace} />}
      {erroSiga && <Message severity="error" text={erroSiga} />}

      <InputText value={form.email} disabled />

      <InputText placeholder="Nome" value={form.nome} onChange={(e) => handleChange(e, "nome")} />
      {errors.nome && <Message severity="error" text={errors.nome} />}

      <InputText placeholder="Matrícula" value={form.matricula} onChange={(e) => handleChange(e, "matricula")} />

      <input type="file" accept="image/*" onChange={handleUpload} />
      {errors.foto && <Message severity="error" text={errors.foto} />}

      <Button label="Abrir câmera" onClick={iniciarCamera} />

      {cameraAtiva && (
        <div>
          <video ref={videoRef} width="300" autoPlay />
          <canvas ref={overlayRef} style={{ position: "absolute" }} />
          <Button label="Capturar foto" onClick={capturarFoto} />
          <Button label="Parar câmera" onClick={pararCamera} />
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {preview && <img src={preview} width="200" />}

      <Button label="Salvar cadastro" onClick={confirmarEnvio} loading={loading} />
    </div>
  );
}