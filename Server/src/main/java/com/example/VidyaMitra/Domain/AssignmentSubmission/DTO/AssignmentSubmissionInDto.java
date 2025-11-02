package com.example.VidyaMitra.Domain.AssignmentSubmission.DTO;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AssignmentSubmissionInDto {
    private Long assignmentId;
    private Long studentId;
    private String grade;
    private String comment;
    private String fileUrl;
}

