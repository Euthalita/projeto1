package com.tcc.face_detection.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tcc.face_detection.dto.TurmaDTO;
import com.tcc.face_detection.model.Turma;
import com.tcc.face_detection.repository.TurmaRepository;

@Service
public class TurmaService {

    private final TurmaRepository turmaRepository;

    public TurmaService(TurmaRepository turmaRepository) {
        this.turmaRepository = turmaRepository;
    }

    public Turma criarTurma(TurmaDTO dto) {
        Turma turma = new Turma();
        turma.setCodigo(dto.getCodigo());
        turma.setNome(dto.getNome());
        turma.setProfessor(dto.getProfessor());
        turma.setSemestre(dto.getSemestre());
        turma.setSala(dto.getSala());
        turma.setHorario(dto.getHorario());
        return turmaRepository.save(turma);
    }

    public List<Turma> listarTodas() {
        return turmaRepository.findAll();
    }

    public Turma buscarPorId(Long id) {
        return turmaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada!"));
    }

    public Turma atualizar(Long id, TurmaDTO dto) {
        Turma turma = buscarPorId(id);

        turma.setCodigo(dto.getCodigo());
        turma.setNome(dto.getNome());
        turma.setProfessor(dto.getProfessor());
        turma.setSemestre(dto.getSemestre());
        turma.setSala(dto.getSala());
        turma.setHorario(dto.getHorario());

        return turmaRepository.save(turma);
    }

    public void deletar(Long id) {
        Turma turma = buscarPorId(id);
        turmaRepository.delete(turma);
    }
}
