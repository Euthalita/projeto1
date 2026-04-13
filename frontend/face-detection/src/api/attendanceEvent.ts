import { type AttendanceEvent, enqueueAttendance as sendBatch } from "./attendanceApi";

// fila interna
let queue: AttendanceEvent[] = [];
let isSending = false;

// controle de duplicação (por aluno + tipo)
const lastSentMap = new Map<string, number>();

// evita spam (ENTER/EXIT repetido)
const shouldSendAttendance = (event: AttendanceEvent) => {
  const key = `${event.studentId}-${event.type}`;
  const now = Date.now();
  const last = lastSentMap.get(key);

  if (!last || now - last > 5000) { // 5s debounce
    lastSentMap.set(key, now);
    return true;
  }

  return false;
};

// adiciona na fila
export const enqueueAttendance = (event: AttendanceEvent) => {
  if (!shouldSendAttendance(event)) return;

  queue.push(event);
};

// processa fila em lote
export const processQueue = async () => {
  if (isSending || queue.length === 0) return;

  isSending = true;

  // pega lote atual
  const batch = [...queue];
  queue = [];

  try {
    await sendBatch(batch); // 🔥 agora envia array corretamente
    console.log("📤 Eventos enviados:", batch.length);
  } catch (error) {
    console.error("Erro ao processar fila:", error);

    // retry (não perde dados)
    queue = [...batch, ...queue];
  } finally {
    isSending = false;
  }
};

// inicia processamento automático
export const startQueueProcessor = () => {
  setInterval(() => {
    processQueue();
  }, 3000);
};