package com.example.VidyaMitra.Domain.SchoolClass;

import com.example.VidyaMitra.Domain.AttendanceRecord.AttendanceRecordEntity;
import com.example.VidyaMitra.Domain.Student.StudentEntity;
import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "school_classes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SchoolClassEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String grade; // e.g., "Grade 8"

    @Column(nullable = false)
    private String section; // e.g., "A"

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private TeacherEntity teacher;

    @OneToMany(mappedBy = "schoolClass")
    private List<StudentEntity> students;
}
