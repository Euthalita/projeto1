import { useEffect, useRef } from "react";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import { recognizeFace } from "../api/faceRecognitionApi";

type TrackedFace = {
  id: string;
  box: any;
  lastSeen: number;

  recognized?: boolean;
  studentId?: string;
  lastRecognizedAt?: number;
};

export default function FaceDetectorComponent() {

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const lastDetectionTime = useRef(0);
  const isProcessing = useRef(false);

  // TRACKING
  const trackedFaces = useRef<TrackedFace[]>([]);

  // RELAÇÃO TRACK → ALUNO
  const faceToStudent = useRef<Map<string, string>>(new Map());

  // TEMPO DE PRESENÇA (ms)
  const studentPresence = useRef<Map<string, number>>(new Map());

  // FILA
  const faceQueue = useRef<TrackedFace[]>([]);

  const DETECTION_INTERVAL = 120;
  const RECOGNITION_INTERVAL = 180000; // 3 min
  const FACE_SIZE = 112;
  const MAX_FACES = 8;

  useEffect(() => {

    let faceDetector: FaceDetector;
    let animationFrameId: number;
    let queueInterval: any;

    const init = async () => {

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
        },
        runningMode: "VIDEO",
      });

      await startCamera();
      detectFaces();
      startQueueProcessor();

      // 🔥 DEBUG
      setInterval(() => {
        console.log("📊 Presença parcial:");
        studentPresence.current.forEach((tempo, id) => {
          console.log(`Aluno ${id}: ${(tempo / 1000).toFixed(1)}s`);
        });
      }, 10000);

    };

    const startCamera = async () => {

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await new Promise((resolve) => {
          videoRef.current!.onloadedmetadata = () => {
            videoRef.current!.play();
            resolve(true);
          };
        });
      }

    };

    // 🔥 TRACKING
    const isSameFace = (box1: any, box2: any) => {
      const dx = Math.abs(box1.originX - box2.originX);
      const dy = Math.abs(box1.originY - box2.originY);
      return dx < 60 && dy < 60;
    };

    const updateTracking = (detections: any[]) => {

      const now = Date.now();
      const updated: TrackedFace[] = [];

      detections.forEach((det) => {

        const box = det.boundingBox;
        let matched = false;

        for (let face of trackedFaces.current) {

          if (isSameFace(face.box, box)) {
            face.box = box;
            face.lastSeen = now;
            updated.push(face);
            matched = true;
            break;
          }

        }

        if (!matched) {
          updated.push({
            id: crypto.randomUUID(),
            box,
            lastSeen: now
          });
        }

      });

      trackedFaces.current = updated.filter(
        (face) => now - face.lastSeen < 4000
      );

    };

    // 🔥 PRESENÇA (BASEADA EM TRACKING)
    const updatePresence = () => {

      trackedFaces.current.forEach((face) => {

        const studentId = faceToStudent.current.get(face.id);

        if (studentId) {

          const prev = studentPresence.current.get(studentId) || 0;

          studentPresence.current.set(
            studentId,
            prev + DETECTION_INTERVAL
          );

        }

      });

    };

    // 🔥 FILA INTELIGENTE
    const enqueueFace = (face: TrackedFace) => {

      const now = Date.now();

      if (face.recognized && face.lastRecognizedAt) {
        if (now - face.lastRecognizedAt < RECOGNITION_INTERVAL) {
          return;
        }
      }

      const alreadyQueued = faceQueue.current.some(
        (f) => f.id === face.id
      );

      if (!alreadyQueued) {
        faceQueue.current.push(face);
      }

    };

    // 🔥 RECONHECIMENTO POR ROSTO
    const captureAndRecognize = async (face: TrackedFace) => {

      const now = Date.now();

      if (face.recognized && face.lastRecognizedAt) {
        if (now - face.lastRecognizedAt < RECOGNITION_INTERVAL) {
          return;
        }
      }

      if (isProcessing.current) return;

      const video = videoRef.current;
      if (!video) return;

      isProcessing.current = true;

      if (!captureCanvasRef.current) {
        captureCanvasRef.current = document.createElement("canvas");
      }

      const canvas = captureCanvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = FACE_SIZE;
      canvas.height = FACE_SIZE;

      ctx?.drawImage(
        video,
        face.box.originX,
        face.box.originY,
        face.box.width,
        face.box.height,
        0,
        0,
        FACE_SIZE,
        FACE_SIZE
      );

      return new Promise<void>((resolve) => {

        canvas.toBlob(async (blob) => {

          if (!blob) {
            isProcessing.current = false;
            resolve();
            return;
          }

          try {

            const result = await recognizeFace(blob);

            if (result) {
              console.log("✅ Reconhecido:", result.nome);

              face.recognized = true;
              face.studentId = result.id;
              face.lastRecognizedAt = now;

              faceToStudent.current.set(face.id, result.id);
            }

          } catch (err) {
            console.error(err);
          }

          isProcessing.current = false;
          resolve();

        }, "image/jpeg", 0.5);

      });

    };

    // 🔥 PROCESSADOR DA FILA
    const startQueueProcessor = () => {

      queueInterval = setInterval(async () => {

        if (faceQueue.current.length === 0) return;
        if (isProcessing.current) return;

        const face = faceQueue.current.shift();

        if (face) {
          await captureAndRecognize(face);
        }

      }, 1500);

    };

    const drawBox = (ctx: CanvasRenderingContext2D, face: TrackedFace) => {

      const recognized = faceToStudent.current.has(face.id);

      ctx.strokeStyle = recognized ? "green" : "yellow";
      ctx.lineWidth = 2;

      ctx.strokeRect(
        face.box.originX,
        face.box.originY,
        face.box.width,
        face.box.height
      );

    };

    const detectFaces = () => {

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const render = async () => {

        const now = performance.now();

        if (now - lastDetectionTime.current < DETECTION_INTERVAL) {
          animationFrameId = requestAnimationFrame(render);
          return;
        }

        lastDetectionTime.current = now;

        const detections = faceDetector.detectForVideo(
          video,
          performance.now()
        );

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const faces = detections.detections.slice(0, MAX_FACES);

        updateTracking(faces);

        // 🔥 PRESENÇA NÃO DEPENDE DA FILA
        updatePresence();

        trackedFaces.current.forEach((face) => {
          drawBox(ctx, face);
          enqueueFace(face);
        });

        animationFrameId = requestAnimationFrame(render);

      };

      render();

    };

    init();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(queueInterval);
    };

  }, []);

  return (
    <div style={{ position: "relative", width: 640 }}>
      <video ref={videoRef} style={{ width: "100%" }} />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );

}