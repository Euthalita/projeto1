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

  const trackedFaces = useRef<TrackedFace[]>([]);
  const faceQueue = useRef<TrackedFace[]>([]);

  const faceToStudent = useRef<Map<string, string>>(new Map());
  const studentPresence = useRef<Map<string, number>>(new Map());

  const isProcessing = useRef(false);
  const lastDetectionTime = useRef(0);

  const DETECTION_INTERVAL = 120;
  const RECOGNITION_INTERVAL = 180000;
  const FACE_SIZE = 112;
  const MAX_FACES = 8;

  useEffect(() => {

    let detector: FaceDetector;
    let animationId: number;
    let queueInterval: any;

    const init = async () => {
      detector = await initDetector();
      await initCamera();
      startDetection();
      queueInterval = setInterval(processQueue, 1500);
      debugPresence();
    };

    const initDetector = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      return FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
        },
        runningMode: "VIDEO",
      });
    };

    const initCamera = async () => {
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

    const isSameFace = (a: any, b: any) => {
      return (
        Math.abs(a.originX - b.originX) < 60 &&
        Math.abs(a.originY - b.originY) < 60
      );
    };

    const updateTracking = (detections: any[]) => {
      const now = Date.now();
      const updated: TrackedFace[] = [];

      detections.forEach((det) => {
        const box = det.boundingBox;
        let found = false;

        for (let face of trackedFaces.current) {
          if (isSameFace(face.box, box)) {
            face.box = box;
            face.lastSeen = now;
            updated.push(face);
            found = true;
            break;
          }
        }

        if (!found) {
          updated.push({
            id: crypto.randomUUID(),
            box,
            lastSeen: now,
          });
        }
      });

      trackedFaces.current = updated.filter(
        (f) => now - f.lastSeen < 4000
      );
    };

    const updatePresence = () => {
      trackedFaces.current.forEach((face) => {
        const studentId = faceToStudent.current.get(face.id);
        if (!studentId) return;

        const prev = studentPresence.current.get(studentId) || 0;
        studentPresence.current.set(studentId, prev + DETECTION_INTERVAL);
      });
    };

    const shouldRecognizeFace = (face: TrackedFace) => {
      if (!face.lastRecognizedAt) return true;
      return Date.now() - face.lastRecognizedAt > RECOGNITION_INTERVAL;
    };

    const enqueueFace = (face: TrackedFace) => {
      if (!shouldRecognizeFace(face)) return;

      const exists = faceQueue.current.some(f => f.id === face.id);
      if (!exists) faceQueue.current.push(face);
    };

    const captureFace = async (face: TrackedFace) => {
      if (!videoRef.current) return;

      if (!captureCanvasRef.current) {
        captureCanvasRef.current = document.createElement("canvas");
      }

      const canvas = captureCanvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = FACE_SIZE;
      canvas.height = FACE_SIZE;

      ctx?.drawImage(
        videoRef.current,
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
          if (!blob) return resolve();

          try {
            const result = await recognizeFace(blob);

            if (result) {
              face.recognized = true;
              face.studentId = result.id;
              face.lastRecognizedAt = Date.now();

              faceToStudent.current.set(face.id, result.id);

              console.log("✅ Reconhecido:", result.nome);
            }

          } catch (err) {
            console.error(err);
          }

          resolve();
        }, "image/jpeg", 0.5);
      });
    };

    const processQueue = async () => {
      if (isProcessing.current) return;
      if (faceQueue.current.length === 0) return;

      const face = faceQueue.current.shift();
      if (!face) return;

      if (!shouldRecognizeFace(face)) return;

      isProcessing.current = true;
      await captureFace(face);
      isProcessing.current = false;
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

    const startDetection = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const loop = async () => {
        const now = performance.now();

        if (now - lastDetectionTime.current >= DETECTION_INTERVAL) {
          lastDetectionTime.current = now;

          const detections = detector.detectForVideo(video, now);
          const faces = detections.detections.slice(0, MAX_FACES);

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          updateTracking(faces);
          updatePresence();

          trackedFaces.current.forEach((face) => {
            drawBox(ctx, face);
            enqueueFace(face);
          });
        }

        animationId = requestAnimationFrame(loop);
      };

      loop();
    };

    const debugPresence = () => {
      setInterval(() => {
        console.log("📊 Presença:");
        studentPresence.current.forEach((t, id) => {
          console.log(`Aluno ${id}: ${(t / 1000).toFixed(1)}s`);
        });
      }, 10000);
    };

    init();

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(queueInterval);
    };

  }, []);

  return (
    <div style={{ position: "relative", width: 640 }}>
      <video ref={videoRef} style={{ width: "100%" }} />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
}