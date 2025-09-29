package com.example.VidyaMitra.Domain.Teacher;

import com.example.VidyaMitra.Domain.Teacher.DTO.LoginRequestDto;
import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherInDto;
import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherOutDto;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface TeacherService {
    String authenticateAndGetToken(LoginRequestDto loginRequest);
    TeacherOutDto registerTeacher(TeacherInDto teacherDto);
    TeacherOutDto getTeacherById(Long id);
    List<TeacherOutDto> getAllTeachers();
    void deleteTeacher(Long id);
    Long getTeacherIdByEmail(String email);

    ///updateTeacher(TeacherInDto teacherDto);

//    void uploadTeacherPhoto(Long id, MultipartFile file);
//     ResponseEntity<byte[]> getTeacherPhoto(Long id);

}
