package com.tcc.face_detection.dto;

import java.util.List;

import com.tcc.face_detection.model.Periodo;

public class TurmaDTO {

    private String codigo;
    private String nome;
    private String professor;
    private String semestre;
    private String sala;
    private Periodo periodo;
    //private List<String> horariosCaptura;

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

    public Periodo getPeriodo() { return periodo; } 
    public void setPeriodo(Periodo periodo) { this.periodo = periodo; } 

    //public List<String> getHorariosCaptura() { return horariosCaptura; }
    //public void setHorariosCaptura(List<String> horariosCaptura) { this.horariosCaptura = horariosCaptura; }
}
