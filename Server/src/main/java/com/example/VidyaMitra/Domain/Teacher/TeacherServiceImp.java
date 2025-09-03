package com.example.VidyaMitra.Domain.Teacher;

import com.example.VidyaMitra.Domain.Teacher.DTO.LoginRequestDto;
import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherInDto;
import com.example.VidyaMitra.Domain.Teacher.DTO.TeacherOutDto;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherServiceImp implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private int jwtExpirationMs;

    public TeacherServiceImp(
            TeacherRepository teacherRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager
    ) {
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public String authenticateAndGetToken(LoginRequestDto loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return generateToken(userDetails.getUsername());

        } catch (Exception e) {
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    private String generateToken(String username) {
        TeacherEntity teacher = teacherRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(username)
                .claim("role", "ROLE_TEACHER") // 👈 include role in token
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    @Override
    public TeacherOutDto registerTeacher(TeacherInDto teacherDto) {
        teacherRepository.findByEmail(teacherDto.getEmail())
                .ifPresent(t -> { throw new IllegalStateException("Email already in use."); });

        TeacherEntity teacherEntity = TeacherMapper.toEntity(teacherDto);
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
        return teacherRepository.findAll()
                .stream()
                .map(TeacherMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteTeacher(Long id) {
        if (!teacherRepository.existsById(id)) {
            throw new RuntimeException("Teacher not found with id: " + id);
        }
        teacherRepository.deleteById(id);
    }

    @Override
    public void uploadTeacherPhoto(Long id, MultipartFile file) {
        TeacherEntity teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        try {
            teacher.setPhoto(file.getBytes());
            teacherRepository.save(teacher);
        } catch (IOException e) {
            throw new RuntimeException("Error uploading photo", e);
        }
    }

    @Override
    public ResponseEntity<byte[]> getTeacherPhoto(Long id) {
        TeacherEntity teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (teacher.getPhoto() == null) {
            return ResponseEntity.notFound().build();
        }

        try (InputStream is = new ByteArrayInputStream(teacher.getPhoto())) {
            String mimeType = URLConnection.guessContentTypeFromStream(is);
            if (mimeType == null) {
                mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mimeType))
                    .body(teacher.getPhoto());
        } catch (IOException e) {
            throw new RuntimeException("Error reading photo", e);
        }
    }

    @Override
    public Long getTeacherIdByEmail(String email) {
        return teacherRepository.findByEmail(email)
                .map(TeacherEntity::getId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with email: " + email));
    }
}
