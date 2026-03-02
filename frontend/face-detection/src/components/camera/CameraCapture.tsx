import React, { useEffect, useRef, useState } from "react";

const CameraCapture: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [intervalTime, setIntervalTime] = useState<number>(5000); // 5 segundos
    const [isCapturing, setIsCapturing] = useState<boolean>(false);

    // Iniciar câmera
    useEffect(() => {
        const startCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        };

        startCamera();
    }, []);

    // Função para capturar imagem
    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/png");
        console.log("Imagem capturada:", imageData);
    };

    // Captura automática
    useEffect(() => {
        if (!isCapturing) return;

        // 🔥 Horários configuráveis
        const targetTimes = [
            { hour: 19, minute: 20 },
            { hour: 19, minute: 40 },
        ];

        let lastCaptureKey: string | null = null;

        const interval = setInterval(() => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            const matchedTime = targetTimes.find(
                (time) =>
                    time.hour === currentHour &&
                    time.minute === currentMinute
            );

            if (matchedTime) {
                const captureKey = `${currentHour}:${currentMinute}`;

                // evita capturar várias vezes no mesmo minuto
                if (captureKey !== lastCaptureKey) {
                    capturePhoto();
                    lastCaptureKey = captureKey;

                    console.log("Captura realizada às", captureKey);
                }
            }
        }, 1000); // verifica a cada 1 segundo

        return () => clearInterval(interval);
    }, [isCapturing]);
    
    return (
        <div>
            <h2>Captura de Webcam</h2>

            <video ref={videoRef} autoPlay playsInline width={400} />

            <br />

            <button onClick={capturePhoto}>Capturar Agora</button>

            <button onClick={() => setIsCapturing(!isCapturing)}>
                {isCapturing ? "Parar Captura Automática" : "Iniciar Captura Automática"}
            </button>

            <br />

            <label>Intervalo (ms): </label>
            <input
                type="number"
                value={intervalTime}
                onChange={(e) => setIntervalTime(Number(e.target.value))}
            />

            <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
    );
};

export default CameraCapture;