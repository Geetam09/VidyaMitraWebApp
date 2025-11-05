package com.example.VidyaMitra.Domain.SchoolClass;

import com.example.VidyaMitra.Domain.SchoolClass.DTO.SchoolClassInDto;
import com.example.VidyaMitra.Domain.SchoolClass.DTO.SchoolClassOutDto;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import com.example.VidyaMitra.Domain.Teacher.TeacherRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchoolClassServiceImp implements SchoolClassService {

    @Autowired
    private SchoolClassRepository schoolClassRepository;
    @Autowired
    private  TeacherRepository teacherRepository;

    @Transactional
    @Override
    public SchoolClassOutDto createSchoolClass(SchoolClassInDto classDto) {
        TeacherEntity teacher = teacherRepository.findById(classDto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + classDto.getTeacherId()));

        SchoolClassEntity newClass = SchoolClassMapper.toEntity(classDto, teacher);
        SchoolClassEntity savedClass = schoolClassRepository.save(newClass);
        return SchoolClassMapper.toDto(savedClass);
    }

    @Override
    public SchoolClassOutDto getSchoolClassById(Long id) {
        SchoolClassEntity schoolClass = schoolClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SchoolClass not found with id: " + id));
        return SchoolClassMapper.toDto(schoolClass);
    }

    @Override
    public List<SchoolClassOutDto> getAllSchoolClasses() {
        return schoolClassRepository.findAll().stream()
                .map(SchoolClassMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public SchoolClassOutDto updateSchoolClass(Long id, SchoolClassInDto classDto) {
        SchoolClassEntity existingClass = schoolClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SchoolClass not found with id: " + id));

        TeacherEntity teacher = teacherRepository.findById(classDto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + classDto.getTeacherId()));

        existingClass.setGrade(classDto.getGrade());
        existingClass.setSection(classDto.getSection());
        existingClass.setTeacher(teacher);

        SchoolClassEntity updatedClass = schoolClassRepository.save(existingClass);
        return SchoolClassMapper.toDto(updatedClass);
    }

    @Transactional
    @Override
    public void deleteSchoolClass(Long id) {
        if (!schoolClassRepository.existsById(id)) {
            throw new RuntimeException("SchoolClass not found with id: " + id);
        }
        schoolClassRepository.deleteById(id);
    }
}

