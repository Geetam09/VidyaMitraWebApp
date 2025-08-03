package com.example.VidyaMitra.Domain.Teacher;

import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherOutDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @GetMapping("/getTeacherById/{id}")
    public ResponseEntity<TeacherOutDto> getTeacherById(@PathVariable Long id) {
        TeacherOutDto teacher = teacherService.getTeacherById(id);
        return ResponseEntity.ok(teacher);
    }

    @GetMapping("/getAllTeachers")
    public ResponseEntity<List<TeacherOutDto>> getAllTeachers() {
        List<TeacherOutDto> teachers = teacherService.getAllTeachers();
        return ResponseEntity.ok(teachers);
    }

    @DeleteMapping("/deleteTeacher/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        // Note: This endpoint should be protected and likely only accessible to an Admin role.
        teacherService.deleteTeacher(id);
        return ResponseEntity.noContent().build();
    }
}
