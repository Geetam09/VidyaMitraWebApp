package com.example.VidyaMitra.Domain.AssignmentSubmission;

import com.example.VidyaMitra.Domain.Assignment.AssignmentEntity;
import com.example.VidyaMitra.Domain.Student.StudentEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "assignment_submissions")
@Data
public class AssignmentSubmissionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private AssignmentEntity assignment;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private StudentEntity student;

    private LocalDateTime submittedAt;
    private String grade; // e.g., "A+", "85%"
    private String fileUrl; // Link to uploaded file if any
}
