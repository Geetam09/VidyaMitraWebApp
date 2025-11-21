package com.example.VidyaMitra.Domain.Testpaper.DTO;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TestAttemptOutDTO {
    private Long id;
    private Long testId;
    private Long studentId;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private boolean tabSwitchDetected;
    private int tabSwitchCount;
    private boolean cancelled;
    private boolean submitted;
    private boolean blocked;
    private Integer score;
    private Boolean passed;
}
