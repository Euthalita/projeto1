package com.tcc.face_detection.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.tcc.face_detection.dto.CadastroDTO;
import com.tcc.face_detection.model.AlunoCadastro;
import com.tcc.face_detection.model.AlunoSiga;
import com.tcc.face_detection.repository.AlunoCadastroRepository;
import com.tcc.face_detection.repository.AlunoSigaRepository;

@Service
public class AlunoService {

    private final AlunoSigaRepository alunoSigaRepository;
    private final AlunoCadastroRepository alunoCadastroRepository;

    private static final String UPLOAD_DIR = "uploads/fotos/";

    public AlunoService(AlunoSigaRepository alunoSigaRepository,
                        AlunoCadastroRepository alunoCadastroRepository) {
        this.alunoSigaRepository = alunoSigaRepository;
        this.alunoCadastroRepository = alunoCadastroRepository;
    }

    public AlunoCadastro cadastrarAluno(CadastroDTO dto) throws IOException {

        // VALIDAÇÕES BÁSICAS
        if (dto.getEmail() == null || dto.getEmail().isBlank()) {
            throw new RuntimeException("Email é obrigatório");
        }

        if (dto.getNome() == null || dto.getNome().isBlank()) {
            throw new RuntimeException("Nome é obrigatório");
        }

        if (dto.getMatricula() == null || dto.getMatricula().isBlank()) {
            throw new RuntimeException("Matrícula é obrigatória");
        }

        // BUSCA NO SIGA
        AlunoSiga alunoSiga = alunoSigaRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Email não encontrado no SIGA"));

        // DEBUG (opcional - pode remover depois)
        System.out.println("ROLE vinda do SIGA: " + alunoSiga.getRole());

        // VALIDA SE É ALUNO (com normalização)
        if (!isStudent(alunoSiga.getRole())) {
            throw new RuntimeException("Apenas alunos podem se cadastrar");
        }

        // VALIDA NOME
        if (!alunoSiga.getNome().equalsIgnoreCase(dto.getNome())) {
            throw new RuntimeException("Nome não confere com o SIGA");
        }

        // VALIDA MATRÍCULA
        if (!alunoSiga.getMatricula().equals(dto.getMatricula())) {
            throw new RuntimeException("Matrícula não confere com o SIGA");
        }

        // VERIFICA SE JÁ EXISTE CADASTRO
        Optional<AlunoCadastro> existing = alunoCadastroRepository.findByEmail(dto.getEmail());
        if (existing.isPresent()) {
            throw new RuntimeException("Aluno já possui cadastro");
        }

        // CRIA CADASTRO
        AlunoCadastro aluno = new AlunoCadastro();
        aluno.setNome(dto.getNome());
        aluno.setEmail(dto.getEmail());
        aluno.setMatricula(dto.getMatricula());

        // DEFINE ROLE PADRÃO (SEMPRE DO BACKEND)
        aluno.setRole("STUDENT");

        // FOTO
        String fotoBase64 = dto.getFotoBase64();
        if (fotoBase64 != null && !fotoBase64.isBlank()) {

            byte[] bytes = Base64.getDecoder().decode(
                fotoBase64.replaceFirst("^data:image/[^;]+;base64,", "")
            );

            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            String fileName = UUID.randomUUID() + ".jpg";
            Path path = Paths.get(UPLOAD_DIR + fileName);

            Files.write(path, bytes);

            aluno.setFoto(path.toString());
        }

        return alunoCadastroRepository.save(aluno);
    }

    // MÉTODO CENTRAL PRA TRATAR ROLE
    private boolean isStudent(String role) {
        if (role == null) return false;

        String normalized = role.trim().toUpperCase();

        return normalized.equals("STUDENT") || normalized.equals("ALUNO");
    }

    public Optional<AlunoCadastro> findByEmail(String email) {
        return alunoCadastroRepository.findByEmail(email);
    }
}