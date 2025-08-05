package com.example.VidyaMitra.Domain.Assignment;

import com.example.VidyaMitra.Domain.Assignment.DTO.AssignmentInDto;
import com.example.VidyaMitra.Domain.Assignment.DTO.AssignmentOutDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:3000")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @PostMapping("/create")
    public ResponseEntity<AssignmentOutDto> createAssignment(@RequestBody AssignmentInDto dto) {
        return ResponseEntity.ok(assignmentService.createAssignment(dto));
    }

    @GetMapping
    public ResponseEntity<List<AssignmentOutDto>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentOutDto> getAssignmentById(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<AssignmentOutDto>> getAssignmentsByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByClass(classId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
}
