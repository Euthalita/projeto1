package com.tcc.face_detection.dto;

import java.time.LocalDateTime;

public class AttendanceEventDTO {

    private String type; // ENTER ou EXIT
    private String studentId;
    private LocalDateTime timestamp;
    private Double confidence; // opcional

    // getters e setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }
}