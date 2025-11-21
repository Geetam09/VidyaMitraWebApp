package com.example.VidyaMitra.Domain.Testpaper.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TestPaperInDTO {
    private String title;

    private String subject;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Long createdByTeacherId;

    private Long classId;
}
