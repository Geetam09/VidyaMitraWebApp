package com.example.VidyaMitra.Domain.AttendanceRecord;



import com.example.VidyaMitra.Domain.AttendanceRecord.AttendanceRecordDTO.AttendanceRecordInDto;
import com.example.VidyaMitra.Domain.AttendanceRecord.AttendanceRecordDTO.AttendanceRecordOutDto;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRecordService {
    AttendanceRecordOutDto markAttendance(AttendanceRecordInDto dto);
    List<AttendanceRecordOutDto> getAttendanceByStudent(Long studentId);
    List<AttendanceRecordOutDto> getAttendanceByDate(LocalDate date);
    void deleteAttendance(Long id);
}
