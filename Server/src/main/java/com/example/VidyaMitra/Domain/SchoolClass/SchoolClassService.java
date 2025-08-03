package com.example.VidyaMitra.Domain.SchoolClass;

import com.example.VidyaMitra.Domain.SchoolClass.DTO.SchoolClassInDto;
import com.example.VidyaMitra.Domain.SchoolClass.DTO.SchoolClassOutDto;
import com.example.VidyaMitra.Domain.Teacher.TeacherRepository;

import java.util.List;

public interface SchoolClassService {
    SchoolClassOutDto createSchoolClass(SchoolClassInDto classDto);
    SchoolClassOutDto getSchoolClassById(Long id);
    List<SchoolClassOutDto> getAllSchoolClasses();
    SchoolClassOutDto updateSchoolClass(Long id, SchoolClassInDto classDto);
    void deleteSchoolClass(Long id);
}
