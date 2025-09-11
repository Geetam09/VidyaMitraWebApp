package com.example.VidyaMitra.Domain.Student;

import com.example.VidyaMitra.Domain.SchoolClass.SchoolClassEntity;
import com.example.VidyaMitra.Domain.Student.DTO.StudentInDto;
import com.example.VidyaMitra.Domain.Student.DTO.StudentOutDto;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class StudentMapper {
    public static StudentOutDto toDto(StudentEntity entity) {
        if (entity == null) {
            return null;
        }
        StudentOutDto dto = new StudentOutDto();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setRollNumber(entity.getRollNumber());
        dto.setParentName(entity.getParentName());
        dto.setParentContact(entity.getParentContact());
        dto.setParentPreferredLanguage(entity.getParentPreferredLanguage());
        dto.setParentEmail(entity.getParentEmail());
        if (entity.getSchoolClass() != null) {
            dto.setSchoolClassId(entity.getSchoolClass().getId());
            dto.setSchoolClassName(entity.getSchoolClass().getGrade() + " " + entity.getSchoolClass().getSection());
        }

        return dto;
    }

    public static StudentEntity toEntity(StudentInDto dto, SchoolClassEntity schoolClass) {
        if (dto == null) {
            return null;
        }
        StudentEntity entity = new StudentEntity();
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setRollNumber(dto.getRollNumber());
        entity.setParentName(dto.getParentName());
        entity.setParentContact(dto.getParentContact());
        entity.setParentPreferredLanguage(dto.getParentPreferredLanguage());
        entity.setSchoolClass(schoolClass);
        entity.setParentEmail(dto.getParentEmail());

        return entity;
    }
}
