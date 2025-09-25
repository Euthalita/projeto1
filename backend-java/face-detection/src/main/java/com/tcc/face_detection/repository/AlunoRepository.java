package com.tcc.face_detection.repository;

import com.tcc.face_detection.*;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import com.tcc.face_detection.model.Aluno;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    Optional<Aluno> findByMatricula(String matricula);
}
