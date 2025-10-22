package com.tcc.face_detection.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tcc.face_detection.dto.LoginDTO;
import com.tcc.face_detection.model.AlunoSiga;
import com.tcc.face_detection.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/api/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            AlunoSiga aluno = authService.login(loginDTO);
            return ResponseEntity.ok("Login realizado com sucesso! Matrícula: " + aluno.getMatricula());
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}