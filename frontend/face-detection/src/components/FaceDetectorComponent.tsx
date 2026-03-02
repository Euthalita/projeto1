import { useEffect, useRef } from "react";
import {
  FaceDetector,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

export default function FaceDetectorComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const detectFaces = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Ajusta tamanho real do canvas ao vídeo
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const render = () => {
        if (!faceDetector) return;

        const detections = faceDetector.detectForVideo(
          video,
          performance.now()
        );

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detections.detections.length > 0) {
          console.log("Rosto detectado!");

          detections.detections.forEach((detection) => {
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
          });
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