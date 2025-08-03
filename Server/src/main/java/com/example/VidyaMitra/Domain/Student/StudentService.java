package com.example.VidyaMitra.Domain.Student;

import com.example.VidyaMitra.Domain.Student.DTO.StudentInDto;
import com.example.VidyaMitra.Domain.Student.DTO.StudentOutDto;

import java.util.List;

public interface StudentService {
    StudentOutDto createStudent(StudentInDto studentDto);
    StudentOutDto getStudentById(Long id);
    List<StudentOutDto> getAllStudents(Long classId);
    StudentOutDto updateStudent(Long id, StudentInDto studentDto);
    void deleteStudent(Long id);
}
