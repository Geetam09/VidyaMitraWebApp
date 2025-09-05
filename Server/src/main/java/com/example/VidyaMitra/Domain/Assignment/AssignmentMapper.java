package com.example.VidyaMitra.Domain.Assignment;

import com.example.VidyaMitra.Domain.Assignment.DTO.AssignmentInDto;
import com.example.VidyaMitra.Domain.Assignment.DTO.AssignmentOutDto;
import com.example.VidyaMitra.Domain.SchoolClass.SchoolClassEntity;

public class AssignmentMapper {

    public static AssignmentEntity toEntity(AssignmentInDto dto, SchoolClassEntity schoolClass) {
        AssignmentEntity entity = new AssignmentEntity();
     //   entity.setTitle(dto.getTitle());
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setDueDate(dto.getDueDate());
        entity.setSchoolClass(schoolClass);
        return entity;
    }

    public static AssignmentOutDto toDto(AssignmentEntity entity) {
        AssignmentOutDto dto = new AssignmentOutDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setDueDate(entity.getDueDate());
        dto.setClassId(entity.getSchoolClass().getId());
        return dto;
    }
}
