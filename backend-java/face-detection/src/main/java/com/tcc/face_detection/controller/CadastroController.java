package com.tcc.face_detection.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(value = "/{matricula}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> cadastrar(
            @PathVariable String matricula,
            @RequestPart("cadastro") CadastroDTO cadastroDTO,
            @RequestPart(value = "foto", required = false) MultipartFile foto) {

        try {

    if (foto != null && !foto.isEmpty()) {

        // ✅ PASSO 3: CHAMANDO O PYTHON
        boolean valido = pythonService.validarImagem(foto);

        if (!valido) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("message", "Imagem inválida ou não é uma pessoa real."));
        }

        cadastroDTO.setFoto(foto);
    }

    AlunoCadastro aluno = alunoService.atualizarCadastro(matricula, cadastroDTO);
    return ResponseEntity.ok(aluno);

} catch (Exception e) {
    return ResponseEntity
        .badRequest()
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

