import { useEffect, useRef } from "react";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import { recognizeFace } from "../api/faceRecognitionApi";
import { enqueueAttendance, startQueueProcessor } from "../api/attendanceEvent";
import { useSearchParams } from "react-router-dom";

type TrackedFace = {
  id: string;
  box: any;
  lastSeen: number;

  recognized?: boolean;
  studentId?: string;
  lastRecognizedAt?: number;
  locked?: boolean;

  priority?: number;
};

export default function FaceDetectorComponent() {

  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const trackedFaces = useRef<TrackedFace[]>([]);
  const faceQueue = useRef<TrackedFace[]>([]);

  const faceToStudent = useRef<Map<string, string>>(new Map());
  const activeStudents = useRef<Set<string>>(new Set());
  const processingStudents = useRef<Set<string>>(new Set());

  const studentLastSeen = useRef<Map<string, number>>(new Map());
  const exitCandidates = useRef<Map<string, number>>(new Map());
  const recentlyExited = useRef<Map<string, number>>(new Map());

  const isProcessing = useRef(false);
  const lastDetectionTime = useRef(0);
  const lastApiCall = useRef(0);

  const DETECTION_INTERVAL = 120;
  const RECOGNITION_INTERVAL = 180000;
  const API_INTERVAL = 2000;
  const FACE_SIZE = 112;
  const MAX_FACES = 8;
  const TRACK_TOLERANCE = 6000;
  const MAX_QUEUE = 6;

  const EXIT_DELAY = 5000;
  const RECONNECT_WINDOW = 10000;
  const LOCK_DURATION = 60000;

  useEffect(() => {

    if (!classId) {
      console.warn("❌ classId não informado");
      return;
    }

    let detector: FaceDetector;
    let animationId: number;
    let queueInterval: any;

    const init = async () => {
      detector = await initDetector();
      await initCamera();
      startQueueProcessor(); 
      startDetection();

      queueInterval = setInterval(processQueue, 1200);
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
        Math.abs(a.originX - b.originX) < 50 &&
        Math.abs(a.originY - b.originY) < 50 &&
        Math.abs(a.width - b.width) < 40 &&
        Math.abs(a.height - b.height) < 40
      );
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
            lastSeen: now,
          });
        }
      });

      trackedFaces.current = updated.filter(
        (f) => now - f.lastSeen < TRACK_TOLERANCE
      );
    };

    const calculatePriority = (face: TrackedFace) => {
      let score = 0;
      const video = videoRef.current;
      if (!video) return 0;

      const centerX = face.box.originX + face.box.width / 2;
      const centerY = face.box.originY + face.box.height / 2;

      const dist = Math.hypot(
        centerX - video.videoWidth / 2,
        centerY - video.videoHeight / 2
      );

      score += Math.max(0, 200 - dist);
      score += face.box.width * 0.5;

      if (!face.recognized) score += 300;
      if (face.locked) score -= 200;

      return score;
    };

    const shouldRecognizeFace = (face: TrackedFace) => {
      if (!face.lastRecognizedAt) return true;
      return Date.now() - face.lastRecognizedAt > RECOGNITION_INTERVAL;
    };

    const enqueueFace = (face: TrackedFace) => {
      if (faceQueue.current.length >= MAX_QUEUE) return;
      if (!shouldRecognizeFace(face)) return;

      const exists = faceQueue.current.some(f => f.id === face.id);
      if (exists) return;

      face.priority = calculatePriority(face);

      faceQueue.current.push(face);
      faceQueue.current.sort((a, b) => b.priority! - a.priority!);
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

              if (processingStudents.current.has(result.id)) {
                return resolve();
              }

              processingStudents.current.add(result.id);

              face.recognized = true;
              face.studentId = result.id;
              face.locked = true;
              face.lastRecognizedAt = Date.now();

              faceToStudent.current.set(face.id, result.id);

              const lastExit = recentlyExited.current.get(result.id);

              if (lastExit && Date.now() - lastExit < RECONNECT_WINDOW) {
                console.log("♻️ Reconectou:", result.id);
                recentlyExited.current.delete(result.id);
              } else {
                if (!activeStudents.current.has(result.id)) {
                  activeStudents.current.add(result.id);

                  enqueueAttendance({
                    type: "ENTER",
                    studentId: result.id,
                    classId: classId,
                    timestamp: new Date().toISOString(),
                  });
                }
              }

              processingStudents.current.delete(result.id);
            }

          } catch (err) {
            console.error(err);
          }

          resolve();
        }, "image/jpeg", 0.4);
      });
    };

    const processQueue = async () => {
      const now = Date.now();

      if (isProcessing.current) return;
      if (faceQueue.current.length === 0) return;
      if (now - lastApiCall.current < API_INTERVAL) return;

      const face = faceQueue.current.shift();
      if (!face) return;

      isProcessing.current = true;
      lastApiCall.current = now;

      await captureFace(face);

      isProcessing.current = false;
    };

    const handleFaceExit = () => {

      const currentStudents = new Set<string>();

      trackedFaces.current.forEach((face) => {
        const studentId = faceToStudent.current.get(face.id);

        if (studentId && face.locked) {
          currentStudents.add(studentId);
          studentLastSeen.current.set(studentId, Date.now());
          exitCandidates.current.delete(studentId);
        }
      });

      activeStudents.current.forEach((studentId) => {

        if (!currentStudents.has(studentId)) {

          if (!exitCandidates.current.has(studentId)) {
            exitCandidates.current.set(studentId, Date.now());
          }

          const firstMissing = exitCandidates.current.get(studentId)!;

          if (Date.now() - firstMissing > EXIT_DELAY) {

            activeStudents.current.delete(studentId);
            recentlyExited.current.set(studentId, Date.now());
            exitCandidates.current.delete(studentId);

            console.log("🚪 Saiu:", studentId);
          }
        }
      });
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

      const loop = () => {

        const now = performance.now();

        if (now - lastDetectionTime.current >= DETECTION_INTERVAL) {

          lastDetectionTime.current = now;

          const detections = detector.detectForVideo(video, now);
          const faces = detections.detections.slice(0, MAX_FACES);

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          updateTracking(faces);
          handleFaceExit();

          trackedFaces.current.forEach((face) => {

            if (face.locked && face.lastRecognizedAt) {
              if (Date.now() - face.lastRecognizedAt > LOCK_DURATION) {
                face.locked = false;
              }
            }

            drawBox(ctx, face);
            enqueueFace(face);
          });
        }

        animationId = requestAnimationFrame(loop);
      };

      loop();
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