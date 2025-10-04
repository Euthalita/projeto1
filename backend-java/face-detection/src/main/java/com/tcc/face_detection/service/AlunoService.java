package com.tcc.face_detection.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.tcc.face_detection.dto.CadastroDTO;
import com.tcc.face_detection.model.AlunoCadastro;
import com.tcc.face_detection.repository.AlunoCadastroRepository;
import com.tcc.face_detection.repository.AlunoSigaRepository;

@Service
public class AlunoService {

    private final AlunoSigaRepository alunoSigaRepository;
    private final AlunoCadastroRepository alunoCadastroRepository;
    private static final String UPLOAD_DIR = "resources/uploads/";

    public AlunoService(AlunoSigaRepository alunoSigaRepository,
                        AlunoCadastroRepository alunoCadastroRepository) {
        this.alunoSigaRepository = alunoSigaRepository;
        this.alunoCadastroRepository = alunoCadastroRepository;
    }

    public AlunoCadastro atualizarCadastro(String matricula, CadastroDTO dto) throws IOException {
        // Verifica se a matrícula existe no SIGA
        alunoSigaRepository.findByMatricula(matricula)
                .orElseThrow(() -> new RuntimeException("Matrícula não encontrada no SIGA!"));

        // Busca cadastro existente ou cria novo
        AlunoCadastro aluno = alunoCadastroRepository.findByMatricula(matricula)
                .orElse(new AlunoCadastro());

        aluno.setMatricula(matricula);
        aluno.setNome(dto.getNome());
        aluno.setEmail(dto.getEmail());

        MultipartFile file = dto.getFoto();
        if (file != null && !file.isEmpty()) {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String filePath = UPLOAD_DIR + file.getOriginalFilename();
            Path path = Paths.get(filePath);
            Files.write(path, file.getBytes());

            aluno.setFoto(filePath);
        }

        return alunoCadastroRepository.save(aluno);
    }

    // NOVO MÉTODO: buscar cadastro pelo número da matrícula
    public Optional<AlunoCadastro> findByMatricula(String matricula) {
        return alunoCadastroRepository.findByMatricula(matricula);
    }
}
