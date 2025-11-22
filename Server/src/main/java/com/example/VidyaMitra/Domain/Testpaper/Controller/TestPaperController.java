package com.example.VidyaMitra.Domain.Testpaper.Controller;

import com.example.VidyaMitra.Domain.Testpaper.DTO.TestPaperInDTO;
import com.example.VidyaMitra.Domain.Testpaper.DTO.TestPaperOutDTO;
import com.example.VidyaMitra.Domain.Testpaper.Service.TestPaperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-paper")
public class TestPaperController {

    private final TestPaperService testPaperService;

    public TestPaperController(TestPaperService testPaperService) {
        this.testPaperService = testPaperService;
    }

    // CREATE TEST PAPER
    @PostMapping
    public ResponseEntity<TestPaperOutDTO> createTest(@RequestBody TestPaperInDTO dto) {
        return ResponseEntity.ok(testPaperService.createTest(dto));
    }

    // SEND TO CLASS
    @PostMapping("/send-to-class/{classId}/{testPaperId}")
    public ResponseEntity<String> sendTestPaperToClass(@PathVariable Long classId,
                                                       @PathVariable Long testPaperId)

     {
        String message = testPaperService.sendTestPaperToClass(classId, testPaperId);
        return ResponseEntity.ok(message);
    }

    // GET TEST BY ID
    @GetMapping("/{id}")
    public ResponseEntity<TestPaperOutDTO> getTest(@PathVariable Long id) {
        return ResponseEntity.ok(testPaperService.getTest(id));
    }

    // DEACTIVATE EXPIRED TESTS
    @PostMapping("/deactivate-expired")
    public ResponseEntity<String> deactivateExpiredTests() {
        testPaperService.deactivateExpiredTests();
        return ResponseEntity.ok("Expired tests deactivated successfully.");
    }

    // GET ALL TESTS
    @GetMapping
    public ResponseEntity<List<TestPaperOutDTO>> getAllTests() {
        return ResponseEntity.ok(testPaperService.getAllTests());
    }
}
