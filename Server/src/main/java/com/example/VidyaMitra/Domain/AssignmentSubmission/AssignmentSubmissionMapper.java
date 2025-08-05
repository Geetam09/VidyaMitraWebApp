package com.example.VidyaMitra.Domain.AssignmentSubmission;

import com.example.VidyaMitra.Domain.Assignment.AssignmentEntity;
import com.example.VidyaMitra.Domain.Assignment.DTO.AssignmentInDto;
import com.example.VidyaMitra.Domain.Assignment.DTO.AssignmentOutDto;
import com.example.VidyaMitra.Domain.AssignmentSubmission.DTO.AssignmentSubmissionInDto;
import com.example.VidyaMitra.Domain.AssignmentSubmission.DTO.AssignmentSubmissionOutDto;
import com.example.VidyaMitra.Domain.Student.StudentEntity;

import java.time.LocalDateTime;

public class AssignmentSubmissionMapper {

    public static AssignmentSubmissionEntity toEntity(AssignmentSubmissionInDto dto, AssignmentEntity assignment, StudentEntity student) {
        AssignmentSubmissionEntity entity = new AssignmentSubmissionEntity();
        entity.setAssignment(assignment);
        entity.setStudent(student);
        entity.setGrade(dto.getGrade());
        entity.setFileUrl(dto.getFileUrl());
        entity.setSubmittedAt(LocalDateTime.now());
        return entity;
    }

    public static AssignmentSubmissionOutDto toDto(AssignmentSubmissionEntity entity) {
        AssignmentSubmissionOutDto dto = new AssignmentSubmissionOutDto();
        dto.setId(entity.getId());
        dto.setAssignmentId(entity.getAssignment().getId());
        dto.setStudentId(entity.getStudent().getId());
        dto.setGrade(entity.getGrade());
        dto.setFileUrl(entity.getFileUrl());
        dto.setSubmittedAt(entity.getSubmittedAt());
        return dto;
    }
}
