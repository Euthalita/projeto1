package com.tcc.face_detection.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tcc.face_detection.model.AlunoCadastro;

public interface AlunoCadastroRepository extends JpaRepository<AlunoCadastro, Long> {
    Optional<AlunoCadastro> findByMatricula(String matricula);
}