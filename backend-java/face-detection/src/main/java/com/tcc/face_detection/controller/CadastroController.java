package com.tcc.face_detection.controller;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Optional;
import javax.imageio.ImageIO;

import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.RectVector;
import org.bytedeco.opencv.opencv_objdetect.CascadeClassifier;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.tcc.face_detection.dto.CadastroDTO;
import com.tcc.face_detection.model.AlunoCadastro;
import com.tcc.face_detection.service.AlunoService;

@RestController
@RequestMapping("/api/cadastro")
public class CadastroController {

    private final AlunoService alunoService;

    public CadastroController(AlunoService alunoService) {
        this.alunoService = alunoService;
    }

    private void validarRosto(MultipartFile foto) throws Exception {

        byte[] bytes = foto.getBytes();
        Mat img = opencv_imgcodecs.imdecode(new Mat(bytes), opencv_imgcodecs.IMREAD_COLOR);
        if (img == null || img.empty()) {
            throw new Exception("Não foi possível ler a imagem enviada.");
        }

        String resourcePath = "/resources/models/haarcascade_frontalface_default.xml";

        InputStream is = getClass().getResourceAsStream(resourcePath);
        if (is == null) {
            throw new Exception("Arquivo de cascade não encontrado em: " + resourcePath);
        }

        File tempCascade = File.createTempFile("haarcascade", ".xml");
        tempCascade.deleteOnExit();

        try (FileOutputStream os = new FileOutputStream(tempCascade)) {
            byte[] buffer = new byte[4096];
            int read;
            while ((read = is.read(buffer)) != -1) {
                os.write(buffer, 0, read);
            }
        }
        is.close();

        CascadeClassifier detector = new CascadeClassifier(tempCascade.getAbsolutePath());
        if (detector.empty()) {
            throw new Exception("Falha ao carregar CascadeClassifier.");
        }

        RectVector rostos = new RectVector();
        detector.detectMultiScale(img, rostos);

        long count = rostos.size();
        if (count == 0) {
            throw new Exception("Nenhuma pessoa foi detectada na foto. Envie uma foto válida.");
        }
    }

    @PostMapping(value = "/{matricula}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> cadastrar(
            @PathVariable String matricula,
            @RequestPart("cadastro") CadastroDTO cadastroDTO,
            @RequestPart(value = "foto", required = false) MultipartFile foto) {

        try {
            if (foto != null && !foto.isEmpty()) {
                validarRosto(foto);
                cadastroDTO.setFoto(foto);
            }

            AlunoCadastro aluno = alunoService.atualizarCadastro(matricula, cadastroDTO);
            return ResponseEntity.ok(aluno);

        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .body(Map.of("message", e.getMessage()));

        }
    }

    @GetMapping("/siga/alunos/{matricula}")
    public ResponseEntity<?> buscarCadastro(@PathVariable String matricula) {
        Optional<AlunoCadastro> alunoOpt = alunoService.findByMatricula(matricula);
        return alunoOpt.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
