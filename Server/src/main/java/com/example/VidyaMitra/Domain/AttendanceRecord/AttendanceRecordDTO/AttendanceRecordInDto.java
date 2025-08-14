package com.example.VidyaMitra.Domain.AttendanceRecord.AttendanceRecordDTO;

import com.example.VidyaMitra.Domain.Assignment.AttendanceStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceRecordInDto {
    private Long studentId;
    private LocalDate attendanceDate;
    private AttendanceStatus status;
}
