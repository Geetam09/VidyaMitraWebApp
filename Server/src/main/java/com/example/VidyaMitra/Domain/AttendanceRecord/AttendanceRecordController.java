package com.example.VidyaMitra.Domain.AttendanceRecord;

import com.example.VidyaMitra.Domain.AttendanceRecord.AttendanceRecordDTO.AttendanceRecordInDto;

import com.example.VidyaMitra.Domain.AttendanceRecord.AttendanceRecordDTO.AttendanceRecordOutDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AttendanceRecordController {

    private final AttendanceRecordService attendanceRecordService;

    @PostMapping("/mark")
    public ResponseEntity<AttendanceRecordOutDto> markAttendance(@RequestBody AttendanceRecordInDto dto) {
        return ResponseEntity.ok(attendanceRecordService.markAttendance(dto));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceRecordOutDto>> getAttendanceByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceRecordService.getAttendanceByStudent(studentId));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<AttendanceRecordOutDto>> getAttendanceByDate(@PathVariable LocalDate date) {
        return ResponseEntity.ok(attendanceRecordService.getAttendanceByDate(date));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        attendanceRecordService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }
}
