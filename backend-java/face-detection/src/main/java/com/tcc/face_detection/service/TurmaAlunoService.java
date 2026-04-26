import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.tcc.face_detection.model.AlunoCadastro;
import com.tcc.face_detection.model.Turma;
import com.tcc.face_detection.model.TurmaAluno;
import com.tcc.face_detection.repository.AlunoRepository;
import com.tcc.face_detection.repository.TurmaAlunoRepository;
import com.tcc.face_detection.repository.TurmaRepository;

@Service
public class TurmaAlunoService {

    private final TurmaAlunoRepository repository;
    private final TurmaRepository turmaRepository;
    private final AlunoRepository alunoRepository;

    public TurmaAlunoService(
        TurmaAlunoRepository repository,
        TurmaRepository turmaRepository,
        AlunoRepository alunoRepository
    ) {
        this.repository = repository;
        this.turmaRepository = turmaRepository;
        this.alunoRepository = alunoRepository;
    }

    public void adicionarAluno(Long turmaId, Long alunoId) {

        if (repository.existsByTurmaIdAndAlunoId(turmaId, alunoId)) {
            throw new RuntimeException("Aluno já está na turma");
        }

        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        AlunoCadastro aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        TurmaAluno ta = new TurmaAluno();
        ta.setTurma(turma);
        ta.setAluno(aluno);
        ta.setDataMatricula(LocalDateTime.now());

        repository.save(ta);
    }

    public List<TurmaAluno> listarPorTurma(Long turmaId) {
        return repository.findByTurmaId(turmaId);
    }
}