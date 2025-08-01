package com.example.VidyaMitra.Domain.Assignment;

import com.example.VidyaMitra.Domain.AssignmentSubmission.AssignmentSubmissionEntity;
import com.example.VidyaMitra.Domain.SchoolClass.SchoolClassEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "assignments")
@Data
public class AssignmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private SchoolClassEntity schoolClass;

    @OneToMany(mappedBy = "assignment")
    private List<AssignmentSubmissionEntity> submissions;
}
