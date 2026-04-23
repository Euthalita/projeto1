package com.tcc.face_detection.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tcc.face_detection.dto.LoginDTO;
import com.tcc.face_detection.dto.LoginResponseDTO;
import com.tcc.face_detection.model.AlunoSiga;
import com.tcc.face_detection.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
    try {

        LoginResponseDTO response = authService.login(loginDTO);
        return ResponseEntity.ok(response);

    } catch (RuntimeException e) {

        String message = e.getMessage();

        if (message.equals("Usuário não encontrado")) {
            return ResponseEntity.status(404).body(
                Map.of("message", "Usuário não encontrado")
            );
        }

        if (message.equals("Senha inválida")) {
            return ResponseEntity.status(401).body(
                Map.of("message", "Senha inválida")
            );
        }

        return ResponseEntity.status(400).body(
            Map.of("message", message)
        );
    }
}
}
