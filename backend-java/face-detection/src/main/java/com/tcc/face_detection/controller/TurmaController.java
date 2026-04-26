package com.tcc.face_detection.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tcc.face_detection.dto.TurmaDTO;
import com.tcc.face_detection.dto.TurmaResponseDTO;
import com.tcc.face_detection.service.TurmaService;

import java.util.List;

@RestController
@RequestMapping("/api/turmas")
public class TurmaController {

    private final TurmaService turmaService;

    public TurmaController(TurmaService turmaService) {
        this.turmaService = turmaService;
    }

    @PostMapping
    public ResponseEntity<TurmaResponseDTO> criar(@RequestBody TurmaDTO dto) {
        return ResponseEntity.ok(turmaService.criarTurma(dto));
    }

    @GetMapping
    public ResponseEntity<List<TurmaResponseDTO>> listar() {
        return ResponseEntity.ok(turmaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurmaResponseDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(turmaService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TurmaResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody TurmaDTO dto) {

        return ResponseEntity.ok(turmaService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletar(@PathVariable Long id) {
        turmaService.deletar(id);
        return ResponseEntity.ok("Turma deletada com sucesso!");
    }
    
    @PostMapping("/{turmaId}/alunos/{alunoId}")
    public ResponseEntity<String> adicionarAluno(
            @PathVariable Long turmaId,
            @PathVariable Long alunoId) {

        turmaService.adicionarAluno(turmaId, alunoId);
        return ResponseEntity.ok("Aluno adicionado com sucesso!");
    }

    @GetMapping("/{id}/alunos")
    public ResponseEntity<?> listarAlunos(@PathVariable Long id) {
        return ResponseEntity.ok(turmaService.listarAlunos(id));
    }
}