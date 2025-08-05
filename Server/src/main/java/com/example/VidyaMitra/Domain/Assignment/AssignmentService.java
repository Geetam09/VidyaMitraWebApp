package com.example.VidyaMitra.Domain.Assignment;

import com.example.VidyaMitra.Domain.Assignment.DTO.AssignmentInDto;
import com.example.VidyaMitra.Domain.Assignment.DTO.AssignmentOutDto;

import java.util.List;

public interface AssignmentService {
    AssignmentOutDto createAssignment(AssignmentInDto dto);
    List<AssignmentOutDto> getAllAssignments();
    AssignmentOutDto getAssignmentById(Long id);
    void deleteAssignment(Long id);
    List<AssignmentOutDto> getAssignmentsByClass(Long classId);
}
