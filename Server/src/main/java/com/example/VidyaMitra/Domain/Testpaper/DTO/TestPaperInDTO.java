package com.example.VidyaMitra.Domain.Testpaper.DTO;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class TestPaperInDTO {
    private String title;

    private String subject;

    private LocalTime startTime;

    private LocalTime endTime;

    private Long createdByTeacherId;

    private Long classId;
}
