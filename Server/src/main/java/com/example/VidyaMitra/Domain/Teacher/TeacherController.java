package com.example.VidyaMitra.Domain.Teacher;

import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherOutDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
//@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
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

<<<<<<< Updated upstream
//    // 📌 POST Photo
//    @PostMapping("/teacherPhoto/{id}")
//    public ResponseEntity<String> uploadPhoto(@PathVariable Long id,
//                                              @RequestParam("file") MultipartFile file) {
//        teacherService.uploadTeacherPhoto(id, file);
//        return ResponseEntity.ok("Photo uploaded successfully");
//    }
//
//    // 📌 Get Photo
//    @GetMapping("/teacherPhoto/{id}")
//    public ResponseEntity<byte[]> getPhoto(@PathVariable Long id) {
//        return teacherService.getTeacherPhoto(id);
//    }
=======
    //  POST Photo
    @PostMapping("/teacherPhoto/{id}")
    public ResponseEntity<String> uploadPhoto(@PathVariable Long id,
                                              @RequestParam("file") MultipartFile file) {
        teacherService.uploadTeacherPhoto(id, file);
        return ResponseEntity.ok("Photo uploaded successfully");
    }

    // Get Photo
    @GetMapping("/teacherPhoto/{id}")
    public ResponseEntity<byte[]> getPhoto(@PathVariable Long id) {
        return teacherService.getTeacherPhoto(id);
    }
>>>>>>> Stashed changes
}
