package com.example.VidyaMitra.Domain.Testpaper;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/generate")
public class TestGeneratorController {

    private final TestGenerationService testGenerationService;

    public TestGeneratorController(TestGenerationService testGenerationService) {
        this.testGenerationService = testGenerationService;
    }

    @PostMapping("/test-paper")
    public ResponseEntity<GeneratedTestResponse> createTest(@RequestBody TestSpecification spec) {
        try {
            String testPaperText = testGenerationService.generateTestPaper(spec);
            return ResponseEntity.ok(new GeneratedTestResponse(testPaperText));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new GeneratedTestResponse("Failed to generate test paper: " + e.getMessage()));
        }
    }
}
