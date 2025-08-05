package com.example.VidyaMitra.Domain.AssignmentSubmission;

import com.example.VidyaMitra.Domain.Assignment.AssignmentEntity;
import com.example.VidyaMitra.Domain.Assignment.AssignmentRepository;
import com.example.VidyaMitra.Domain.AssignmentSubmission.DTO.AssignmentSubmissionInDto;
import com.example.VidyaMitra.Domain.AssignmentSubmission.DTO.AssignmentSubmissionOutDto;
import com.example.VidyaMitra.Domain.Student.StudentEntity;
import com.example.VidyaMitra.Domain.Student.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentSubmissionServiceImpl implements AssignmentSubmissionService {

    private final AssignmentSubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final StudentRepository studentRepository;

    @Override
    public AssignmentSubmissionOutDto submitAssignment(AssignmentSubmissionInDto dto) {
        AssignmentEntity assignment = assignmentRepository.findById(dto.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        StudentEntity student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        AssignmentSubmissionEntity entity = AssignmentSubmissionMapper.toEntity(dto, assignment, student);
        submissionRepository.save(entity);
        return AssignmentSubmissionMapper.toDto(entity);
    }

    @Override
    public List<AssignmentSubmissionOutDto> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .map(AssignmentSubmissionMapper::toDto)
                .collect(Collectors.toList());
    }
}
