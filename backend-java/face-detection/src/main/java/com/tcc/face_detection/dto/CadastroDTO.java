package com.tcc.face_detection.dto;

public class CadastroDTO {
    
    private String nome;
    private String email;
    private String matricula;
    private String fotoBase64; // opcional, caso queira enviar a foto como string base64

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMatricula() { return matricula; }
    public void setMatricula(String matricula) { this.matricula = matricula; }

    public String getFotoBase64() { return fotoBase64; }
    public void setFotoBase64(String fotoBase64) { this.fotoBase64 = fotoBase64; }

    public Object getSenha() {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}

