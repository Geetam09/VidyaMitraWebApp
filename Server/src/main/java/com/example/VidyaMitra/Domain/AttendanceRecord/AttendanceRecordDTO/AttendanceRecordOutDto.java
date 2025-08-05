package com.example.VidyaMitra.Domain.AttendanceRecord.AttendanceRecordDTO;



import com.example.VidyaMitra.Domain.Assignment.AttendanceStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AttendanceRecordOutDto {
    private Long id;
    private Long studentId;
    private LocalDate attendanceDate;
    private AttendanceStatus status;
}
