package com.tcc.face_detection.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.tcc.face_detection.service.AlunoService;

import java.io.IOException;

import com.tcc.face_detection.dto.CadastroFotoDTO;
import com.tcc.face_detection.model.Aluno;

@RestController
@RequestMapping("/api/cadastro")
public class CadastroFotoController {

    private AlunoService alunoService = null;

    public void CadastroController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    @PostMapping("/{matricula}")
    public ResponseEntity<?> atualizarCadastro(
            @PathVariable String matricula,
            @RequestParam("nome") String nome,
            @RequestParam("email") String email,
            @RequestParam("foto") MultipartFile foto) {

        try {
            CadastroFotoDTO dto = new CadastroFotoDTO();
            dto.setNome(nome);
            dto.setEmail(email);
            dto.setFoto(foto);

            Aluno alunoAtualizado = alunoService.atualizarCadastro(matricula, dto);
            return ResponseEntity.ok(alunoAtualizado);

        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erro ao salvar cadastro");
        }
    }
}
