package com.tcc.face_detection.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

@Service
public class TimeService {

    public LocalDateTime getServerTime() {
        return LocalDateTime.now();
    }
}