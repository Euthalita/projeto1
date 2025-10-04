package com.tcc.face_detection.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tcc.face_detection.model.AlunoSiga;

public interface AlunoSigaRepository extends JpaRepository<AlunoSiga, Long> {
    Optional<AlunoSiga> findByMatricula(String matricula);
}
