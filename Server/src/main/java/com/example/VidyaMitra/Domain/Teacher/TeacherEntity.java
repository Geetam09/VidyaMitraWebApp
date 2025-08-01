package com.example.VidyaMitra.Domain.Teacher;

import com.example.VidyaMitra.Domain.CommunityPost.CommunityPostEntity;
import com.example.VidyaMitra.Domain.Resource.ResourceEntity;
import com.example.VidyaMitra.Domain.SchoolClass.SchoolClassEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "TeacherInfo") // "user" is often a reserved keyword in SQL
@Data
public class TeacherEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String subjectTaught;

    // Relationships
    @OneToMany(mappedBy = "teacher")
    private List<SchoolClassEntity> classes;

    @OneToMany(mappedBy = "author")
    private List<CommunityPostEntity> posts;


    @OneToMany(mappedBy = "uploader")
    private List<ResourceEntity> uploadedResources;
}
