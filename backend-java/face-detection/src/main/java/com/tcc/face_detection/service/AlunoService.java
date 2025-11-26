package com.tcc.face_detection.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;
import java.util.UUID;

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

    private static final String UPLOAD_DIR = "uploads/fotos/";

    public AlunoService(AlunoSigaRepository alunoSigaRepository,
                        AlunoCadastroRepository alunoCadastroRepository) {
        this.alunoSigaRepository = alunoSigaRepository;
        this.alunoCadastroRepository = alunoCadastroRepository;
    }

    public AlunoCadastro atualizarCadastro(String matricula, CadastroDTO dto) throws IOException {

        // Verifica matrícula no SIGA
        alunoSigaRepository.findByMatricula(matricula)
                .orElseThrow(() -> new RuntimeException("Matrícula não encontrada no SIGA."));

        // Se já existe cadastro, NÃO permitir novo
        Optional<AlunoCadastro> existing = alunoCadastroRepository.findByMatricula(matricula);

        if (existing.isPresent()) {
            throw new RuntimeException("Aluno já possui cadastro. Não é permitido cadastrar novamente.");
        }

        // Cria novo objeto
        AlunoCadastro aluno = new AlunoCadastro();

        aluno.setMatricula(matricula);
        aluno.setNome(dto.getNome());
        aluno.setEmail(dto.getEmail());

        // =============== SALVAR FOTO ==================
        MultipartFile foto = dto.getFoto();
        if (foto != null && !foto.isEmpty()) {

            // cria diretório se não existir
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            // gera nome único
            String fileName = UUID.randomUUID() + "_" + foto.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + fileName);

            // salva arquivo
            Files.write(path, foto.getBytes());

            // guarda caminho no banco
            aluno.setFoto(path.toString());
        }

        return alunoCadastroRepository.save(aluno);
    }

    public Optional<AlunoCadastro> findByMatricula(String matricula) {
        return alunoCadastroRepository.findByMatricula(matricula);
    }
}
