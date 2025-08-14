package com.example.VidyaMitra.Domain.Student;

import com.example.VidyaMitra.Domain.Student.DTO.StudentInDto;
import com.example.VidyaMitra.Domain.Student.DTO.StudentOutDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/createStudent")
    public ResponseEntity<StudentOutDto> createStudent(@RequestBody StudentInDto studentDto) {
        StudentOutDto createdStudent = studentService.createStudent(studentDto);
        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
    }

    @GetMapping("/getStudentById/{id}")
    public ResponseEntity<StudentOutDto> getStudentById(@PathVariable Long id) {
        StudentOutDto student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/getAllStudents")
    public ResponseEntity<List<StudentOutDto>> getAllStudents(@RequestParam(required = false) Long classId) {
        List<StudentOutDto> students = studentService.getAllStudents(classId);
        return ResponseEntity.ok(students);
    }

    @PutMapping("/updateStudent/{id}")
    public ResponseEntity<StudentOutDto> updateStudent(@PathVariable Long id, @RequestBody StudentInDto studentDto) {
        StudentOutDto updatedStudent = studentService.updateStudent(id, studentDto);
        return ResponseEntity.ok(updatedStudent);
    }

    @DeleteMapping("/deleteStudent/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    // 📌 Upload Photo
    @PostMapping("/StudentPhoto/{id}")
    public ResponseEntity<String> uploadPhoto(@PathVariable Long id,
                                              @RequestParam("file") MultipartFile file) {
        studentService.uploadStudentPhoto(id, file);
        return ResponseEntity.ok("Photo uploaded successfully");
    }

    // 📌 Get Photo
    @GetMapping("/StudentPhoto/{id}")
    public ResponseEntity<byte[]> getPhoto(@PathVariable Long id) {
        return studentService.getStudentPhoto(id);
    }
}