package com.tcc.face_detection.service;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import com.tcc.face_detection.dto.AttendanceEventDTO;

@Service
public class AttendanceService {

    private boolean aulaAtiva = false;
    private LocalDateTime startTime;

    public void startClass() {
        aulaAtiva = true;
        startTime = LocalDateTime.now();
        System.out.println("Aula iniciada em: " + startTime);
    }

    public void endClass() {
        aulaAtiva = false;
        System.out.println("Aula finalizada");
    }

    public boolean isAulaAtiva() {
        return aulaAtiva;
    }

    public void processEvents(List<AttendanceEventDTO> events) {

        if (!aulaAtiva) {
            throw new RuntimeException("A aula não está ativa");
        }

        for (AttendanceEventDTO event : events) {

            // Ignorar eventos antes da aula começar
            if (event.getTimestamp().isBefore(startTime)) {
                continue;
            }

            System.out.println("Tipo: " + event.getType());
            System.out.println("Aluno: " + event.getStudentId());
            System.out.println("Hora: " + event.getTimestamp());
            System.out.println("Confiança: " + event.getConfidence());
            System.out.println("----------------------");

            if ("ENTER".equals(event.getType())) {
                handleEnter(event);
            } else if ("EXIT".equals(event.getType())) {
                handleExit(event);
            }
        }
    }

    private void handleEnter(AttendanceEventDTO event) {
        // TODO: salvar entrada no banco
        System.out.println("Aluno entrou: " + event.getStudentId());
    }

    private void handleExit(AttendanceEventDTO event) {
        // TODO: calcular tempo de permanência
        System.out.println("Aluno saiu: " + event.getStudentId());
    }
}