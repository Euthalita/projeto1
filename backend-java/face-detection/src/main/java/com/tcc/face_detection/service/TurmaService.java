package com.tcc.face_detection.service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.tcc.face_detection.dto.AlunoDTO;
import com.tcc.face_detection.dto.TurmaDTO;
import com.tcc.face_detection.dto.TurmaResponseDTO;
//import com.tcc.face_detection.model.HorarioCaptura;
import com.tcc.face_detection.model.Turma;
import com.tcc.face_detection.model.AlunoCadastro;
import com.tcc.face_detection.model.Periodo;
import com.tcc.face_detection.repository.AlunoCadastroRepository;
import com.tcc.face_detection.repository.TurmaRepository;

@Service
public class TurmaService {

    private final TurmaRepository turmaRepository;
    private final AlunoCadastroRepository alunoRepository;

    public TurmaService(TurmaRepository turmaRepository,
                        AlunoCadastroRepository alunoRepository) {
        this.turmaRepository = turmaRepository;
        this.alunoRepository = alunoRepository;
    }

    // CRIAR
    public TurmaResponseDTO criarTurma(TurmaDTO dto) {

        Turma turma = new Turma();
        turma.setCodigo(dto.getCodigo());
        turma.setNome(dto.getNome());
        turma.setProfessor(dto.getProfessor());
        turma.setSemestre(dto.getSemestre());
        turma.setSala(dto.getSala());
        turma.setPeriodo(dto.getPeriodo());
        
        turma.setAlunos(new ArrayList<>());


       /*  List<HorarioCaptura> listaHorarios = new ArrayList<>();

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
*/
        Turma salva = turmaRepository.save(turma);

        return converterParaResponseDTO(salva);
    }

    // LISTAR TODAS
    public List<TurmaResponseDTO> listarTodas() {

        return turmaRepository.findAll()
                .stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    // BUSCAR POR ID
    public TurmaResponseDTO buscarPorId(Long id) {
        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada!"));

        return converterParaResponseDTO(turma);
    }

    // ATUALIZAR
    public TurmaResponseDTO atualizar(Long id, TurmaDTO dto) {

        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada!"));

        turma.setCodigo(dto.getCodigo());
        turma.setNome(dto.getNome());
        turma.setProfessor(dto.getProfessor());
        turma.setSemestre(dto.getSemestre());
        turma.setSala(dto.getSala());
        turma.setPeriodo(dto.getPeriodo());

        /*turma.getHorariosCaptura().clear();

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
*/
        Turma atualizada = turmaRepository.save(turma);

        return converterParaResponseDTO(atualizada);
    }

    // DELETAR
    public void deletar(Long id) {

        Turma turma = turmaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada!"));

        turmaRepository.delete(turma);
    }

     public void adicionarAluno(Long turmaId, Long alunoId) {

        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        AlunoCadastro aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        if (!"STUDENT".equalsIgnoreCase(aluno.getRole())) {
            throw new RuntimeException("Somente alunos podem ser adicionados à turma");
        }

        boolean jaExiste = turma.getAlunos()
                .stream()
                .anyMatch(a -> a.getId().equals(alunoId));

        if (jaExiste) {
            throw new RuntimeException("Aluno já está na turma");
        }

        turma.getAlunos().add(aluno);

        turmaRepository.save(turma);
    }

    public List<AlunoCadastro> listarAlunos(Long turmaId) {

        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        return turma.getAlunos();
    }


    // MÉTODO PRIVADO PARA CONVERSÃO
    private TurmaResponseDTO converterParaResponseDTO(Turma turma) {

        TurmaResponseDTO response = new TurmaResponseDTO();

        response.setId(turma.getId());
        response.setCodigo(turma.getCodigo());
        response.setNome(turma.getNome());
        response.setProfessor(turma.getProfessor());
        response.setSemestre(turma.getSemestre());
        response.setSala(turma.getSala());
        response.setPeriodo(turma.getPeriodo());

        if (turma.getAlunos() != null) {
        response.setAlunos(
            turma.getAlunos()
                .stream()
                .map(a -> new AlunoDTO(
                        a.getId(),
                        a.getNome(),
                        a.getMatricula()
                ))
                .toList()
        );
        }

       /* if (turma.getHorariosCaptura() != null) {
            response.setHorariosCaptura(
                    turma.getHorariosCaptura()
                            .stream()
                            .map(h -> h.getHorario().toString())
                            .collect(Collectors.toList()));
        }
*/
        return response;
   }

   
}