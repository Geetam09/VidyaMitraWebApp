package com.example.VidyaMitra.Domain.AttendanceRecord;

import com.example.VidyaMitra.Domain.AttendanceRecord.AttendanceRecordDTO.AttendanceRecordInDto;
import com.example.VidyaMitra.Domain.AttendanceRecord.AttendanceRecordDTO.AttendanceRecordOutDto;
import com.example.VidyaMitra.Domain.Student.StudentEntity;
import com.example.VidyaMitra.Domain.Student.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceRecordServiceImpl implements AttendanceRecordService {

    private final AttendanceRecordRepository attendanceRecordRepository;
    private final StudentRepository studentRepository;

    @Override
    public AttendanceRecordOutDto markAttendance(AttendanceRecordInDto dto) {
        StudentEntity student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        AttendanceRecordEntity entity = AttendanceRecordMapper.toEntity(dto, student);
        AttendanceRecordEntity savedEntity = attendanceRecordRepository.save(entity);
        return AttendanceRecordMapper.toDto(savedEntity);
    }

    @Override
    public List<AttendanceRecordOutDto> getAttendanceByStudent(Long studentId) {
        return attendanceRecordRepository.findByStudent_Id(studentId)
                .stream()
                .map(AttendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }


    @Override
    public List<AttendanceRecordOutDto> getAttendanceByDate(LocalDate date) {
        return attendanceRecordRepository.findByAttendanceDate(date)
                .stream()
                .map(AttendanceRecordMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAttendance(Long id) {
        attendanceRecordRepository.deleteById(id);
    }
}