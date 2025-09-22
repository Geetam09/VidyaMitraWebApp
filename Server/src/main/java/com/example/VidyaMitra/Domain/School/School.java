package com.example.VidyaMitra.Domain.School;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "schools")
@Data
public class School {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "school_name")
    private String schoolName;
}
