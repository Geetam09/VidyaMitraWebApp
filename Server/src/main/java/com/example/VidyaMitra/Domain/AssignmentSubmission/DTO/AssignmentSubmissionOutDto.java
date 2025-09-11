package com.example.VidyaMitra.Domain.AssignmentSubmission.DTO;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentSubmissionOutDto {
    private Long id;
    private Long assignmentId;
    private Long studentId;
    private String grade;
    private String fileUrl;
    private LocalDateTime submittedAt;
}
