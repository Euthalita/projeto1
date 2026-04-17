package com.tcc.face_detection.dto;

public class LoginResponseDTO {

    private boolean success;
    private boolean userExists;
    private String role;
    private String matricula;

    public LoginResponseDTO(boolean success, boolean userExists, String role, String matricula) {
        this.success = success;
        this.userExists = userExists;
        this.role = role;
        this.matricula = matricula;
    }

    public boolean isSuccess() { return success; }
    public boolean isUserExists() { return userExists; }
    public String getRole() { return role; }
    public String getMatricula() { return matricula; }
}