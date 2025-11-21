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

    // CREATE Test Paper
    @PostMapping
    public ResponseEntity<TestPaperOutDTO> createTest(@RequestBody TestPaperInDTO dto) {
        TestPaperOutDTO createdTest = testPaperService.createTest(dto);
        return ResponseEntity.ok(createdTest);
    }

    // GET Test Paper by ID
    @GetMapping("/{id}")
    public ResponseEntity<TestPaperOutDTO> getTest(@PathVariable Long id) {
        TestPaperOutDTO test = testPaperService.getTest(id);
        return ResponseEntity.ok(test);
    }

    // OPTIONAL: Manually trigger expiry check (if not only scheduler-based)
    @PostMapping("/deactivate-expired")
    public ResponseEntity<String> deactivateExpiredTests() {
        testPaperService.deactivateExpiredTests();
        return ResponseEntity.ok("Expired tests deactivated successfully.");
    }
    // GET all tests
    @GetMapping
    public ResponseEntity<List<TestPaperOutDTO>> getAllTests() {
        List<TestPaperOutDTO> tests = testPaperService.getAllTests();
        return ResponseEntity.ok(tests);
    }

}
