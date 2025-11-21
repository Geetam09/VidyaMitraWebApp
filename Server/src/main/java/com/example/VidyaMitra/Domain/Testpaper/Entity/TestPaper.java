package com.example.VidyaMitra.Domain.Testpaper.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestPaper {


        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String title;

        private String subject;

        private LocalDateTime startTime;

        private LocalDateTime endTime;

        private String testLink; // unique link sent by email

        private boolean active; // true until endTime

        private Long createdByTeacherId; // track which teacher created it
    }



