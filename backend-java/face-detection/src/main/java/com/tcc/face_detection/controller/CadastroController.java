package com.tcc.face_detection.controller;

import java.io.IOException;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.tcc.face_detection.dto.CadastroDTO;
import com.tcc.face_detection.model.AlunoCadastro;
import com.tcc.face_detection.service.AlunoService;

@RestController
@RequestMapping("/api/cadastro")
public class CadastroController {

    private final AlunoService alunoService;

    public CadastroController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    /**
     * Endpoint para cadastro ou atualização do aluno com envio de foto
     * @param matricula do aluno (verificada na simulação da API SIGA)
     * @param cadastroDTO com nome, email e foto
     * @param foto opcional, enviada como MultipartFile
     */
    @PostMapping(value = "/{matricula}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> cadastrar(
            @PathVariable String matricula,
            @RequestPart("cadastro") CadastroDTO cadastroDTO,
            @RequestPart(value = "foto", required = false) MultipartFile foto) {

        try {
            if (foto != null && !foto.isEmpty()) {
                cadastroDTO.setFoto(foto);
            }

            AlunoCadastro aluno = alunoService.atualizarCadastro(matricula, cadastroDTO);
            return ResponseEntity.ok(aluno);

        } catch (RuntimeException | IOException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint para buscar cadastro pelo número de matrícula
     */
    @GetMapping("/{matricula}")
    public ResponseEntity<?> buscarCadastro(@PathVariable String matricula) {
        Optional<AlunoCadastro> alunoOpt = alunoService.findByMatricula(matricula);
        return alunoOpt.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }
}
