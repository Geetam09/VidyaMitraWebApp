package com.example.VidyaMitra.Domain.Teacher;

import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherInDto;
import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherOutDto;
import org.springframework.stereotype.Component;

@Component
public class TeacherMapper {

    public static TeacherOutDto toDto(TeacherEntity entity) {
        if (entity == null) {
            return null;
        }
        TeacherOutDto dto = new TeacherOutDto();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setEmail(entity.getEmail());
        dto.setSubjectTaught(entity.getSubjectTaught());
        dto.setClassCount(entity.getClasses() != null ? entity.getClasses().size() : 0);
        dto.setTeachingExperience(entity.getTeachingExperience());
        dto.setSchoolName(entity.getSchoolName());
        return dto;
    }

    public static TeacherEntity toEntity(TeacherInDto dto) {
        if (dto == null) {
            return null;
        }
        TeacherEntity entity = new TeacherEntity();
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setEmail(dto.getEmail());
        entity.setPassword(dto.getPassword());
        entity.setSubjectTaught(dto.getSubjectTaught());
        entity.setTeachingExperience(dto.getTeachingExperience());
        entity.setSchoolName(dto.getSchoolName());
        return entity;
    }
}
