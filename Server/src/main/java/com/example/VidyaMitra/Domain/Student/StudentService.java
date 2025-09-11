package com.example.VidyaMitra.Domain.Student;

import com.example.VidyaMitra.Domain.Student.DTO.StudentInDto;
import com.example.VidyaMitra.Domain.Student.DTO.StudentOutDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface StudentService {
    StudentOutDto createStudent(StudentInDto studentDto);
    StudentOutDto getStudentById(Long id);
    List<StudentOutDto> getAllStudents(Long classId);
    StudentOutDto updateStudent(Long id, StudentInDto studentDto);
    void deleteStudent(Long id);
    void uploadStudentPhoto(Long id, MultipartFile file);
    ResponseEntity<byte[]> getStudentPhoto(Long id);
}
