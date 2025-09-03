package com.example.VidyaMitra.Domain.Teacher.Auth;

import com.example.VidyaMitra.Domain.Teacher.DTO.LoginRequestDto;
import com.example.VidyaMitra.Domain.Teacher.DTO.LoginResponseDto;
import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherInDto;
import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherOutDto;
import com.example.VidyaMitra.Domain.Teacher.TeacherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final TeacherService teacherService;

    public AuthController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @PostMapping("/register")
    public ResponseEntity<TeacherOutDto> register(@RequestBody TeacherInDto teacherInDto) {
        return ResponseEntity.ok(teacherService.registerTeacher(teacherInDto));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequest) {
        String token = teacherService.authenticateAndGetToken(loginRequest);
        Long teacherId = teacherService.getTeacherIdByEmail(loginRequest.getEmail());
        return ResponseEntity.ok(new LoginResponseDto(token,teacherId));
    }
}