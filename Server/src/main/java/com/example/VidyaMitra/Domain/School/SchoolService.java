package com.example.VidyaMitra.Domain.School;

import com.example.VidyaMitra.Domain.School.DTO.SchoolInDto;
import com.example.VidyaMitra.Domain.School.DTO.SchoolOutDto;

import java.util.List;

public interface SchoolService {
    SchoolOutDto createSchool(SchoolInDto dto);
    List<SchoolOutDto>getAllSchools();
}
