package com.tcc.face_detection.service;

import com.tcc.face_detection.dto.LoginDTO;
import com.tcc.face_detection.model.Aluno;
import com.tcc.face_detection.repository.AlunoRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final AlunoRepository alunoRepository;

    public AuthService(AlunoRepository alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    public Aluno login(LoginDTO dto) {
        Optional<Aluno> alunoOpt = alunoRepository.findByMatricula(dto.getMatricula());

        if (alunoOpt.isEmpty()) {
            throw new RuntimeException("Matrícula não encontrada");
        }

        Aluno aluno = alunoOpt.get();
        if (!aluno.getSenha().equals(dto.getSenha())) {
            throw new RuntimeException("Senha incorreta");
        }

        return aluno;
    }
}
