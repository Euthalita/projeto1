package com.tcc.face_detection.dto;

import com.tcc.face_detection.model.Periodo;
import java.util.List;

public class TurmaResponseDTO {

    private Long id;
    private String codigo;
    private String nome;
    private String professor;
    private String semestre;
    private String sala;
    private Periodo periodo;

    private List<AlunoDTO> alunos;
    //private List<String> horariosCaptura;

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

    public Periodo getPeriodo() { return periodo; }
    public void setPeriodo(Periodo periodo) { this.periodo = periodo; }

    public List<AlunoDTO> getAlunos() { return alunos; }
    public void setAlunos(List<AlunoDTO> alunos) { this.alunos = alunos; }

    //public List<String> getHorariosCaptura() { return horariosCaptura; }
    //public void setHorariosCaptura(List<String> horariosCaptura) { this.horariosCaptura = horariosCaptura; }
}