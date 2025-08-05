package com.example.VidyaMitra.Domain.AttendanceRecord;


import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecordEntity, Long> {
    List<AttendanceRecordEntity> findByStudent_Id(Long studentId);
    List<AttendanceRecordEntity> findByAttendanceDate(LocalDate date);
}
