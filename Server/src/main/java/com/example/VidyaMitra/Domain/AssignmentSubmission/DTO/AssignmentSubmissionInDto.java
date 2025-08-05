package com.example.VidyaMitra.Domain.AssignmentSubmission.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AssignmentSubmissionInDto {
    private Long assignmentId;
    private Long studentId;
    private String grade;
    private String fileUrl;
}

