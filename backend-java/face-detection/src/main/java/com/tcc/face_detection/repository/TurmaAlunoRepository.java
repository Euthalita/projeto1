package com.tcc.face_detection.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.tcc.face_detection.model.TurmaAluno;

public interface TurmaAlunoRepository extends JpaRepository<TurmaAluno, Long> {

    List<TurmaAluno> findByTurmaId(Long turmaId);

    boolean existsByTurmaIdAndAlunoId(Long turmaId, Long alunoId);
}