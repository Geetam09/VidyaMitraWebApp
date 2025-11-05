package com.example.VidyaMitra.Domain.Student;

import com.example.VidyaMitra.Domain.SchoolClass.SchoolClassEntity;
import com.example.VidyaMitra.Domain.SchoolClass.SchoolClassRepository;
import com.example.VidyaMitra.Domain.Student.DTO.StudentInDto;
import com.example.VidyaMitra.Domain.Student.DTO.StudentOutDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImp implements StudentService {
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private  SchoolClassRepository schoolClassRepository;

    @Override
    public StudentOutDto createStudent(StudentInDto studentDto) {
        SchoolClassEntity schoolClass = schoolClassRepository.findById(studentDto.getSchoolClassId())
                .orElseThrow(() -> new RuntimeException("SchoolClass not found with id: " + studentDto.getSchoolClassId()));

        StudentEntity studentEntity = StudentMapper.toEntity(studentDto, schoolClass);
        StudentEntity savedStudent = studentRepository.save(studentEntity);
        return StudentMapper.toDto(savedStudent);
    }

    @Override
    public StudentOutDto getStudentById(Long id) {
        StudentEntity student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        return StudentMapper.toDto(student);
    }

    @Override
    public List<StudentOutDto> getAllStudents(Long classId) {
        List<StudentEntity> students;
        if (classId != null) {
            students = studentRepository.findBySchoolClass_Id(classId);
        } else {
            students = studentRepository.findAll();
        }
        return students.stream()
                .map(StudentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentOutDto updateStudent(Long id, StudentInDto studentDto) {
        StudentEntity existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        SchoolClassEntity schoolClass = schoolClassRepository.findById(studentDto.getSchoolClassId())
                .orElseThrow(() -> new RuntimeException("SchoolClass not found with id: " + studentDto.getSchoolClassId()));

        existingStudent.setFirstName(studentDto.getFirstName());
        existingStudent.setLastName(studentDto.getLastName());
        existingStudent.setRollNumber(studentDto.getRollNumber());
        existingStudent.setParentName(studentDto.getParentName());
        existingStudent.setParentContact(studentDto.getParentContact());
        existingStudent.setParentPreferredLanguage(studentDto.getParentPreferredLanguage());
        existingStudent.setSchoolClass(schoolClass);

        StudentEntity updatedStudent = studentRepository.save(existingStudent);
        return StudentMapper.toDto(updatedStudent);
    }

    @Override
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    public void uploadStudentPhoto(Long id, MultipartFile file) {
        StudentEntity student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        try {
            student.setPhoto(file.getBytes());
            studentRepository.save(student);
        } catch (IOException e) {
            throw new RuntimeException("Error uploading photo", e);
        }
    }

    @Override
    public ResponseEntity<byte[]> getStudentPhoto(Long id) {
        StudentEntity student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (student.getPhoto() == null) {
            return ResponseEntity.notFound().build();
        }

        try (InputStream is = new ByteArrayInputStream(student.getPhoto())) {
            String mimeType = URLConnection.guessContentTypeFromStream(is);
            if (mimeType == null) {
                mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mimeType))
                    .body(student.getPhoto());
        } catch (IOException e) {
            throw new RuntimeException("Error reading photo", e);
        }
    }

}

