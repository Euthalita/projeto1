package com.tcc.face_detection.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tcc.face_detection.dto.TurmaDTO;
import com.tcc.face_detection.model.Turma;
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
    public ResponseEntity<Turma> criar(@RequestBody TurmaDTO dto) {
        return ResponseEntity.ok(turmaService.criarTurma(dto));
    }

    @GetMapping
    public ResponseEntity<List<Turma>> listar() {
        return ResponseEntity.ok(turmaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Turma> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(turmaService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Turma> atualizar(@PathVariable Long id, @RequestBody TurmaDTO dto) {
        return ResponseEntity.ok(turmaService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        turmaService.deletar(id);
        return ResponseEntity.ok("Turma deletada com sucesso!");
    }
}

