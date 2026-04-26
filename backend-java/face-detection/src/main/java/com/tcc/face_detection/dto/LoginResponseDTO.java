package com.tcc.face_detection.dto;

public class LoginResponseDTO {

    private boolean success;
    private boolean temCadastro; // 🔥 novo campo correto
    private String role;
    private String matricula;

    public LoginResponseDTO(boolean success, boolean temCadastro, String role, String matricula) {
        this.success = success;
        this.temCadastro = temCadastro;
        this.role = role;
        this.matricula = matricula;
    }

    public boolean isSuccess() { return success; }
    public boolean isTemCadastro() { return temCadastro; }
    public String getRole() { return role; }
    public String getMatricula() { return matricula; }
}