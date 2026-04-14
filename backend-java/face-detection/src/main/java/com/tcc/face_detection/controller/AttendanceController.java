package com.tcc.face_detection.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tcc.face_detection.dto.AttendanceEventDTO;
import com.tcc.face_detection.service.AttendanceService;

@RestController
@RequestMapping("/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // Iniciar aula
    @PostMapping("/class/start")
    public ResponseEntity<?> startClass() {
        attendanceService.startClass();
        return ResponseEntity.ok("Aula iniciada");
    }

    // Finalizar aula
    @PostMapping("/class/end")
    public ResponseEntity<?> endClass() {
        attendanceService.endClass();
        return ResponseEntity.ok("Aula finalizada");
    }

    // Receber eventos do frontend
    @PostMapping
    public ResponseEntity<?> receiveAttendance(
            @RequestBody List<AttendanceEventDTO> events) {

        try {
            attendanceService.processEvents(events);
            return ResponseEntity.ok("Eventos processados com sucesso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}