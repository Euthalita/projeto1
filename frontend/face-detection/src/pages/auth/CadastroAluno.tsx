import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useAuth } from "../../context/AuthContext";
import { FaceDetector, FilesetResolver} from "@mediapipe/tasks-vision";
import { api } from "../../api/api";

export default function CadastroAluno() {

  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  const [detector, setDetector] = useState<FaceDetector | null>(null);
  const [cameraAtiva, setCameraAtiva] = useState(false);

  const [foto, setFoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [erroFace, setErroFace] = useState("");

  const [form, setForm] = useState({
    matricula: user || "",
    nome: "",
    email: ""
  });

  const [errors, setErrors] = useState({
    nome: "",
    email: "",
    foto: ""
  });

  // Função utilitária: File -> Base64
  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          const base64 = result.split(',')[1];
          resolve(base64);
        } else {
          reject("Erro ao ler arquivo");
        }
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Inicialização MediaPipe
  useEffect(() => {
    iniciarMediaPipe();
  }, []);

  async function iniciarMediaPipe() {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const faceDetector = await FaceDetector.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite"
          }
        }
      );

      setDetector(faceDetector);

    } catch (error) {
      console.error(error);
      setErroFace("Erro ao carregar o detector facial.");
    }
  }

  // Funções para câmera e detecção
  function detectarEmTempoReal() {
    if (!videoRef.current || !overlayRef.current || !detector) return;

    const video = videoRef.current;
    const canvas = overlayRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const ctx: CanvasRenderingContext2D = context;
    const rect = video.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;

    function detectar() {
      if (video.readyState < 2 || !detector) {
        requestAnimationFrame(detectar);
        return;
      }

      const result = detector.detect(video);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (result.detections) {
        result.detections.forEach((detection) => {
          const box = detection.boundingBox;
          if (!box) return;

          const scaleX = canvas.width / video.videoWidth;
          const scaleY = canvas.height / video.videoHeight;

          ctx.strokeRect(
            box.originX * scaleX,
            box.originY * scaleY,
            box.width * scaleX,
            box.height * scaleY
          );
        });
      }

      requestAnimationFrame(detectar);
    }

    detectar();
  }

  async function iniciarCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraAtiva(true);
      if (detector) detectarEmTempoReal();
    } catch (error) {
      console.error(error);
      setErroFace("Erro ao acessar a câmera.");
    }
  }

  async function capturarFoto() {
    if (!videoRef.current || !canvasRef.current || !detector) {
      setErroFace("Detector não carregado.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

      const file = new File([blob], "foto_camera.jpg", { type: "image/jpeg" });
      setFoto(file);
      setPreview(URL.createObjectURL(blob));

      setErrors(prev => ({ ...prev, foto: "" }));
    }, "image/jpeg");
  }

  // Validação de campos e foto
  function validarCampo(campo: string, valor: string) {
    let erro = "";
    if (campo === "nome" && !valor.trim()) erro = "Nome é obrigatório.";
    if (campo === "email") {
      if (!valor.trim()) erro = "Email é obrigatório.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor))
        erro = "Digite um email válido.";
    }
    setErrors(prev => ({ ...prev, [campo]: erro }));
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>, campo: string) {
    const valor = e.target.value;
    setForm(prev => ({ ...prev, [campo]: valor }));
    validarCampo(campo, valor);
  }

  function validarFormulario() {
    const novosErros: any = {};
    if (!form.nome.trim()) novosErros.nome = "Nome é obrigatório.";
    if (!form.email.trim()) novosErros.email = "Email é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      novosErros.email = "Digite um email válido.";
    if (!foto) novosErros.foto = "Envie uma foto.";

    setErrors(prev => ({ ...prev, ...novosErros }));
    return Object.keys(novosErros).length === 0;
  }

  async function validarImagem(file: File) {
    if (!detector) { setErroFace("Carregando detector facial..."); return false; }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    ctx.drawImage(img, 0, 0);

    const result = detector.detect(canvas);

    if (!result.detections || result.detections.length === 0) {
      setErroFace("Nenhum rosto detectado."); return false;
    }
    if (result.detections.length > 1) {
      setErroFace("Mais de um rosto detectado."); return false;
    }

    setErroFace("");
    return true;
  }

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const valido = await validarImagem(file);
    if (!valido) return;

    setFoto(file);
    setPreview(URL.createObjectURL(file));
    setErrors(prev => ({ ...prev, foto: "" }));
  }

  // Envio do cadastro (base64)
  function confirmarEnvio() {
    if (!validarFormulario()) return;

    confirmDialog({
      message: "Deseja enviar seu cadastro?",
      header: "Confirmar envio",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Enviar",
      rejectLabel: "Cancelar",
      accept: enviarCadastro
    });
  }

  async function enviarCadastro() {
    if (!foto) { alert("Nenhuma foto selecionada."); return; }

    setLoading(true);
    try {
      const fotoBase64 = await fileToBase64(foto);

      const payload = {
        nome: form.nome,
        email: form.email,
        fotoBase64: fotoBase64
      };

       await api.post(`/api/cadastro/${form.matricula}`, payload);

      alert("Cadastro realizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar cadastro.");
    }
    setLoading(false);
  }

  // JSX do componente
  if (!detector) return <p>Carregando reconhecimento facial...</p>;

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <ConfirmDialog />
      <h2>Cadastro do Aluno</h2>

      {erroFace && <Message severity="error" text={erroFace} />}

      <div>
        <label>Nome</label>
        <InputText value={form.nome} onChange={(e) => handleChange(e, "nome")} />
        {errors.nome && <Message severity="error" text={errors.nome} />}
      </div>

      <div>
        <label>Email</label>
        <InputText value={form.email} onChange={(e) => handleChange(e, "email")} />
        {errors.email && <Message severity="error" text={errors.email} />}
      </div>

      <div>
        <label>Enviar foto</label>
        <input type="file" accept="image/*" onChange={handleUpload} />
        {errors.foto && <Message severity="error" text={errors.foto} />}
      </div>

      <div style={{ marginTop: 20 }}>
        <Button label="Abrir câmera" onClick={iniciarCamera} />
      </div>

      {cameraAtiva && (
        <div style={{ position: "relative", width: 320, height: 240 }}>
          <video ref={videoRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <canvas ref={overlayRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
          <div style={{ marginTop: 250 }}>
            <Button label="Capturar foto" onClick={capturarFoto} />
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {preview && <img src={preview} width="200" style={{ marginTop: 20 }} />}

      <div style={{ marginTop: 20 }}>
        <Button label="Salvar cadastro" onClick={confirmarEnvio} loading={loading} />
      </div>
    </div>
  );
}