package com.example.VidyaMitra.Domain.AssignmentSubmission;

import com.example.VidyaMitra.Domain.AssignmentSubmission.DTO.AssignmentSubmissionInDto;
import com.example.VidyaMitra.Domain.AssignmentSubmission.DTO.AssignmentSubmissionOutDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class AssignmentSubmissionController {

    private final AssignmentSubmissionService submissionService;

    @PostMapping("/submit")
    public ResponseEntity<AssignmentSubmissionOutDto> submit(@RequestBody AssignmentSubmissionInDto dto) {
        return ResponseEntity.ok(submissionService.submitAssignment(dto));
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<AssignmentSubmissionOutDto>> getByAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignment(assignmentId));
    }
}
