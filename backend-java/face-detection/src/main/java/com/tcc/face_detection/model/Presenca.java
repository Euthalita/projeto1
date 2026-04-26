package com.tcc.face_detection.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Presenca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long turmaId;
    private Long alunoId;

    private LocalDate data;
    private Boolean presente;
}
