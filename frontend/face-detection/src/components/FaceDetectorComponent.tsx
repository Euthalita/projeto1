import { useEffect, useRef } from "react";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import { recognizeFace } from "../api/faceRecognitionApi";

export default function FaceDetectorComponent() {

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const lastDetectionTime = useRef(0);
  const lastRecognitionTime = useRef(0);

  const isProcessing = useRef(false);

  const activeFaces = useRef<Map<string, number>>(new Map()); // presença ativa
  const recognizedFaces = useRef<Map<string, number>>(new Map()); // reconhecidos

  const DETECTION_INTERVAL = 100; // leve
  const RECOGNITION_INTERVAL = 1800000; // 🔥 180 segundos
  const FACE_SIZE = 160;

  useEffect(() => {

    let faceDetector: FaceDetector;
    let animationFrameId: number;

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

    };

    const startCamera = async () => {

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
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

    const getFaceKey = (box: any) => {
      return `${Math.round(box.originX / 50)}-${Math.round(box.originY / 50)}`;
    };

    const updatePresence = (faceKey: string) => {

      const now = Date.now();

      activeFaces.current.set(faceKey, now);

    };

    const cleanOldFaces = () => {

      const now = Date.now();

      activeFaces.current.forEach((lastSeen, key) => {
        if (now - lastSeen > 3000) {
          activeFaces.current.delete(key);
        }
      });

    };

    const captureAndRecognize = async (box: any) => {

      const now = Date.now();

      if (now - lastRecognitionTime.current < RECOGNITION_INTERVAL) return;
      if (isProcessing.current) return;

      const video = videoRef.current;
      if (!video) return;

      isProcessing.current = true;
      lastRecognitionTime.current = now;

      if (!captureCanvasRef.current) {
        captureCanvasRef.current = document.createElement("canvas");
      }

      const canvas = captureCanvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = FACE_SIZE;
      canvas.height = FACE_SIZE;

      ctx?.drawImage(
        video,
        box.originX,
        box.originY,
        box.width,
        box.height,
        0,
        0,
        FACE_SIZE,
        FACE_SIZE
      );

      canvas.toBlob(async (blob) => {

        if (!blob) {
          isProcessing.current = false;
          return;
        }

        try {

          const result = await recognizeFace(blob);

          if (result) {

            console.log("Reconhecido:", result.nome);

            recognizedFaces.current.set(result.id, Date.now());

          }

        } catch (err) {
          console.error(err);
        }

        isProcessing.current = false;

      }, "image/jpeg", 0.5);

    };

    const drawBox = (ctx: CanvasRenderingContext2D, box: any, color: string) => {

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      ctx.strokeRect(
        box.originX,
        box.originY,
        box.width,
        box.height
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

        cleanOldFaces();

        detections.detections.forEach(async (detection: any) => {

          const box = detection.boundingBox;
          const faceKey = getFaceKey(box);

          // Presença leve (tempo real)
          updatePresence(faceKey);

          drawBox(ctx, box, "yellow");

          // Reconhecimento (raramente)
          await captureAndRecognize(box);

        });

        animationFrameId = requestAnimationFrame(render);

      };

      render();

    };

    init();

    return () => {
      cancelAnimationFrame(animationFrameId);
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