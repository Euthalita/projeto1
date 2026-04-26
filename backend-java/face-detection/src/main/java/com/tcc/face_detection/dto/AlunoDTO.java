package com.tcc.face_detection.dto;

public class AlunoDTO {

    private Long id;
    private String nome;
    private String matricula;

    public AlunoDTO() {}

    public AlunoDTO(Long id, String nome, String matricula) {
        this.id = id;
        this.nome = nome;
        this.matricula = matricula;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getMatricula() { return matricula; }
    public void setMatricula(String matricula) { this.matricula = matricula; }
}