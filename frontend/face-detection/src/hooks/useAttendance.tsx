import { useRef } from "react";

export function useAttendance() {

  const aulaInicio = useRef<number>(Date.now());

  const faceToStudent = useRef<Map<string, string>>(new Map());
  const studentPresence = useRef<Map<string, number>>(new Map());

  const DETECTION_INTERVAL = 120;

  const registerRecognition = (faceId: string, studentId: string) => {
    faceToStudent.current.set(faceId, studentId);
  };

  const updatePresence = (trackedFaces: any[]) => {

    trackedFaces.forEach((face) => {

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

  const getFinalAttendance = () => {

    const totalAula = Date.now() - aulaInicio.current;

    const result: any[] = [];

    studentPresence.current.forEach((tempo, studentId) => {

      const porcentagem = (tempo / totalAula) * 100;

      result.push({
        studentId,
        porcentagem,
        presente: porcentagem >= 75
      });

    });

    return result;
  };

  return {
    registerRecognition,
    updatePresence,
    getFinalAttendance
  };

}