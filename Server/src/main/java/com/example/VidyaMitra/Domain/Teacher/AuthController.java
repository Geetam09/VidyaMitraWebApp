package com.example.VidyaMitra.Domain.Teacher;

import com.example.VidyaMitra.Domain.Teacher.DTO.LoginRequestDto;
import com.example.VidyaMitra.Domain.Teacher.DTO.LoginResponseDto;
import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherInDto;
import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherOutDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final TeacherService teacherService;

    public AuthController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @PostMapping("/register")
    public ResponseEntity<TeacherOutDto> registerTeacher(@RequestBody TeacherInDto teacherDto) {
        TeacherOutDto registeredTeacher = teacherService.registerTeacher(teacherDto);
        return new ResponseEntity<>(registeredTeacher, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequest) {
        String token = teacherService.authenticateAndGetToken(loginRequest);
        return ResponseEntity.ok(new LoginResponseDto(token));
    }
}
