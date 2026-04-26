package com.tcc.face_detection.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tcc.face_detection.dto.CadastroDTO;
import com.tcc.face_detection.model.AlunoCadastro;
import com.tcc.face_detection.service.AlunoService;
import com.tcc.face_detection.service.PythonValidationService;

@RestController
@RequestMapping("/api/cadastro")
public class CadastroController {

    private final AlunoService alunoService;
    private final PythonValidationService pythonService;

    public CadastroController(AlunoService alunoService, PythonValidationService pythonService) {
        this.alunoService = alunoService;
        this.pythonService = pythonService;
    }

    // CADASTRO DO ALUNO
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> cadastrar(@RequestBody CadastroDTO cadastroDTO) {

        try {

            // valida se enviou foto
            String fotoBase64 = cadastroDTO.getFotoBase64();
            if (fotoBase64 == null || fotoBase64.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Foto não enviada."));
            }

            // valida imagem com Python
            boolean valido = pythonService.validarImagemBase64(fotoBase64);
            if (!valido) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Imagem inválida ou não é uma pessoa real."));
            }

            // salva cadastro
            AlunoCadastro aluno = alunoService.cadastrarAluno(cadastroDTO);

            return ResponseEntity.ok(Map.of(
                    "message", "Cadastro realizado com sucesso",
                    "email", aluno.getEmail()
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // CONSULTAR SE JÁ TEM CADASTRO
    @GetMapping("/{email}")
    public ResponseEntity<?> buscarCadastro(@PathVariable String email) {
        Optional<AlunoCadastro> alunoOpt = alunoService.findByEmail(email);

        if (alunoOpt.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "cadastrado", false
            ));
        }

        return ResponseEntity.ok(Map.of(
                "cadastrado", true,
                "dados", alunoOpt.get()
        ));
    }

    @GetMapping
public ResponseEntity<?> listarAlunos() {
    return ResponseEntity.ok(alunoService.listarTodos());
}
}