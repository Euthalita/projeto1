package com.tcc.face_detection.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.tcc.face_detection.dto.LoginDTO;
import com.tcc.face_detection.dto.LoginResponseDTO;
import com.tcc.face_detection.model.AlunoCadastro;
import com.tcc.face_detection.model.AlunoSiga;
import com.tcc.face_detection.repository.AlunoCadastroRepository;
import com.tcc.face_detection.repository.AlunoSigaRepository;

@Service
public class AuthService {

    private final AlunoSigaRepository alunoSigaRepository;
    private final AlunoCadastroRepository alunoCadastroRepository;

    public AuthService(AlunoSigaRepository alunoSigaRepository,
                       AlunoCadastroRepository alunoCadastroRepository) {
        this.alunoSigaRepository = alunoSigaRepository;
        this.alunoCadastroRepository = alunoCadastroRepository;
    }

    public LoginResponseDTO login(LoginDTO dto) {

        // validações básicas
        if (dto.getEmail() == null || dto.getEmail().isEmpty()) {
            throw new RuntimeException("Email é obrigatório");
        }

        if (dto.getSenha() == null || dto.getSenha().isEmpty()) {
            throw new RuntimeException("Senha é obrigatória");
        }

        // busca no SIGA
        AlunoSiga aluno = alunoSigaRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // valida senha (SIGA)
        if (!aluno.getSenha().equals(dto.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        // verifica se já tem cadastro facial
        Optional<AlunoCadastro> cadastro = alunoCadastroRepository.findByEmail(dto.getEmail());

        boolean temCadastro = cadastro.isPresent();

        // monta resposta
        return new LoginResponseDTO(
                true,                  // login válido
                temCadastro,           // já fez cadastro?
                aluno.getRole(),       // ALUNO ou PROFESSOR
                aluno.getEmail()
        );
    }
}