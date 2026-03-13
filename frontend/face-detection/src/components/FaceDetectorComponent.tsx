import { useEffect, useRef } from "react";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import { recognizeFace } from "../api/faceRecognitionApi";

export default function FaceDetectorComponent() {

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const lastCaptureTime = useRef(0);
  const lastDetectionTime = useRef(0);

  const isProcessing = useRef(false);
  const lastBox = useRef<any>(null);

  const recognizedFaces = useRef<Map<string, number>>(new Map());

  const DETECTION_INTERVAL = 100; // 10 FPS
  const CAPTURE_COOLDOWN = 2000;
  const FACE_IGNORE_TIME = 10000; // 10 segundos
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

    const isFaceStable = (box: any) => {

      if (!lastBox.current) {
        lastBox.current = box;
        return false;
      }

      const dx = Math.abs(box.originX - lastBox.current.originX);
      const dy = Math.abs(box.originY - lastBox.current.originY);

      lastBox.current = box;

      return dx < 5 && dy < 5;

    };

    const captureFace = async (box: any, ctx: CanvasRenderingContext2D) => {

      const now = Date.now();

      if (now - lastCaptureTime.current < CAPTURE_COOLDOWN) return;
      if (isProcessing.current) return;

      const video = videoRef.current;
      if (!video) return;

      isProcessing.current = true;
      lastCaptureTime.current = now;

      if (!captureCanvasRef.current) {
        captureCanvasRef.current = document.createElement("canvas");
      }

      const canvas = captureCanvasRef.current;
      const ctxCapture = canvas.getContext("2d");

      canvas.width = FACE_SIZE;
      canvas.height = FACE_SIZE;

      ctxCapture?.drawImage(
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

      canvas.toBlob(
        async (blob) => {

          if (!blob) {
            isProcessing.current = false;
            return;
          }

          try {

            const result = await recognizeFace(blob);

            if (!result) {
              drawBox(ctx, box, "red");
              isProcessing.current = false;
              return;
            }

            const now = Date.now();
            const lastSeen = recognizedFaces.current.get(result.id);

            if (lastSeen && now - lastSeen < FACE_IGNORE_TIME) {

              console.log("Rosto já reconhecido recentemente");
              drawBox(ctx, box, "green");

              isProcessing.current = false;
              return;

            }

            recognizedFaces.current.set(result.id, now);

            console.log("Aluno reconhecido:", result.nome);

            drawBox(ctx, box, "green");

          } catch (error) {

            console.error("Erro reconhecimento:", error);

            drawBox(ctx, box, "red");

          }

          isProcessing.current = false;

        },
        "image/jpeg",
        0.8
      );

    };

    const drawBox = (ctx: CanvasRenderingContext2D, box: any, color: string) => {

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;

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

        if (detections.detections.length > 0) {

          const detection = detections.detections[0];
          const box = detection.boundingBox;

          if (box) {

            drawBox(ctx, box, "red");

            if (isFaceStable(box)) {

              await captureFace(box, ctx);

            }

          }

        }

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