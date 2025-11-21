package com.example.VidyaMitra.Domain.Testpaper.Entity;

import jakarta.persistence.*;
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
public class TestAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long testId;

    private Long studentId;

    private LocalDateTime startedAt;

    private LocalDateTime endedAt;

    private boolean tabSwitchDetected;

    private int tabSwitchCount; // NEW → track how many times tab switch occurred

    private boolean cancelled;

    private boolean submitted;

    private boolean blocked;// blocked due to tab switch violations or cancelled

    private Integer score;
    private Boolean passed;

}
