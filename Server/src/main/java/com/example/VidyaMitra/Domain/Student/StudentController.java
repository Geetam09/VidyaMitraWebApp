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
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping("/createStudent")
    public ResponseEntity<StudentOutDto> createStudent(
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("rollNumber") String rollNumber,
            @RequestParam("parentName") String parentName,
            @RequestParam("parentContact") Long parentContact,
            @RequestParam("parentEmail") String parentEmail,
            @RequestParam("parentPreferredLanguage") String parentPreferredLanguage,
            @RequestParam("schoolClassId") Long schoolClassId,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) {

        StudentInDto studentDto = new StudentInDto();
        studentDto.setFirstName(firstName);
        studentDto.setLastName(lastName);
        studentDto.setRollNumber(rollNumber);
        studentDto.setParentName(parentName);
        studentDto.setParentContact(parentContact);
        studentDto.setParentEmail(parentEmail);
        studentDto.setParentPreferredLanguage(parentPreferredLanguage);
        studentDto.setSchoolClassId(schoolClassId);


        StudentOutDto createdStudent = studentService.createStudent(studentDto);


        if (photo != null && !photo.isEmpty()) {
            studentService.uploadStudentPhoto(createdStudent.getId(), photo);
        }

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
    public ResponseEntity<StudentOutDto> updateStudent(
            @PathVariable Long id,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("rollNumber") String rollNumber,
            @RequestParam("parentName") String parentName,
            @RequestParam(value ="parentContact", required = false) Long parentContact,
            @RequestParam("parentEmail") String parentEmail,
            @RequestParam("parentPreferredLanguage") String parentPreferredLanguage,
            @RequestParam("schoolClassId") Long schoolClassId,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) {

        StudentInDto studentDto = new StudentInDto();
        studentDto.setFirstName(firstName);
        studentDto.setLastName(lastName);
        studentDto.setRollNumber(rollNumber);
        studentDto.setParentName(parentName);
        studentDto.setParentContact(parentContact);
        studentDto.setParentEmail(parentEmail);
        studentDto.setParentPreferredLanguage(parentPreferredLanguage);
        studentDto.setSchoolClassId(schoolClassId);


        StudentOutDto updatedStudent = studentService.updateStudent(id, studentDto);


        if (photo != null && !photo.isEmpty()) {
            studentService.uploadStudentPhoto(updatedStudent.getId(), photo);
        }

        return ResponseEntity.ok(updatedStudent);
    }


    @DeleteMapping("/deleteStudent/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/StudentPhoto/{id}")
    public ResponseEntity<String> uploadPhoto(@PathVariable Long id,
                                              @RequestParam("file") MultipartFile file) {
        studentService.uploadStudentPhoto(id, file);
        return ResponseEntity.ok("Photo uploaded successfully");
    }


    @GetMapping("/StudentPhoto/{id}")
    public ResponseEntity<byte[]> getPhoto(@PathVariable Long id) {
        return studentService.getStudentPhoto(id);
    }
}