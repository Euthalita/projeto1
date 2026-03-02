package com.tcc.face_detection.dto;

import java.util.List;

public class TurmaResponseDTO {

    private Long id;
    private String codigo;
    private String nome;
    private String professor;
    private String semestre;
    private String sala;

    private List<String> horariosCaptura;

    // getters e setters
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

    public List<String> getHorariosCaptura() { return horariosCaptura; }
    public void setHorariosCaptura(List<String> horariosCaptura) { this.horariosCaptura = horariosCaptura; }
}