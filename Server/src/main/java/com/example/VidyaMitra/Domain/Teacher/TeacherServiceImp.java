package com.example.VidyaMitra.Domain.Teacher;

import com.example.VidyaMitra.Domain.Teacher.DTO.LoginRequestDto;
import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherInDto;
import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherOutDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherServiceImp implements TeacherService {
    @Autowired
    private  TeacherRepository teacherRepository;
/// //

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Value("${app.jwt.secret}") // Define this in application.properties
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}") // Define this in application.properties
    private int jwtExpirationMs;

    public String authenticateAndGetToken(LoginRequestDto loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return generateToken(userDetails.getUsername());
    }

    private String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
/// //

    @Override
    public TeacherOutDto registerTeacher(TeacherInDto teacherDto) {
        if (teacherRepository.findByEmail(teacherDto.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already in use.");
        }

        TeacherEntity teacherEntity = TeacherMapper.toEntity(teacherDto);

        // Hash the password before saving
        teacherEntity.setPassword(passwordEncoder.encode(teacherDto.getPassword()));

        TeacherEntity savedTeacher = teacherRepository.save(teacherEntity);
        return TeacherMapper.toDto(savedTeacher);
    }

    @Override
    public TeacherOutDto getTeacherById(Long id) {
        TeacherEntity teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + id));
        return TeacherMapper.toDto(teacher);
    }

    @Override
    public List<TeacherOutDto> getAllTeachers() {
        return teacherRepository.findAll().stream()
                .map(TeacherMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteTeacher(Long id) {
        if (!teacherRepository.existsById(id)) {
            throw new RuntimeException("Teacher not found with id: " + id);
        }
        // Warning: Deleting a teacher will have cascading effects.
        // You need a clear strategy for what happens to their classes, posts, etc.
        teacherRepository.deleteById(id);
    }

    @Override
    public Long getTeacherIdByEmail(String email) {
        return teacherRepository.findByEmail(email)
                .map(TeacherEntity::getId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with email"+ email));
    }


}
