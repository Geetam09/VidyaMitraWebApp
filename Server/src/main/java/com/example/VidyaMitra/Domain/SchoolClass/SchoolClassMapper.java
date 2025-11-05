package com.example.VidyaMitra.Domain.SchoolClass;

import com.example.VidyaMitra.Domain.SchoolClass.DTO.SchoolClassInDto;
import com.example.VidyaMitra.Domain.SchoolClass.DTO.SchoolClassOutDto;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import org.springframework.stereotype.Component;

@Component
public class SchoolClassMapper {
    public static SchoolClassOutDto toDto(SchoolClassEntity entity) {
        if (entity == null) {
            return null;
        }
        SchoolClassOutDto dto = new SchoolClassOutDto();
        dto.setId(entity.getId());
        dto.setGrade(entity.getGrade());
        dto.setSection(entity.getSection());
        if (entity.getTeacher() != null) {
            dto.setTeacherId(entity.getTeacher().getId());
            dto.setTeacherName(entity.getTeacher().getFirstName() + " " + entity.getTeacher().getLastName());
        }

        dto.setStudentCount(entity.getStudents() != null ? entity.getStudents().size() : 0);
        return dto;
    }

    public static SchoolClassEntity toEntity(SchoolClassInDto dto, TeacherEntity teacher) {
        if (dto == null) {
            return null;
        }
        SchoolClassEntity entity = new SchoolClassEntity();
        entity.setGrade(dto.getGrade());
        entity.setSection(dto.getSection());
        entity.setTeacher(teacher);
        return entity;
    }
}
