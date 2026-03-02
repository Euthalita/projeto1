package com.tcc.face_detection.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tcc.face_detection.service.TimeService;

@RestController
@RequestMapping("/api/time")
@CrossOrigin
public class TimeController {

    private final TimeService timeService;

    public TimeController(TimeService timeService) {
        this.timeService = timeService;
    }

    @GetMapping("/server-time")
    public Map<String, String> getServerTime() {
        LocalDateTime now = timeService.getServerTime();

        Map<String, String> response = new HashMap<>();
        response.put("serverTime", now.toString());

        return response;
    }
}