package com.example.VidyaMitra.Domain.Assignment;

import com.example.VidyaMitra.Domain.Assignment.DTO.AssignmentInDto;
import com.example.VidyaMitra.Domain.Assignment.DTO.AssignmentOutDto;
import com.example.VidyaMitra.Domain.SchoolClass.SchoolClassEntity;
import com.example.VidyaMitra.Domain.SchoolClass.SchoolClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentServiceImpl implements AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private SchoolClassRepository schoolClassRepository;

    @Override
    public AssignmentOutDto createAssignment(AssignmentInDto dto) {
        SchoolClassEntity schoolClass = schoolClassRepository.findById(dto.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));

        AssignmentEntity entity = AssignmentMapper.toEntity(dto, schoolClass);
        return AssignmentMapper.toDto(assignmentRepository.save(entity));
    }

    @Override
    public List<AssignmentOutDto> getAllAssignments() {
        return assignmentRepository.findAll()
                .stream().map(AssignmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public AssignmentOutDto getAssignmentById(Long id) {
        return assignmentRepository.findById(id)
                .map(AssignmentMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
    }

    @Override
    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }

    @Override
    public List<AssignmentOutDto> getAssignmentsByClass(Long classId) {
        return assignmentRepository.findBySchoolClass_Id(classId)
                .stream().map(AssignmentMapper::toDto)
                .collect(Collectors.toList());
    }
}
