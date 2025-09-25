package com.tcc.face_detection.dto;

import org.springframework.web.multipart.MultipartFile;

public class CadastroFotoDTO {
    private String nome;
    private String email;
    private MultipartFile foto;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public MultipartFile getFoto() { return foto; }
    public void setFoto(MultipartFile foto) { this.foto = foto; }
}

