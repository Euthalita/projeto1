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

    // Agora consumindo JSON
    @PostMapping(value = "/{matricula}", consumes = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<?> cadastrar(
        @PathVariable String matricula,
        @RequestBody CadastroDTO cadastroDTO) {

    try {

        // Valida imagem com Python
        String fotoBase64 = cadastroDTO.getFotoBase64();
        if (fotoBase64 == null || fotoBase64.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Foto não enviada."));
        }

        boolean valido = pythonService.validarImagemBase64(fotoBase64);
        if (!valido) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Imagem inválida ou não é uma pessoa real."));
        }

        // Se passou na validação, salva no servidor
        AlunoCadastro aluno = alunoService.atualizarCadastro(matricula, cadastroDTO);
        return ResponseEntity.ok(aluno);

    } catch (Exception e) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", e.getMessage()));
    }
}

    @GetMapping("/siga/alunos/{matricula}")
    public ResponseEntity<?> buscarCadastro(@PathVariable String matricula) {
        Optional<AlunoCadastro> alunoOpt = alunoService.findByMatricula(matricula);
        return alunoOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}