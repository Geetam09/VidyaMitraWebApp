package com.example.VidyaMitra.Domain.AttendanceRecord;

import com.example.VidyaMitra.Domain.Assignment.AttendanceStatus;
import com.example.VidyaMitra.Domain.Student.StudentEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "attendance_records")
@Data
public class AttendanceRecordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private StudentEntity student;

    @Column(nullable = false)
    private LocalDate attendanceDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status;
}