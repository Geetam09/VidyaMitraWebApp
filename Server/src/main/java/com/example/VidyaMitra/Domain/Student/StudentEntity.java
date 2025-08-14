package com.example.VidyaMitra.Domain.Student;

import com.example.VidyaMitra.Domain.AttendanceRecord.AttendanceRecordEntity;
import com.example.VidyaMitra.Domain.SchoolClass.SchoolClassEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "students")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String rollNumber;

    private String parentName;
    private String parentContact;
    @Column(unique = true)
    private String parentEmail;
    private String parentPreferredLanguage; // e.g., "en", "mr", "hi"

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private SchoolClassEntity schoolClass;

    @OneToMany(mappedBy = "student")
    private List<AttendanceRecordEntity> attendanceRecords;
}
