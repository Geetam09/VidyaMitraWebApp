package com.example.VidyaMitra.Domain.AssignmentSubmission;

import com.example.VidyaMitra.Domain.AssignmentSubmission.DTO.AssignmentSubmissionInDto;
import com.example.VidyaMitra.Domain.AssignmentSubmission.DTO.AssignmentSubmissionOutDto;

import java.util.List;
public interface AssignmentSubmissionService {
    AssignmentSubmissionOutDto submitAssignment(AssignmentSubmissionInDto dto);
    List<AssignmentSubmissionOutDto> getSubmissionsByAssignment(Long assignmentId);
}

