package com.tcc.face_detection.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tcc.face_detection.model.UsuarioSiga;

public interface UsuarioSigaRepository extends JpaRepository<UsuarioSiga, Long> {
    Optional<UsuarioSiga> findByEmail(String email);
}