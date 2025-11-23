package com.tcc.face_detection.model;

import jakarta.persistence.*;

@Entity
@Table(name = "turmas")
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigo;     // ex: ADS2025-1
    private String nome;       // nome da disciplina
    private String professor;
    private String semestre;   // 2025/1
    private String sala;       
    private String horario;    // ex: 19h00 - 21h00

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getProfessor() { return professor; }
    public void setProfessor(String professor) { this.professor = professor; }

    public String getSemestre() { return semestre; }
    public void setSemestre(String semestre) { this.semestre = semestre; }

    public String getSala() { return sala; }
    public void setSala(String sala) { this.sala = sala; }

    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }
}
