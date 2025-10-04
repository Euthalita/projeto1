package com.tcc.face_detection.service;

import org.springframework.stereotype.Service;

import com.tcc.face_detection.dto.LoginDTO;
import com.tcc.face_detection.model.AlunoSiga;
import com.tcc.face_detection.repository.AlunoSigaRepository;

@Service
public class AuthService {

    private final AlunoSigaRepository alunoSigaRepository;

    public AuthService(AlunoSigaRepository alunoSigaRepository) {
        this.alunoSigaRepository = alunoSigaRepository;
    }

    public AlunoSiga login(LoginDTO dto) {
        AlunoSiga aluno = alunoSigaRepository.findByMatricula(dto.getMatricula())
            .orElseThrow(() -> new RuntimeException("Matrícula não encontrada"));

    if (!aluno.getSenha().equals(dto.getSenha())) {
        throw new RuntimeException("Senha incorreta");
    }

    return aluno;
}

   
}
