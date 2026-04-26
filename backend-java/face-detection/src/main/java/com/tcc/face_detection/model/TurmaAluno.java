package com.tcc.face_detection.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;


@Entity
public class TurmaAluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "turma_id")
    private Turma turma;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private AlunoCadastro aluno;

    private LocalDateTime dataMatricula;

    // getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Turma getTurma() { return turma; }
    public void setTurma(Turma turma) { this.turma = turma; }

    public AlunoCadastro getAluno() { return aluno; }
    public void setAluno(AlunoCadastro aluno) { this.aluno = aluno; }

    public LocalDateTime getDataMatricula() { return dataMatricula; }
    public void setDataMatricula(LocalDateTime dataMatricula) { this.dataMatricula = dataMatricula; }
}

