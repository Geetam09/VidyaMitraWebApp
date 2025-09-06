package com.example.VidyaMitra.Domain.School;

import com.example.VidyaMitra.Domain.School.DTO.SchoolInDto;
import com.example.VidyaMitra.Domain.School.DTO.SchoolOutDto;

public class SchoolMapper {
    public static School toEntity(SchoolInDto dto) {
        School school = new School();
        school.setName(dto.getName());
        return school;
    }

    public static SchoolOutDto toDto(School school) {
        SchoolOutDto dto = new SchoolOutDto();
        dto.setId(school.getId());
        dto.setName(school.getName());
        return dto;
    }
}
