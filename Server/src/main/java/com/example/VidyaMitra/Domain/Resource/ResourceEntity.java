package com.example.VidyaMitra.Domain.Resource;

import com.example.VidyaMitra.Domain.Teacher.TeacherEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
@Data
public class ResourceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String fileUrl;
    private String fileType; // e.g., "PDF", "Worksheet", "Video"

    @ManyToOne
    @JoinColumn(name = "uploader_id")
    private TeacherEntity uploader;

    private LocalDateTime uploadedAt;
}
