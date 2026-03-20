package com.tcc.face_detection.service;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PythonValidationService {

    // Mantemos o método antigo caso queira usar MultipartFile
    public boolean validarImagem(byte[] fotoBytes) {
        String base64 = java.util.Base64.getEncoder().encodeToString(fotoBytes);
        return validarImagemBase64(base64);
    }

    // Novo método que recebe Base64 diretamente
    public boolean validarImagemBase64(String base64) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String pythonUrl = "http://localhost:5000/validar";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = Map.of("image", base64);
            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(pythonUrl, request, Map.class);

            System.out.println("Status Python: " + response.getStatusCode());
            System.out.println("Resposta Python: " + response.getBody());

            Map<String, Object> responseBody = response.getBody();

            if (responseBody == null || !responseBody.containsKey("valido")) {
                throw new RuntimeException("Resposta inválida do Python");
            }

            return (Boolean) responseBody.get("valido");

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Erro ao validar imagem no Python: " + e.getMessage());
        }
    }
}