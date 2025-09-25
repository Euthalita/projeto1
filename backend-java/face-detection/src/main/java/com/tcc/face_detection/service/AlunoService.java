package com.tcc.face_detection.service;

import com.tcc.face_detection.dto.CadastroFotoDTO;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import com.tcc.face_detection.model.Aluno;
import com.tcc.face_detection.repository.AlunoRepository;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private static final String UPLOAD_DIR = "uploads/";

    public AlunoService(AlunoRepository alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    public Aluno atualizarCadastro(String matricula, CadastroFotoDTO dto) throws IOException {
        Optional<Aluno> alunoOpt = alunoRepository.findByMatricula(matricula);

        if (alunoOpt.isEmpty()) {
            throw new RuntimeException("Matrícula não encontrada!");
        }

        Aluno aluno = alunoOpt.get();
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

        return alunoRepository.save(aluno);
    }
}
