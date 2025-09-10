package com.example.VidyaMitra.Domain.Teacher;

import com.example.VidyaMitra.Domain.Teacher.DTO.LoginRequestDto;
import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherInDto;
import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherOutDto;

import java.util.List;

public interface TeacherService {
    String authenticateAndGetToken(LoginRequestDto loginRequest);
    public TeacherOutDto registerTeacher(TeacherInDto teacherDto);
    TeacherOutDto getTeacherById(Long id);
    List<TeacherOutDto> getAllTeachers();
    void deleteTeacher(Long id);
    Long getTeacherIdByEmail(String email);
}
