package com.tcc.face_detection.service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.tcc.face_detection.dto.TurmaDTO;
import com.tcc.face_detection.dto.TurmaResponseDTO;
import com.tcc.face_detection.model.HorarioCaptura;
import com.tcc.face_detection.model.Turma;
import com.tcc.face_detection.repository.TurmaRepository;

@Service
public class TurmaService {

    private final TurmaRepository turmaRepository;

    public TurmaService(TurmaRepository turmaRepository) {
        this.turmaRepository = turmaRepository;
    }

    // ✅ CRIAR
    public TurmaResponseDTO criarTurma(TurmaDTO dto) {

        Turma turma = new Turma();
        turma.setCodigo(dto.getCodigo());
        turma.setNome(dto.getNome());
        turma.setProfessor(dto.getProfessor());
        turma.setSemestre(dto.getSemestre());
        turma.setSala(dto.getSala());

        List<HorarioCaptura> listaHorarios = new ArrayList<>();

        if (dto.getHorariosCaptura() != null) {
            for (String horarioStr : dto.getHorariosCaptura()) {

                HorarioCaptura horario = new HorarioCaptura();
                try {
                    horario.setHorario(LocalTime.parse(horarioStr));
                } catch (Exception e) {
                    throw new IllegalArgumentException("Formato de horário inválido: " + horarioStr);
                }
                horario.setTurma(turma);

                listaHorarios.add(horario);
            }
        }

        turma.setHorariosCaptura(listaHorarios);

        Turma salva = turmaRepository.save(turma);

        return converterParaResponseDTO(salva);
    }

    // ✅ LISTAR TODAS
    public List<TurmaResponseDTO> listarTodas() {

        return turmaRepository.findAll()
                .stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    // ✅ BUSCAR POR ID
    public TurmaResponseDTO buscarPorId(Long id) {

        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada!"));

        return converterParaResponseDTO(turma);
    }

    // ✅ ATUALIZAR
    public TurmaResponseDTO atualizar(Long id, TurmaDTO dto) {

        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada!"));

        turma.setCodigo(dto.getCodigo());
        turma.setNome(dto.getNome());
        turma.setProfessor(dto.getProfessor());
        turma.setSemestre(dto.getSemestre());
        turma.setSala(dto.getSala());

        turma.getHorariosCaptura().clear();

        if (dto.getHorariosCaptura() != null) {
            for (String horarioStr : dto.getHorariosCaptura()) {

                HorarioCaptura horario = new HorarioCaptura();
                try {
                    horario.setHorario(LocalTime.parse(horarioStr));
                } catch (Exception e) {
                    throw new IllegalArgumentException("Formato de horário inválido: " + horarioStr);
                }
                horario.setTurma(turma);

                turma.getHorariosCaptura().add(horario);
            }
        }

        Turma atualizada = turmaRepository.save(turma);

        return converterParaResponseDTO(atualizada);
    }

    // ✅ DELETAR
    public void deletar(Long id) {

        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada!"));

        turmaRepository.delete(turma);
    }

    // 🔥 MÉTODO PRIVADO PARA CONVERSÃO
    private TurmaResponseDTO converterParaResponseDTO(Turma turma) {

        TurmaResponseDTO response = new TurmaResponseDTO();

        response.setId(turma.getId());
        response.setCodigo(turma.getCodigo());
        response.setNome(turma.getNome());
        response.setProfessor(turma.getProfessor());
        response.setSemestre(turma.getSemestre());
        response.setSala(turma.getSala());

        if (turma.getHorariosCaptura() != null) {
            response.setHorariosCaptura(
                    turma.getHorariosCaptura()
                            .stream()
                            .map(h -> h.getHorario().toString())
                            .collect(Collectors.toList()));
        }

        return response;
    }
}