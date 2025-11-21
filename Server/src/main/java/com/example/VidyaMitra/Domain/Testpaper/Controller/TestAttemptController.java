package com.example.VidyaMitra.Domain.Testpaper.Controller;

import com.example.VidyaMitra.Domain.Testpaper.DTO.TestAttemptInDTO;
import com.example.VidyaMitra.Domain.Testpaper.DTO.TestAttemptOutDTO;
import com.example.VidyaMitra.Domain.Testpaper.Service.TestAttemptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-attempt")
public class TestAttemptController {
    private final TestAttemptService attemptService;

    public TestAttemptController(TestAttemptService attemptService) {
        this.attemptService = attemptService;
    }

    @PostMapping("/start")
    public ResponseEntity<TestAttemptOutDTO> startAttempt(@RequestBody TestAttemptInDTO dto) {
        return ResponseEntity.ok(attemptService.startAttempt(dto));
    }

    @PutMapping("/{id}/tab-switch")
    public ResponseEntity<TestAttemptOutDTO> markTabSwitch(@PathVariable Long id) {
        return ResponseEntity.ok(attemptService.markTabSwitch(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<TestAttemptOutDTO> cancelAttempt(@PathVariable Long id) {
        return ResponseEntity.ok(attemptService.cancelAttempt(id));
    }

    @PutMapping("/{id}/submit")
    public ResponseEntity<TestAttemptOutDTO> submitAttempt(@PathVariable Long id) {
        return ResponseEntity.ok(attemptService.submitAttempt(id));
    }
    @GetMapping("/test/{testId}/all-attempts")
    public ResponseEntity<List<TestAttemptOutDTO>> getAllAttemptsForTest(@PathVariable Long id){
        List<TestAttemptOutDTO> attempts = attemptService.getAllAttemptsByTestId(id);
        return ResponseEntity.ok(attempts);
    }
}
