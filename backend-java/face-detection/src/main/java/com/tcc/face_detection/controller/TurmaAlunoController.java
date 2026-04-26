package com.tcc.face_detection.controller;

import com.tcc.face_detection.service.TurmaAlunoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/turma-aluno")
public class TurmaAlunoController {

    private final TurmaAlunoService service;

    public TurmaAlunoController(TurmaAlunoService service) {
        this.service = service;
    }

    // adicionar aluno na turma
    @PostMapping("/{turmaId}/{alunoId}")
    public ResponseEntity<?> adicionar(
            @PathVariable Long turmaId,
            @PathVariable Long alunoId) {

        service.adicionarAluno(turmaId, alunoId);

        return ResponseEntity.ok().body("Aluno adicionado na turma");
    }

    // listar alunos da turma
    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<?> listar(@PathVariable Long turmaId) {
        return ResponseEntity.ok(service.listarPorTurma(turmaId));
    }
}