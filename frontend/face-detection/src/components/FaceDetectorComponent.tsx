import { useEffect, useRef } from "react";
import {
  FaceDetector,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import { recognizeFace } from "../api/faceRecognitionApi";

export default function FaceDetectorComponent() {

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const lastCaptureTime = useRef(0);
  const isProcessing = useRef(false);
  const faceStableCounter = useRef(0);

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

    const captureFace = async (box: any) => {

      const now = Date.now();

      // cooldown de 2 segundos
      if (now - lastCaptureTime.current < 2000) {
        return;
      }

      if (isProcessing.current) {
        return;
      }

      const video = videoRef.current;
      if (!video) return;

      isProcessing.current = true;
      lastCaptureTime.current = now;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = box.width;
      canvas.height = box.height;

      ctx?.drawImage(
        video,
        box.originX,
        box.originY,
        box.width,
        box.height,
        0,
        0,
        box.width,
        box.height
      );

      const base64 = canvas.toDataURL("image/jpeg");
      const image = base64.split(",")[1];

      try {

        const result = await recognizeFace(image);

        console.log("Resultado reconhecimento:", result);

      } catch (error) {

        console.error("Erro no reconhecimento:", error);

      }

      isProcessing.current = false;

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

        if (!faceDetector) return;

        const detections = faceDetector.detectForVideo(
          video,
          performance.now()
        );

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detections.detections.length > 0) {

          faceStableCounter.current += 1;

          detections.detections.forEach(async (detection) => {

            const box = detection.boundingBox;
            if (!box) return;

            ctx.strokeStyle = "red";
            ctx.lineWidth = 3;

            ctx.strokeRect(
              box.originX,
              box.originY,
              box.width,
              box.height
            );

            // só captura se o rosto estiver estável
            if (faceStableCounter.current > 5) {

              await captureFace(box);

              faceStableCounter.current = 0;

            }

          });

        } else {

          faceStableCounter.current = 0;

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