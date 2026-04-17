import { type AttendanceEvent, sendAttendanceBatch } from "./attendanceApi";

let queue: AttendanceEvent[] = [];
let isSending = false;

const lastSentMap = new Map<string, number>();
const retryCountMap = new Map<string, number>();

const MAX_QUEUE_SIZE = 200;
const MAX_RETRIES = 3;

// debounce por aluno + turma + tipo
const shouldSendAttendance = (event: AttendanceEvent) => {
  const key = `${event.studentId}-${event.classId}-${event.type}`;
  const now = Date.now();
  const last = lastSentMap.get(key);

  if (!last || now - last > 5000) {
    lastSentMap.set(key, now);
    return true;
  }

  return false;
};

// adiciona na fila
export const enqueueAttendance = (event: AttendanceEvent) => {
  if (!shouldSendAttendance(event)) return;

  if (queue.length >= MAX_QUEUE_SIZE) {
    console.warn("Fila cheia, descartando evento");
    return;
  }

  queue.push(event);
};

// processamento da fila
export const processQueue = async () => {
  if (isSending || queue.length === 0) return;

  isSending = true;

  const batch = [...queue];
  queue = [];

  try {
    await sendAttendanceBatch(batch);
    console.log("📤 Eventos enviados:", batch);
  } catch (error) {
    console.error("Erro ao processar fila:", error);

    batch.forEach(event => {
      const key = `${event.studentId}-${event.timestamp}`;
      const retries = retryCountMap.get(key) || 0;

      if (retries < MAX_RETRIES) {
        retryCountMap.set(key, retries + 1);
        queue.push(event);
      } else {
        console.warn("Descartando após muitas tentativas:", event);
      }
    });
  } finally {
    isSending = false;
  }
};

// inicia processamento automático (usa processQueue)
export const startQueueProcessor = () => {
  setInterval(() => {
    processQueue();
  }, 2000);
};